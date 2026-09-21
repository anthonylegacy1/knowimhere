import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowUpRight, Phone, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/kih/SectionHeading";

const TITLE = "Safety & Emergency Resources in Detroit | Know I'm Here";
const DESC =
  "Find trusted safety information, emergency alerts, school safety resources, crisis support and official reporting options for your Detroit school or neighborhood.";

export const Route = createFileRoute("/safety")({
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
  component: Safety,
});

type Item = { label: string; note: string; source: string; href?: string; tel?: string };

const REPORTING: { heading: string; blurb: string; items: Item[] }[] = [
  {
    heading: "Immediate emergency",
    blurb: "Someone is in danger, a crime is happening now, or there is a fire or medical emergency.",
    items: [
      { label: "Call 911", note: "Police, fire and emergency medical response.", source: "Emergency services", tel: "911" },
    ],
  },
  {
    heading: "Non-emergency incident or suspicious activity",
    blurb: "Something already happened, or something seems wrong but no one is in immediate danger.",
    items: [
      {
        label: "Detroit Police non-emergency line",
        note: "Report a non-emergency incident or ask where to file a report.",
        source: "Detroit Police Department",
        tel: "313-267-4600",
      },
      {
        label: "Detroit Police Department",
        note: "Precinct information, reporting options and department contacts.",
        source: "City of Detroit",
        href: "https://detroitmi.gov/departments/police-department",
      },
      {
        label: "Anonymous tip line",
        note: "Share information about a crime without giving your name.",
        source: "Crime Stoppers of Michigan",
        href: "https://www.1800speakup.org",
      },
    ],
  },
  {
    heading: "Neighborhood concern or city service issue",
    blurb: "Streetlights, blight, illegal dumping, abandoned vehicles and similar neighborhood conditions.",
    items: [
      {
        label: "Improve Detroit",
        note: "Submit neighborhood service requests to the City.",
        source: "City of Detroit",
        href: "https://detroitmi.gov/webapp/improve-detroit-submit-issue",
      },
    ],
  },
  {
    heading: "School-related safety concern",
    blurb: "A threat, bullying, or a safety concern involving a school or student.",
    items: [
      {
        label: "OK2SAY confidential student tip line",
        note: "Confidential tips about threats to student safety in Michigan schools.",
        source: "State of Michigan",
        href: "https://www.michigan.gov/ok2say",
      },
      {
        label: "Detroit Public Schools Community District",
        note: "District contacts, school information and family resources.",
        source: "DPSCD",
        href: "https://www.detroitk12.org",
      },
    ],
  },
  {
    heading: "Mental-health or crisis support",
    blurb: "You or someone you know is in emotional distress or crisis.",
    items: [
      { label: "988 Suicide & Crisis Lifeline", note: "Call or text 988, 24 hours a day.", source: "988 Lifeline", tel: "988" },
      {
        label: "Detroit Wayne Integrated Health Network",
        note: "Local mental-health and crisis services.",
        source: "DWIHN",
        href: "https://www.dwihn.org",
      },
    ],
  },
];

const ALERTS: Item[] = [
  { label: "City of Detroit alerts & news", note: "Official city notices and emergency information.", source: "City of Detroit", href: "https://detroitmi.gov" },
  { label: "Detroit Fire Department", note: "Fire safety information and department contacts.", source: "City of Detroit", href: "https://detroitmi.gov/departments/detroit-fire-department" },
  { label: "Michigan emergency management", note: "State emergency preparedness and alert information.", source: "Michigan State Police / MSP EMHSD", href: "https://www.michigan.gov/msp/divisions/emhsd" },
  { label: "DDOT service alerts", note: "Bus detours, route changes and service disruptions.", source: "Detroit Department of Transportation", href: "https://detroitmi.gov/departments/detroit-department-transportation" },
  { label: "Michigan road & traffic conditions", note: "Closures and incident-related traffic information.", source: "Mi Drive / MDOT", href: "https://mdotjboss.state.mi.us/MiDrive" },
  { label: "National Weather Service — Detroit", note: "Severe weather watches and warnings.", source: "NOAA / NWS", href: "https://www.weather.gov/dtx" },
];

function ItemLink({ item }: { item: Item }) {
  const inner = (
    <>
      <span className="flex items-center justify-between gap-2 font-display text-base font-bold">
        {item.label}
        {item.tel ? <Phone className="size-5 shrink-0 text-brand" aria-hidden /> : <ArrowUpRight className="size-5 shrink-0 text-brand" aria-hidden />}
      </span>
      <span className="text-sm text-foreground/70">{item.note}</span>
      <span className="mt-1 text-xs font-extrabold uppercase tracking-wide text-brand">{item.source}</span>
    </>
  );
  const cls = "card-flat flex min-h-11 flex-col gap-1 p-4 transition-colors hover:bg-cream";
  return item.tel ? (
    <a href={`tel:${item.tel.replace(/[^0-9]/g, "")}`} className={cls}>
      {inner}
    </a>
  ) : (
    <a href={item.href} target="_blank" rel="noreferrer noopener" className={cls}>
      {inner}
    </a>
  );
}

