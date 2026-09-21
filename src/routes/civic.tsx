import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/kih/SectionHeading";

const TITLE = "Voting & Civic Access in Detroit | Know I'm Here";
const DESC =
  "Find trusted, official information about voting, registration, polling locations, early voting, sample ballots and civic services in Detroit and Michigan.";

export const Route = createFileRoute("/civic")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Civic,
});

const OPTIONS: { label: string; note: string; source: string; href: string }[] = [
  {
    label: "Register to vote",
    note: "Register online, by mail or in person through the State of Michigan.",
    source: "Michigan Voter Information Center",
    href: "https://mvic.sos.state.mi.us/RegisterVoter",
  },
  {
    label: "Check voter registration",
    note: "Confirm your registration status with the official state record.",
    source: "Michigan Voter Information Center",
    href: "https://mvic.sos.state.mi.us/Voter/Index",
  },
  {
    label: "Find my polling place",
    note: "Look up your assigned Election Day polling location.",
    source: "Michigan Voter Information Center",
    href: "https://mvic.sos.state.mi.us/Voter/Index",
  },
  {
    label: "Find early voting location",
    note: "Early voting sites and hours are published by the state and the city.",
    source: "Michigan Voter Information Center",
    href: "https://mvic.sos.state.mi.us/Voter/Index",
  },
  {
    label: "View sample ballot",
    note: "See the official ballot for your address before you vote.",
    source: "Michigan Voter Information Center",
    href: "https://mvic.sos.state.mi.us/Voter/Index",
  },
  {
    label: "Find local clerk / election office",
    note: "Contact Detroit's election officials with questions.",
    source: "Detroit Department of Elections",
    href: "https://detroitmi.gov/departments/department-elections",
  },
  {
    label: "Precinct and district information",
    note: "Precinct and district assignments come from official records only.",
    source: "Michigan Voter Information Center",
    href: "https://mvic.sos.state.mi.us/Voter/Index",
  },
  {
    label: "Official City civic information",
    note: "City services, departments and civic resources.",
    source: "City of Detroit",
    href: "https://detroitmi.gov",
  },
];

function Civic() {
  return (
    <div className="container-kih py-8 sm:py-12">
      <SectionHeading
        eyebrow="Voting & Civic Access"
        title="Official civic and voter information."
        text="Find trusted, official information about voting, registration, polling locations, and civic services."
      />

      <p className="mt-5 flex items-start gap-3 rounded-lg border-2 border-brand bg-cream p-4 font-semibold text-foreground">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
        Know I&apos;m Here is a nonpartisan civic-access platform. KIH does not endorse candidates, political parties, ballot
        positions, or voting choices.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {OPTIONS.map((o) => (
          <a
            key={o.label}
            href={o.href}
            target="_blank"
            rel="noreferrer noopener"
            className="card-flat flex min-h-11 flex-col gap-1 p-4 transition-colors hover:bg-cream"
          >
            <span className="flex items-center justify-between gap-2 font-display text-base font-bold">
              {o.label}
              <ArrowUpRight className="size-5 shrink-0 text-brand" aria-hidden />
            </span>
            <span className="text-sm text-foreground/70">{o.note}</span>
            <span className="mt-1 text-xs font-extrabold uppercase tracking-wide text-brand">{o.source}</span>
          </a>
        ))}
      </div>

      <div className="card-flat mt-8 p-5">
        <p className="text-xs font-extrabold uppercase tracking-wide text-brand">Verified sources</p>
        <ul className="mt-2 list-inside list-disc text-sm text-foreground/75">
          <li>Michigan Voter Information Center</li>
          <li>Detroit Department of Elections</li>
          <li>Verified City of Detroit civic resources</li>
          <li>Verified State of Michigan government resources</li>
        </ul>
      </div>

      <p className="mt-5 text-xs text-muted-foreground">
        Know I&apos;m Here does not determine or infer voter eligibility, registration status, polling locations, early voting
        locations, precinct assignments, district assignments, ballot contents, or election deadlines. Personalized election
        information comes only from verified official sources.
      </p>

      <Link to="/" className="btn-base btn-outline mt-6 inline-flex">
        Back to Know I&apos;m Here
      </Link>
    </div>
  );
}
