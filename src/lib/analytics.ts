import { supabase } from "@/integrations/supabase/client";
import type { CategoryId } from "@/data/resources";

/**
 * Privacy-conscious measurement layer.
 *
 * Rules enforced here and in the database:
 * - No latitude/longitude is ever sent. Geography is recorded only as a
 *   neighborhood label, a ZIP, a coarse distance bucket and the chosen radius.
 * - Anonymous residents are identified by a random id stored in this browser.
 *   It is never linked to an account and nobody can read individual rows: the
 *   anon role has INSERT-only rights on engagement_events.
 * - Free-text questions are never stored. Only a derived general topic is.
 */

const SESSION_KEY = "kih:session:v1";
const VISIT_KEY = "kih:visited:v1";
const REFERRER_KEY = "kih:referrer:v1";
const TAB_KEY = "kih:tab-session:v1";

export function anonymousSessionId(): string {
  if (typeof window === "undefined") return "server";
  let id = window.localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export type AnalyticsEvent =
  | "session_started"
  | "return_visit"
  | "location_enabled"
  | "manual_area_selected"
  | "search_submitted"
  | "ask_kih_query"
  | "category_selected"
  | "resource_view"
  | "resource_saved"
  | "resource_interested"
  | "map_opened"
  | "map_marker_selected"
  | "get_there"
  | "call_clicked"
  | "external_resource_opened"
  | "kih_live_viewed"
  | "food_resource_viewed"
  | "transportation_option_viewed"
  | "everyday_connect_opened"
  | "fast_freddy_resource_viewed";

export interface TrackPayload {
  resourceSlug?: string | undefined;
  category?: CategoryId | string | undefined;
  subcategory?: string | undefined;
  neighborhood?: string | undefined;
  zip?: string | undefined;
  areaType?: "current_location" | "manual_zip" | "manual_neighborhood" | undefined;
  distanceMiles?: number | undefined;
  searchRadius?: number | undefined;
  queryTopic?: string | undefined;
  resultCount?: number | undefined;
}

/** Coarse geography: enough for planning, useless for tracking a person. */
export function distanceBucket(miles?: number): string | null {
  if (miles === undefined || !Number.isFinite(miles)) return null;
  if (miles < 1) return "under_1_mile";
  if (miles <= 3) return "1_3_miles";
  if (miles <= 5) return "3_5_miles";
  return "over_5_miles";
}

export const DISTANCE_BUCKET_LABEL: Record<string, string> = {
  under_1_mile: "Under 1 mile",
  "1_3_miles": "1–3 miles",
  "3_5_miles": "3–5 miles",
  over_5_miles: "Over 5 miles",
};

function deviceType(): string {
  if (typeof window === "undefined") return "unknown";
  return window.innerWidth < 768 ? "mobile" : "desktop";
}

function referralSource(): string {
  if (typeof window === "undefined") return "unknown";
  const stored = window.localStorage.getItem(REFERRER_KEY);
  if (stored) return stored;
  let value = "direct";
  try {
    const ref = document.referrer;
    if (ref) {
      const host = new URL(ref).hostname;
      if (host && host !== window.location.hostname) value = host;
    }
  } catch {
    /* unreadable referrer */
  }
  window.localStorage.setItem(REFERRER_KEY, value);
  return value;
}

async function resourceRowId(slug: string): Promise<string | null> {
  const { data } = await supabase.from("resources").select("id").eq("slug", slug).maybeSingle();
  return data?.id ?? null;
}

/** Records one privacy-safe engagement event. Never throws. */
export async function track(event: AnalyticsEvent, payload: TrackPayload = {}): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const resource_id = payload.resourceSlug ? await resourceRowId(payload.resourceSlug) : null;
    await supabase.from("engagement_events").insert({
      event_type: event,
      resource_id,
      resource_slug: payload.resourceSlug ?? null,
      resource_category: payload.category ?? null,
      subcategory: payload.subcategory ?? null,
      neighborhood: payload.neighborhood ?? null,
      zip: payload.zip ?? null,
      area_type: payload.areaType ?? null,
      distance_bucket: distanceBucket(payload.distanceMiles),
      search_radius: payload.searchRadius ?? null,
      query_topic: payload.queryTopic ?? null,
      result_count: payload.resultCount ?? null,
      source_page: window.location.pathname,
      referral_source: referralSource(),
      device_type: deviceType(),
      anonymous_session_id: anonymousSessionId(),
    });
  } catch {
    /* measurement must never break the resident experience */
  }
}