function Safety() {
  return (
    <div className="container-kih py-8 sm:py-12">
      <SectionHeading
        eyebrow="Safety & Emergency Resources"
        title="Know where to look, who to contact, and what the official next step is."
        text="Find trusted safety information, emergency resources, and official reporting options for your school or neighborhood."
      />

      <p className="mt-5 flex items-start gap-3 rounded-lg border-2 border-brand bg-cream p-4 font-bold text-foreground">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
        If someone is in immediate danger or an emergency is happening now, call 911.
      </p>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold">Report a safety concern</h2>
        <p className="mt-1 text-foreground/70">
          Know I&apos;m Here does not take reports. Pick the situation that matches and you&apos;ll be routed to the official channel that does.
        </p>
        <div className="mt-5 space-y-6">
          {REPORTING.map((g) => (
            <div key={g.heading}>
              <p className="font-display text-lg font-bold">{g.heading}</p>
              <p className="text-sm text-foreground/70">{g.blurb}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {g.items.map((i) => (
                  <ItemLink key={i.label} item={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-5 rounded-lg border border-border bg-cream p-4 text-sm font-semibold text-foreground">
          Please do not investigate an incident yourself or confront anyone. Share what you know with the official channel and let them handle it.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold">Official alerts & conditions</h2>
        <p className="mt-1 text-foreground/70">
          Public-safety alerts, emergency notifications, severe weather, road closures and transit changes — from the agencies that publish them.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {ALERTS.map((i) => (
            <ItemLink key={i.label} item={i} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold">School safety & family awareness</h2>
        <p className="mt-1 text-foreground/70">
          Families need more than educational opportunities. They also need an easy way to reach trusted information when a school or the area
          around it may be affected by a safety concern.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <ItemLink
            item={{
              label: "District alerts & school closures",
              note: "Official notifications, closures, schedule changes and emergency instructions.",
              source: "Detroit Public Schools Community District",
              href: "https://www.detroitk12.org",
            }}
          />
          <ItemLink
            item={{
              label: "Find your school and its contacts",
              note: "School directory, main office numbers and family contact information.",
              source: "DPSCD",
              href: "https://www.detroitk12.org/schools",
            }}
          />
          <ItemLink
            item={{
              label: "Report a school safety concern",
              note: "Confidential tips about threats, bullying or student safety.",
              source: "OK2SAY · State of Michigan",
              href: "https://www.michigan.gov/ok2say",
            }}
          />
          <ItemLink
            item={{
              label: "Youth mental health & counseling",
              note: "Crisis support and counseling for young people and families.",
              source: "988 Lifeline / DWIHN",
              href: "https://988lifeline.org",
            }}
          />
        </div>
        <p className="mt-4 text-sm text-foreground/70">
          If your child attends a charter, private or non-DPSCD school, use that school or district&apos;s own official alert and contact
          information — Know I&apos;m Here routes you to the source, it does not speak for any school.
        </p>
        <Link to="/opportunities" className="btn-base btn-outline mt-4 inline-flex">
          Explore youth &amp; education opportunities
        </Link>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold">Getting there when something is affecting the area</h2>
        <p className="mt-1 text-foreground/70">
          When official information shows a road, transit route or area around a school is affected, these sources publish the updates: DDOT
          service alerts, Mi Drive road conditions, and school or district pickup and dismissal notices.
        </p>
        <p className="mt-3 rounded-lg border border-border bg-cream p-4 text-sm font-semibold text-foreground">
          Know I&apos;m Here does not determine whether a route or location is safe. Follow official guidance from the City, law enforcement,
          emergency management, transit agencies and your school or district.
        </p>
        <Link to="/map" className="btn-base btn-outline mt-4 inline-flex">
          Open the map
        </Link>
      </section>

      <div className="card-flat mt-12 flex items-start gap-3 p-5">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
        <div>
          <p className="font-display font-bold">How Know I&apos;m Here handles safety information</p>
          <p className="mt-1 text-sm text-foreground/75">
            Know I&apos;m Here is a navigation and awareness layer — not law enforcement, emergency dispatch, or a school-safety authority. Safety
            information comes only from verified official sources such as the City of Detroit, Detroit Police Department, Detroit Fire Department,
            school districts, emergency management agencies, official transit agencies and verified community-safety organizations. This is not a
            rumor feed, and unverified accusations about individuals are never published here.
          </p>
        </div>
      </div>

      <p className="mt-5 text-xs text-muted-foreground">
        Sources to verify before launch: City of Detroit, Detroit Police Department, Detroit Fire Department, Detroit Public Schools Community
        District, Michigan OK2SAY, Michigan State Police Emergency Management &amp; Homeland Security Division, DDOT, MDOT Mi Drive, National
        Weather Service, 988 Suicide &amp; Crisis Lifeline, Detroit Wayne Integrated Health Network.
      </p>

      <Link to="/" className="btn-base btn-outline mt-6 inline-flex">
        Back to Know I&apos;m Here
      </Link>
    </div>
  );
}
