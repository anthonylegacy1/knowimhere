import { supabase } from "@/integrations/supabase/client";
import type { CategoryId } from "@/data/resources";

/**
 * Privacy-conscious measurement layer.
 *
 * Rules enforced here:
 * - No coordinates are ever sent. A verified check-in sends only a rounded
 *   distance in meters.
 * - Anonymous residents are identified by a random session id stored locally.
 *   It is never linked to an account and is not readable by anyone else
 *   (the anon role has INSERT-only rights on these tables).
 * - Reads of individual rows are impossible for the public; only the
 *   aggregate database functions are exposed.
 */

const SESSION_KEY = "kih:session:v1";

export function anonymousSessionId(): string {
  if (typeof window === "undefined") return "server";
  let id = window.localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

async function resourceRowId(slug: string): Promise<string | null> {
  const { data } = await supabase.from("resources").select("id").eq("slug", slug).maybeSingle();
  return data?.id ?? null;
}

export type EngagementType = "resource_view" | "get_there" | "category_interest";

export async function logEngagement(input: {
  type: EngagementType;
  resourceSlug: string;
  category: CategoryId | string;
  neighborhood?: string;
}): Promise<void> {
  try {
    const resource_id = await resourceRowId(input.resourceSlug);
    await supabase.from("engagement_events").insert({
      event_type: input.type,
      resource_id,
      resource_slug: input.resourceSlug,
      resource_category: input.category,
      neighborhood: input.neighborhood ?? null,
      anonymous_session_id: anonymousSessionId(),
    });
  } catch {
    /* measurement must never break the resident experience */
  }
}

export async function persistCheckIn(input: {
  resourceSlug: string;
  category: CategoryId | string;
  neighborhood?: string;
  status: "verified" | "self_reported";
  distanceMeters?: number;
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
        input.status === "verified" && input.distanceMeters !== undefined ? Math.round(input.distanceMeters) : null,
      source: "web",
      anonymous_session_id: anonymousSessionId(),
    });
    return !error;
  } catch {
    return false;
  }
}

export interface ImpactTotals {
  resourceViews: number;
  getThereClicks: number;
  selfReportedCheckIns: number;
  verifiedCheckIns: number;
}

export async function fetchImpactTotals(): Promise<ImpactTotals | null> {
  const { data, error } = await supabase.rpc("impact_totals");
  const row = Array.isArray(data) ? data[0] : data;
  if (error || !row) return null;
  return {
    resourceViews: Number(row.resource_views ?? 0),
    getThereClicks: Number(row.get_there_clicks ?? 0),
    selfReportedCheckIns: Number(row.self_reported_checkins ?? 0),
    verifiedCheckIns: Number(row.verified_checkins ?? 0),
  };
}

export interface CategoryImpact {
  category: string;
  views: number;
  checkins: number;
}

export async function fetchImpactByCategory(): Promise<CategoryImpact[]> {
  const { data, error } = await supabase.rpc("impact_by_category");
  if (error || !data) return [];
  return (data as { category: string; views: number; checkins: number }[]).map((r) => ({
    category: r.category,
    views: Number(r.views ?? 0),
    checkins: Number(r.checkins ?? 0),
  }));
}
