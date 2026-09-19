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
  { to: "/for-you", label: "For You" },
  { to: "/ask", label: "Ask KIH" },
  { to: "/live", label: "KIH Live" },
  { to: "/opportunities", label: "Education & Youth" },
  { to: "/work-after-55", label: "Work After 55" },
  { to: "/learn", label: "Everyday Connect Learning" },
  { to: "/neighborhood", label: "My Neighborhood" },
  { to: "/", hash: "detroit-economic-impact", label: "Detroit Economic Impact" },
  { to: "/partners", label: "Partner Impact" },
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
          <Link to="/demo" className="btn-base btn-ink btn-sm hidden sm:inline-flex">
            View Demo
          </Link>
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
        <nav className="border-t border-border bg-card md:hidden" aria-label="Mobile">
          <div className="container-kih flex flex-col gap-1 py-3">
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
            <Link to="/demo" onClick={() => setOpen(false)} className="btn-base btn-brand mt-2">
              View Demo Experience
            </Link>
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