/** One session_started per browser tab; return_visit when this browser has been here before. */
export function startSession(): void {
  if (typeof window === "undefined") return;
  try {
    if (window.sessionStorage.getItem(TAB_KEY)) return;
    window.sessionStorage.setItem(TAB_KEY, "1");
    const returning = window.localStorage.getItem(VISIT_KEY) !== null;
    window.localStorage.setItem(VISIT_KEY, new Date().toISOString());
    void track("session_started");
    if (returning) void track("return_visit");
  } catch {
    /* storage unavailable */
  }
}

/** A resource view, plus the specific programme views KIH reports on separately. */
export function trackResourceView(input: {
  slug: string;
  category: CategoryId | string;
  neighborhood?: string | undefined;
  distanceMiles?: number | undefined;
}): void {
  const base: TrackPayload = {
    resourceSlug: input.slug,
    category: input.category,
    neighborhood: input.neighborhood,
    distanceMiles: input.distanceMiles,
  };
  void track("resource_view", base);
  if (input.category === "food") void track("food_resource_viewed", base);
  if (input.slug.startsWith("ff-") || input.slug === "fast-freddy-experience") {
    void track("fast_freddy_resource_viewed", base);
  }
  if (input.slug.startsWith("everyday-connect")) void track("everyday_connect_opened", base);
}

/* ---------------------------------------------------------------------- */
/* Ask KIH topics — the question text itself is never stored.              */
/* ---------------------------------------------------------------------- */

export const QUERY_TOPICS = [
  "Food Support",
  "Health & Wellness",
  "Employment & Training",
  "Transportation",
  "Senior Programs",
  "Youth & Family",
  "Housing",
  "Education",
  "Recreation",
  "Technology",
  "Community Activities",
  "Neighborhood Information",
  "Local Events",
] as const;

const TOPIC_RULES: { topic: (typeof QUERY_TOPICS)[number]; words: RegExp }[] = [
  { topic: "Food Support", words: /\b(food|eat|meal|pantry|grocer|hungry|snap|wic|produce)\b/i },
  { topic: "Health & Wellness", words: /\b(health|clinic|doctor|medical|dental|mental|wellness|blood pressure|screening|vaccin)\b/i },
  { topic: "Employment & Training", words: /\b(job|work|employ|hiring|career|training|resume|apprentice)\b/i },
  { topic: "Transportation", words: /\b(bus|ride|transit|ddot|smart|transport|get there|drive|car)\b/i },
  { topic: "Senior Programs", words: /\b(senior|older adult|55\+|60\+|elder|retire)\b/i },
  { topic: "Youth & Family", words: /\b(kid|child|teen|youth|family|parent|after school|daycare)\b/i },
  { topic: "Housing", words: /\b(housing|rent|evict|apartment|shelter|utility|home repair)\b/i },
  { topic: "Education", words: /\b(class|school|ged|college|learn|tutor|literacy|library)\b/i },
  { topic: "Recreation", words: /\b(park|gym|basketball|swim|walk|recreation|fitness|sport)\b/i },
  { topic: "Technology", words: /\b(computer|internet|wifi|phone|tech|digital|online)\b/i },
  { topic: "Local Events", words: /\b(event|festival|concert|happening|tonight|this weekend|today)\b/i },
  { topic: "Neighborhood Information", words: /\b(neighborhood|my area|zip|block|street|safe|near me)\b/i },
  { topic: "Community Activities", words: /\b(community|group|volunteer|meet|social|club|gather)\b/i },
];

