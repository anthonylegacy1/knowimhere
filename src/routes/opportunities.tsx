import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ResourceCard } from "@/components/kih/ResourceCard";
import { SectionHeading } from "@/components/kih/SectionHeading";
import { AskKIH } from "@/components/kih/AskKIH";
import { RESOURCES, type Resource } from "@/data/resources";

const TITLE = "Education & Youth Opportunities in Detroit | Know I'm Here";
const DESC =
  "After-school programs, tutoring, summer jobs, internships, trades, college and FAFSA help, mentoring, sports, STEM and youth wellness resources across Detroit — filtered by age, neighborhood, cost and transportation.";

export const Route = createFileRoute("/opportunities")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Opportunities,
});

const GROUPS: { id: string; label: string; match: (r: Resource) => boolean }[] = [
  { id: "all", label: "All opportunities", match: () => true },
  { id: "after-school", label: "After-school", match: (r) => ["teen-afterschool", "tutoring", "youth-basketball", "youth-mentoring"].includes(r.id) },
  { id: "tutoring", label: "Tutoring & academics", match: (r) => ["tutoring", "college-fafsa"].includes(r.id) },
  { id: "jobs", label: "Summer jobs & internships", match: (r) => ["summer-youth-jobs", "youth-automotive", "career-exploration"].includes(r.id) },
  { id: "trades", label: "Skilled trades", match: (r) => ["youth-automotive", "workforce-training"].includes(r.id) },
  { id: "college", label: "College & FAFSA", match: (r) => ["college-fafsa", "career-exploration"].includes(r.id) },
  { id: "stem", label: "STEM & technology", match: (r) => ["coding-workshop", "teen-afterschool", "career-exploration"].includes(r.id) },
  { id: "sports", label: "Sports & recreation", match: (r) => ["youth-basketball", "riverwalk-walk"].includes(r.id) },
  { id: "mentoring", label: "Mentoring", match: (r) => ["youth-mentoring"].includes(r.id) },
  { id: "wellness", label: "Youth mental health", match: (r) => ["youth-mental-health"].includes(r.id) },
  { id: "volunteer", label: "Volunteering", match: (r) => ["volunteer-corps"].includes(r.id) },
];

const AGES = ["Any age", "Under 14", "14–18", "18–24"] as const;

function ageOk(r: Resource, age: (typeof AGES)[number]) {
  if (age === "Any age") return true;
  const l = (r.ageLabel ?? "").toLowerCase();
  if (age === "Under 14") return /k–12|all ages|12–18/.test(l);
  if (age === "14–18") return /12–18|13–19|14–24|15–19|k–12|high school|all ages/.test(l);
  return /13–19|14–24|15–19|18\+|adults|high school/.test(l);
}

function Opportunities() {
  const [group, setGroup] = useState("all");
  const [age, setAge] = useState<(typeof AGES)[number]>("Any age");
  const [freeOnly, setFreeOnly] = useState(false);
  const [nearOnly, setNearOnly] = useState(false);
  const [transitOnly, setTransitOnly] = useState(false);

  const list = useMemo(() => {
    const g = GROUPS.find((x) => x.id === group)!;
    const base = group === "all" ? RESOURCES.filter((r) => r.youthFriendly && r.tags.some((t) => ["youth", "education", "technology", "recreation", "employment"].includes(t))) : RESOURCES.filter(g.match);
    return base.filter(
      (r) =>
        ageOk(r, age) &&
        (!freeOnly || r.cost === "Free") &&
        (!nearOnly || r.distanceMiles <= 1.5) &&
        (!transitOnly || r.transitFriendly),
    );
  }, [group, age, freeOnly, nearOnly, transitOnly]);

  return (
    <div className="container-kih py-8 sm:py-12">
      <SectionHeading
        eyebrow="Education & Youth Opportunity Hub"
        title="What's out here for young Detroiters."
        text="After-school programs, tutoring, summer jobs, internships, trades, college help, mentoring, sports, STEM and wellness — in one place, filtered to what actually fits."
      />

      <div className="mt-6">
        <EverydayConnectTip text="Explore Future Ready digital skills through Everyday Connect." linkLabel="Visit Everyday Connect" />
      </div>

      <div className="card-pop mt-6 p-4 sm:p-5">
        <p className="font-display font-bold">Try asking in your own words</p>
        <div className="mt-2">
          <AskKIH compact initialQuestion="I'm 15 and I like basketball, computers and making money." />
        </div>
      </div>

      <div className="mt-8 -mx-5 overflow-x-auto px-5 pb-1">
        <div className="flex w-max gap-2">
          {GROUPS.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGroup(g.id)}
              className={`chip min-h-11 cursor-pointer px-4 ${group === g.id ? "bg-ink text-cream" : ""}`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {AGES.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setAge(a)}
            className={`chip min-h-11 cursor-pointer px-4 ${age === a ? "bg-brand text-brand-foreground" : ""}`}
          >
            {a}
          </button>
        ))}
        <span className="mx-1 h-6 w-px bg-border" aria-hidden />
        {[
          ["Free only", freeOnly, () => setFreeOnly(!freeOnly)],
          ["Within 1.5 miles", nearOnly, () => setNearOnly(!nearOnly)],
          ["Reachable without a car", transitOnly, () => setTransitOnly(!transitOnly)],
        ].map(([label, on, fn]) => (
          <button
            key={label as string}
            type="button"
            aria-pressed={on as boolean}
            onClick={fn as () => void}
            className={`chip min-h-11 cursor-pointer px-4 ${on ? "bg-mint/20 text-mint" : ""}`}
          >
            {(on ? "✓ " : "") + (label as string)}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="card-flat mt-8 p-6 text-center text-foreground/70">No matches with those filters. Try clearing one.</p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      )}

      <div className="card-flat mt-10 p-6">
        <h2 className="font-display text-xl font-bold">Everyday Connect: Future Ready</h2>
        <p className="mt-1 text-foreground/70">
          Technology for opportunity, not just entertainment — AI literacy, resumes, college applications and digital citizenship.
        </p>
        <Link to="/learn" className="btn-base btn-outline mt-4">
          Open the learning center
        </Link>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Listings are realistic Buildathon demonstration data. Verify age requirements, deadlines and eligibility with the provider.
      </p>
    </div>
  );
}
