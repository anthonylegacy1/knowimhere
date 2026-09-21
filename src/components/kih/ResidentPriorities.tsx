import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const ECOSYSTEM: { label: string; note: string }[] = [
  { label: "Rise Higher Detroit", note: "Resident priorities" },
  { label: "Venture 313", note: "Challenge framework" },
  { label: "Know I'm Here", note: "Discovery + access + connection" },
  { label: "Everyday Connect", note: "Digital confidence + adoption" },
  { label: "Fast Freddy Experience", note: "Trusted community pilot" },
  { label: "Partners + City", note: "Privacy-conscious engagement insight" },
];

const FLOW = ["Discovery", "Access", "Participation", "Utilization", "Measurement", "Adoption"];

type Extra = "health" | "civic" | "safety" | "shelter" | "school-safety";

interface TabContent {
  id: string;
  title: string;
  badge?: string;
  concern: string;
  helps: string;
  journeyTitle: string;
  journey: string[];
  partnerValue?: string;
  extra?: Extra;
  extras?: Extra[];
  journeyAsList?: boolean;
  highlight?: string;
}

const TABS: TabContent[] = [
  {
    id: "health",
    title: "Community & Public Health",
    badge: "Primary Buildathon focus",
    concern:
      "Food assistance, health and wellness resources, mental-health support, senior services, caregiver support, recreation, family support, and community programs.",
    helps:
      "Instead of requiring residents to know which department or organization owns a service, residents can start with: “What do you need today?” Know I'm Here uses resident interests, needs, neighborhood, and optional location context to surface relevant resources and next steps.",
    journeyTitle: "“What do you need today?”",
    journey: ["Ask KIH", "Nearby health, food or wellness resource", "Understand the next step", "Get there", "Voluntary check-in"],
    extra: "health",
    extras: ["shelter"],
  },
  {
    id: "neighborhoods",
    title: "Safe, Just & Thriving Neighborhoods",
    badge: "Expansion application",
    concern:
      "Stronger neighborhood stability, safer communities, housing resources, healthy food, public spaces, youth opportunities, and neighborhood support.",
    helps:
      "Know I'm Here can help residents discover housing assistance, home repair programs, food resources, neighborhood services, recreation, safe spaces, mental-health or crisis resources, youth programming, community events, and neighborhood information.",
    journeyTitle: "“I need help repairing my home.”",
    journey: ["Ask KIH", "Housing / home repair resources", "Next step", "Official source or organization", "Get there / follow up"],
    partnerValue:
      "Partners and the City can see, in aggregate, whether neighborhood resources are being discovered and acted on — never individual resident histories.",
    extras: ["safety", "shelter"],
  },
  {
    id: "transportation",
    title: "Reliable Transportation, Infrastructure & Sustainability",
    badge: "Expansion application",
    concern:
      "Reliable transportation and infrastructure affect whether people can reach jobs, health care, education, recreation, civic services, and other opportunities.",
    helps:
      "Know I'm Here can connect a discovered resource to mobility context, including transit options, DDOT information, ride assistance, accessibility options, mobility resources, service alerts, transportation requirements, and infrastructure information.",
    journeyTitle: "“I found the senior class. How do I get there?”",
    journey: ["Discover", "Get there", "Participate"],
    partnerValue:
      "Transportation partners could see aggregate signals about where access — not awareness — is the barrier.",
  },
  {
    id: "government",
    title: "Open, Accessible & Responsible Government",
    badge: "Expansion application",
    concern:
      "Easier access to city services, clearer information, better customer service, transparency, and trusted civic information.",
    helps:
      "Residents should not have to know which department owns the answer before asking the question. Know I'm Here can help residents navigate toward verified official sources for city services and civic information.",
    journeyTitle: "Example questions residents ask",
    journey: [
      "“How do I report a broken streetlight?”",
      "“Where do I apply for this housing program?”",
      "“What city resources are available for seniors?”",
      "“Where do I vote?”",
      "“Am I registered?”",
      "“What precinct or district am I in?”",
      "“Where can I register to vote?”",
      "“Where is my early-voting location?”",
      "“How do I view my sample ballot?”",
    ],
    journeyAsList: true,
    extra: "civic",
  },
  {
    id: "youth",
    title: "Future of Education & Youth Opportunities",
    badge: "Expansion application",
    concern:
      "Safe environments, after-school opportunities, youth mental-health resources, education support, recreation, training, and pathways into employment.",
    helps:
      "Residents could discover after-school programs, summer opportunities, mentoring, sports and recreation, career programs, training, internships, paid youth opportunities, and mental-health resources.",
    journeyTitle: "“What can my child do after school near us?”",
    journey: ["Ask KIH", "Nearby youth opportunities", "Eligibility / schedule / next step", "Get there", "Participate"],
    highlight: "The opportunity may already exist. Know I'm Here helps the family know it exists and how to participate.",
    extras: ["school-safety"],
  },
  {
    id: "future",
    title: "Future of Detroit",
    badge: "Expansion application · longer-term",
    concern:
      "This Venture 313 category can include physical AI, cross-border opportunity, waterfront activity, sports, entertainment, media, tourism, festivals, events, and local business activation.",
    helps:
      "Know I'm Here could expand toward waterfront activities, sports, entertainment, arts and culture, festivals, neighborhood events, local businesses, tourism, cross-border experiences, event transportation, wayfinding, safety information, and local promotions.",
    journeyTitle: "“I'm going to an event at the waterfront. What else is happening around me?”",
    journey: ["Event", "Transportation", "Food", "Local businesses", "Community activity", "Safety information"],
  },
];

