import { createServerFn } from "@tanstack/react-start";

/**
 * Internal KIH analytics. Every aggregate is computed server-side behind an
 * admin passphrase; no individual row ever leaves this handler.
 *
 * Privacy rules enforced here:
 * - Neighborhood groups with fewer than MIN_GROUP unique anonymous residents
 *   are suppressed entirely.
 * - No coordinates exist in the analytics tables, so none can be returned.
 * - No session ids, user ids, question text or individual check-in rows are
 *   included in any response.
 */

export const MIN_GROUP = 5;

export interface AdminRange {
  key: string;
  from?: string | null;
  to?: string | null;
}

export interface Counter {
  label: string;
  value: number;
}

export interface ResourceRow {
  slug: string;
  category: string | null;
  views: number;
  saves: number;
  getThere: number;
  calls: number;
  externalOpens: number;
  selfReportedCheckIns: number;
  verifiedCheckIns: number;
}

export interface NeighborhoodRow {
  neighborhood: string;
  residents: number;
  sessions: number;
  views: number;
  getThere: number;
  checkIns: number;
  topCategory: string | null;
}

export interface TopicRow {
  topic: string;
  searches: number;
  averageResults: number | null;
  gap: boolean;
}

export interface CategoryRow {
  category: string;
  views: number;
  searches: number;
  saves: number;
  getThere: number;
  total: number;
  share: number;
}

export interface AdminReport {
  status: "ok";
  generatedAt: string;
  rangeLabel: string;
  eventCount: number;
  overview: Record<string, number | null>;
  funnel: { stage: string; detail: string; events: number }[];
  categories: CategoryRow[];
  topics: TopicRow[];
  resources: ResourceRow[];
  neighborhoods: NeighborhoodRow[];
  suppressedNeighborhoods: number;
  location: { currentLocation: number; manualZip: number; manualNeighborhood: number; averageRadius: number | null };
  map: { opens: number; markers: number; viewsFromMap: number; getThereFromMap: number; callsFromMap: number; checkInsFromMap: number };
  devices: Counter[];
}

export type AdminResult = AdminReport | { status: "denied" } | { status: "unconfigured" };

interface EventRow {
  event_type: string;
  resource_slug: string | null;
  resource_category: string | null;
  neighborhood: string | null;
  zip: string | null;
  area_type: string | null;
  search_radius: number | null;
  query_topic: string | null;
  result_count: number | null;
  source_page: string | null;
  device_type: string | null;
  anonymous_session_id: string | null;
  created_at: string;
}

interface CheckinRow {
  resource_slug: string | null;
  resource_category: string | null;
  neighborhood: string | null;
  status: string;
  source: string | null;
  anonymous_session_id: string | null;
  created_at: string;
}

function countBy<T>(rows: T[], pick: (r: T) => string | null | undefined): Counter[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    const k = pick(r);
    if (!k) continue;
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}

