import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, ExternalLink, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type FoodResource = { name: string; badge: string; blurb: string; cta: string; href: string };

const FOOD_RESOURCES: FoodResource[] = [
  {
    name: "City of Detroit Food Pantry Map",
    badge: "City resource",
    blurb: "Verified food pantry locations across Detroit.",
    cta: "Find Food Pantries",
    href: "https://detroitmi.gov/news/city-detroit-launches-interactive-one-stop-map-food-pantries-support-snap-recipients",
  },
  {
    name: "Forgotten Harvest",
    badge: "Food distribution",
    blurb: "Mobile pantries and emergency food across Metro Detroit.",
    cta: "Find Food Near You",
    href: "https://www.forgottenharvest.org/find-food/",
  },
  {
    name: "Gleaners Community Food Bank",
    badge: "Food assistance",
    blurb: "Food distributions throughout Southeast Michigan.",
    cta: "Visit Official Resource",
    href: "https://www.gcfb.org/",
  },
  {
    name: "Michigan 2-1-1 / United Way",
    badge: "Human services",
    blurb: "Food, utility, housing and health referrals.",
    cta: "Find Help Through 2-1-1",
    href: "https://mi211.org/",
  },
  {
    name: "MI Bridges / SNAP",
    badge: "Benefits",
    blurb: "Apply for Michigan food assistance benefits.",
    cta: "Apply For Food Assistance",
    href: "https://www.michigan.gov/mdhhs/assistance-programs/food",
  },
  {
    name: "Double Up Food Bucks",
    badge: "Fresh food",
    blurb: "Extra value on produce for Bridge Card users.",
    cta: "Find A Double Up Location",
    href: "https://doubleupfoodbucks.org/find-a-location/",
  },
  {
    name: "Detroit WIC",
    badge: "Family nutrition",
    blurb: "Nutrition support for eligible women, infants and children.",
    cta: "Explore Detroit WIC",
    href: "https://detroitmi.gov/departments/detroit-health-department/programs-and-services/wic-women-infants-and-children-program",
  },
  {
    name: "Detroit Parks & Recreation Food Programs",
    badge: "Youth + senior support",
    blurb: "Food-access programs at Detroit recreation centers.",
    cta: "Explore Food Programs",
    href: "https://detroitmi.gov/departments/detroit-parks-recreation/support-detroit-parks-and-recreation",
  },
];

const TODAY_SEARCH = ["City website", "Food bank website", "Benefits portal", "2-1-1", "Nutrition program", "Community organization", "Transportation information"];

const KIH_ORGANIZES = ["What is nearby", "Who the program serves", "When it is available", "Whether eligibility may apply", "How to reach the official resource", "Transportation / Get There options"];

const DEMO_RESULTS = [
  { title: "Nearby food distribution", meta: "Community food resource · Today · 0.8 miles away" },
  { title: "Food pantry", meta: "Open today · 1.4 miles away" },
  { title: "Fresh-food benefit", meta: "Bridge Card eligible · Participating location nearby" },
];

const SUBTOPICS: { title: string; emoji: string; text: string; items: string[] }[] = [
  {
    title: "Health & Wellness",
    emoji: "🩺",
    text: "Clinics, screenings, mental health support and wellness programming across Detroit.",
    items: ["Community clinics", "Screenings", "Mental health support", "Wellness programs"],
  },
  {
    title: "Senior Services",
    emoji: "🌼",
    text: "Programs, meals and social connection for older adults.",
    items: ["Senior centers", "Meal programs", "Benefits help", "Social activities"],
  },
  {
    title: "Caregiver Support",
    emoji: "🤲",
    text: "Resources for family members and caregivers supporting a loved one.",
    items: ["Respite information", "Support groups", "Care navigation"],
  },
  {
    title: "Recreation & Active Living",
    emoji: "🏀",
    text: "Recreation centers, parks and movement programs for every generation.",
    items: ["Recreation centers", "Parks", "Fitness programs", "Community sports"],
  },
  {
    title: "Family & Youth Support",
    emoji: "👨‍👩‍👧",
    text: "Youth programs, family services and school-connected support.",
    items: ["Youth programs", "Family services", "Summer opportunities"],
  },
  {
    title: "Community Programs",
    emoji: "🤝",
    text: "Neighborhood organizations, events and community-led programming.",
    items: ["Neighborhood groups", "Community events", "Volunteer opportunities"],
  },
];

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group card-flat overflow-hidden">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-base font-extrabold">
        <span>{title}</span>
        <ChevronDown className="size-5 shrink-0 text-brand transition-transform group-open:rotate-180" aria-hidden />
      </summary>
      <div className="border-t border-border px-5 py-5">{children}</div>
    </details>
  );
}

