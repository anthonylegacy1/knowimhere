import { Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, MessageCircle } from "lucide-react";
import { SectionHeading } from "@/components/kih/SectionHeading";
import { Button } from "@/components/ui/button";

type FoodResource = { name: string; badge: string; blurb: string; cta: string; href: string };

const FOOD_RESOURCES: FoodResource[] = [
  {
    name: "City of Detroit Food Pantry Map",
    badge: "City resource",
    blurb: "Find verified food pantry locations and food-support options across Detroit.",
    cta: "Find Food Pantries",
    href: "https://detroitmi.gov/news/city-detroit-launches-interactive-one-stop-map-food-pantries-support-snap-recipients",
  },
  {
    name: "Forgotten Harvest",
    badge: "Food distribution",
    blurb: "Find mobile pantries, partner agencies, shelters, soup kitchens and emergency food assistance throughout Metro Detroit.",
    cta: "Find Food Near You",
    href: "https://www.forgottenharvest.org/find-food/",
  },
  {
    name: "Gleaners Community Food Bank",
    badge: "Food assistance",
    blurb: "Connect with food distributions and emergency food-support resources throughout Southeast Michigan.",
    cta: "Visit Gleaners",
    href: "https://www.gcfb.org/",
  },
  {
    name: "Michigan 2-1-1",
    badge: "Human services",
    blurb: "Connect with food assistance and thousands of additional health and human-service resources.",
    cta: "Find Help Through 2-1-1",
    href: "https://mi211.org/",
  },
  {
    name: "MI Bridges / SNAP",
    badge: "Benefits",
    blurb: "Apply for Michigan food assistance benefits, check eligibility and manage benefits.",
    cta: "Apply For Food Assistance",
    href: "https://www.michigan.gov/mdhhs/assistance-programs/food",
  },
  {
    name: "Double Up Food Bucks",
    badge: "Fresh food",
    blurb: "Find participating grocery stores and farmers markets where eligible Bridge Card users can receive additional value for fruits and vegetables.",
    cta: "Find A Double Up Location",
    href: "https://doubleupfoodbucks.org/find-a-location/",
  },
  {
    name: "Detroit WIC",
    badge: "Family nutrition",
    blurb: "Nutrition support, healthy foods, education, breastfeeding support and wellness resources for eligible women, infants and children.",
    cta: "Explore Detroit WIC",
    href: "https://detroitmi.gov/departments/detroit-health-department/programs-and-services/wic-women-infants-and-children-program",
  },
  {
    name: "Detroit Parks & Recreation Food Programs",
    badge: "Youth + senior support",
    blurb: "Food-access programs connected to Detroit recreation centers and community programming.",
    cta: "Explore Food Programs",
    href: "https://detroitmi.gov/departments/detroit-parks-recreation/support-detroit-parks-and-recreation",
  },
];

const FLOW = [
  "I need food support",
  "Know I'm Here understands the need",
  "Shows relevant existing resources",
  "Helps the resident get there or apply",
  "Connects them to additional support",
];

const QUESTIONS = [
  "Where can I get food near me today?",
  "Where can I use my Bridge Card for fresh produce?",
  "Are there senior meal programs near me?",
  "Where can I apply for grocery assistance?",
];

const NEEDS = [
  { title: "Need food today", emoji: "🥫", items: ["Food pantries", "Mobile food distributions", "Community meals", "Emergency food assistance"] },
  { title: "Help buying groceries", emoji: "🛒", items: ["SNAP", "MI Bridges", "Benefits assistance"] },
  { title: "Fresh + healthy food", emoji: "🥕", items: ["Double Up Food Bucks", "Farmers markets", "Fresh-food distributions", "Nutrition programs"] },
  { title: "Family + senior support", emoji: "👨‍👩‍👧", items: ["WIC", "Senior meal programs", "Youth meal programs", "Caregiver and family resources"] },
];

const TODAY_SEARCH = ["City website", "Food bank website", "Benefits portal", "2-1-1", "Nutrition program", "Community organization", "Transportation information"];

const KIH_ORGANIZES = ["What is nearby", "Who the program serves", "When it is available", "Whether eligibility may apply", "How to reach the official resource", "Transportation / Get There options"];

const DEMO_RESULTS = [
  { title: "Nearby food distribution", meta: "Community food resource · Today", distance: "0.8 miles away" },
  { title: "Food pantry", meta: "Open today", distance: "1.4 miles away" },
  { title: "Fresh-food benefit", meta: "Bridge Card eligible", distance: "Participating location nearby" },
];

