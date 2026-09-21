import { Link } from "@tanstack/react-router";
import { ChevronDown, Lock, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import mark from "@/assets/kih-mark.png";
import { Button } from "@/components/ui/button";
import { AccessibilityPanel } from "@/components/kih/AccessibilityPanel";
import { setMenuOpen } from "@/lib/menu-state";

type NavItem = { to: string; hash?: string; label: string };

const NAV = [
  { to: "/story", label: "Vision" },
  { to: "/demo", label: "KIH Resident Funnel" },
] as const;

const GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "Resident experience",
    items: [
      { to: "/", hash: "community-public-health", label: "Community + Public Health" },
      { to: "/for-you", label: "For You" },
      { to: "/", hash: "nearby-map", label: "Map What's Around Me" },
      { to: "/ask", label: "Ask KIH" },
      { to: "/", hash: "help-me-get-there", label: "Help Me Get There" },
    ],
  },
  {
    title: "Trust + adoption",
    items: [
      { to: "/", hash: "fast-freddy", label: "Fast Freddy Experience" },
      { to: "/learn", label: "Everyday Connect Learning" },
    ],
  },
  {
    title: "Detroit impact",
    items: [
      { to: "/partners", label: "Partner Impact" },
      { to: "/sponsorship", label: "Partners + Sponsorship" },
      { to: "/", hash: "detroit-economic-impact", label: "Detroit Economic Impact & ROI" },
      { to: "/", hash: "discover-detroit", label: "Discover Detroit" },
    ],
  },
];

const ABOUT_MORE: NavItem[] = [
  { to: "/story", label: "Vision" },
  { to: "/demo", label: "KIH Resident Funnel" },
  { to: "/", hash: "privacy-ai", label: "Privacy + Responsible AI" },
  { to: "/live", label: "KIH Live" },
  { to: "/community-health", label: "Community + Public Health page" },
  { to: "/neighborhood", label: "My Neighborhood" },
  { to: "/", hash: "im-here", label: "I'm Here" },
  { to: "/opportunities", label: "Education & Youth" },
  { to: "/work-after-55", label: "Work After 55" },
  { to: "/civic", label: "Voting & Civic Access" },
  { to: "/safety", label: "Safety & Emergency Resources" },
  { to: "/help", label: "Watch & Learn" },
  { to: "/privacy", label: "Privacy" },
  { to: "/changelog", label: "Changelog" },
];

const LINK_CLASS =
  "flex min-h-11 items-center rounded-md px-3 py-2 text-[15px] font-bold leading-tight text-foreground hover:bg-secondary";

export function Header() {
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(open);
    return () => setMenuOpen(false);
  }, [open]);

  const close = () => {
    setOpen(false);
    setAboutOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
      <div className="container-kih flex items-center justify-between gap-3 py-3">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Know I'm Here home" onClick={close}>
          <img src={mark} alt="" width={44} height={44} className="size-11" />
          <div className="leading-none">
            <p className="font-display text-lg font-bold tracking-tight">Know I&apos;m Here</p>
            <p className="text-[11px] font-semibold text-muted-foreground">Detroit</p>
          </div>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 text-sm font-semibold md:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-2 text-foreground/70 hover:bg-secondary"
              activeProps={{ className: "rounded-md px-3 py-2 bg-secondary text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <AccessibilityPanel />
          <Button
            type="button"
            variant="outline"
            className="hidden min-h-11 gap-2 rounded-full px-4 font-bold md:inline-flex"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
            Menu
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-11 rounded-full md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <nav className="max-h-[80vh] overflow-y-auto border-t border-border bg-card" aria-label="Site">
          <div className="container-kih py-2 md:grid md:grid-cols-3 md:gap-x-6">
            {GROUPS.map((group) => (
              <div key={group.title} className="border-b border-border py-2 last:border-b-0 md:border-b-0">
                <p className="px-3 pb-1 text-[11px] font-extrabold uppercase tracking-wider text-brand">{group.title}</p>
                <div className="flex flex-col">
                  {group.items.map((n) => (
                    <Link
                      key={n.label}
                      to={n.to}
                      {...(n.hash ? { hash: n.hash } : {})}
                      onClick={close}
                      className={LINK_CLASS}
                    >
                      {n.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="border-t border-border py-2 md:col-span-3">
              <button
                type="button"
                onClick={() => setAboutOpen((v) => !v)}
                aria-expanded={aboutOpen}
                aria-controls="about-more-links"
                className="flex min-h-11 w-full items-center justify-between rounded-md px-3 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground hover:bg-secondary"
              >
                About + more
                <ChevronDown className={`size-4 transition-transform ${aboutOpen ? "rotate-180" : ""}`} aria-hidden />
              </button>
              {aboutOpen && (
                <div id="about-more-links" className="flex flex-col md:grid md:grid-cols-3 md:gap-x-6">
                  {ABOUT_MORE.map((n) => (
                    <Link
                      key={n.label}
                      to={n.to}
                      {...(n.hash ? { hash: n.hash } : {})}
                      onClick={close}
                      className={`${LINK_CLASS} font-semibold`}
                    >
                      {n.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-border py-2 md:col-span-3">
              <Link
                to="/admin/analytics"
                onClick={close}
                className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <Lock className="size-4" aria-hidden /> Admin Analytics
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