function JourneyChain({ steps }: { steps: string[] }) {
  return (
    <ol className="mt-3 flex flex-wrap items-center gap-2">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-2">
          <span className="chip bg-card text-xs font-semibold text-foreground/80">{s}</span>
          {i < steps.length - 1 && <span aria-hidden className="text-brand">→</span>}
        </li>
      ))}
    </ol>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-extrabold uppercase tracking-wide text-brand">{label}</p>
      <div className="mt-1.5 text-foreground/75">{children}</div>
    </div>
  );
}

function Collapsible({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-border bg-cream p-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        className="flex min-h-11 w-full items-center justify-between gap-3 text-left font-display text-base font-bold"
      >
        {title}
        {open ? <ChevronUp className="size-5 shrink-0" aria-hidden /> : <ChevronDown className="size-5 shrink-0" aria-hidden />}
      </button>
      {open && (
        <div id={id} className="mt-3 space-y-4 text-sm">
          {children}
        </div>
      )}
    </div>
  );
}

function QuestionList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map((q) => (
        <li key={q} className="rounded-lg border border-border bg-card px-3 py-2 font-semibold text-foreground/80">
          {q}
        </li>
      ))}
    </ul>
  );
}

function SafetyAwareness() {
  return (
    <Collapsible id="community-safety-panel" title="Community safety & incident awareness">
      <p className="text-foreground/75">
        Know I&apos;m Here can help residents find trusted information about safety concerns affecting their neighborhood and connect them to the
        appropriate official resources when something is happening nearby.
      </p>
      <div>
        <p className="text-xs font-extrabold uppercase tracking-wide text-brand">Surfaced through verified sources</p>
        <ul className="mt-1.5 list-inside list-disc text-foreground/75">
          <li>Official public-safety alerts and emergency notifications</li>
          <li>Road closures related to incidents</li>
          <li>Severe weather or emergency conditions</li>
          <li>Community safety and violence-prevention programs</li>
          <li>Mental-health crisis resources</li>
          <li>Official police or public-safety reporting resources</li>
        </ul>
      </div>
      <QuestionList
        items={[
          "“Something is happening near my block. Where can I find official information?”",
          "“How do I report something I witnessed?”",
          "“Is there an official safety alert for my neighborhood?”",
        ]}
      />
      <JourneyChain steps={["Ask KIH", "Location / neighborhood", "Verified safety source", "Official information / reporting option", "Next step"]} />
      <p className="rounded-lg border-2 border-brand bg-card p-3 font-bold text-foreground">
        If someone is in immediate danger or an emergency is happening now, call 911.
      </p>
      <p className="text-foreground/75">
        For non-emergency situations, Know I&apos;m Here routes residents to the appropriate verified City, law-enforcement, school or
        public-safety channel. Please do not investigate an incident yourself or confront anyone, and KIH never publishes unverified accusations
        about individuals.
      </p>
      <Link to="/safety" className="btn-base btn-outline inline-flex">
        Report a safety concern
      </Link>
    </Collapsible>
  );
}

