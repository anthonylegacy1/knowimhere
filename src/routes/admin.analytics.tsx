import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { RESOURCES, CATEGORIES, type CategoryId } from "@/data/resources";
import { getAdminAnalytics, MIN_GROUP, type AdminResult, type AdminReport } from "@/lib/admin-analytics.functions";

const TITLE = "KIH Analytics (internal) | Know I'm Here";
const DESC = "Protected internal analytics for the Know I'm Here team.";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: AdminAnalytics,
});

const SECTIONS = [
  ["activity", "Resident Activity Summary"],
  ["overview", "Overview"],
  ["funnel", "Resident Funnel"],
  ["ask", "Ask KIH Insights"],
  ["categories", "Category Demand"],
  ["resources", "Resource Performance"],
  ["neighborhoods", "Neighborhood Insights"],
  ["gaps", "Resource Gap Analysis"],
  ["location", "Location Usage"],
  ["map", "Map Engagement"],
  ["report", "Partner Report Builder"],
] as const;

const RANGES = [
  ["today", "Today"],
  ["7", "Last 7 days"],
  ["30", "Last 30 days"],
  ["90", "Last 90 days"],
  ["all", "All time"],
  ["custom", "Custom range"],
] as const;

type RangeId = (typeof RANGES)[number][0];

// The admin passphrase is never persisted anywhere in the browser (no
// localStorage, sessionStorage or cookie). It lives in React state for the
// current page view only and is sent to the server function to be verified.

