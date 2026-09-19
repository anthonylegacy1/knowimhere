import { ExternalLink } from "lucide-react";
import type { CityResource } from "@/data/city-resources";

export function CityResourceCard({
  resource,
  showWhy = false,
  lead,
  compact = false,
}: {
  resource: CityResource;
  showWhy?: boolean;
  lead?: string;
  compact?: boolean;
}) {
  const official = resource.badge === "Official Detroit Resource";
  return (
    <div className={`card-pop ${compact ? "p-4" : "p-5 sm:p-6"}`}>
      {lead && <p className="mb-3 text-sm font-semibold text-foreground/70">{lead}</p>}
      <span
        className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide ${
          official ? "bg-sky/15 text-sky" : "bg-mint/15 text-foreground/70"
        }`}
      >
        {resource.badge}
      </span>
      <h3 className="mt-2 font-display text-xl font-bold leading-tight">{resource.name}</h3>
      <p className="mt-1 text-sm text-foreground/70">{resource.blurb}</p>

      {showWhy && (
        <p className="mt-3 rounded-xl bg-cream px-3 py-2 text-sm text-foreground/75">
          <span className="font-bold">Why Know I&apos;m Here recommended this:</span> {resource.why}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <a href={resource.href} target="_blank" rel="noreferrer" className="btn-base btn-brand btn-sm inline-flex items-center gap-2">
          {resource.cta} <ExternalLink className="size-4" aria-hidden />
        </a>
        {resource.secondary && (
          <a
            href={resource.secondary.href}
            target="_blank"
            rel="noreferrer"
            className="btn-base btn-sm inline-flex items-center gap-2 border-2 border-border bg-card"
          >
            {resource.secondary.label} <ExternalLink className="size-4" aria-hidden />
          </a>
        )}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">You are leaving Know I&apos;m Here and opening an external resource.</p>
    </div>
  );
}
