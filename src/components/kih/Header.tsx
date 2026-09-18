import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/lib/app-store";
import mark from "@/assets/kih-mark.png";

const NAV = [
  { to: "/for-you", label: "For You" },
  { to: "/ask", label: "Ask KIH" },
  { to: "/neighborhood", label: "Neighborhood" },
  { to: "/story", label: "Our Story" },
  { to: "/partners", label: "Partners" },
] as const;

export function Header() {
  const { cycleTextSize, textSize } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-border bg-cream/95 backdrop-blur">
      <div className="container-kih flex items-center justify-between gap-3 py-3">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Know I'm Here home" onClick={() => setOpen(false)}>
          <img src={mark} alt="" width={44} height={44} className="size-11" />
          <div className="leading-none">
            <p className="font-display text-lg font-bold tracking-tight">Know I&apos;m Here</p>
            <p className="text-[11px] font-semibold text-muted-foreground">Detroit · Venture 313</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-semibold lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-full px-3 py-2 text-foreground/70 hover:bg-foreground/5"
              activeProps={{ className: "rounded-full px-3 py-2 bg-foreground/5 text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={cycleTextSize}
            aria-label="Increase text size"
            aria-pressed={textSize > 0}
            className="inline-flex min-h-11 items-center gap-1 rounded-full border-2 border-border bg-card px-3 py-2 text-xs font-extrabold"
          >
            A+{textSize > 0 && <span className="text-brand">{textSize === 1 ? "115%" : "130%"}</span>}
          </button>
          <Link to="/demo" className="btn-base btn-ink btn-sm hidden sm:inline-flex">
            View Demo
          </Link>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border-2 border-border bg-card lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t-2 border-border bg-card lg:hidden" aria-label="Mobile">
          <div className="container-kih flex flex-col gap-1 py-3">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3.5 text-lg font-bold text-foreground hover:bg-cream"
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
