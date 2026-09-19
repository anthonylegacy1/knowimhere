import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import mark from "@/assets/kih-mark.png";
import { Button } from "@/components/ui/button";
import { AccessibilityPanel } from "@/components/kih/AccessibilityPanel";

const NAV = [
  { to: "/story", label: "Vision" },
  { to: "/demo", label: "KIH Resident Funnel" },
] as const;

const MORE_NAV = [
  { to: "/community-health", label: "Community + Public Health" },
  { to: "/partners", label: "Partner Impact" },
  { to: "/sponsorship", label: "Partners + Sponsorship" },
  { to: "/", hash: "detroit-economic-impact", label: "Detroit Economic Impact" },
  { to: "/learn", label: "Everyday Connect Learning" },
  { to: "/", hash: "fast-freddy", label: "Fast Freddy Experience" },
  { to: "/for-you", label: "For You" },
  { to: "/ask", label: "Ask KIH" },
  { to: "/", hash: "help-me-get-there", label: "Help Me Get There" },
  { to: "/neighborhood", label: "My Neighborhood" },
  { to: "/live", label: "KIH Live" },
  { to: "/", hash: "im-here", label: "I'm Here" },
  { to: "/opportunities", label: "Education & Youth" },
  { to: "/work-after-55", label: "Work After 55" },
  { to: "/", hash: "discover-detroit", label: "Discover Detroit" },
] as const;


export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
      <div className="container-kih flex items-center justify-between gap-3 py-3">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Know I'm Here home" onClick={() => setOpen(false)}>
          <img src={mark} alt="" width={44} height={44} className="size-11" />
          <div className="leading-none">
            <p className="font-display text-lg font-bold tracking-tight">Know I&apos;m Here</p>
            <p className="text-[11px] font-semibold text-muted-foreground">Detroit · Venture 313</p>
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
        <nav className="border-t border-border bg-card" aria-label="Site">
          <div className="container-kih flex flex-col gap-1 py-3 md:grid md:grid-cols-3 md:gap-x-4 lg:grid-cols-4">
            {[...NAV, ...MORE_NAV].map((n) => (
              <Link
                key={n.label}
                to={n.to}
                {...("hash" in n ? { hash: n.hash } : {})}
                onClick={() => setOpen(false)}
                className="rounded-md px-4 py-3 text-base font-bold text-foreground hover:bg-secondary"
              >
                {n.label}
              </Link>

            ))}
            <div className="mt-2 flex flex-wrap gap-3 px-4 text-sm font-semibold text-muted-foreground">
              <Link to="/help" onClick={() => setOpen(false)}>Watch &amp; Learn</Link>
              <Link to="/privacy" onClick={() => setOpen(false)}>Privacy</Link>
              <Link to="/changelog" onClick={() => setOpen(false)}>Changelog</Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
