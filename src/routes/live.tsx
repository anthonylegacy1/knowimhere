import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BellRing,
  Check,
  ExternalLink,
  Eye,
  MapPin,
  Radio,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SectionHeading } from "@/components/kih/SectionHeading";
import { LiveSummary } from "@/components/kih/LiveSummary";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-store";
import {
  ALERT_RADIUS,
  LIVE_ITEMS,
  LIVE_TABS,
  REPORT_TYPES,
  REPORT_WHEN,
  SOURCE_LABEL,
  type LiveItem,
  type LiveScope,
  type LiveSource,
} from "@/data/live";

const TITLE = "KIH Live — Know What's Happening Around You | Know I'm Here";
const DESC =
  "A Know I'm Here prototype that shows how community reports, official notices, transportation disruptions and local information could come together for the area you choose.";

export const Route = createFileRoute("/live")({
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
  component: LivePage,
});

const SOURCE_STYLE: Record<LiveSource, string> = {
  community: "border-sun bg-sun/15",
  official: "border-sky/40 bg-sky/10",
  news: "border-border bg-card",
  kih: "border-brand/40 bg-brand/10",
};

const BADGE_STYLE: Record<LiveSource, string> = {
  community: "bg-sun/40 text-ink",
  official: "bg-sky/20 text-sky",
  news: "bg-background text-foreground/70",
  kih: "bg-brand/20 text-brand",
};

const SAFETY_RESOURCES = [
  {
    name: "Detroit Alerts 365",
    badge: "Official city resource",
    badgeClass: "bg-sky/20 text-sky",
    text: "Receive official Detroit-specific emergency notifications and important alerts.",
    cta: "Sign up for official alerts",
    href: "https://detroitmi.gov/departments/homeland-security-emergency-management/detroit-alerts-365",
  },
  {
    name: "Project Green Light Detroit",
    badge: "Detroit public safety",
    badgeClass: "bg-sky/20 text-sky",
    text: "Learn about Detroit's public-private real-time public-safety camera program.",
    cta: "Learn about Project Green Light",
    href: "https://detroitmi.gov/departments/police-department/project-green-light-detroit",
  },
  {
    name: "Citizen",
    badge: "External safety resource",
    badgeClass: "bg-background text-foreground/70",
    text: "View community safety and incident information available through the Citizen platform.",
    cta: "Open Citizen",
    href: "https://citizen.com",
  },
];

function PrototypeBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`chip bg-ink text-[10px] uppercase tracking-wide text-cream ${className}`}>
      Buildathon demonstration data
    </span>
  );
}