/** Derives a general topic from a resident question. The question is discarded. */
export function queryTopic(question: string): string {
  for (const rule of TOPIC_RULES) {
    if (rule.words.test(question)) return rule.topic;
  }
  return "Other";
}

/* ---------------------------------------------------------------------- */
/* Check-ins                                                               */
/* ---------------------------------------------------------------------- */

export async function persistCheckIn(input: {
  resourceSlug: string;
  category: CategoryId | string;
  neighborhood?: string | undefined;
  status: "verified" | "self_reported";
  distanceMeters?: number | undefined;
  fromMap?: boolean | undefined;
}): Promise<boolean> {
  try {
    const resource_id = await resourceRowId(input.resourceSlug);
    const { error } = await supabase.from("checkins").insert({
      resource_id,
      resource_slug: input.resourceSlug,
      resource_category: input.category,
      neighborhood: input.neighborhood ?? null,
      status: input.status,
      verification_method: input.status === "verified" ? "geolocation" : "resident_confirmation",
      distance_at_checkin:
        input.status === "verified" && input.distanceMeters !== undefined
          ? Math.round(input.distanceMeters)
          : null,
      source: input.fromMap ? "map" : "web",
      anonymous_session_id: anonymousSessionId(),
    });
    return !error;
  } catch {
    return false;
  }
}

/* ---------------------------------------------------------------------- */
/* Public aggregate reads (partner-facing)                                 */
/* ---------------------------------------------------------------------- */

export interface ImpactTotals {
  residentSessions: number;
  returnSessions: number;
  resourceViews: number;
  getThereClicks: number;
  callsInitiated: number;
  resourcesSaved: number;
  mapViews: number;
  askKihQuestions: number;
  externalOpens: number;
  liveViews: number;
  selfReportedCheckIns: number;
  verifiedCheckIns: number;
}

export async function fetchImpactTotals(): Promise<ImpactTotals | null> {
  const { data, error } = await supabase.rpc("analytics_overview");
  const row = Array.isArray(data) ? data[0] : data;
  if (error || !row) return null;
  return {
    residentSessions: Number(row.resident_sessions ?? 0),
    returnSessions: Number(row.return_sessions ?? 0),
    resourceViews: Number(row.resource_views ?? 0),
    getThereClicks: Number(row.get_there_clicks ?? 0),
    callsInitiated: Number(row.calls_initiated ?? 0),
    resourcesSaved: Number(row.resources_saved ?? 0),
    mapViews: Number(row.map_views ?? 0),
    askKihQuestions: Number(row.ask_kih_questions ?? 0),
    externalOpens: Number(row.external_opens ?? 0),
    liveViews: Number(row.kih_live_views ?? 0),
    selfReportedCheckIns: Number(row.self_reported_checkins ?? 0),
    verifiedCheckIns: Number(row.verified_checkins ?? 0),
  };
}

export interface CategoryDemand {
  category: string;
  events: number;
  share: number;
}

export async function fetchCategoryDemand(): Promise<CategoryDemand[]> {
  const { data, error } = await supabase.rpc("analytics_category_demand");
  if (error || !data) return [];
  return (data as { category: string; events: number; share: number }[]).map((r) => ({
    category: r.category,
    events: Number(r.events ?? 0),
    share: Number(r.share ?? 0),
  }));
}

export interface FunnelStage {
  stage: string;
  events: number;
}

export async function fetchFunnel(): Promise<FunnelStage[]> {
  const { data, error } = await supabase.rpc("analytics_funnel");
  if (error || !data) return [];
  return (data as { stage: string; events: number }[]).map((r) => ({
    stage: r.stage,
    events: Number(r.events ?? 0),
  }));
}
