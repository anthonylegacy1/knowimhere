import { useState, type ReactNode } from "react";
import { ArrowDown, ChevronDown, ChevronUp } from "lucide-react";

/**
 * Detroit Economic Impact & ROI.
 *
 * Claim language rule for this whole section: nothing here states a proven
 * result. Everything is "designed to", "potential", "could", or "the pilot
 * will measure". Current functionality, pilot metrics and future business
 * model are labelled separately.
 */

const PILLARS = ["Discovery", "Access", "Participation", "Utilization", "Measurement", "Adoption"];

const INVESTMENT = [
  "Health",
  "Recreation",
  "Transit",
  "Workforce",
  "Senior Services",
  "Youth Programs",
  "Neighborhood Initiatives",
  "Events",
];

const RETURN_PRIMARY = ["More Awareness", "More Participation", "Better Utilization"];

const RETURN_MORE = ["Less Fragmented Outreach", "Better Engagement Data", "Better Future Decisions"];

const ROI_CARDS: Array<[string, string]> = [
  ["More awareness", "Help more residents discover funded programs and resources that already exist."],
  ["More participation", "Increase the opportunity for programs to reach the residents they were designed to serve."],
  ["Better utilization", "Help existing services reach more of their available capacity."],
  [
    "Less fragmented outreach",
    "Complement individual flyers, websites, social campaigns, manual calls and disconnected promotion with one connected discovery layer.",
  ],
  [
    "Better engagement data",
    "Provide privacy-conscious aggregate insight into what residents discover, select and voluntarily engage with.",
  ],
  [
    "Better future decisions",
    "Give participating organizations additional evidence about demand, participation patterns, outreach effectiveness and potential resource gaps.",
  ],
];

const JOURNEY: Array<[string, string, string]> = [
  ["Step 1", "Resident need", "Here's a Detroit resident looking for food or wellness support."],
  [
    "Step 2",
    "KIH identifies what is relevant",
    "Know I'm Here identifies nearby resources based on the resident's selected needs, interests, location and preferences.",
  ],
  [
    "Step 3",
    "KIH improves discovery",
    "Instead of the organization relying only on a flyer, separate website, social post, or the resident already knowing the program exists, Know I'm Here brings that opportunity into the resident's personalized discovery experience.",
  ],
  [
    "Step 4",
    "Resident takes action",
    "The resident can understand the resource, see what is required, learn how to get there, and voluntarily confirm participation.",
  ],
  ["Step 5", "Value is created on both sides", "Both the resident and the organization gain something real."],
];

const RESIDENT_VALUE = [
  "Easier discovery",
  "Clearer next steps",
  "Transportation and access information",
  "Less searching",
  "More relevant opportunities",
];

const ORG_VALUE = [
  "Another path to reach residents",
  "Greater opportunity for participation",
  "Improved utilization of funded capacity",
  "Measurable engagement signals",
  "Better understanding of outreach effectiveness",
];

const CAPACITY_CHAIN = [
  "Program is funded",
  "Program exists",
  "Resident need exists",
  "KIH creates the connection",
  "Resident discovers it",
  "Resident gets there",
  "Resident participates",
  "Engagement can be measured",
];

const CITY_BENEFITS = [
  "Get more value from existing program dollars",
  "Help funded programs reach more people",
  "Reduce outreach fragmentation",
  "Create better engagement insight",
];

const RESIDENT_METRICS = [
  "Resource views",
  "Ask KIH searches",
  "Get There clicks",
  "Resource saves",
  "Registrations and referrals",
  "Voluntary check-ins",
  "Repeat usage",
  "Repeat participation",
];

const PARTNER_METRICS = [
  "Referral traffic",
  "Program registrations",
  "Attendance",
  "Utilization rates",
  "Outreach conversion",
  "Cost per resident reached",
  "Category demand",
  "Neighborhood demand",
  "Resource gaps",
];

const CUSTOMER_GROUPS = [
  "Municipalities",
  "Healthcare systems",
  "Nonprofits",
  "Senior-living organizations",
  "Community organizations",
  "Workforce organizations",
  "Local businesses",
  "Enterprise partners",
];