function ShelterAccess() {
  return (
    <Collapsible id="safe-shelter-panel" title="Safe place & emergency shelter resources">
      <p className="text-foreground/75">
        Know I&apos;m Here can help residents and families quickly find trusted emergency shelter, temporary housing, crisis support, and
        safe-place resources when they need somewhere secure to stay.
      </p>
      <QuestionList
        items={[
          "“My family needs a safe place to stay tonight.”",
          "“Where can I find emergency shelter near me?”",
          "“I'm worried about losing my housing. Where can I get help?”",
          "“I need a safe place for me and my children.”",
        ]}
      />
      <JourneyChain steps={["Ask KIH", "Housing / safety need", "Verified shelter or housing resource", "Contact / availability", "Get there"]} />
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-xs font-extrabold uppercase tracking-wide text-brand">Featured external resource</p>
        <p className="mt-1 font-display text-lg font-bold">313 Safe Beds</p>
        <p className="mt-1 text-foreground/75">Find emergency shelter and housing resources across Metro Detroit.</p>
        <a href="https://www.313safebeds.com/" target="_blank" rel="noreferrer noopener" className="btn-base btn-primary mt-3 inline-flex">
          Visit 313 Safe Beds
        </a>
      </div>
      <p className="text-xs text-muted-foreground">
        Know I&apos;m Here does not control shelter availability or intake decisions. Shelter providers and partner organizations make all intake
        and placement decisions.
      </p>
    </Collapsible>
  );
}

function SchoolSafety() {
  return (
    <Collapsible id="school-safety-panel" title="School safety & family awareness">
      <p className="text-foreground/75">
        Families need more than educational opportunities. They also need an easy way to reach trusted information when a school or surrounding
        area may be affected by a safety concern.
      </p>
      <div>
        <p className="text-xs font-extrabold uppercase tracking-wide text-brand">Verified sources KIH can help families navigate</p>
        <ul className="mt-1.5 list-inside list-disc text-foreground/75">
          <li>School safety notifications, district alerts and emergency instructions</li>
          <li>School closures or schedule changes</li>
          <li>Nearby public-safety incidents that officially affect school operations</li>
          <li>Mental-health, counseling, bullying-prevention and youth crisis resources</li>
          <li>Safe transportation information and school contact information</li>
          <li>Official reporting resources</li>
        </ul>
      </div>
      <QuestionList
        items={[
          "“Is there an official safety alert affecting my child's school?”",
          "“Where can I find the school district's emergency information?”",
          "“How do I report a school safety concern?”",
          "“Are there youth mental-health resources near us?”",
        ]}
      />
      <JourneyChain steps={["Ask KIH", "School / neighborhood", "Verified school or public-safety source", "Alert / guidance", "Contact or next step"]} />
      <p className="text-foreground/75">
        When official information shows a school, road, transit route or surrounding area is affected, KIH can also point families to official
        transportation updates, road closures, transit changes and published pickup or dismissal information. Know I&apos;m Here does not
        independently determine that a route or location is safe.
      </p>
      <Link to="/safety" className="btn-base btn-outline inline-flex">
        Safety &amp; emergency resources
      </Link>
    </Collapsible>
  );
}

function CivicAccess() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-border bg-cream p-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="civic-access-panel"
        className="flex min-h-11 w-full items-center justify-between gap-3 text-left font-display text-base font-bold"
      >
        Civic access &amp; voter information
        {open ? <ChevronUp className="size-5 shrink-0" aria-hidden /> : <ChevronDown className="size-5 shrink-0" aria-hidden />}
      </button>
      {open && (
        <div id="civic-access-panel" className="mt-3 space-y-4 text-sm">
          <p className="text-foreground/75">
            Accessible government also means making it easier for residents to find trusted, official civic information. Know I&apos;m Here can
            help residents navigate to verified government sources for voter registration, registration status, polling locations, early voting,
            absentee voting, sample ballots, precinct information, district information, and local election-office information based on where they
            live.
          </p>
          <JourneyChain steps={["Ask KIH", "Location / neighborhood", "Verified official source", "Polling / registration information", "Get there"]} />
          <p className="rounded-lg border border-border bg-card p-3 font-semibold text-foreground">
            Know I&apos;m Here is a nonpartisan civic-access platform. KIH does not endorse candidates, political parties, ballot positions, or
            voting choices. Election information should come from verified government election sources.
          </p>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wide text-brand">Official sources to prioritize</p>
            <ul className="mt-1.5 list-inside list-disc text-foreground/75">
              <li>Detroit Department of Elections</li>
              <li>City of Detroit voter information resources</li>
              <li>Michigan Voter Information Center</li>
            </ul>
          </div>
          <p className="text-xs text-muted-foreground">
            Know I&apos;m Here does not infer eligibility, polling locations, precincts, district assignments, sample ballot contents, or deadlines.
            Residents are routed to authoritative official sources.
          </p>
        </div>
      )}
    </div>
  );
}