function LivePage() {
  const { profile } = useApp();
  const hood = profile.neighborhood || "Southwest Detroit";
  const [tab, setTab] = useState<LiveScope>("near");
  const [reportOpen, setReportOpen] = useState(false);
  const [reportType, setReportType] = useState<string | null>(null);
  const [where, setWhere] = useState<"approx" | "manual">("approx");
  const [when, setWhen] = useState(REPORT_WHEN[0]!);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saw, setSaw] = useState(5);
  const [responders, setResponders] = useState(2);
  const [clear, setClear] = useState(0);
  const [alertsOn, setAlertsOn] = useState(true);
  const [radius, setRadius] = useState(ALERT_RADIUS[1]!);

  const items = LIVE_ITEMS.filter((i) => i.scopes.includes(tab));

  return (
    <div className="container-kih py-8 sm:py-12">
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid size-12 place-items-center rounded-lg bg-ink text-cream"><Radio /></span>
        <div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">KIH Live</h1>
          <p className="text-lg font-bold text-foreground/70">Know what&apos;s happening around you.</p>
        </div>
        <PrototypeBadge className="ml-auto" />
      </div>
      <p className="mt-4 max-w-3xl text-lg text-foreground/70">
        See community reports, important neighborhood updates, transportation disruptions and other information relevant
        to the area you choose.
      </p>

      <div role="note" className="mt-5 rounded-lg border-2 border-brand/50 bg-brand/10 p-5">
        <p className="font-bold text-ink">
          Know I&apos;m Here is a community information and resource platform. KIH Live does not replace 911, emergency
          services, law enforcement, emergency management or official public-safety alerts.
        </p>
      </div>

      {/* PROTOTYPE PUSH ALERT */}
      <section className="mt-8" aria-labelledby="live-alert">
        <div className="rounded-lg border-2 border-sun bg-sun/20 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <BellRing className="size-5 text-ink" aria-hidden />
            <p id="live-alert" className="text-sm font-extrabold uppercase tracking-wide text-ink">⚠️ Community safety alert</p>
            <PrototypeBadge className="ml-auto" />
          </div>
          <p className="mt-3 text-lg font-bold text-ink">
            Multiple community reports indicate possible gunfire approximately 0.8 miles from your selected area.
          </p>
          <p className="mt-1 text-sm text-foreground/70">Reported 7 minutes ago.</p>
          <p className="mt-2 text-xs font-extrabold uppercase tracking-wide text-ink">Not yet verified by an official source</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button className="min-h-12" onClick={() => toast("Prototype: an approximate area view would open here.")}>View area</Button>
            <Button variant="outline" className="min-h-12" onClick={() => toast("Prototype: community updates would open here.")}>View updates</Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Community report — not an emergency notification.</p>
        </div>
      </section>

      {/* FEED */}
      <section className="mt-12" aria-labelledby="live-feed">
        <h2 id="live-feed" className="font-display text-3xl font-bold">What&apos;s happening around me?</h2>
        <p className="mt-2 text-foreground/65">Near {hood}. Prototype example information only.</p>

        <div className="mt-5 -mx-5 overflow-x-auto px-5 pb-1">
          <div className="flex w-max gap-2" role="tablist" aria-label="KIH Live filters">
            {LIVE_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`chip min-h-11 cursor-pointer px-4 ${tab === t.id ? "bg-ink text-cream" : ""}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {items.map((item) => <LiveCard key={item.id} item={item} />)}
        </ul>
        {items.length === 0 && <p className="mt-5 text-foreground/65">No prototype items in this view.</p>}

        <Button className="mt-6 min-h-14 px-6 text-base" aria-expanded={reportOpen} aria-controls="report-form" onClick={() => setReportOpen((v) => !v)}>
          + Report something
        </Button>
      </section>

      {/* REPORT FLOW */}
      {reportOpen && (
        <section id="report-form" className="mt-6 card-pop p-6 sm:p-8" aria-labelledby="report-heading">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="report-heading" className="font-display text-2xl font-bold">Community report</h2>
            <PrototypeBadge className="ml-auto" />
          </div>

          <p className="mt-5 text-xs font-extrabold uppercase tracking-wide text-sky">What are you reporting?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {REPORT_TYPES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setReportType(r.id)}
                aria-pressed={reportType === r.id}
                className={`chip min-h-11 cursor-pointer px-4 ${reportType === r.id ? "bg-ink text-cream" : "hover:bg-card"}`}
              >
                <span aria-hidden>{r.emoji}</span> {r.label}
              </button>
            ))}
          </div>

          <p className="mt-6 text-xs font-extrabold uppercase tracking-wide text-sky">Where?</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <ChoiceButton active={where === "approx"} onClick={() => setWhere("approx")} label="Use approximate current location" />
            <ChoiceButton active={where === "manual"} onClick={() => setWhere("manual")} label="Choose area manually" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Only an approximate area is shown publicly. Your precise personal location is never displayed with a report.
          </p>

          <p className="mt-6 text-xs font-extrabold uppercase tracking-wide text-sky">When?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {REPORT_WHEN.map((w) => (
              <button key={w} type="button" onClick={() => setWhen(w)} aria-pressed={when === w} className={`chip min-h-11 cursor-pointer px-4 ${when === w ? "bg-ink text-cream" : "hover:bg-card"}`}>
                {w}
              </button>
            ))}
          </div>

          <label className="mt-6 block text-xs font-extrabold uppercase tracking-wide text-sky" htmlFor="live-note">Add a short update (optional)</label>
          <textarea
            id="live-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Anything helpful for neighbors to know."
            className="mt-2 w-full rounded-2xl border-2 border-input bg-cream p-3 text-base"
          />

          <p className="mt-4 rounded-lg border border-border bg-background p-4 text-sm font-semibold text-foreground/75">
            Community reports are not official emergency reports. If you are experiencing an emergency, contact the
            appropriate emergency service.
          </p>

          <Button
            className="mt-4 min-h-14 px-6 text-base"
            disabled={!reportType}
            onClick={() => {
              setSubmitted(true);
              toast.success("Prototype community report recorded for this demonstration.");
            }}
          >
            Submit community report
          </Button>

          {submitted && (
            <div className="mt-4 rounded-lg border-2 border-sun bg-sun/15 p-4">
              <p className="font-bold text-ink">Prototype example — report recorded as community reported, not verified.</p>
              <p className="mt-1 text-sm text-foreground/70">
                {REPORT_TYPES.find((r) => r.id === reportType)?.label} · {when} ·{" "}
                {where === "approx" ? "Approximate current area" : "Manually chosen area"}
                {note.trim() ? ` · “${note.trim()}”` : ""}
              </p>
            </div>
          )}
        </section>
      )}

      {/* CORROBORATION */}
      <section className="mt-12" aria-labelledby="corroboration">
        <SectionHeading eyebrow="Community corroboration" title="Add what you know — without a public comment feed." text="Residents can add structured updates to an unverified community report. More reports never turn a community report into a verified incident." />
        <div className="mt-6 rounded-lg border-2 border-sun bg-sun/15 p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip bg-sun/40 text-[10px] uppercase tracking-wide text-ink">Community reported</span>
            <span className="chip bg-background text-[10px] uppercase tracking-wide text-muted-foreground">Not yet verified</span>
            <PrototypeBadge className="ml-auto" />
          </div>
          <h3 className="mt-3 font-display text-xl font-bold">⚠️ Possible gunfire reported · 0.8 miles away</h3>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <ChoiceButton label="I saw / heard this too" onClick={() => setSaw((n) => n + 1)} />
            <ChoiceButton label="Emergency responders present" onClick={() => setResponders((n) => n + 1)} />
            <ChoiceButton label="Area appears clear now" onClick={() => setClear((n) => n + 1)} />
            <ChoiceButton label="Add update" onClick={() => toast("Prototype: a short structured update form would open here.")} />
          </div>
          <ul className="mt-4 grid gap-1.5 text-sm font-semibold text-foreground/75">
            <li>{saw} residents reported similar activity</li>
            <li>{responders} residents report emergency responders present</li>
            <li>{clear} residents report the area appears clear now</li>
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Community reported information stays labeled as community reported until an appropriate authoritative source
            confirms it.
          </p>
        </div>
      </section>

      {/* ALERT RADIUS */}
      <section className="mt-12" aria-labelledby="alerts">
        <div className="card-flat p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="grid size-11 place-items-center rounded-lg bg-sky/15 text-sky"><MapPin /></span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wide text-sky">Prototype settings</p>
              <h2 id="alerts" className="font-display text-2xl font-bold">Safety + neighborhood alerts</h2>
            </div>
            <button
              type="button"
              onClick={() => setAlertsOn((v) => !v)}
              aria-pressed={alertsOn}
              className={`btn-base ml-auto min-h-14 px-6 ${alertsOn ? "btn-brand" : "btn-ink"}`}
            >
              {alertsOn ? "Alerts: ON ✓" : "Alerts: OFF"}
            </button>
          </div>
          <p className="mt-4 text-xs font-extrabold uppercase tracking-wide text-sky">Alert me about important activity within:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {ALERT_RADIUS.map((r) => (
              <button key={r} type="button" disabled={!alertsOn} onClick={() => setRadius(r)} aria-pressed={radius === r} className={`chip min-h-11 cursor-pointer px-4 ${radius === r && alertsOn ? "bg-ink text-cream" : ""} ${alertsOn ? "" : "opacity-50"}`}>
                {r}
              </button>
            ))}
          </div>
          <p className="mt-3 text-foreground/70">You choose the area you want Know I&apos;m Here to monitor for relevant information.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            This works with the I&apos;m Here location and personalization setting. Location-based alerts are only active
            when you turn them on.
          </p>
          <Button asChild variant="outline" className="mt-4 min-h-12"><Link to="/for-you">Open I&apos;m Here settings <ArrowRight /></Link></Button>
        </div>
      </section>

      {/* ASK KIH */}
      <section className="mt-12" aria-labelledby="ask-live">
        <SectionHeading eyebrow="Ask KIH" title="“What’s happening around me?”" text="Ask KIH can organize live information by category and always shows where each item came from." />
        <div className="mt-6"><LiveSummary /></div>
        <Button asChild variant="outline" className="mt-4 min-h-12"><Link to="/ask" search={{ q: "What's happening around me?" }}>Ask this in Ask KIH <ArrowRight /></Link></Button>
      </section>

      {/* TRUSTED CIRCLE */}
      <section className="mt-12" aria-labelledby="trusted">
        <div className="rounded-lg border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Users className="size-5 text-sky" aria-hidden />
            <h2 id="trusted" className="font-display text-2xl font-bold">Trusted Circle</h2>
            <span className="chip bg-background text-[10px] uppercase tracking-wide text-muted-foreground">Coming soon</span>
          </div>
          <p className="mt-3 text-foreground/70">
            Choose trusted family members, caregivers or contacts who can receive selected check-in updates.
          </p>
          <ol className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm font-bold text-ink">
            {["Discover an activity", "Get transportation help", "Arrive", "I'm Here ✓", "Let my trusted contact know I arrived"].map((s, i) => (
              <li key={s} className="flex items-center gap-2">
                {i > 0 && <ArrowRight className="size-4 text-sky" aria-hidden />}
                <span className="rounded-full border border-border bg-background px-3.5 py-1.5">{s}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs text-muted-foreground">
            Optional, event-based and resident-controlled. No continuous family tracking.
          </p>
        </div>
      </section>

      {/* TRUSTED SAFETY RESOURCES */}
      <section className="mt-12" aria-labelledby="trusted-safety">
        <SectionHeading
          eyebrow="Trusted safety resources"
          title="Connect directly to existing Detroit and community safety tools."
        />
        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          {SAFETY_RESOURCES.map((r) => (
            <li key={r.name} className="card-flat flex flex-col p-5">
              <span className={`chip w-fit text-[10px] uppercase tracking-wide ${r.badgeClass}`}>{r.badge}</span>
              <h3 className="mt-3 font-display text-xl font-bold leading-tight">{r.name}</h3>
              <p className="mt-2 text-sm text-foreground/70">{r.text}</p>
              <a
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-base btn-ink mt-4 min-h-12 self-start px-5 text-sm"
              >
                {r.cta} <ExternalLink className="size-4" aria-hidden />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-foreground/70">
          Know I&apos;m Here does not replace these services. KIH Live is designed as a connection layer that can help
          residents discover and navigate relevant community information and trusted resources in one experience.
        </p>
      </section>

      {/* PRINCIPLES */}
      <section className="mt-12" aria-labelledby="principles">
        <div className="rounded-lg bg-ink p-6 text-cream sm:p-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-aqua" aria-hidden />
            <h2 id="principles" className="font-display text-2xl font-extrabold">Community awareness without community surveillance.</h2>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Principle icon={<Check />} title="Resident control" text="Choose whether location-based alerts are active." />
            <Principle icon={<Eye />} title="Source transparency" text="Know whether information came from a resident, official source, news source or Know I'm Here." />
            <Principle icon={<MapPin />} title="Approximate public location" text="Community reports should not publicly expose a resident's precise personal location." />
            <Principle icon={<ShieldCheck />} title="No false verification" text="Community reports remain clearly labeled until supported by an appropriate authoritative source." />
          </div>
        </div>
      </section>

      <p className="mt-10 text-xs text-muted-foreground">
        All incidents, reports, sources and counts on this page are Buildathon demonstration data for a prototype. Know
        I&apos;m Here does not currently receive live police, emergency, government, news or public-safety data.
      </p>
    </div>
  );
}

function LiveCard({ item }: { item: LiveItem }) {
  return (
    <li className={`rounded-2xl border-2 p-5 ${SOURCE_STYLE[item.source]}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`chip text-[10px] uppercase tracking-wide ${BADGE_STYLE[item.source]}`}>{SOURCE_LABEL[item.source]}</span>
        {item.unverified && <span className="chip bg-background text-[10px] uppercase tracking-wide text-muted-foreground">Not yet verified</span>}
        <span className="chip bg-background text-[10px] uppercase tracking-wide text-muted-foreground">Prototype example</span>
      </div>
      <h3 className="mt-3 font-display text-xl font-bold leading-tight">{item.emoji} {item.title}</h3>
      <p className="mt-1 text-sm font-semibold text-foreground/70">
        {item.place}
        {item.distance ? ` · ${item.distance}` : ""} · {item.ago}
      </p>
      {item.sourceName && <p className="mt-1 text-sm font-bold text-ink">Source: {item.sourceName}</p>}
      {item.reports && <p className="mt-1 text-sm font-bold text-ink">{item.reports} community reports</p>}
      <p className="mt-2 text-sm text-foreground/70">{item.detail}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button className="min-h-12" onClick={() => toast(`Prototype: ${item.primaryCta.toLowerCase()} for “${item.title}”.`)}>{item.primaryCta}</Button>
        {item.secondaryCta && (
          <Button variant="outline" className="min-h-12" onClick={() => toast("Prototype: community updates would open here.")}>{item.secondaryCta}</Button>
        )}
      </div>
    </li>
  );
}

function ChoiceButton({ label, active, onClick }: { label: string; active?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      {...(active === undefined ? {} : { "aria-pressed": active })}
      className={`min-h-14 rounded-2xl border-2 px-4 text-left font-bold ${active ? "border-ink bg-ink text-cream" : "border-border bg-background hover:bg-card"}`}
    >
      {label}
    </button>
  );
}

function Principle({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-lg border border-cream/15 bg-cream/5 p-5">
      <span className="grid size-10 place-items-center rounded-lg bg-aqua text-ink">{icon}</span>
      <h3 className="mt-3 text-sm font-extrabold uppercase tracking-wide text-aqua">{title}</h3>
      <p className="mt-1 text-sm text-cream/80">{text}</p>
    </div>
  );
}