function resourceName(slug: string): string {
  const found = RESOURCES.find((r) => r.id === slug)?.name;
  if (found) return found;
  return slug
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Plain-English names for the technical event codes stored in the database. */
const EVENT_LABELS: Record<string, string> = {
  session_started: "Visit Started",
  return_visit: "Return Visit",
  resource_view: "Resource Viewed",
  get_there: "Get There Used",
  ask_kih_query: "Ask KIH Question",
  search_submitted: "Search Made",
  map_opened: "Map Opened",
  map_marker_selected: "Map Marker Opened",
  call_clicked: "Call Initiated",
  resource_saved: "Resource Saved",
  resource_interested: "Marked Interested",
  external_resource_opened: "Partner Website Opened",
  category_selected: "Category Explored",
  location_enabled: "Current Location Used",
  manual_area_selected: "Area Chosen Manually",
  transportation_option_viewed: "Transportation Option Viewed",
  kih_live_viewed: "KIH Live Viewed",
  food_resource_viewed: "Food Resource Viewed",
  fast_freddy_resource_viewed: "Fast Freddy Resource Viewed",
  everyday_connect_opened: "Everyday Connect Opened",
  verified_checkin: "Verified Check-In",
  self_reported_checkin: "Self-Reported Check-In",
};

function eventLabel(type: string): string {
  return EVENT_LABELS[type] ?? type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function activitySentence(row: { eventType: string; slug: string | null; category: string | null }): string {
  const res = row.slug ? resourceName(row.slug) : null;
  const cat = row.category ? categoryLabel(row.category) : null;
  switch (row.eventType) {
    case "resource_view":
      return res ? `Resident viewed ${res}.` : cat ? `Resident opened a ${cat} resource.` : "Resident viewed a resource.";
    case "get_there":
      return res ? `Resident used Get There for ${res}.` : "Resident used Get There.";
    case "call_clicked":
      return res ? `Resident started a call to ${res}.` : "Resident started a call to a provider.";
    case "resource_saved":
      return res ? `Resident saved ${res}.` : "Resident saved a resource.";
    case "ask_kih_query":
      return "Resident asked Know I'm Here a question.";
    case "map_opened":
      return "Resident opened the map.";
    case "map_marker_selected":
      return res ? `Resident opened ${res} from the map.` : "Resident opened a map marker.";
    case "category_selected":
      return cat ? `Resident explored ${cat}.` : "Resident explored a category.";
    case "session_started":
      return "Resident started a visit.";
    case "return_visit":
      return "Resident came back to Know I'm Here.";
    case "external_resource_opened":
      return res ? `Resident opened the website for ${res}.` : "Resident opened a partner website.";
    default:
      return res ? `${eventLabel(row.eventType)} — ${res}.` : `${eventLabel(row.eventType)}.`;
  }
}

/** Event types the current app actually records; anything else is "not yet tracked". */
const IMPLEMENTED = new Set(Object.keys(EVENT_LABELS));

function Bars({ rows }: { rows: { label: string; value: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="space-y-2">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="font-bold">{r.label}</span>
            <span className="font-display text-lg font-bold">{r.value}</span>
          </div>
          <div className="mt-1 h-3 rounded-full bg-foreground/10">
            <div className="h-3 rounded-full bg-brand" style={{ width: `${(r.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function categoryLabel(id: string | null): string {
  if (!id) return "—";
  return CATEGORIES[id as CategoryId]?.label ?? id;
}

function rangeBounds(range: RangeId, from: string, to: string): { from: string | null; to: string | null } {
  if (range === "all") return { from: null, to: null };
  if (range === "custom") {
    return {
      from: from ? new Date(`${from}T00:00:00`).toISOString() : null,
      to: to ? new Date(`${to}T23:59:59`).toISOString() : null,
    };
  }
  const now = new Date();
  if (range === "today") {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return { from: start.toISOString(), to: null };
  }
  const days = Number(range);
  return { from: new Date(now.getTime() - days * 86400000).toISOString(), to: null };
}

function Stat({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="card-flat p-4">
      <p className="font-display text-3xl font-bold">{value === null ? "—" : value}</p>
      <p className="mt-0.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

function SectionCard({ id, title, lead, children }: { id: string; title: string; lead?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="card-pop scroll-mt-24 p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-2xl font-bold">{title}</h2>
        <span className="chip bg-mint/25 text-[11px] uppercase tracking-wide">Live MVP data</span>
      </div>
      {lead && <p className="mt-1 text-sm text-foreground/70">{lead}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Empty({ text = "No data yet" }: { text?: string }) {
  return <p className="rounded-2xl bg-cream px-4 py-6 text-center text-sm font-bold uppercase tracking-wide text-muted-foreground">{text}</p>;
}

function AdminAnalytics() {
  const run = useServerFn(getAdminAnalytics);
  const [key, setKey] = useState("");
  const [range, setRange] = useState<RangeId>("30");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [result, setResult] = useState<AdminResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [reportCategory, setReportCategory] = useState("all");
  const [reportNeighborhood, setReportNeighborhood] = useState("all");
  const [sortBy, setSortBy] = useState<"views" | "getThere" | "calls" | "saves">("views");

  const load = useCallback(
    async (pass: string) => {
      setLoading(true);
      const bounds = rangeBounds(range, customFrom, customTo);
      try {
        const res = (await run({ data: { key: pass, ...bounds } })) as AdminResult;
        setResult(res);
      } finally {
        setLoading(false);
      }
    },
    [run, range, customFrom, customTo],
  );

  const report = result?.status === "ok" ? (result as AdminReport) : null;

  const sortedResources = useMemo(() => {
    if (!report) return [];
    return [...report.resources].sort((a, b) => b[sortBy] - a[sortBy]);
  }, [report, sortBy]);

  const partnerSummary = useMemo(() => {
    if (!report) return null;
    const res = report.resources.filter((r) => reportCategory === "all" || r.category === reportCategory);
    const hoods = report.neighborhoods.filter((h) => reportNeighborhood === "all" || h.neighborhood === reportNeighborhood);
    const sum = (pick: (r: (typeof res)[number]) => number) => res.reduce((s, r) => s + pick(r), 0);
    return {
      label: reportCategory === "all" ? "All categories" : categoryLabel(reportCategory),
      neighborhood: reportNeighborhood === "all" ? "All neighborhoods" : reportNeighborhood,
      views: sum((r) => r.views),
      getThere: sum((r) => r.getThere),
      calls: sum((r) => r.calls),
      saves: sum((r) => r.saves),
      checkIns: sum((r) => r.selfReportedCheckIns + r.verifiedCheckIns),
      topDemand: report.categories
        .filter((c) => reportCategory === "all" || c.category === reportCategory)
        .slice(0, 3)
        .map((c) => categoryLabel(c.category)),
      hoods: hoods.length,
    };
  }, [report, reportCategory, reportNeighborhood]);

  function downloadCsv() {
    if (!report) return;
    const lines = [
      ["Resource", "Category", "Views", "Saves", "Get There", "Calls", "External opens", "Self-reported check-ins", "Verified check-ins"].join(","),
      ...report.resources.map((r) =>
        [
          `"${resourceName(r.slug).replace(/"/g, '""')}"`,
          `"${categoryLabel(r.category)}"`,
          r.views,
          r.saves,
          r.getThere,
          r.calls,
          r.externalOpens,
          r.selfReportedCheckIns,
          r.verifiedCheckIns,
        ].join(","),
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kih-resource-performance-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!report) {
    return (
      <div className="container-kih py-12">
        <div className="mx-auto max-w-md">
          <span className="eyebrow">Internal</span>
          <h1 className="mt-3 font-display text-3xl font-bold">KIH Analytics</h1>
          <p className="mt-2 text-foreground/70">
            Understand how residents discover, access and engage with community resources. This area is for the Know I&apos;m Here team.
          </p>
          <form
            className="card-pop mt-6 p-6"
            onSubmit={(e) => {
              e.preventDefault();
              void load(key);
            }}
          >
            <label htmlFor="admin-key" className="text-sm font-bold">
              Admin passphrase
            </label>
            <input
              id="admin-key"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              autoComplete="current-password"
              className="mt-2 min-h-12 w-full rounded-2xl border-2 border-border bg-card px-4 text-base"
            />
            <button type="submit" disabled={loading} className="btn-base btn-brand mt-4 w-full">
              {loading ? "Checking…" : "Open dashboard"}
            </button>
            {result?.status === "denied" && (
              <p className="mt-3 text-sm font-bold text-brand">That passphrase is not correct.</p>
            )}
            {result?.status === "unconfigured" && (
              <p className="mt-3 text-sm font-bold text-brand">
                No admin passphrase is configured for this project yet, so the dashboard stays locked.
              </p>
            )}
          </form>
        </div>
      </div>
    );
  }

  const gaps = report.topics.filter((t) => t.gap);

  return (
    <div className="container-kih py-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="eyebrow">Internal · not resident-facing</span>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">KIH Analytics</h1>
          <p className="mt-2 max-w-2xl text-foreground/70">
            Understand how residents discover, access and engage with community resources.
          </p>
        </div>
        <div className="flex gap-2 print:hidden">
          <button type="button" onClick={downloadCsv} className="btn-base btn-sm border-2 border-border bg-card">
            Download CSV
          </button>
          <button type="button" onClick={() => window.print()} className="btn-base btn-sm border-2 border-border bg-card">
            Print / save report
          </button>
        </div>
      </div>

      <nav aria-label="Analytics sections" className="mt-6 flex flex-wrap gap-2 print:hidden">
        {SECTIONS.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="chip min-h-11 px-4">
            {label}
          </a>
        ))}
      </nav>

      <div className="mt-6 flex flex-wrap items-center gap-2 print:hidden">
        {RANGES.map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={range === id}
            onClick={() => setRange(id)}
            className={`chip min-h-11 cursor-pointer px-4 ${range === id ? "bg-ink text-cream" : ""}`}
          >
            {label}
          </button>
        ))}
        {range === "custom" && (
          <>
            <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="min-h-11 rounded-2xl border-2 border-border bg-card px-3" />
            <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="min-h-11 rounded-2xl border-2 border-border bg-card px-3" />
          </>
        )}
        <button type="button" onClick={() => void load(key)} className="btn-base btn-brand btn-sm">
          {loading ? "Loading…" : "Apply"}
        </button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Showing {report.rangeLabel} · {report.eventCount} recorded events · generated {new Date(report.generatedAt).toLocaleString()}. All
        figures are live MVP data recorded by this prototype.
      </p>

      <div className="mt-8 grid gap-6">
        <SectionCard id="overview" title="Overview">
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Object.entries(report.overview).map(([label, value]) => (
              <Stat key={label} label={label} value={value} />
            ))}
          </div>
        </SectionCard>

        <SectionCard id="funnel" title="Resident connection funnel" lead="Each step counts a distinct recorded action; steps are never merged.">
          <ol className="space-y-3">
            {report.funnel.map((f, i) => {
              const first = report.funnel[0]?.events ?? 0;
              const pct = first ? Math.round((f.events / first) * 100) : 0;
              return (
                <li key={f.stage}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-bold">
                      {i + 1}. {f.stage}
                    </span>
                    <span className="font-display text-2xl font-bold">
                      {f.events} <span className="text-sm font-bold text-muted-foreground">{i === 0 ? "" : `${pct}% of discover`}</span>
                    </span>
                  </div>
                  <div className="mt-1 h-3 rounded-full bg-foreground/10">
                    <div className="h-3 rounded-full bg-brand" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{f.detail}</p>
                </li>
              );
            })}
          </ol>
        </SectionCard>

        <SectionCard id="ask" title="What are residents asking for?" lead="Questions are never stored. Only a derived general topic is recorded.">
          {report.topics.length === 0 ? (
            <Empty />
          ) : (
            <ul className="space-y-2">
              {report.topics.map((t) => (
                <li key={t.topic} className="card-flat flex flex-wrap items-center justify-between gap-2 p-3">
                  <span className="font-bold">{t.topic}</span>
                  <span className="text-sm text-foreground/70">
                    {t.searches} searches · {t.averageResults === null ? "results not recorded" : `${t.averageResults} avg matches`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard id="categories" title="Most explored categories">
          <div className="mb-3 flex flex-wrap gap-2">
            {(["views", "saves", "getThere"] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={sortBy === m}
                onClick={() => setSortBy(m)}
                className={`chip min-h-11 cursor-pointer px-4 ${sortBy === m ? "bg-ink text-cream" : ""}`}
              >
                Rank by {m === "getThere" ? "Get There" : m}
              </button>
            ))}
          </div>
          {report.categories.length === 0 ? (
            <Empty />
          ) : (
            <ul className="space-y-2">
              {[...report.categories]
                .sort((a, b) => (b[sortBy === "calls" ? "views" : sortBy] as number) - (a[sortBy === "calls" ? "views" : sortBy] as number))
                .map((c) => (
                  <li key={c.category} className="card-flat p-3">
                    <div className="flex items-baseline justify-between">
                      <span className="font-bold">{categoryLabel(c.category)}</span>
                      <span className="font-display text-xl font-bold">{c.share}%</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {c.views} views · {c.searches} category selections · {c.saves} saves · {c.getThere} Get There
                    </p>
                  </li>
                ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard id="resources" title="Resource performance">
          {sortedResources.length === 0 ? (
            <Empty />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    <th className="py-2">Resource</th>
                    <th>Category</th>
                    {(["views", "saves", "getThere", "calls"] as const).map((m) => (
                      <th key={m}>
                        <button type="button" onClick={() => setSortBy(m)} className="uppercase underline-offset-4 hover:underline">
                          {m === "getThere" ? "Get There" : m}
                        </button>
                      </th>
                    ))}
                    <th>External</th>
                    <th>Self check-ins</th>
                    <th>Verified</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedResources.map((r) => (
                    <tr key={r.slug} className="border-t border-border">
                      <td className="py-2 font-bold">{resourceName(r.slug)}</td>
                      <td>{categoryLabel(r.category)}</td>
                      <td>{r.views}</td>
                      <td>{r.saves}</td>
                      <td>{r.getThere}</td>
                      <td>{r.calls}</td>
                      <td>{r.externalOpens}</td>
                      <td>{r.selfReportedCheckIns}</td>
                      <td>{r.verifiedCheckIns}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>

        <SectionCard
          id="neighborhoods"
          title="Where is engagement happening?"
          lead={`Neighborhood or ZIP only — never coordinates. Groups with fewer than ${MIN_GROUP} unique residents are hidden.`}
        >
          {report.neighborhoods.length === 0 ? (
            <Empty text={`No neighborhood reaches the ${MIN_GROUP}-resident privacy threshold yet`} />
          ) : (
            <ul className="space-y-2">
              {report.neighborhoods.map((h) => (
                <li key={h.neighborhood} className="card-flat p-3">
                  <div className="flex items-baseline justify-between">
                    <span className="font-bold">{h.neighborhood}</span>
                    <span className="text-sm text-foreground/70">{h.residents} residents</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {h.views} views · {h.getThere} Get There · {h.checkIns} check-ins · top category {categoryLabel(h.topCategory)}
                  </p>
                </li>
              ))}
            </ul>
          )}
          {report.suppressedNeighborhoods > 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              {report.suppressedNeighborhoods} neighborhood group(s) hidden for privacy (fewer than {MIN_GROUP} residents).
            </p>
          )}
        </SectionCard>

        <SectionCard id="gaps" title="What are residents looking for that KIH can't yet find?" lead="Repeated demand that returns too few matching resources.">
          {report.topics.length === 0 ? (
            <Empty />
          ) : (
            <ul className="space-y-2">
              {(gaps.length > 0 ? gaps : report.topics).map((t) => (
                <li key={t.topic} className={`card-flat p-3 ${t.gap ? "border-2 border-brand" : ""}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-bold">{t.topic}</span>
                    {t.gap && <span className="chip bg-brand text-brand-foreground text-[11px] uppercase tracking-wide">Resource gap</span>}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {t.searches} searches · {t.averageResults === null ? "matching results not recorded" : `${t.averageResults} matching resources on average`}
                  </p>
                </li>
              ))}
            </ul>
          )}
          {report.topics.length > 0 && gaps.length === 0 && (
            <p className="mt-3 text-xs text-muted-foreground">No topic currently meets the gap rule (3+ searches averaging under 3 matches).</p>
          )}
        </SectionCard>

        <SectionCard id="location" title="Location usage" lead="How residents choose to set their area. No coordinates are recorded anywhere.">
          <div className="grid gap-3 sm:grid-cols-4">
            <Stat label="Current location used" value={report.location.currentLocation} />
            <Stat label="Manual ZIP used" value={report.location.manualZip} />
            <Stat label="Manual neighborhood used" value={report.location.manualNeighborhood} />
            <Stat label="Average radius (miles)" value={report.location.averageRadius} />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Location declined: <strong>not yet tracked</strong> — KIH does not record a decline event.
          </p>
        </SectionCard>

        <SectionCard id="map" title="Map engagement">
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Map opens" value={report.map.opens} />
            <Stat label="Markers selected" value={report.map.markers} />
            <Stat label="Resources opened from map" value={report.map.viewsFromMap} />
            <Stat label="Get There from map" value={report.map.getThereFromMap} />
            <Stat label="Calls from map" value={report.map.callsFromMap} />
            <Stat label="Check-ins from map" value={report.map.checkInsFromMap} />
          </div>
        </SectionCard>

        <SectionCard id="report" title="Create partner summary" lead="Aggregate only. No resident identity, question history or individual check-in leaves this screen.">
          <div className="flex flex-wrap gap-2 print:hidden">
            <select value={reportCategory} onChange={(e) => setReportCategory(e.target.value)} className="min-h-11 rounded-2xl border-2 border-border bg-card px-3">
              <option value="all">All categories</option>
              {Object.entries(CATEGORIES).map(([id, c]) => (
                <option key={id} value={id}>
                  {c.label}
                </option>
              ))}
            </select>
            <select value={reportNeighborhood} onChange={(e) => setReportNeighborhood(e.target.value)} className="min-h-11 rounded-2xl border-2 border-border bg-card px-3">
              <option value="all">All neighborhoods</option>
              {report.neighborhoods.map((h) => (
                <option key={h.neighborhood} value={h.neighborhood}>
                  {h.neighborhood}
                </option>
              ))}
            </select>
          </div>
          {partnerSummary && (
            <div className="card-flat mt-4 p-5">
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-brand">
                {partnerSummary.label} · {partnerSummary.neighborhood} · {report.rangeLabel}
              </p>
              <ul className="mt-3 space-y-1 font-bold">
                <li>{partnerSummary.views} resource views</li>
                <li>{partnerSummary.getThere} Get There actions</li>
                <li>{partnerSummary.calls} provider calls</li>
                <li>{partnerSummary.saves} saved resources</li>
                <li>{partnerSummary.checkIns} voluntary check-ins</li>
              </ul>
              {partnerSummary.topDemand.length > 0 && (
                <p className="mt-3 text-sm text-foreground/70">Top demand: {partnerSummary.topDemand.join(" · ")}</p>
              )}
              <p className="mt-3 text-xs text-muted-foreground">
                Live MVP data from the Know I&apos;m Here prototype. Aggregate only — no individual resident records.
              </p>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
