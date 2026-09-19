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
    hook: "From Buildathon prototype to Detroit-born civic tech venture",
    copy:
      "Know I'm Here can demonstrate how a Detroit-built solution moves from prototype to a sustainable technology venture while addressing a real resident-access problem.",
    alignment: [
      "Founder development",
      "Pilot support",
      "Commercialization",
      "Startup mentorship",
      "Detroit innovation ecosystem",
      "Community technology",
    ],
    value: "Help prove that civic technology built in Detroit can scale from neighborhood pilot to sustainable venture.",
    note: null as string | null,
    flow: null as readonly string[] | null,
    example: null as string | null,
    tag: null as string | null,
  },
  {
    name: "ID Ventures",
    hook: "A Detroit proof point with a scalable platform model",
    copy:
      "KIH can begin by solving Detroit's fragmented resource-discovery problem and develop into a repeatable connection platform for municipalities, institutions and community networks.",
    alignment: [
      "Scalable technology",
      "Institutional customers",
      "Recurring revenue",
      "Product-market validation",
      "City-to-city expansion",
      "Venture growth",
    ],
    value: "Detroit becomes the proof point for a connection platform that could eventually scale beyond one city.",
    note: null,
    flow: null,
    example: null,
    tag: null,
  },
  {
    name: "Gilbert Family Foundation",
    hook: "Turn resource access into economic mobility",
    copy:
      "Residents cannot benefit from opportunities they cannot find or reach. KIH can make employment, training, food, health, transportation and neighborhood resources easier to discover and navigate.",
    alignment: [
      "Economic mobility",
      "Neighborhood opportunity",
      "Workforce connection",
      "Digital inclusion",
      "Community participation",
      "Access",
    ],
    value: "Help turn existing Detroit investment into greater resident participation and opportunity.",
    note: null,
    flow: null,
    example: null,
    tag: null,
  },
  {
    name: "Google",
    hook: "AI that helps residents find the right next step",
    copy:
      "Ask KIH can turn natural-language questions into useful resource discovery, while Everyday Connect helps residents build confidence using smartphones, digital services and AI.",
    alignment: [
      "Responsible AI",
      "Search",
      "Accessibility",
      "Maps / location",
      "Cloud infrastructure",
      "Digital skills",
      "AI education",
    ],
    value: "AI becomes useful when it helps a resident move from a question to a real community resource.",
    note: null,
    flow: ["Voice / text", "Location context", "Trusted resource matching", "Next step"],
    example: "“What resources are around me right now?”",
    tag: null,
  },
  {
    name: "SMART",
    hook: "A resource only helps if a resident can reach it",
    copy:
      "KIH can connect resource discovery directly to transportation information so residents understand not only what is available, but how to get there.",
    alignment: [
      "Transit discovery",
      "Trip access",
      "Senior mobility",
      "Accessibility",
      "Workforce transportation",
      "Community-resource access",
    ],
    value: "Connect transportation access directly to community participation.",
    note: null,
    flow: ["Discover", "Get there", "Participate"],
    example: null,
    tag: null,
  },
  {
    name: "Henry Ford Health",
    hook: "Community health starts before the appointment",
    copy:
      "KIH can help residents discover nearby wellness, prevention, food-support and community-health resources — and understand how to reach them.",
    alignment: [
      "Community + public health",
      "Preventive care",
      "Screenings",
      "Wellness",
      "Food access",
      "Senior health",
      "Neighborhood outreach",
      "Access to care",
    ],
    value: "Help residents discover health and wellness resources before a need becomes a crisis.",
    note: null,
    flow: null,
    example: null,
    tag: null,
  },
  {
    name: "JustAir",
    hook: "Connect neighborhood information to community health",
    copy:
      "Environmental conditions are part of public health. KIH could eventually help residents discover trusted hyperlocal environmental-health information alongside neighborhood resources and alerts.",
    alignment: [
      "Environmental health",
      "Neighborhood awareness",
      "Air-quality education",
      "Hyperlocal information",
      "Public health",
    ],
    value: "Help residents understand how environmental conditions connect to health and neighborhood awareness.",
    note: "Future integration opportunity — no JustAir data integration exists today.",
    flow: null,
    example: null,
    tag: "Future integration opportunity",
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
          eyebrow="Potential alignment"
          title="Why KIH could matter to organizations already investing in Detroit"
          text="Different partners can strengthen different parts of the resident journey. Know I'm Here can create value across community health, transportation, technology, economic mobility and neighborhood participation."
        />
        <p className="mt-3 max-w-2xl text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Each card below describes potential alignment only — not an existing sponsorship, partnership, funding or
          endorsement.
        </p>
        <div className="mt-6 grid gap-3">
          {ORGS.map((o) => (
            <details key={o.name} className="group card-pop p-5">
              <summary className="flex min-h-12 cursor-pointer list-none items-start justify-between gap-3">
                <span>
                  <span className="chip chip-sun text-[10px] uppercase tracking-wide">Potential alignment</span>
                  {o.tag && <span className="chip ml-2 text-[10px] uppercase tracking-wide">{o.tag}</span>}
                  <span className="mt-2 block font-display text-lg font-bold">{o.name}</span>
                  <span className="mt-1 block text-sm font-bold uppercase tracking-wide text-sky">{o.hook}</span>
                  <span className="mt-2 block text-xs font-extrabold uppercase tracking-wide text-brand">
                    <span className="group-open:hidden">Explore potential alignment +</span>
                    <span className="hidden group-open:inline">Hide potential alignment −</span>
                  </span>
                </span>
                <ChevronDown className="mt-1 size-5 shrink-0 transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <div className="mt-4">
                <p className="text-foreground/75">{o.copy}</p>
                {o.example && <p className="mt-3 text-sm font-semibold text-foreground/80">{o.example}</p>}
                {o.flow && (
                  <p className="mt-3 flex flex-wrap items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-sky">
                    {o.flow.map((step, i) => (
                      <span key={step}>
                        {step}
                        {i < o.flow!.length - 1 ? " →" : ""}
                      </span>
                    ))}
                  </p>
                )}
                <p className="mt-4 text-xs font-extrabold uppercase tracking-wide text-sky">Potential alignment</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {o.alignment.map((a) => (
                    <li key={a} className="chip">
                      {a}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 rounded-lg border-2 border-brand bg-brand/10 p-3 text-sm font-semibold text-ink">
                  {o.value}
                </p>
                {o.note && (
                  <p className="mt-3 rounded-lg border-2 border-sun bg-sun/15 p-3 text-sm font-semibold text-ink">{o.note}</p>
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
