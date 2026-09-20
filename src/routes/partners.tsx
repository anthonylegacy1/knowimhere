import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowDown } from "lucide-react";
import { SectionHeading } from "@/components/kih/SectionHeading";
import { fetchCategoryDemand, fetchImpactTotals, type CategoryDemand, type ImpactTotals } from "@/lib/impact";
import { CATEGORIES, type CategoryId } from "@/data/resources";

/**
 * Data-source audit (verified against the database, Sept 20 2026):
 *
 * Every number in "What this MVP is measuring" is a real aggregate over the
 * engagement_events and checkins tables, written by prototype interactions
 * during Buildathon building and testing. Nothing in that block is seeded or
 * hard-coded. The activity is internal testing, so it is labelled
 * "Buildathon test activity", never resident adoption.
 *
 * Resident sessions read the session_started event, which was added after
 * resource-view tracking, so earlier views have no matching session. That is
 * explained on screen rather than patched over.
 *
 * The Senior Wellness / Youth Technology funnels are hard-coded illustrative
 * scenarios and stay in their own clearly badged section.
 */

function Flow({ steps }: { steps: string[] }) {
  return (
    <ol className="mx-auto mt-5 max-w-sm">
      {steps.map((s, i) => (
        <li key={s}>
          {i > 0 && (
            <div className="flex justify-center py-1.5 text-foreground/40" aria-hidden>
              <ArrowDown className="size-5" />
            </div>
          )}
          <div
            className={`rounded-2xl px-4 py-3 text-center text-sm font-extrabold uppercase ${
              s.startsWith("Know I") ? "bg-brand text-brand-foreground" : "card-flat"
            }`}
          >
            {s}
          </div>
        </li>
      ))}
    </ol>
  );
}

function LearnMore({ label, children }: { label: string; children: ReactNode }) {
  return (
    <details className="mt-3 rounded-2xl border-2 border-ink/10 bg-card px-4 py-3">
      <summary className="min-h-11 cursor-pointer list-none text-sm font-extrabold text-ink">{label}</summary>
      <div className="mt-2 text-sm text-foreground/75">{children}</div>
    </details>
  );
}

const PILOT_RESIDENT = [
  "Resource discovery",
  "Resource detail views",
  "Get There clicks",
  "Registrations and referrals",
  "Voluntary check-ins",
  "Repeat visits",
  "Repeat participation",
  "Category demand",
];

const PILOT_PARTNER = [
  "Referral traffic",
  "Program registrations",
  "Attendance and utilization",
  "Outreach conversion",
  "Available capacity vs participation",
  "Cost per resident reached",
  "Repeat engagement",
  "Neighborhood demand",
  "Resource gaps",
];