export function FoodSupport() {
  return (
    <section id="food-support" className="scroll-mt-24 border-y border-border bg-card">
      <div className="container-kih py-14">
        <SectionHeading
          eyebrow="Community + public health"
          title="Food support, connected around you."
          text="Detroit already has food pantries, nutrition programs, grocery assistance, senior and youth meal programs, fresh-food incentives and community organizations helping residents every day. Know I'm Here can help bring those resources into one simple discovery experience — making it easier to understand what is available, what fits your needs and where to go next."
        />

        <article className="card-flat mt-8 bg-ink p-6 text-cream sm:p-8">
          <h3 className="font-display text-2xl font-extrabold leading-tight sm:text-3xl">
            Detroit has the resources.<br />
            <span className="text-aqua">Know I&apos;m Here helps make the connection.</span>
          </h3>
          <p className="mt-3 max-w-3xl text-cream/80">
            Instead of expecting a resident to know which website, agency or program to search first, Know I&apos;m Here can help organize trusted food-support options based on what that resident needs at that moment.
          </p>
        </article>

        <div className="mt-8">
          <p className="text-xs font-extrabold uppercase tracking-wider text-brand">The resident experience</p>
          <ol className="mt-3 flex flex-wrap items-center gap-2">
            {FLOW.map((step, i) => (
              <li key={step} className="flex items-center gap-2">
                <span className="chip bg-background text-sm font-bold text-foreground/80">{step}</span>
                {i < FLOW.length - 1 && <ArrowRight className="size-4 text-brand" aria-hidden />}
              </li>
            ))}
          </ol>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {QUESTIONS.map((q) => (
              <li key={q} className="rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground/75">“{q}”</li>
            ))}
          </ul>
        </div>

        <h3 className="mt-10 font-display text-xl font-extrabold">Existing resources Know I&apos;m Here can help residents discover</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {FOOD_RESOURCES.map((r) => (
            <div key={r.name} className="card-pop p-5">
              <span className="inline-flex items-center rounded-full bg-sky/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-sky">{r.badge}</span>
              <h4 className="mt-2 font-display text-lg font-bold leading-tight">{r.name}</h4>
              <p className="mt-1 text-sm text-foreground/70">{r.blurb}</p>
              <a href={r.href} target="_blank" rel="noreferrer" className="btn-base btn-brand btn-sm mt-4 inline-flex items-center gap-2">
                {r.cta} <ExternalLink className="size-4" aria-hidden />
              </a>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {NEEDS.map((n) => (
            <article key={n.title} className="card-flat p-5">
              <h4 className="font-display text-lg font-bold"><span aria-hidden>{n.emoji}</span> {n.title}</h4>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {n.items.map((i) => <li key={i} className="chip bg-background text-xs text-foreground/70">{i}</li>)}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <article className="rounded-lg border border-border bg-background p-6">
            <p className="text-xs font-extrabold uppercase tracking-wider text-foreground/60">Today</p>
            <h4 className="mt-2 text-lg font-extrabold">A resident may need to search:</h4>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {TODAY_SEARCH.map((t) => <li key={t} className="chip bg-card text-xs text-foreground/70">{t}</li>)}
            </ul>
          </article>
          <article className="rounded-lg border-2 border-brand/30 bg-brand/5 p-6">
            <p className="text-xs font-extrabold uppercase tracking-wider text-brand">With Know I&apos;m Here</p>
            <h4 className="mt-2 text-lg font-extrabold">A resident asks: “Where can I get food near me today?”</h4>
            <ul className="mt-3 grid gap-1.5 text-sm text-foreground/75">
              {KIH_ORGANIZES.map((k) => <li key={k}>• {k}</li>)}
            </ul>
          </article>
        </div>
        <p className="mt-4 font-display text-lg font-extrabold">
          One question. Multiple trusted resources. <span className="text-sky">One clear next step.</span>
        </p>

        <article className="card-flat mt-10 bg-ink p-6 text-cream sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-lg bg-aqua text-ink"><MessageCircle /></span>
            <div>
              <p className="text-xs font-extrabold uppercase text-aqua">Ask KIH</p>
              <h3 className="text-xl font-extrabold">“Where can I get food near me today?”</h3>
            </div>
          </div>
          <span className="mt-4 inline-flex rounded-full bg-cream/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-cream/80">Buildathon demonstration data</span>
          <p className="mt-3 text-xs font-extrabold uppercase tracking-wider text-aqua">Food support near you</p>
          <ol className="mt-2 grid gap-2">
            {DEMO_RESULTS.map((d, i) => (
              <li key={d.title} className="rounded-lg bg-cream/10 px-4 py-3">
                <p className="font-bold">{i + 1}. {d.title}</p>
                <p className="text-sm text-cream/75">{d.meta} · {d.distance}</p>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild className="min-h-12 bg-aqua text-ink hover:bg-aqua/90"><Link to="/ask" search={{ q: "Where can I get food near me today?" }}>Ask Know I&apos;m Here <ArrowRight /></Link></Button>
            <a href="https://detroitmi.gov/news/city-detroit-launches-interactive-one-stop-map-food-pantries-support-snap-recipients" target="_blank" rel="noreferrer" className="btn-base btn-sm inline-flex min-h-12 items-center gap-2 border-2 border-cream/30 text-cream">
              Visit Official Resource <ExternalLink className="size-4" aria-hidden />
            </a>
          </div>
          <p className="mt-3 text-xs text-cream/60">Prototype example. These results are demonstration data, not live availability.</p>
        </article>

        <article className="mt-10 rounded-lg border-2 border-mint/40 bg-mint/10 p-6">
          <h3 className="font-display text-xl font-extrabold">Food access is public health.</h3>
          <p className="mt-2 max-w-3xl text-foreground/75">
            Access to nutritious food connects directly to health, family stability, childhood development, healthy aging and community well-being. Know I&apos;m Here can help make existing food-support programs easier to discover as part of a broader Community + Public Health experience.
          </p>
        </article>

        <p className="mt-6 max-w-3xl text-xs text-muted-foreground">
          Know I&apos;m Here does not operate these food programs. External resources remain owned and managed by their respective organizations. KIH is designed to help residents discover and navigate trusted resources more easily.
        </p>

        <p className="mt-8 max-w-3xl font-display text-xl font-extrabold leading-tight sm:text-2xl">
          Detroit doesn&apos;t need another food program. It needs an easier way to connect residents to the programs already here.
          <span className="mt-2 block text-base font-bold text-foreground/70">Know I&apos;m Here helps make that connection.</span>
        </p>
      </div>
    </section>
  );
}