function TabPanel({ tab }: { tab: TabContent }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="font-display text-lg font-bold sm:text-xl">{tab.title}</h4>
        {tab.badge && (
          <span
            className={`chip text-[0.7rem] font-extrabold uppercase tracking-wide ${
              tab.id === "health" ? "bg-brand text-background" : "bg-cream text-foreground/70"
            }`}
          >
            {tab.id === "health" ? "Primary focus" : tab.badge}
          </span>
        )}
      </div>

      <Block label="What residents are concerned about">
        <p>{tab.concern}</p>
      </Block>
      <Block label="How Know I'm Here helps">
        <p>{tab.helps}</p>
      </Block>
      <Block label="Example resident journey">
        <p className="font-semibold text-foreground">{tab.journeyTitle}</p>
        {tab.journeyAsList ? (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {tab.journey.map((s) => (
              <li key={s} className="rounded-lg border border-border bg-cream px-3 py-2 text-sm font-semibold text-foreground/80">
                {s}
              </li>
            ))}
          </ul>
        ) : (
          <JourneyChain steps={tab.journey} />
        )}
      </Block>
      {tab.highlight && (
        <p className="rounded-lg border border-border bg-cream p-4 font-bold text-foreground">{tab.highlight}</p>
      )}
      {tab.extra === "health" && (
        <>
          <div className="rounded-lg border border-border bg-cream p-4">
            <p className="text-xs font-extrabold uppercase tracking-wide text-sky">Everyday Connect digital confidence bridge</p>
            <p className="mt-1.5 text-foreground/75">
              Finding a resource only helps if a resident feels confident using the technology required to access it. Everyday Connect helps
              residents learn practical digital skills involving smartphones, QR codes, online forms, maps, transportation technology, AI tools,
              appointment systems, and community websites.
            </p>
          </div>
          <Block label="Value to partners / city">
            <JourneyChain steps={FLOW} />
          </Block>
        </>
      )}
      {tab.extra === "civic" && <CivicAccess />}
      {tab.extras?.includes("safety") && <SafetyAwareness />}
      {tab.extras?.includes("shelter") && <ShelterAccess />}
      {tab.extras?.includes("school-safety") && <SchoolSafety />}
      {tab.partnerValue && (
        <Block label="Value to partners / city">
          <p>{tab.partnerValue}</p>
        </Block>
      )}
    </div>
  );
}

