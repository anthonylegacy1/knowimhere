import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { IssueFlow } from "@/components/kih/IssueFlow";
import { SectionHeading } from "@/components/kih/SectionHeading";
import { ISSUE_TYPES, NEIGHBORHOOD_UPDATES, RESOURCES, type UpdateKind } from "@/data/resources";
import { useApp } from "@/lib/app-store";
import { useLocationState } from "@/lib/location";
import { distanceToResource } from "@/lib/resource-distance";
import { ImHereControl } from "@/components/kih/ImHere";
import { cityResource } from "@/data/city-resources";
import { CityResourceCard } from "@/components/kih/CityResourceCard";

const TITLE = "My Neighborhood — Know What's Happening Around You | Know I'm Here";
const DESC = "Community meetings, rec-center updates, cooling centers, road closures and City notices for your Detroit neighborhood, plus help reporting neighborhood issues.";

export const Route = createFileRoute("/neighborhood")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Neighborhood,
});

type Filter = "mine" | "today" | "week" | UpdateKind;
const FILTERS: { id: Filter; label: string }[] = [
  { id: "mine", label: "My Neighborhood" },
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "important", label: "Important" },
  { id: "community", label: "Community" },
  { id: "city", label: "City Services" },
];

const KIND_STYLE: Record<UpdateKind, string> = {
  important: "border-sun bg-sun/20",
  community: "border-mint/40 bg-mint/10",
  city: "border-sky/40 bg-sky/10",
};

function Neighborhood() {
  const { profile } = useApp();
  const { on, areaLabel, precise, activeCoords } = useLocationState();
  const [filter, setFilter] = useState<Filter>("mine");
  const [issueText, setIssueText] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);
  const hood = areaLabel ?? profile.neighborhood ?? "Southwest Detroit";
  const nearby = RESOURCES.map((r) => ({ r, d: distanceToResource(r, activeCoords) }))
    .filter((e) => e.d !== null)
    .sort((a, b) => a.d!.miles - b.d!.miles)
    .slice(0, 4);

  const list = NEIGHBORHOOD_UPDATES.filter((u) => {
    if (filter === "mine") return true;
    if (filter === "today") return u.when === "today";
    if (filter === "week") return true;
    return u.kind === filter;
  });

  function submitIssue(e: FormEvent) {
    e.preventDefault();
    if (issueText.trim()) setSubmitted(issueText.trim());
  }

  return (
    <div className="container-kih py-8 sm:py-12">
      <SectionHeading eyebrow={`Near ${hood}`} title="Know What's Happening Around You" text="Calm, clear neighborhood information — community meetings, rec-center updates, weather notices, road closures and City services. Not a crime feed." />

      <div className="mt-6">
        <ImHereControl />
      </div>

      <div className="card-flat mt-6 flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <p className="eyebrow">Map what&apos;s around me</p>
          <p className="mt-1 font-display text-lg font-bold">
            See resources, programs and opportunities around the area you choose.
          </p>
        </div>
        <Link to="/map" className="btn-base btn-brand min-h-12 px-5">
          View Map
        </Link>
      </div>

      <section className="mt-6 card-flat p-6">
        <h2 className="font-display text-xl font-extrabold">Based on your current area</h2>
        <p className="mt-1 text-sm text-foreground/70">
          {on
            ? `${precise ? "Using your current location" : "Using the area you selected"} · ${hood}`
            : "Choose a neighborhood or ZIP code to personalize this section."}
        </p>
        {on && (
          <ul className="mt-4 grid gap-2">
            {nearby.map(({ r, d }) => (
              <li key={r.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card px-4 py-3">
                <span className="font-bold">{r.name}</span>
                <span className="text-sm text-foreground/65">{r.neighborhood} · {r.whenLabel}</span>
                <span className="chip ml-auto text-xs">~{d!.miles.toFixed(1)} mi away</span>
                <Link to="/resource/$id" params={{ id: r.id }} className="btn-base btn-outline btn-sm">View details</Link>
              </li>
            ))}
          </ul>
        )}
      </section>


      <div className="mt-6 -mx-5 overflow-x-auto px-5 pb-1">
        <div className="flex w-max gap-2">
          {FILTERS.map((f) => (
            <button key={f.id} type="button" onClick={() => setFilter(f.id)} className={`chip min-h-10 cursor-pointer px-4 ${filter === f.id ? "bg-ink text-cream" : ""}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {list.map((u) => (
          <li key={u.id} className={`rounded-2xl border-2 p-4 ${KIND_STYLE[u.kind]}`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl" aria-hidden>{u.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wide text-foreground/60">
                    {u.kind === "city" ? "City services" : u.kind}
                  </span>
                  <span className="text-[11px] font-bold text-muted-foreground">· {u.when === "today" ? "Today" : "This week"}</span>
                </div>
                <p className="mt-0.5 font-display text-lg font-bold leading-tight">{u.title}</p>
                <p className="mt-1 text-sm text-foreground/70">{u.detail}</p>
                {u.resourceId && (
                  <Link to="/resource/$id" params={{ id: u.resourceId }} className="mt-2 inline-flex min-h-10 items-center font-bold text-sky">
                    View details →
                  </Link>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">Neighborhood updates are realistic demonstration data for the Buildathon prototype.</p>

      {/* REPORT AN ISSUE */}
      <section className="mt-14" aria-labelledby="report">
        <div className="card-pop p-6 sm:p-8">
          <span className="eyebrow">Neighborhood issue routing · prototype</span>
          <h2 id="report" className="mt-4 font-display text-3xl font-bold">Report or Find Help With an Issue</h2>
          <p className="mt-2 text-lg text-foreground/70">Describe it in your own words. We&apos;ll figure out what kind of issue it is and point you to the right official Detroit resource.</p>
          <form onSubmit={submitIssue} className="mt-5 flex flex-col gap-2 sm:flex-row">
            <input
              value={issueText}
              onChange={(e) => setIssueText(e.target.value)}
              placeholder="People keep dumping trash on the vacant lot next door."
              aria-label="Describe the issue"
              className="min-h-13 flex-1 rounded-2xl border-2 border-input bg-cream px-4 text-base"
            />
            <button type="submit" className="btn-base btn-brand">Find the right resource</button>
          </form>
          <div className="mt-3 flex flex-wrap gap-2">
            {ISSUE_TYPES.map((i) => (
              <button
                key={i.id}
                type="button"
                onClick={() => {
                  const t = `${i.emoji} ${i.label} near me`;
                  setIssueText(t);
                  setSubmitted(`${i.keywords[0]} ${i.label}`);
                }}
                className="chip min-h-9 cursor-pointer hover:bg-card"
              >
                {i.emoji} {i.label}
              </button>
            ))}
          </div>
          {submitted && (
            <div className="mt-6">
              <IssueFlow text={submitted} neighborhood={hood} />
            </div>
          )}
          {!submitted && (
            <div className="mt-6">
              <CityResourceCard resource={cityResource("improve-detroit")} />
            </div>
          )}
          <p className="mt-4 text-sm font-semibold text-muted-foreground">Know I&apos;m Here does not replace City services. It helps residents find and use them. For emergencies, call 911.</p>
        </div>
      </section>
    </div>
  );
}
