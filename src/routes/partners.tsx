import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SectionHeading } from "@/components/kih/SectionHeading";

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
    <div className="container-kih py-8 sm:py-12">
      <SectionHeading eyebrow="For organizations and partners" title="From Outreach to Measurable Participation" text="Flyers tell you how many you printed. Know I'm Here shows who was matched, who showed interest, who got there, and who participated." />

      <div className="mt-6 flex gap-2" role="tablist">
        {TABS.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} type="button" onClick={() => setTab(t)} className={`chip min-h-11 cursor-pointer px-4 ${tab === t ? "bg-ink text-cream" : ""}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "Impact" && (
        <div className="mt-6 grid gap-5 lg:grid-cols-5">
          <div className="card-pop p-6 lg:col-span-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-xl font-bold">{PROGRAMS[program]!.name}</h2>
              <span className="chip chip-sun text-[11px] uppercase tracking-wide">Buildathon demonstration data</span>
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
        <Link to="/demo" className="btn-base btn-brand">See the resident experience</Link>
      </div>
    </div>
  );
}