const REVENUE_STREAMS = [
  "Municipal contracts",
  "Institutional subscriptions",
  "Partner dashboards",
  "Sponsored verified resources",
  "Local-business promotional packages",
  "Enterprise licensing",
  "White-label city deployments",
  "Privacy-conscious analytics",
  "Legally appropriate transaction or referral revenue",
];

function Expandable({
  label,
  closeLabel = "Show less",
  children,
}: {
  label: string;
  closeLabel?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const id = `roi-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        className="mt-4 flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl border-2 border-ink/15 bg-card px-5 text-left font-extrabold uppercase tracking-wide text-ink shadow-sm transition-colors hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <span className="min-w-0">{open ? closeLabel : label}</span>
        {open ? (
          <ChevronUp className="size-5 shrink-0 text-brand" aria-hidden />
        ) : (
          <ChevronDown className="size-5 shrink-0 text-brand" aria-hidden />
        )}
      </button>
      <div
        id={id}
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"}`}
        aria-hidden={!open}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </>
  );
}

function Arrow() {
  return (
    <div className="flex justify-center py-2 text-foreground/40" aria-hidden>
      <ArrowDown className="size-6" />
    </div>
  );
}

export function DetroitROI() {
  return (
    <div className="space-y-10 sm:space-y-14">
      {/* 1 — PRIMARY ROI MESSAGE */}
      <div>
        <span className="eyebrow">Detroit economic impact &amp; ROI</span>
        <h2 className="mt-4 font-display text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-5xl">
          Turning community investment into measurable engagement
        </h2>
        <p className="mt-3 max-w-3xl font-display text-xl font-extrabold uppercase leading-tight text-brand sm:text-2xl">
          Know I&apos;m Here improves discovery and access. Everyday Connect strengthens adoption. Together, they help
          Detroit and its partners improve participation, utilization, and measurement.
        </p>
        <p className="mt-5 max-w-3xl text-base text-foreground/70 sm:text-lg">
          Detroit and its community partners already invest in health programs, recreation, transportation, workforce
          development, senior services, youth programs, neighborhood initiatives, events, and other community
          resources.
        </p>
        <p className="mt-3 max-w-3xl text-base text-foreground/70 sm:text-lg">
          The opportunity is making sure residents can actually find them, reach them, use them, and return to them.
        </p>
        <p className="mt-3 max-w-3xl text-base text-foreground/70 sm:text-lg">
          Know I&apos;m Here helps close the discovery and access gap by connecting residents to relevant resources.
          Everyday Connect helps close the digital-confidence gap by teaching residents how to use the technology
          required to access those opportunities.
        </p>
        <p className="mt-3 max-w-3xl text-base text-foreground/70 sm:text-lg">
          Together, they can help participating organizations better understand whether outreach is translating into
          discovery, access, participation, and utilization.
        </p>
        <p className="mt-3 max-w-3xl text-base text-foreground/70 sm:text-lg">
          Over time, privacy-conscious engagement data can help partners understand how programs are being reached and
          used, where additional outreach may be needed, and whether community investment dollars are generating
          meaningful resident engagement.
        </p>
        <p className="mt-4 max-w-3xl rounded-2xl bg-sun/30 px-5 py-4 text-base font-bold sm:text-lg">
          The goal is simple: help Detroit and its partners get more measurable value from the resources they are
          already investing in.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {PILLARS.map((p) => (
            <li key={p} className="chip bg-sun/40 text-sm font-extrabold uppercase tracking-wide">
              {p}
            </li>
          ))}
        </ul>
      </div>

      {/* 2 — CONNECTION FLOW */}
      <div>
        <h3 className="font-display text-2xl font-bold">Where Know I&apos;m Here sits</h3>
        <div className="mx-auto mt-5 max-w-3xl">
          <div className="card-flat p-5">
            <p className="text-xs font-extrabold uppercase tracking-wide text-sky">Public + community investment</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {INVESTMENT.map((i) => (
                <li key={i} className="chip text-sm">
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <Arrow />
          <div className="rounded-lg bg-brand p-5 text-brand-foreground">
            <p className="text-xs font-extrabold uppercase tracking-wide">Know I&apos;m Here connection layer</p>
            <p className="mt-2 font-display text-xl font-extrabold uppercase">
              Discover → Get There → Check In → Measure
            </p>
          </div>
          <Arrow />
          <div className="card-flat bg-aqua-soft/60 p-5">
            <p className="text-xs font-extrabold uppercase tracking-wide text-sky">Potential return</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {RETURN_PRIMARY.map((r) => (
                <li key={r} className="chip text-sm">
                  {r}
                </li>
              ))}
            </ul>
            <Expandable label="View all potential returns">
              <ul className="mt-4 flex flex-wrap gap-2">
                {RETURN_MORE.map((r) => (
                  <li key={r} className="chip text-sm">
                    {r}
                  </li>
                ))}
              </ul>
            </Expandable>
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-foreground/70">
          Know I&apos;m Here is designed to sit between investment that already exists and actual resident participation.
        </p>
      </div>

      {/* 3 — MORE CONNECTION / UTILIZATION / IMPACT PER DOLLAR */}
      <div>
        <h3 className="font-display text-3xl font-extrabold uppercase leading-tight sm:text-4xl">
          More connection.
          <br />
          More utilization.
          <br />
          <span className="text-brand">More impact per dollar.</span>
        </h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ROI_CARDS.slice(0, 3).map(([t, d]) => (
            <div key={t} className="card-flat p-5">
              <p className="font-display text-lg font-bold uppercase">{t}</p>
              <p className="mt-2 text-sm text-foreground/75">{d}</p>
            </div>
          ))}
        </div>
        <Expandable label="View all ROI benefits">
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ROI_CARDS.slice(3).map(([t, d]) => (
              <div key={t} className="card-flat p-5">
                <p className="font-display text-lg font-bold uppercase">{t}</p>
                <p className="mt-2 text-sm text-foreground/75">{d}</p>
              </div>
            ))}
          </div>
        </Expandable>
      </div>

      {/* 4 — SINGLE RESIDENT JOURNEY */}
      <div>
        <h3 className="font-display text-2xl font-bold sm:text-3xl">How a single resident journey creates value</h3>
        <p className="mt-3 max-w-3xl text-foreground/70">
          See how Know I&apos;m Here moves a resident from need to discovery, action, and measurable engagement.
        </p>
        <ol className="mt-5 grid gap-3 md:grid-cols-2">
          {JOURNEY.slice(0, 2).map(([n, t, d]) => (
            <li key={n} className="card-flat p-5">
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-brand">{n}</p>
              <p className="mt-1 font-display text-lg font-bold">{t}</p>
              <p className="mt-2 text-sm text-foreground/75">{d}</p>
            </li>
          ))}
        </ol>
        <Expandable label="Continue the resident journey">
          <ol className="mt-4 grid gap-3 lg:grid-cols-3">
            {JOURNEY.slice(2).map(([n, t, d]) => (
              <li key={n} className="card-flat p-5">
                <p className="text-[11px] font-extrabold uppercase tracking-wide text-brand">{n}</p>
                <p className="mt-1 font-display text-lg font-bold">{t}</p>
                <p className="mt-2 text-sm text-foreground/75">{d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="card-pop p-6">
              <p className="text-xs font-extrabold uppercase tracking-wide text-brand">Resident value</p>
              <ul className="mt-3 space-y-1.5 text-sm font-semibold">
                {RESIDENT_VALUE.map((v) => (
                  <li key={v}>• {v}</li>
                ))}
              </ul>
            </div>
            <div className="card-pop bg-ink p-6 text-cream">
              <p className="text-xs font-extrabold uppercase tracking-wide text-sun">Organization value</p>
              <ul className="mt-3 space-y-1.5 text-sm font-semibold">
                {ORG_VALUE.map((v) => (
                  <li key={v}>• {v}</li>
                ))}
              </ul>
            </div>
          </div>
        </Expandable>
        <p className="mt-4 rounded-2xl bg-sun/30 px-5 py-4 text-lg font-bold">
          The resident receives access while the organization gets another opportunity to turn funded capacity into
          actual participation.
        </p>
      </div>

      {/* 5 — INFORMATION TO MEASURABLE ENGAGEMENT */}
      <div>
        <h3 className="font-display text-2xl font-extrabold uppercase leading-tight sm:text-4xl">
          From providing information
          <br />
          <span className="text-brand">to measuring engagement</span>
        </h3>
        <p className="mt-4 max-w-3xl text-foreground/70">
          Know I&apos;m Here is designed to move beyond simply showing residents what exists. When a resident
          voluntarily takes actions such as viewing a resource, requesting directions, registering, saving an
          opportunity, or checking in, those actions can create privacy-conscious engagement signals.
        </p>
        <p className="mt-5 inline-block rounded-2xl bg-ink px-5 py-4 font-display text-xl font-extrabold uppercase leading-tight text-cream">
          Not surveillance.
          <br />
          Not silent attendance tracking.
        </p>
        <p className="mt-4 max-w-3xl text-foreground/70">
          Consent-based participation signals can eventually help participating organizations understand whether
          outreach is translating into resident engagement.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="card-flat p-5">
            <p className="font-display text-lg font-bold uppercase">Location access</p>
            <p className="mt-2 text-sm text-foreground/75">Used voluntarily to personalize nearby results.</p>
          </div>
          <div className="card-flat p-5">
            <p className="font-display text-lg font-bold uppercase">Check-in</p>
            <p className="mt-2 text-sm text-foreground/75">
              A separate voluntary action where the resident confirms that they arrived or participated.
            </p>
          </div>
        </div>
        <p className="mt-3 text-sm font-semibold text-foreground/70">
          Device location is never treated as proof of attendance. Attendance is never inferred automatically, and
          residents are never checked in silently.
        </p>
      </div>

      {/* 6 — FUNDED CAPACITY → ACTUAL PARTICIPATION */}
      <div>
        <h3 className="font-display text-2xl font-extrabold uppercase leading-tight sm:text-3xl">
          Turn funded capacity into more opportunities for actual participation
        </h3>
        <p className="mt-3 max-w-3xl text-foreground/70">
          Know I&apos;m Here does not replace the underlying program. It is designed to improve the connection between
          programs that already exist and residents who may benefit from them.
        </p>
        <ol className="mx-auto mt-6 max-w-md">
          {CAPACITY_CHAIN.slice(0, 4).map((step, i) => (
            <li key={step}>
              {i > 0 && <Arrow />}
              <div
                className={`rounded-2xl p-4 text-center font-extrabold uppercase ${
                  step.startsWith("KIH") ? "bg-brand text-brand-foreground" : "card-flat"
                }`}
              >
                {step}
              </div>
            </li>
          ))}
        </ol>
        <div className="mx-auto max-w-md">
          <Expandable label="See how the connection becomes participation">
            <ol className="mt-4">
              {CAPACITY_CHAIN.slice(4).map((step, i) => (
                <li key={step}>
                  {i > 0 && <Arrow />}
                  <div className="card-flat rounded-2xl p-4 text-center font-extrabold uppercase">{step}</div>
                </li>
              ))}
            </ol>
          </Expandable>
        </div>
      </div>

      {/* 7 — GOVERNMENT ROI */}
      <div>
        <h3 className="font-display text-2xl font-bold sm:text-3xl">What does ROI mean for Detroit?</h3>
        <p className="mt-3 max-w-3xl text-foreground/70">
          For the City of Detroit and community partners, return on investment does not necessarily mean direct profit.
          It can mean getting more community impact from dollars that are already being spent.
        </p>
        <p className="mt-3 max-w-3xl text-foreground/70">
          If residents can discover services earlier and participate more consistently, Know I&apos;m Here could help
          participating organizations improve utilization, increase engagement, reduce some forms of fragmented
          outreach, and gain better insight into how residents interact with existing resources.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CITY_BENEFITS.map((b) => (
            <div key={b} className="card-flat p-5">
              <p className="font-display text-lg font-bold uppercase leading-snug">{b}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 8 — PILOT MEASUREMENT */}
      <div>
        <h3 className="font-display text-2xl font-bold sm:text-3xl">How we will measure whether it works</h3>
        <p className="mt-3 max-w-3xl text-foreground/70">
          The first Know I&apos;m Here pilots should test a simple economic question: does making resources easier to
          discover and reach increase measurable engagement with programs that already exist?
        </p>
        <p className="mt-4 inline-flex rounded-full bg-sun/40 px-4 py-2 text-xs font-extrabold uppercase tracking-wide">
          Pilot metrics to measure — not existing performance statistics
        </p>
        <Expandable label="View metrics">
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="card-flat p-6">
              <p className="text-xs font-extrabold uppercase tracking-wide text-brand">Resident engagement</p>
              <ul className="mt-3 space-y-1.5 text-sm font-semibold">
                {RESIDENT_METRICS.map((m) => (
                  <li key={m}>• {m}</li>
                ))}
              </ul>
            </div>
            <div className="card-flat p-6">
              <p className="text-xs font-extrabold uppercase tracking-wide text-sky">Partner ROI / utilization</p>
              <ul className="mt-3 space-y-1.5 text-sm font-semibold">
                {PARTNER_METRICS.map((m) => (
                  <li key={m}>• {m}</li>
                ))}
              </ul>
            </div>
          </div>
        </Expandable>
        <p className="mt-3 text-xs text-muted-foreground">
          No results are shown here. These are the measurements a pilot would collect.
        </p>
      </div>

      {/* 9 — BUSINESS + INVESTOR CONNECTION */}
      <div>
        <h3 className="font-display text-2xl font-bold sm:text-3xl">Why this can become a sustainable business</h3>
        <p className="mt-3 max-w-3xl text-foreground/70">
          The same connection layer that creates value for residents and community partners can also support recurring
          institutional revenue.
        </p>
        <p className="mt-3 inline-flex rounded-full bg-cream px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-brand">
          Future business model — nothing here is contracted or sold today
        </p>
        <Expandable label="View potential customers and revenue streams">
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="card-flat p-6">
              <p className="text-xs font-extrabold uppercase tracking-wide text-brand">Potential paying customer groups</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {CUSTOMER_GROUPS.map((c) => (
                  <li key={c} className="chip text-sm">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-flat p-6">
              <p className="text-xs font-extrabold uppercase tracking-wide text-sky">Potential revenue streams</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {REVENUE_STREAMS.map((r) => (
                  <li key={r} className="chip text-sm">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Expandable>
        <p className="mt-5 rounded-2xl bg-aqua-soft/60 px-5 py-4 text-lg font-bold">
          The core resident experience can remain free while institutions that benefit from improved engagement help
          fund the ecosystem.
        </p>
      </div>

      {/* 10 — CLOSING */}
      <div className="rounded-xl bg-ink p-8 text-center text-cream sm:p-12">
        <p className="font-display text-2xl font-extrabold uppercase leading-tight sm:text-4xl">
          Detroit already invests in the opportunity.
        </p>
        <p className="mt-2 font-display text-2xl font-extrabold uppercase leading-tight text-sun sm:text-4xl">
          Know I&apos;m Here is designed to help more residents reach it.
        </p>
        <p className="mx-auto mt-6 font-display text-xl font-extrabold uppercase leading-tight sm:text-2xl">
          More connection. More utilization. More impact per dollar.
        </p>
        <p className="mx-auto mt-5 max-w-3xl text-cream/80">
          Know I&apos;m Here is not designed to create another layer of disconnected programming. It is designed to help
          Detroit get more measurable impact from resources, services, opportunities, and investments that already
          exist.
        </p>
      </div>
    </div>
  );
}
