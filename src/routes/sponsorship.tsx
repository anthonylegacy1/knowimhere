import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { SectionHeading } from "@/components/kih/SectionHeading";
import { Button } from "@/components/ui/button";

const TITLE = "Partners + Sponsorship — Power the Connection Layer | Know I'm Here";
const DESC =
  "How organizations could support Know I'm Here: sponsorship categories, potential partner alignment, and what a sponsorship can support across Detroit.";

export const Route = createFileRoute("/sponsorship")({
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
  component: SponsorshipPage,
});

const CATEGORIES = [
  {
    title: "Community + Public Health Partner",
    idea: "Help residents discover health, wellness, food, prevention and community-support resources.",
    label: "Potential benefits",
    items: [
      "Stronger community-resource awareness",
      "Increased participation",
      "Health-resource discovery",
      "Measurable aggregate engagement",
      "Neighborhood-level outreach",
    ],
  },
  {
    title: "Mobility + Access Partner",
    idea: "Help residents move from discovering a resource to actually reaching it.",
    label: "Potential benefits",
    items: [
      "Transportation discovery",
      "Trip-planning connection",
      "Senior and accessibility support",
      "Reduced access barriers",
      "Transportation-to-participation insight",
    ],
  },
  {
    title: "Technology + AI Partner",
    idea: "Support the digital infrastructure that powers discovery, personalization and Ask KIH.",
    label: "Potential areas",
    items: ["AI", "Cloud", "Mapping", "Geolocation", "Search", "Accessibility", "Data infrastructure", "Digital learning"],
  },
  {
    title: "Economic Mobility Partner",
    idea: "Connect residents to employment, training, entrepreneurship and economic opportunity.",
    label: "Potential benefits",
    items: [
      "Workforce-resource discovery",
      "Training participation",
      "Neighborhood opportunity access",
      "Entrepreneurship visibility",
      "Local economic activity",
    ],
  },
  {
    title: "Community Impact Partner",
    idea:
      "Expand access to neighborhood programs, food resources, senior services, youth opportunities, recreation and community organizations.",
    label: "Potential focus",
    items: ["Neighborhood programs", "Food resources", "Senior services", "Youth opportunities", "Recreation", "Community organizations"],
  },
  {
    title: "Data + Impact Partner",
    idea:
      "Support privacy-conscious aggregate measurement of how residents discover, access and participate in resources.",
    label: "Potential focus",
    items: [
      "Aggregate participation insight",
      "Resource-access measurement",
      "Pilot learning reports",
      "No individual resident location histories — ever",
    ],
  },
] as const;

const ORGS = [
  {
    name: "TechTown Detroit",
    hook: "From prototype to Detroit-born civic tech venture",
    copy:
      "Know I'm Here can demonstrate how a Detroit-built prototype can become a scalable technology company while solving a real resident-access problem.",
    alignment: [
      "Founder development",
      "Pilot support",
      "Startup mentorship",
      "Commercialization",
      "Detroit technology ecosystem",
      "Community innovation",
    ],
    note: null as string | null,
  },
  {
    name: "ID Ventures",
    hook: "A Detroit proof point with a scalable platform model",
    copy:
      "KIH can begin with Detroit's fragmented resource ecosystem and develop into a repeatable connection platform that could eventually serve additional municipalities, institutions and community networks.",
    alignment: [
      "Scalable technology",
      "Institutional customers",
      "Recurring revenue",
      "City-to-city expansion",
      "Measurable product adoption",
    ],
    note: null,
  },
  {
    name: "Gilbert Family Foundation",
    hook: "Turn resource access into economic mobility",
    copy:
      "Residents cannot benefit from opportunities they cannot find or reach. KIH can help make employment, training, food, health, transportation and neighborhood resources easier to discover and navigate.",
    alignment: [
      "Economic mobility",
      "Neighborhood opportunity",
      "Access",
      "Detroit residents",
      "Community participation",
      "Digital inclusion",
    ],
    note: null,
  },
  {
    name: "Google",
    hook: "AI that helps residents find the right next step",
    copy:
      "Ask KIH can turn natural-language questions into relevant resource discovery while Everyday Connect helps residents build the digital confidence needed to use modern technology.",
    alignment: [
      "Responsible AI",
      "Search",
      "Accessibility",
      "Maps / location",
      "Cloud infrastructure",
      "Digital-skills education",
    ],
    note: "Example — a resident asks: “Where can I get food near me today?” KIH organizes relevant trusted resources and next steps.",
  },
  {
    name: "SMART",
    hook: "Discovery only matters if the resident can get there",
    copy:
      "KIH can connect nearby community resources and opportunities with transportation information so residents can understand not only what is available, but how to reach it.",
    alignment: [
      "Public transportation",
      "Trip access",
      "Senior mobility",
      "Disability / accessibility",
      "Workforce transportation",
      "Community-resource access",
    ],
    note: "Discover → Get There → Participate",
  },
  {
    name: "Henry Ford Health",
    hook: "Bring community health resources closer to the resident",
    copy:
      "KIH can help residents discover nearby health, wellness, prevention, food-support and community-health opportunities based on location and need.",
    alignment: [
      "Community + public health",
      "Preventive care",
      "Screenings",
      "Wellness",
      "Food access",
      "Senior health",
      "Neighborhood outreach",
      "Transportation to care / resources",
    ],
    note: null,
  },
  {
    name: "JustAir",
    hook: "Connect neighborhood information to community health",
    copy:
      "Environmental conditions are part of public health. KIH could eventually help residents discover trusted hyperlocal environmental-health information alongside other neighborhood resources and alerts.",
    alignment: [
      "Environmental health",
      "Neighborhood awareness",
      "Air-quality education",
      "Public health",
      "Hyperlocal information",
    ],
    note: "Future integration opportunity — no JustAir data integration exists today.",
  },
] as const;

