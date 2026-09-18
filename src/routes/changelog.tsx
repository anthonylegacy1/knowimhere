import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/kih/SectionHeading";

const TITLE = "Changelog & Developer Notes | Know I'm Here";
const DESC = "Build history for the Know I'm Here MVP, including enhancements created during the Venture 313 Buildathon.";

export const Route = createFileRoute("/changelog")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Changelog,
});

const ENTRIES = [
  {
    date: "2026 · Venture 313 Buildathon",
    title: "v2 — Substantially rebuilt MVP",
    items: [
      "Detroit-specific matching (interests + location + transportation + accessibility)",
      "Rise Higher Detroit priority alignment section",
      "My Neighborhood information feed with calm filters",
      "Conversational neighborhood issue routing to official City resources",
      "Help Me Get There transportation access layer",
      "Ask KIH — AI Community Guide (Lovable AI)",
      "I'M HERE check-in with private-by-default sharing",
      "Partner ROI dashboard (demonstration data)",
      "Video onboarding placeholders and A+ text accessibility",
      "Buildathon Demo Mode (Dorothy)",
    ],
  },
  {
    date: "Pre-Buildathon",
    title: "v1 — Concept and early prototype",
    items: ["Original Know I'm Here concept: a personalized community-access platform for Detroit residents", "Fast Freddy Experience and Everyday Connect groundwork"],
  },
];

function Changelog() {
  return (
    <div className="container-kih py-8 sm:py-12">
      <SectionHeading eyebrow="Developer notes" title="Changelog" text="For judges and collaborators." />
      <div className="card-flat mt-6 p-5 text-sm text-foreground/75">
        <p className="font-bold text-foreground">Developer note</p>
        <p className="mt-1">
          Know I&apos;m Here existed conceptually before Venture 313. The version you see here is a substantially rebuilt MVP created for the Buildathon. It does not claim an official City of Detroit or Rise Higher partnership, government endorsement, active transportation integrations, paying customers, existing users, or guaranteed outcomes.
        </p>
      </div>
      <ol className="mt-8 space-y-6">
        {ENTRIES.map((e) => (
          <li key={e.title} className="card-pop p-6">
            <p className="text-[11px] font-extrabold uppercase tracking-wide text-brand">{e.date}</p>
            <h2 className="mt-1 font-display text-2xl font-bold">{e.title}</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-foreground/80">
              {e.items.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