export const getAdminAnalytics = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const d = (data ?? {}) as Partial<AdminRange>;
    return {
      key: typeof d.key === "string" ? d.key : "",
      from: typeof d.from === "string" ? d.from : null,
      to: typeof d.to === "string" ? d.to : null,
    } satisfies AdminRange;
  })
  .handler(async ({ data }): Promise<AdminResult> => {
    const expected = process.env["KIH_ANALYTICS_KEY"];
    if (!expected) return { status: "unconfigured" };
    if (!data.key || data.key !== expected) return { status: "denied" };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let eventQuery = supabaseAdmin
      .from("engagement_events")
      .select(
        "event_type,resource_slug,resource_category,neighborhood,zip,area_type,search_radius,query_topic,result_count,source_page,device_type,anonymous_session_id,created_at",
      )
      .order("created_at", { ascending: false })
      .limit(50000);
    let checkinQuery = supabaseAdmin
      .from("checkins")
      .select("resource_slug,resource_category,neighborhood,status,source,anonymous_session_id,created_at")
      .order("checked_in_at", { ascending: false })
      .limit(50000);

    if (data.from) {
      eventQuery = eventQuery.gte("created_at", data.from);
      checkinQuery = checkinQuery.gte("created_at", data.from);
    }
    if (data.to) {
      eventQuery = eventQuery.lte("created_at", data.to);
      checkinQuery = checkinQuery.lte("created_at", data.to);
    }

    const [{ data: eventsData }, { data: checkinsData }] = await Promise.all([eventQuery, checkinQuery]);
    const events = (eventsData ?? []) as unknown as EventRow[];
    const checkins = (checkinsData ?? []) as unknown as CheckinRow[];

    const ofType = (t: string) => events.filter((e) => e.event_type === t);
    const n = (t: string) => ofType(t).length;
    const uniqueSessions = (rows: { anonymous_session_id: string | null }[]) =>
      new Set(rows.map((r) => r.anonymous_session_id).filter(Boolean)).size;

    const selfReported = checkins.filter((c) => c.status === "self_reported").length;
    const verified = checkins.filter((c) => c.status === "verified").length;

    const overview: Record<string, number | null> = {
      "Resident sessions": uniqueSessions(ofType("session_started")),
      "Return visits": n("return_visit"),
      "Ask KIH searches": n("ask_kih_query") + n("search_submitted"),
      "Resource views": n("resource_view"),
      "Map views": n("map_opened"),
      "Map marker interactions": n("map_marker_selected"),
      "Saved resources": n("resource_saved"),
      "Get There actions": n("get_there"),
      "Call actions": n("call_clicked"),
      "External resource clicks": n("external_resource_opened"),
      "Self-reported check-ins": selfReported,
      "Location-verified check-ins": verified,
    };

    const funnel = [
      { stage: "Discover", detail: "Resource viewed", events: n("resource_view") },
      { stage: "Show interest", detail: "Saved or marked interested", events: n("resource_saved") + n("resource_interested") },
      { stage: "Get There", detail: "Directions or transportation accessed", events: n("get_there") },
      { stage: "Connect", detail: "Call or external provider link", events: n("call_clicked") + n("external_resource_opened") },
      { stage: "Participate", detail: "Self-reported or verified check-in", events: checkins.length },
    ];

    // Category demand
    const catMap = new Map<string, CategoryRow>();
    const catRow = (c: string) => {
      let row = catMap.get(c);
      if (!row) {
        row = { category: c, views: 0, searches: 0, saves: 0, getThere: 0, total: 0, share: 0 };
        catMap.set(c, row);
      }
      return row;
    };
    for (const e of events) {
      const c = e.resource_category;
      if (!c) continue;
      const row = catRow(c);
      if (e.event_type === "resource_view") row.views += 1;
      else if (e.event_type === "resource_saved") row.saves += 1;
      else if (e.event_type === "get_there") row.getThere += 1;
      else if (e.event_type === "category_selected") row.searches += 1;
      else continue;
      row.total += 1;
    }
    const catTotal = [...catMap.values()].reduce((s, r) => s + r.total, 0);
    const categories = [...catMap.values()]
      .map((r) => ({ ...r, share: catTotal ? Math.round((r.total / catTotal) * 1000) / 10 : 0 }))
      .sort((a, b) => b.total - a.total);

    // Ask KIH topics + resource gaps
    const askRows = events.filter((e) => e.event_type === "ask_kih_query" || e.event_type === "search_submitted");
    const topicMap = new Map<string, { searches: number; results: number[] }>();
    for (const e of askRows) {
      const t = e.query_topic ?? "Other";
      const row = topicMap.get(t) ?? { searches: 0, results: [] };
      row.searches += 1;
      if (typeof e.result_count === "number") row.results.push(e.result_count);
      topicMap.set(t, row);
    }
    const topics: TopicRow[] = [...topicMap.entries()]
      .map(([topic, r]) => {
        const averageResults = r.results.length
          ? Math.round((r.results.reduce((s, x) => s + x, 0) / r.results.length) * 10) / 10
          : null;
        return { topic, searches: r.searches, averageResults, gap: r.searches >= 3 && averageResults !== null && averageResults < 3 };
      })
      .sort((a, b) => b.searches - a.searches);

    // Resource performance
    const slugs = new Set<string>();
    events.forEach((e) => e.resource_slug && slugs.add(e.resource_slug));
    checkins.forEach((c) => c.resource_slug && slugs.add(c.resource_slug));
    const resources: ResourceRow[] = [...slugs]
      .map((slug) => {
        const es = events.filter((e) => e.resource_slug === slug);
        const cs = checkins.filter((c) => c.resource_slug === slug);
        return {
          slug,
          category: es.find((e) => e.resource_category)?.resource_category ?? null,
          views: es.filter((e) => e.event_type === "resource_view").length,
          saves: es.filter((e) => e.event_type === "resource_saved").length,
          getThere: es.filter((e) => e.event_type === "get_there").length,
          calls: es.filter((e) => e.event_type === "call_clicked").length,
          externalOpens: es.filter((e) => e.event_type === "external_resource_opened").length,
          selfReportedCheckIns: cs.filter((c) => c.status === "self_reported").length,
          verifiedCheckIns: cs.filter((c) => c.status === "verified").length,
        };
      })
      .sort((a, b) => b.views - a.views);

    // Neighborhood insights, suppressed below the privacy threshold
    const hoods = new Set<string>();
    events.forEach((e) => e.neighborhood && hoods.add(e.neighborhood));
    checkins.forEach((c) => c.neighborhood && hoods.add(c.neighborhood));
    let suppressedNeighborhoods = 0;
    const neighborhoods: NeighborhoodRow[] = [];
    for (const hood of hoods) {
      const es = events.filter((e) => e.neighborhood === hood);
      const cs = checkins.filter((c) => c.neighborhood === hood);
      const residents = new Set(
        [...es, ...cs].map((r) => r.anonymous_session_id).filter(Boolean) as string[],
      ).size;
      if (residents < MIN_GROUP) {
        suppressedNeighborhoods += 1;
        continue;
      }
      neighborhoods.push({
        neighborhood: hood,
        residents,
        sessions: residents,
        views: es.filter((e) => e.event_type === "resource_view").length,
        getThere: es.filter((e) => e.event_type === "get_there").length,
        checkIns: cs.length,
        topCategory: countBy(es, (e) => e.resource_category)[0]?.label ?? null,
      });
    }
    neighborhoods.sort((a, b) => b.views - a.views);

    const radii = events.map((e) => e.search_radius).filter((r): r is number => typeof r === "number");
    const location = {
      currentLocation: n("location_enabled"),
      manualZip: events.filter((e) => e.area_type === "manual_zip").length,
      manualNeighborhood: events.filter((e) => e.area_type === "manual_neighborhood").length,
      averageRadius: radii.length ? Math.round((radii.reduce((s, x) => s + x, 0) / radii.length) * 10) / 10 : null,
    };

    const fromMap = (t: string) => events.filter((e) => e.event_type === t && e.source_page === "/map").length;
    const map = {
      opens: n("map_opened"),
      markers: n("map_marker_selected"),
      viewsFromMap: fromMap("resource_view"),
      getThereFromMap: fromMap("get_there"),
      callsFromMap: fromMap("call_clicked"),
      checkInsFromMap: checkins.filter((c) => c.source === "map").length,
    };

    return {
      status: "ok",
      generatedAt: new Date().toISOString(),
      rangeLabel: data.from ? `${data.from.slice(0, 10)} → ${(data.to ?? new Date().toISOString()).slice(0, 10)}` : "All time",
      eventCount: events.length,
      overview,
      funnel,
      categories,
      topics,
      resources,
      neighborhoods,
      suppressedNeighborhoods,
      location,
      map,
      devices: countBy(events, (e) => e.device_type),
    };
  });