export function FoodSupport() {
  return (
    <section id="food-support" className="scroll-mt-24">
      <div className="container-kih py-10">
        <span className="eyebrow">Community + public health</span>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">Food support, connected around you.</h1>
        <p className="mt-3 max-w-2xl text-lg text-foreground/65">
          Detroit already has food pantries, nutrition programs, grocery assistance, senior and youth meal programs, fresh-food incentives and community organizations. Know I&apos;m Here helps residents discover these resources in one place based on need, location and timing.
        </p>

        <article className="card-flat mt-6 bg-ink p-6 text-cream sm:p-8">
          <h2 className="font-display text-2xl font-extrabold leading-tight sm:text-3xl">
            Detroit has the resources.<br />
            <span className="text-aqua">Know I&apos;m Here helps make the connection.</span>
          </h2>
          <p className="mt-3 max-w-3xl text-cream/80">
            Instead of searching multiple websites, agencies and programs, residents can ask one question and get a clearer path to the right resource.
          </p>
        </article>

        <div className="mt-6 grid gap-3">
          <Accordion title="How KIH makes the connection">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-lg border border-border bg-background p-5">
                <p className="text-xs font-extrabold uppercase tracking-wider text-foreground/60">Without Know I&apos;m Here</p>
                <h3 className="mt-2 text-base font-extrabold">A resident may need to search:</h3>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {TODAY_SEARCH.map((t) => <li key={t} className="chip bg-card text-xs text-foreground/70">{t}</li>)}
                </ul>
              </div>
              <div className="rounded-lg border-2 border-brand/30 bg-brand/5 p-5">
                <p className="text-xs font-extrabold uppercase tracking-wider text-brand">With Know I&apos;m Here</p>
                <h3 className="mt-2 text-base font-extrabold">“Where can I get food near me today?”</h3>
                <ul className="mt-3 grid gap-1.5 text-sm text-foreground/75">
                  {KIH_ORGANIZES.map((k) => <li key={k}>• {k}</li>)}
                </ul>
              </div>
            </div>
            <p className="mt-4 font-display text-lg font-extrabold">
              One question. Multiple trusted resources. <span className="text-sky">One clear next step.</span>
            </p>
          </Accordion>

          <Accordion title="Explore existing Detroit food resources">
            <div className="grid gap-3 sm:grid-cols-2">
              {FOOD_RESOURCES.map((r) => (
                <div key={r.name} className="card-pop p-4">
                  <span className="inline-flex items-center rounded-full bg-sky/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-sky">{r.badge}</span>
                  <h4 className="mt-2 font-display text-lg font-bold leading-tight">{r.name}</h4>
                  <p className="mt-1 text-sm text-foreground/70">{r.blurb}</p>
                  <a href={r.href} target="_blank" rel="noreferrer" className="btn-base btn-brand btn-sm mt-3 inline-flex min-h-11 items-center gap-2">
                    {r.cta} <ExternalLink className="size-4" aria-hidden />
                  </a>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Know I&apos;m Here does not operate these food programs. External resources remain owned and managed by their respective organizations.
            </p>
          </Accordion>
        </div>

        <article className="card-flat mt-6 bg-ink p-6 text-cream sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-lg bg-aqua text-ink"><MessageCircle /></span>
            <div>
              <p className="text-xs font-extrabold uppercase text-aqua">Ask KIH</p>
              <h2 className="text-xl font-extrabold">“Where can I get food near me today?”</h2>
            </div>
          </div>
          <span className="mt-4 inline-flex rounded-full bg-cream/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-cream/80">Buildathon demonstration data</span>
          <ol className="mt-3 grid gap-2">
            {DEMO_RESULTS.map((d, i) => (
              <li key={d.title} className="rounded-lg bg-cream/10 px-4 py-3">
                <p className="font-bold">{i + 1}. {d.title}</p>
                <p className="text-sm text-cream/75">{d.meta}</p>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild className="min-h-12 bg-aqua text-ink hover:bg-aqua/90"><Link to="/ask" search={{ q: "Where can I get food near me today?" }}>Ask Know I&apos;m Here <ArrowRight /></Link></Button>
            <a href="https://detroitmi.gov/news/city-detroit-launches-interactive-one-stop-map-food-pantries-support-snap-recipients" target="_blank" rel="noreferrer" className="btn-base btn-sm inline-flex min-h-12 items-center gap-2 border-2 border-cream/30 text-cream">
              Visit Official Resource <ExternalLink className="size-4" aria-hidden />
            </a>
          </div>
          <p className="mt-3 text-xs text-cream/60">Prototype example. Results shown are demonstration data, not live availability.</p>
        </article>

        <h2 className="mt-10 font-display text-2xl font-bold">Explore Community + Public Health</h2>
        <div className="mt-4 grid gap-3">
          <Accordion title="🥫 Food Support" defaultOpen>
            <p className="text-sm text-foreground/75">
              Pantries, mobile distributions, community meals, grocery assistance, fresh-food incentives and family nutrition programs — all above in one place.
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {["Need food today", "Help buying groceries", "Fresh + healthy food", "Family + senior support"].map((i) => (
                <li key={i} className="chip bg-background text-xs text-foreground/70">{i}</li>
              ))}
            </ul>
          </Accordion>
          {SUBTOPICS.map((s) => (
            <Accordion key={s.title} title={`${s.emoji} ${s.title}`}>
              <p className="text-sm text-foreground/75">{s.text}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {s.items.map((i) => <li key={i} className="chip bg-background text-xs text-foreground/70">{i}</li>)}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">Prototype section. More resources can be added here.</p>
            </Accordion>
          ))}
        </div>

        <article className="mt-8 rounded-lg border-2 border-mint/40 bg-mint/10 p-6">
          <h2 className="font-display text-xl font-extrabold">Food access is public health.</h2>
          <p className="mt-2 max-w-3xl text-foreground/75">
            Access to nutritious food connects directly to health, family stability, childhood development, healthy aging and community well-being.
          </p>
        </article>

        <p className="mt-8 max-w-3xl font-display text-xl font-extrabold leading-tight sm:text-2xl">
          Detroit doesn&apos;t need another food program. It needs an easier way to connect residents to the programs already here.
          <span className="mt-2 block text-base font-bold text-foreground/70">Know I&apos;m Here helps make that connection.</span>
        </p>
      </div>
    </section>
  );
}
