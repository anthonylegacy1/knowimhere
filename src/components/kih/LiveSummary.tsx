import { Link } from "@tanstack/react-router";
import { Radio, ArrowRight } from "lucide-react";
import { LIVE_ASK_SUMMARY } from "@/data/live";

export function LiveSummary() {
  return (
    <div className="card-flat p-5">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-lg bg-sky/15 text-sky"><Radio className="size-5" /></span>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wide text-sky">KIH Live</p>
          <h3 className="text-lg font-extrabold">Here&apos;s what&apos;s happening nearby</h3>
        </div>
      </div>
      <ul className="mt-4 grid gap-2">
        {LIVE_ASK_SUMMARY.map((row) => (
          <li key={row.label} className="rounded-lg border border-border bg-background p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wide text-ink">{row.label}</span>
              <span className="chip bg-card text-[10px] uppercase tracking-wide text-muted-foreground">{row.source}</span>
            </div>
            <p className="mt-1 text-sm text-foreground/70">{row.text}</p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">
        Buildathon demonstration data. Community reports are not verified by an official source. KIH Live does not
        replace 911 or official public-safety alerts.
      </p>
      <Link to="/live" className="btn-base btn-ink btn-sm mt-4">Open KIH Live <ArrowRight className="size-4" /></Link>
    </div>
  );
}