const SUPPORT = [
  ["Resource data", "Help expand and verify community-resource information."],
  ["Technology", "Support AI, maps, cloud infrastructure, geolocation and accessibility."],
  ["Community pilots", "Fund neighborhood testing with residents and organizations."],
  ["Digital confidence", "Support Everyday Connect education and onboarding."],
  ["Transportation access", "Help residents reach community resources."],
  ["Outreach", "Help more residents learn that available resources exist."],
  ["Measurement", "Support privacy-conscious aggregate participation insights."],
] as const;

const RECEIVE = [
  "Recognition as a supporting organization",
  "Participation in pilot initiatives",
  "Aggregate impact reporting",
  "Community-program visibility",
  "Co-developed educational campaigns",
  "Community activation opportunities",
  "Pilot learning reports",
] as const;

function placeholder(kind: string) {
  toast(`${kind}: prototype placeholder — a partnership contact workflow is not connected yet.`);
}

function SponsorshipPage() {
  return (
    <div className="pb-16">
      <section className="container-kih pt-10">
        <span className="eyebrow">Power the connection layer</span>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl">Partner With Know I&apos;m Here</h1>
        <p className="mt-4 max-w-3xl text-lg text-foreground/70">
          Know I&apos;m Here is designed to help residents discover, reach and participate in the resources,
          opportunities and services already around them.
        </p>
        <p className="mt-3 max-w-3xl text-lg text-foreground/70">
          Organizations can support different parts of that journey — from health and transportation to technology,
          economic mobility and community engagement.
        </p>
        <p className="mt-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Buildathon prototype. No organization named on this page currently sponsors, funds, endorses or partners with
          Know I&apos;m Here. Everything here describes potential alignment only.
        </p>
      </section>

      <section className="container-kih pt-12">
        <SectionHeading eyebrow="Sponsorship opportunity" title="Six ways an organization could support the journey" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <article key={c.title} className="card-pop p-5">
              <h3 className="font-display text-lg font-bold">{c.title}</h3>
              <p className="mt-2 text-sm text-foreground/70">{c.idea}</p>
              <p className="mt-4 text-xs font-extrabold uppercase tracking-wide text-sky">{c.label}</p>
              <ul className="mt-2 grid gap-1.5 text-sm text-foreground/75">
                {c.items.map((i) => (
                  <li key={i}>• {i}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="container-kih pt-14">
        <SectionHeading
          eyebrow="Potential partner fit"
          title="Why KIH could matter to organizations already investing in Detroit"
          text="Each card below describes potential alignment only — not an existing sponsorship, partnership or endorsement."
        />
        <div className="mt-6 grid gap-3">
          {ORGS.map((o) => (
            <details key={o.name} className="group card-pop p-5">
              <summary className="flex min-h-12 cursor-pointer list-none items-start justify-between gap-3">
                <span>
                  <span className="chip chip-sun text-[10px] uppercase tracking-wide">Potential alignment</span>
                  <span className="mt-2 block font-display text-lg font-bold">{o.name}</span>
                  <span className="mt-1 block text-sm font-bold uppercase tracking-wide text-sky">{o.hook}</span>
                </span>
                <ChevronDown className="mt-1 size-5 shrink-0 transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <div className="mt-4">
                <p className="text-foreground/75">{o.copy}</p>
                <p className="mt-4 text-xs font-extrabold uppercase tracking-wide text-sky">Potential alignment</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {o.alignment.map((a) => (
                    <li key={a} className="chip">
                      {a}
                    </li>
                  ))}
                </ul>
                {o.note && (
                  <p className="mt-4 rounded-lg border-2 border-sun bg-sun/15 p-3 text-sm font-semibold text-ink">{o.note}</p>
                )}
                <Button type="button" className="mt-4 min-h-12 font-bold" onClick={() => placeholder("Explore partnership fit")}>
                  Explore partnership fit
                </Button>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="container-kih pt-14">
        <SectionHeading eyebrow="Sponsor value" title="What a KIH sponsorship can support" />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SUPPORT.map(([label, text]) => (
            <div key={label} className="card-flat p-4">
              <p className="text-xs font-extrabold uppercase tracking-wide text-brand">{label}</p>
              <p className="mt-1.5 text-sm text-foreground/75">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-kih pt-14">
        <SectionHeading eyebrow="Responsible sponsorship" title="What sponsors could receive" />
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <ul className="card-pop grid gap-2 p-5 text-foreground/75">
            {RECEIVE.map((r) => (
              <li key={r}>• {r}</li>
            ))}
          </ul>
          <div className="card-flat p-5">
            <p className="text-xs font-extrabold uppercase tracking-wide text-brand">Never part of a sponsorship</p>
            <ul className="mt-2 grid gap-2 text-foreground/75">
              <li>• Access to individual resident data</li>
              <li>• Individual location histories</li>
              <li>• Private check-in records</li>
              <li>• Preferential treatment in public-resource recommendations</li>
            </ul>
            <p className="mt-3 text-sm text-muted-foreground">
              Paid sponsorship never quietly changes public-resource recommendations. If sponsored content exists in the
              future, it will be clearly labeled <span className="chip chip-sun text-[10px] uppercase">Sponsored</span>.
            </p>
          </div>
        </div>
      </section>

      <section className="container-kih pt-14">
        <div className="card-pop border-2 border-brand bg-brand/10 p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Sponsor the connection — not the resident&apos;s data.</h2>
          <p className="mt-3 max-w-3xl text-foreground/75">
            Know I&apos;m Here is designed around resident trust. Sponsorship can support infrastructure, outreach and
            access without selling individual resident location or participation information.
          </p>
        </div>
      </section>

      <section className="container-kih pt-14">
        <div className="card-flat p-6 sm:p-8">
          <p className="flex flex-wrap items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-sky">
            <span>Resident value</span> → <span>Partner value</span> → <span>City impact</span>
          </p>
          <p className="mt-3 max-w-3xl text-foreground/75">
            Residents use Know I&apos;m Here for free. Partners help strengthen the connection infrastructure.
            Organizations benefit when more residents can discover, reach and participate in the resources and
            opportunities already being funded across Detroit.
          </p>
        </div>
      </section>

      <section className="container-kih pt-14">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Help Detroit residents reach what&apos;s already here.</h2>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button type="button" className="min-h-12 font-bold" onClick={() => placeholder("Explore partnership")}>
            Explore partnership
          </Button>
          <Button type="button" variant="outline" className="min-h-12 font-bold" onClick={() => placeholder("Discuss a pilot")}>
            Discuss a pilot
          </Button>
          <Button asChild variant="ghost" className="min-h-12 font-bold">
            <Link to="/partners">See Partner Impact →</Link>
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Prototype placeholders — a partnership contact workflow is not connected yet.
        </p>
      </section>
    </div>
  );
}
