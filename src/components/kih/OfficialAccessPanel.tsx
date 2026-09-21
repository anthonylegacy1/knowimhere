import { ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { CATEGORIES, type CategoryId } from "@/data/resources";

/**
 * Shelter, safety and civic access are not mapped pins.
 *
 * Know I'm Here does not hold verified street-level records or live availability
 * for shelters, crisis services or election offices, so those categories route to
 * official sources instead of placing invented markers on the map.
 */

interface OfficialLink {
  label: string;
  detail: string;
  href: string;
  internal?: boolean;
}

interface Group {
  id: Extract<CategoryId, "shelter" | "safety" | "civic">;
  intro: string;
  note?: string;
  links: OfficialLink[];
}

export const OFFICIAL_GROUPS: Group[] = [
  {
    id: "shelter",
    intro:
      "Emergency shelter, safe beds, temporary and family housing, youth shelter, domestic-violence support, homelessness services, warming and cooling centers, and crisis support.",
    note:
      "Know I'm Here does not show real-time bed availability. Contact the provider directly — shelters make all intake and placement decisions.",
    links: [
      { label: "Shelter & safe place resources", detail: "All Know I'm Here shelter routing in one place", href: "/safety#shelter", internal: true },
      { label: "313 Safe Beds", detail: "Emergency shelter and housing resources across Metro Detroit", href: "https://www.313safebeds.com/" },
      {
        label: "Detroit Housing & Revitalization Department",
        detail: "Official City housing and homelessness help",
        href: "https://detroitmi.gov/departments/housing-and-revitalization-department",
      },
      { label: "National Domestic Violence Hotline", detail: "24/7 support — 800-799-7233", href: "tel:18007997233" },
    ],
  },
  {
    id: "safety",
    intro:
      "Mental-health crisis support, violence prevention, neighborhood safety information, safe spaces, non-emergency reporting and community crisis services.",
    note: "If someone is in immediate danger or an emergency is happening now, call 911.",
    links: [
      { label: "Safety & emergency resources", detail: "Official reporting channels, alerts and crisis lines", href: "/safety", internal: true },
      { label: "988 Suicide & Crisis Lifeline", detail: "24/7 mental-health crisis support", href: "tel:988" },
      { label: "Detroit Police non-emergency", detail: "313-267-4600", href: "tel:13132674600" },
      { label: "Crime Stoppers of Michigan", detail: "Anonymous tips", href: "https://www.1800speakup.org/" },
    ],
  },
  {
    id: "civic",
    intro:
      "Register to vote, check your registration, find your polling place or early-voting location, view a sample ballot, reach your local clerk, and look up precinct or district information.",
    note:
      "Know I'm Here provides civic-access information from verified official sources and does not endorse candidates, political parties, ballot positions, or voting choices.",
    links: [
      { label: "Voting & civic access", detail: "All official election links in one place", href: "/civic", internal: true },
      { label: "Michigan Voter Information Center", detail: "Registration, polling place, sample ballot", href: "https://mvic.sos.state.mi.us/" },
      {
        label: "Detroit Department of Elections",
        detail: "Official City of Detroit election office",
        href: "https://detroitmi.gov/departments/department-elections",
      },
    ],
  },
];

export function OfficialAccessPanel({ selected }: { selected: CategoryId[] }) {
  const groups = OFFICIAL_GROUPS.filter((g) => selected.includes(g.id));
  if (groups.length === 0) return null;

  return (
    <div className="mt-6 space-y-4">
      {groups.map((g) => (
        <section key={g.id} className="card-flat p-5">
          <h2 className="font-display text-xl font-bold">
            {CATEGORIES[g.id].emoji} {CATEGORIES[g.id].label}
          </h2>
          <p className="mt-2 text-sm text-foreground/70">{g.intro}</p>
          {g.note && (
            <p className="mt-3 rounded-2xl bg-sun/30 px-4 py-3 text-sm font-bold">{g.note}</p>
          )}
          <p className="mt-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Official sources — not map pins
          </p>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {g.links.map((l) => (
              <li key={l.href}>
                {l.internal ? (
                  <Link to={l.href} className="flex min-h-14 flex-col justify-center rounded-2xl border-2 border-ink/10 bg-card px-4 py-2 hover:bg-cream">
                    <span className="font-extrabold">{l.label}</span>
                    <span className="text-xs text-foreground/70">{l.detail}</span>
                  </Link>
                ) : (
                  <a
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                    className="flex min-h-14 flex-col justify-center rounded-2xl border-2 border-ink/10 bg-card px-4 py-2 hover:bg-cream"
                  >
                    <span className="flex items-center gap-1 font-extrabold">
                      {l.label}
                      {l.href.startsWith("http") && <ExternalLink className="size-3.5 shrink-0" aria-hidden />}
                    </span>
                    <span className="text-xs text-foreground/70">{l.detail}</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export default OfficialAccessPanel;