export function ResidentPriorities() {
  const [active, setActive] = useState("health");
  const [ecoOpen, setEcoOpen] = useState(false);


  return (
    <section className="border-y border-border bg-card">
      <div className="container-kih py-14">
        <SectionHeading
          eyebrow="Resident priorities"
          title="Detroit already told us what matters."
          text="Through Rise Higher Detroit, residents shared priorities around stronger neighborhoods, safer communities, reliable transportation, economic opportunity, youth opportunities, accessible government, health, wellness, and community support."
        />
        <div className="mt-5 inline-block rounded-lg border-2 border-brand bg-cream px-4 py-3">
          <p className="font-display text-lg font-bold text-foreground">Primary Detroit focus: Community &amp; Public Health.</p>
          <p className="mt-1 font-semibold text-foreground/75">Designed to extend across Detroit&apos;s other resident priorities.</p>
          <span className="chip mt-2 inline-block bg-brand text-xs font-extrabold uppercase tracking-wide text-background">
            Venture 313 · Primary Impact Pillar
          </span>
        </div>

        {/* Ecosystem — collapsible on mobile, always shown on desktop */}
        <div className="mt-8">
          <div className="lg:hidden">
            <h3 className="font-display text-base font-bold uppercase tracking-wide">How the KIH ecosystem works</h3>
            <p className="mt-1 text-sm text-foreground/70">
              From Detroit resident priorities to community connection, digital confidence, adoption, and measurable engagement.
            </p>
            <p className="mt-2 text-xs font-extrabold uppercase tracking-wide text-brand">
              Detroit priorities → KIH connection → Digital confidence → Community pilot → Partner insight
            </p>
            {!ecoOpen && (
              <button
                type="button"
                onClick={() => setEcoOpen(true)}
                aria-expanded={false}
                aria-controls="kih-ecosystem"
                className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-brand bg-background px-4 py-2 text-sm font-bold text-brand"
              >
                View ecosystem <ChevronDown className="size-4" aria-hidden />
              </button>
            )}
          </div>

          <div id="kih-ecosystem" className={ecoOpen ? "" : "hidden lg:block"}>
            <ol className="mt-3 grid gap-2 lg:mt-0 lg:grid-flow-col lg:auto-cols-fr lg:items-stretch lg:gap-0">
              {ECOSYSTEM.map((step, i) => (
                <li key={step.label} className="flex flex-col items-center lg:flex-row lg:items-stretch">
                  <div className="w-full max-w-xl rounded-lg border border-border bg-background px-3 py-3 text-center lg:h-full">
                    <p className="font-display text-sm font-bold">{step.label}</p>
                    <p className="text-xs text-foreground/65">{step.note}</p>
                  </div>
                  {i < ECOSYSTEM.length - 1 && (
                    <span aria-hidden className="py-1 text-brand lg:grid lg:place-items-center lg:px-1.5 lg:py-0">
                      <span className="lg:hidden">↓</span>
                      <span className="hidden lg:inline">→</span>
                    </span>
                  )}
                </li>
              ))}
            </ol>
            {ecoOpen && (
              <button
                type="button"
                onClick={() => setEcoOpen(false)}
                aria-expanded
                aria-controls="kih-ecosystem"
                className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-border bg-background px-4 py-2 text-sm font-bold text-foreground/75 lg:hidden"
              >
                Collapse <ChevronUp className="size-4" aria-hidden />
              </button>
            )}
          </div>
        </div>

        <h3 id="how-kih-responds" className="mt-8 scroll-mt-24 font-display text-xl font-extrabold uppercase leading-tight sm:text-2xl">
          How KIH responds to the primary focus
        </h3>
        <p className="mt-2 max-w-3xl font-semibold text-foreground">
          Community + Public Health is where Know I&apos;m Here proves the model. The same connection architecture can
          extend across Detroit&apos;s other resident priorities.
        </p>
        <p className="mt-2 max-w-2xl text-sm text-foreground/70">
          Venture 313 provides the challenge framework. Rise Higher Detroit provides the resident voice. KIH connects
          the two by helping residents discover, understand, reach and use existing resources.
        </p>




        {/* Tabs */}
        <div className="mt-5" role="tablist" aria-label="Detroit resident priority areas">
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
            {TABS.map((t) => {
              const on = t.id === active;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  id={`priority-tab-${t.id}`}
                  aria-selected={on}
                  aria-controls={`priority-panel-${t.id}`}
                  onClick={() => setActive(t.id)}
                  className={`min-h-11 shrink-0 rounded-full border-2 px-4 py-2 text-sm font-bold transition-colors ${
                    on
                      ? "border-brand bg-brand text-background"
                      : t.id === "health"
                        ? "border-brand bg-background text-brand hover:bg-cream"
                        : "border-border bg-background text-foreground/70 hover:bg-cream"
                  }`}
                >
                  {t.title}
                  {t.id === "health" && <span className="ml-1.5 text-xs font-extrabold uppercase">· Primary focus</span>}
                </button>
              );
            })}
          </div>

          {TABS.filter((t) => t.id === active).map((t) => (
            <div
              key={t.id}
              role="tabpanel"
              id={`priority-panel-${t.id}`}
              aria-labelledby={`priority-tab-${t.id}`}
              className="card-flat mt-5 p-5 sm:p-7"
            >
              <TabPanel tab={t} />
            </div>
          ))}
        </div>

        <p className="mt-6 max-w-3xl rounded-lg border-2 border-border bg-cream p-4 font-bold text-foreground">
          Know I&apos;m Here does not replace Detroit&apos;s programs, organizations, or official systems. It helps residents find them, understand
          them, reach them, and use them.
        </p>
        <p className="mt-3 max-w-3xl text-xs text-muted-foreground">
          Know I&apos;m Here is an independent prototype and is not an official City of Detroit platform or endorsed by the Rise Higher Detroit
          initiative.
        </p>
        <p className="mt-3 max-w-3xl text-xs text-muted-foreground">
          Sources to verify before launch: Rise Higher Detroit Community Framework / City of Detroit, Venture 313 Buildathon challenge categories,
          Detroit Department of Elections, Michigan Voter Information Center.
        </p>
      </div>
    </section>
  );
}