function LiveImpact() {
  const [totals, setTotals] = useState<ImpactTotals | null>(null);
  const [demand, setDemand] = useState<CategoryDemand[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    void Promise.all([fetchImpactTotals(), fetchCategoryDemand()]).then(([t, d]) => {
      if (!active) return;
      setTotals(t);
      setDemand(d);
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!loaded || !totals) return null;

  const items: Array<[string, number]> = [
    ["Resident sessions", totals.residentSessions],
    ["Return visits", totals.returnSessions],
    ["Resource views", totals.resourceViews],
    ["Ask KIH questions", totals.askKihQuestions],
    ["Map views", totals.mapViews],
    ["Resources saved", totals.resourcesSaved],
    ["Get There actions", totals.getThereClicks],
    ["Calls initiated", totals.callsInitiated],
    ["Voluntary check-ins — self-reported", totals.selfReportedCheckIns],
    ["Voluntary check-ins — location-verified", totals.verifiedCheckIns],
  ];

  const sessionsLag = totals.residentSessions === 0 && totals.resourceViews > 0;
  const demandTotal = demand.reduce((sum, d) => sum + d.events, 0);

  return (
    <>
      {/* SECTION A — WHAT THIS MVP IS MEASURING */}
      <div className="card-pop mt-6 border-2 border-mint p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-xl font-bold">What this MVP is measuring</h2>
          <span className="chip bg-mint/25 text-[11px] uppercase tracking-wide">Buildathon test activity</span>
        </div>
        <p className="mt-1 text-sm text-foreground/70">
          Prototype interaction data — not yet a measure of citywide impact. Includes Buildathon testing activity by the
          team. Totals only: no individual resident, question, location or history is shown or stored here.
        </p>

        <dl className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {items.map(([label, n]) => (
            <div key={label} className="card-flat p-3">
              <dd className="font-display text-2xl font-bold leading-none sm:text-3xl">{n}</dd>
              <dt className="mt-1 text-[11px] font-bold uppercase leading-tight tracking-wide text-muted-foreground">
                {label}
              </dt>
            </div>
          ))}
        </dl>

        {sessionsLag && (
          <p className="mt-3 rounded-2xl bg-sun/25 px-4 py-3 text-sm font-semibold">
            Resident sessions reads a session event that was added to the prototype after resource-view tracking, so
            the views above were recorded before any session could be counted. The two numbers cover different tracking
            periods and should not be read as a ratio.
          </p>
        )}

        <LearnMore label="Learn more: where each number comes from">
          <ul className="list-disc space-y-1 pl-5">
            <li>All counts are database aggregates over recorded prototype events and voluntary check-ins.</li>
            <li>Nothing in this block is seeded, sampled or hard-coded.</li>
            <li>Activity so far is building and testing by the team, not public resident use.</li>
            <li>A metric showing 0 means no such event has been recorded yet — never a placeholder.</li>
          </ul>
        </LearnMore>

        <h3 className="mt-6 font-display text-lg font-bold">Most explored categories</h3>
        {demand.length === 0 ? (
          <p className="mt-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">No data yet</p>
        ) : (
          <>
            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Early prototype activity — based on {demandTotal} tracked category interactions
            </p>
            <ul className="mt-2 space-y-1.5">
              {demand.slice(0, 6).map((d) => (
                <li key={d.category} className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-bold">{CATEGORIES[d.category as CategoryId]?.label ?? d.category}</span>
                  <span className="whitespace-nowrap">
                    <span className="font-display text-lg font-bold">{d.share}%</span>{" "}
                    <span className="text-xs text-muted-foreground">({d.events})</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">
              This sample is small and mostly internal testing. It is not representative of Detroit resident demand.
            </p>
          </>
        )}
      </div>

      {/* SECTION B — WHAT A REAL PILOT WOULD MEASURE */}
      <div className="card-pop mt-6 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-xl font-bold">What a real pilot would measure</h2>
          <span className="chip chip-sun text-[11px] uppercase tracking-wide">Pilot metrics — not current results</span>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="card-flat p-5">
            <p className="text-xs font-extrabold uppercase tracking-wide text-brand">Resident engagement</p>
            <ul className="mt-2 space-y-1 text-sm font-semibold">
              {PILOT_RESIDENT.map((m) => (
                <li key={m}>• {m}</li>
              ))}
            </ul>
          </div>
          <div className="card-flat p-5">
            <p className="text-xs font-extrabold uppercase tracking-wide text-sky">Partner / ROI metrics</p>
            <ul className="mt-2 space-y-1 text-sm font-semibold">
              {PILOT_PARTNER.map((m) => (
                <li key={m}>• {m}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">No values are shown here. These are measurements a pilot would collect.</p>
      </div>
    </>
  );
}

const TITLE = "Partners & Impact — From Outreach to Measurable Participation | Know I'm Here";
const DESC = "How Know I'm Here helps Detroit organizations move from outreach spend to measured participation, plus the business model and product roadmap.";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Partners,
});

const PROGRAMS = [
  {
    name: "Senior Wellness Program",
    funnel: [
      { label: "Matched", n: 318, note: "Residents whose profile fit" },
      { label: "Viewed", n: 126, note: "Opened the details" },
      { label: "Interested", n: 54, note: "Saved or tapped I'm Interested" },
      { label: "Accessed", n: 31, note: "Requested directions or a ride" },
      { label: "Participated", n: 22, note: "Checked in with I'm Here" },
    ],
  },
  {
    name: "Youth Technology Workshop",
    funnel: [
      { label: "Matched", n: 275, note: "Residents whose profile fit" },
      { label: "Viewed", n: 112, note: "Opened the details" },
      { label: "Interested", n: 63, note: "Saved or tapped I'm Interested" },
      { label: "Accessed", n: 21, note: "Requested transportation" },
      { label: "Participated", n: 36, note: "Checked in with I'm Here" },
    ],
  },
];

const TABS = ["Impact", "Business model", "Roadmap"] as const;

function Partners() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Impact");
  const [program, setProgram] = useState(0);
  const FUNNEL = PROGRAMS[program]!.funnel;
  const max = FUNNEL[0]!.n;

  return (
    <div className="container-kih py-8 pb-36 sm:py-12 sm:pb-36">
      <SectionHeading
        eyebrow="For organizations and partners"
        title="From discovery to measurable impact"
        text="Detroit already invests in programs, services, and community resources. Know I'm Here is designed to help partners understand whether improved discovery and access translate into measurable resident engagement."
      />
      <p className="mt-4 text-sm font-extrabold uppercase tracking-wide text-foreground/70">
        Discover <span className="text-brand">→</span> Act <span className="text-brand">→</span> Participate{" "}
        <span className="text-brand">→</span> Return <span className="text-brand">→</span> Measure
      </p>

      <div className="mt-6 flex gap-2" role="tablist">
        {TABS.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} type="button" onClick={() => setTab(t)} className={`chip min-h-11 cursor-pointer px-4 ${tab === t ? "bg-ink text-cream" : ""}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "Impact" && (
        <>
          <div className="card-pop mt-6 p-5 sm:p-6">
            <h2 className="font-display text-xl font-bold">Why these metrics matter</h2>
            <Flow
              steps={[
                "Public + community investment",
                "Know I'm Here",
                "Discovery",
                "Resident action",
                "Participation",
                "Measurable engagement",
                "Better resource utilization",
              ]}
            />
            <p className="mt-5 text-sm font-semibold text-foreground/75">
              Know I&apos;m Here does not create the underlying community program. It creates another pathway between an
              existing investment and the resident it was designed to serve.
            </p>
          </div>

          <div className="mt-6 rounded-xl bg-ink p-6 text-cream sm:p-8">
            <p className="font-display text-xl font-extrabold uppercase leading-tight sm:text-3xl">
              Detroit is already investing in the resources.
            </p>
            <p className="mt-2 font-display text-lg font-extrabold uppercase leading-tight text-sun sm:text-2xl">
              Know I&apos;m Here is designed to increase the potential return on that investment by improving:
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {["Discovery", "Access", "Participation", "Utilization", "Measurement"].map((p) => (
                <li key={p} className="chip bg-cream/15 text-sm font-extrabold uppercase tracking-wide text-cream">
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-cream/80">
              Forward-looking. No ROI result is claimed until a pilot measures one.
            </p>
          </div>
        </>
      )}

      {tab === "Impact" && <LiveImpact />}

      {tab === "Impact" && (
        <div className="card-pop mt-6 p-5 sm:p-6">
          <h2 className="font-display text-xl font-bold">From information to engagement</h2>
          <Flow
            steps={[
              "Resident has a need — food or wellness support",
              "KIH surfaces a relevant resource",
              "Resident opens resource",
              "Get There",
              "Voluntary check-in, registration or action",
              "Partner receives aggregated engagement signal",
            ]}
          />
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="card-flat p-5">
              <p className="text-xs font-extrabold uppercase tracking-wide text-brand">Resident value</p>
              <ul className="mt-2 space-y-1 text-sm font-semibold">
                <li>• Easier discovery</li>
                <li>• Relevant information</li>
                <li>• Clearer next steps</li>
                <li>• Access and navigation support</li>
              </ul>
            </div>
            <div className="card-flat bg-ink p-5 text-cream">
              <p className="text-xs font-extrabold uppercase tracking-wide text-sun">Partner value</p>
              <ul className="mt-2 space-y-1 text-sm font-semibold">
                <li>• Another pathway to reach residents</li>
                <li>• Opportunity for greater participation</li>
                <li>• Better understanding of engagement</li>
                <li>• Opportunity to improve utilization of funded capacity</li>
              </ul>
            </div>
          </div>
          <p className="mt-4 rounded-2xl bg-sun/30 px-5 py-4 font-bold">
            The resident receives access while the organization gets another opportunity to turn funded capacity into
            actual participation.
          </p>
        </div>
      )}

      {tab === "Impact" && (
        <div className="card-pop mt-6 border-2 border-sky/40 p-5 sm:p-6">
          <h2 className="font-display text-xl font-bold">Measurement without surveillance</h2>
          <p className="mt-2 text-sm text-foreground/75">
            Know I&apos;m Here is being designed around consent-based engagement signals. Location access is optional.
            Check-in is voluntary. The partner dashboard emphasizes aggregated trends rather than exposing individual
            resident histories.
          </p>
          <p className="mt-4 font-display text-lg font-extrabold uppercase leading-tight">
            Not silent tracking.
            <br />
            Not automatic attendance.
            <br />
            <span className="text-brand">Consent-based participation signals.</span>
          </p>
          <LearnMore label="Learn more: location access is not check-in">
            <p>
              <strong>Location access</strong> is used voluntarily to personalize nearby information.{" "}
              <strong>Check-in</strong> is a separate voluntary action where the resident confirms arrival or
              participation. A check-in marked location-verified means the resident tapped Check In and the app took a
              fresh reading to confirm the device was reasonably close. Attendance is never inferred silently.
            </p>
          </LearnMore>
        </div>
      )}

      {tab === "Impact" && (
        <div className="card-pop mt-6 p-5 sm:p-6">
          <h2 className="font-display text-xl font-bold">From funded capacity to actual participation</h2>
          <p className="mt-2 text-sm text-foreground/75">
            The goal is not simply more clicks. The goal is understanding whether discovery leads to meaningful resident
            action.
          </p>
          <Flow
            steps={[
              "Resource funded",
              "Resource published",
              "Resource discovered",
              "Resident takes action",
              "Resident participates",
              "Repeat engagement",
              "Partner measures utilization",
            ]}
          />
        </div>
      )}

      {tab === "Impact" && (
        <div className="mt-10">
          <h2 className="font-display text-xl font-bold">How partner ROI could be measured</h2>
          <p className="mt-2 max-w-3xl text-sm text-foreground/75">
            This scenario demonstrates how a future partner could measure movement from discovery to participation.
            These figures are illustrative and are not current resident usage.
          </p>
        </div>
      )}

      {tab === "Impact" && (
        <div className="mt-4 grid gap-5 lg:grid-cols-5">
          <div className="card-pop p-5 sm:p-6 lg:col-span-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-xl font-bold">{PROGRAMS[program]!.name}</h2>
              <span className="chip chip-sun text-[11px] uppercase tracking-wide">Buildathon demonstration</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {PROGRAMS.map((p, i) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setProgram(i)}
                  aria-pressed={program === i}
                  className={`chip min-h-11 cursor-pointer px-4 ${program === i ? "bg-brand text-brand-foreground" : ""}`}
                >
                  {p.name}
                </button>
              ))}
            </div>
            <ol className="mt-5 space-y-3">
              {FUNNEL.map((f, i) => (
                <li key={f.label}>
                  <div className="flex items-baseline justify-between">
                    <span className="font-bold">{i + 1}. {f.label}</span>
                    <span className="font-display text-2xl font-bold">{f.n}</span>
                  </div>
                  <div className="mt-1 h-3 rounded-full bg-foreground/10">
                    <div className="h-3 rounded-full bg-brand" style={{ width: `${(f.n / max) * 100}%` }} />
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{f.note}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="space-y-4 lg:col-span-2">
            <div className="card-flat p-5">
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-muted-foreground">Traditional outreach</p>
              <p className="mt-1 font-display text-xl font-bold text-foreground/60">SPEND → ADVERTISE → HOPE</p>
            </div>
            <div className="card-pop bg-ink p-5 text-cream">
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-sun">Know I&apos;m Here</p>
              <p className="mt-1 font-display text-xl font-bold">MATCH → ENGAGE → ACCESS → PARTICIPATE → MEASURE</p>
            </div>
            <div className="card-flat p-5 text-sm text-foreground/75">
              <p className="font-bold text-foreground">What partners get</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Aggregate funnel: matched → participated</li>
                <li>Which transportation options residents used</li>
                <li>Which neighborhoods are reaching you — and which aren&apos;t</li>
                <li>Never individual tracking. Check-ins are private by default.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {tab === "Business model" && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="card-pop bg-sun/30 p-6 sm:col-span-2 lg:col-span-3">
            <h2 className="font-display text-2xl font-bold">Residents: always free.</h2>
            <p className="mt-1 text-foreground/75">Finding your community should never have a price tag. Organizations fund the platform.</p>
          </div>
          {[
            ["Sponsored community access", "Organizations sponsor visibility for programs that match residents who actually qualify."],
            ["Institutional licensing", "Health systems, foundations, and city-scale partners license the connection layer for their programs."],
            ["Event mode", "Directory, navigation, vendor discovery, schedules, check-in and analytics for festivals and community events."],
            ["Partner & merchant tools", "Simple tools for local organizations and merchants to publish, update and measure."],
            ["Enterprise / community deployment", "A configured deployment for a campus, district, or another city."],
          ].map(([t, d]) => (
            <div key={t} className="card-flat p-5">
              <h3 className="font-display text-lg font-bold">{t}</h3>
              <p className="mt-1 text-sm text-foreground/75">{d}</p>
            </div>
          ))}
          <p className="text-xs text-muted-foreground sm:col-span-2 lg:col-span-3">No finalized pricing. No paying customers yet. This is a Buildathon MVP describing the intended model.</p>
        </div>
      )}

      {tab === "Roadmap" && (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { n: "Phase 1", t: "Connect", tag: "Current", items: ["Resource discovery", "Health & community resources", "Neighborhood information", "AI Community Guide", "Transportation assistance", "I'm Here check-in", "Saved items", "Accessibility tools"] },
            { n: "Phase 2", t: "Personalize", tag: "Next", items: ["Improved recommendations", "Preference learning", "Real-time information", "Partner promotions", "Deeper integrations"] },
            { n: "Phase 3", t: "Community Intelligence", tag: "Later", items: ["Opt-in aggregated insights", "Service-gap identification", "Organizer dashboards", "Partner analytics", "Trend reporting"] },
          ].map((p, i) => (
            <div key={p.n} className={`card-pop p-6 ${i === 0 ? "bg-brand/10" : ""}`}>
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-extrabold uppercase tracking-wide text-brand">{p.n}</p>
                <span className="chip text-[11px]">{p.tag}</span>
              </div>
              <h3 className="mt-1 font-display text-2xl font-bold">{p.t}</h3>
              <ul className="mt-3 space-y-1.5 text-sm">
                {p.items.map((it) => (
                  <li key={it}>{i === 0 ? "✓" : "○"} {it}</li>
                ))}
              </ul>
            </div>
          ))}
          <p className="text-sm text-foreground/70 md:col-span-3">
            Community intelligence is aggregated and privacy-conscious — no individual surveillance. Longer-term ideas (event mode, merchant tools, group coordination, travel profiles, hospitality mode, other cities) stay behind the Detroit MVP.
          </p>
        </div>
      )}

      <div className="mt-12 text-center">
        <h2 className="font-display text-xl font-bold">See the bigger ROI model</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-foreground/75">
          These engagement signals are designed to help test a larger question: can better discovery and access help
          existing Detroit programs generate more participation and more measurable impact from investments already
          being made?
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link to="/" hash="detroit-economic-impact" className="btn-base btn-brand">
            View Detroit Economic Impact &amp; ROI
          </Link>
          <Link to="/demo" className="btn-base border-2 border-ink/15 bg-card font-bold text-ink">
            See the resident experience
          </Link>
        </div>
      </div>
    </div>
  );
}
