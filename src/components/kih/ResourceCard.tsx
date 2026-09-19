import { Link } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, ChevronDown, MapPin, Clock, Accessibility, Bus } from "lucide-react";
import { useState } from "react";
import { CATEGORIES, type Resource } from "@/data/resources";
import { useApp } from "@/lib/app-store";
import { useLocationState } from "@/lib/location";
import { distanceToResource, resourceCoords } from "@/lib/resource-distance";
import { toast } from "sonner";
import { CallButton } from "@/components/kih/CallButton";
import { verifiedContact, verifiedPhone } from "@/data/resource-contacts";

const TONE: Record<string, string> = {
  mint: "bg-mint/15 text-mint",
  sun: "bg-sun/40 text-foreground",
  brand: "bg-brand/15 text-brand",
  sky: "bg-sky/15 text-sky",
  plum: "bg-plum/15 text-plum",
};

export function ResourceCard({
  resource,
  reasons = [],
  compact = false,
  onGetThere,
  scheduleNote,
  availabilityUnconfirmed = false,
}: {
  resource: Resource;
  reasons?: string[] | undefined;
  compact?: boolean | undefined;
  onGetThere?: ((r: Resource) => void) | undefined;
  /** Validated date/day/time for a date-specific question. */
  scheduleNote?: string | undefined;
  availabilityUnconfirmed?: boolean | undefined;
}) {
  const { saved, toggleSaved, markInterested, dismiss, interested } = useApp();
  const { activeCoords } = useLocationState();
  const live = distanceToResource(resource, activeCoords);
  const [why, setWhy] = useState(false);
  const cat = CATEGORIES[resource.category];
  const isSaved = saved.includes(resource.id);
  const isInterested = interested.includes(resource.id);
  const phone = verifiedPhone(resource.id);
  const contact = verifiedContact(resource.id);
  // An online-only resource has nowhere to travel to, so no Get There action.
  const hasPlace = resourceCoords(resource) !== null;

  return (
    <article className="card-pop flex flex-col p-5 transition-transform hover:-translate-y-0.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-3xl" aria-hidden>
          {cat.emoji}
        </span>
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${TONE[cat.tone]}`}>{cat.label}</span>
      </div>
      <h3 className="mt-3 font-display text-xl font-bold leading-tight">{resource.name}</h3>
      {resource.sourceLabel && (
        <p className="mt-1 text-[11px] font-extrabold uppercase tracking-wide text-mint">{resource.sourceLabel}</p>
      )}
      <p className="mt-1 text-sm text-foreground/60">{resource.summary}</p>

      {scheduleNote && (
        <p className="mt-2 rounded-xl bg-sun/40 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-foreground">
          {scheduleNote}
        </p>
      )}
      {!scheduleNote && availabilityUnconfirmed && (
        <p className="mt-2 text-xs font-bold text-muted-foreground">
          Availability not confirmed — check current hours with provider.
        </p>
      )}


      <div className="mt-3 flex flex-wrap gap-1.5">
        {live ? (
          <span className="chip" title="Approximate distance from your area to this neighborhood">
            <MapPin className="size-3.5" aria-hidden /> ~{live.miles.toFixed(1)} mi away
          </span>
        ) : (
          resource.distanceMiles > 0 && (
            <span className="chip">
              <MapPin className="size-3.5" aria-hidden /> {resource.distanceMiles} mi
            </span>
          )
        )}
        <span className="chip">
          <Clock className="size-3.5" aria-hidden /> {(resource.whenLabel.split("•")[0] ?? "").trim()}
        </span>
        <span className="chip chip-sun">{resource.cost}</span>
        {resource.accessibility[0] && (
          <span className="chip">
            <Accessibility className="size-3.5" aria-hidden /> {resource.accessibility[0]}
          </span>
        )}
        {resource.transitFriendly && resource.transportation[0] && (
          <span className="chip">
            <Bus className="size-3.5" aria-hidden /> {resource.transportation[0]}
          </span>
        )}
      </div>

      {!compact && (
        <p className="mt-3 text-xs font-semibold text-muted-foreground">
          {resource.location} · {resource.organization}
        </p>
      )}

      {reasons.length > 0 && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setWhy((v) => !v)}
            aria-expanded={why}
            className="inline-flex min-h-10 items-center gap-1 text-sm font-bold text-sky"
          >
            Why am I seeing this? <ChevronDown className={`size-4 transition-transform ${why ? "rotate-180" : ""}`} />
          </button>
          {why && (
            <div className="card-flat mt-2 p-3 text-sm">
              <ul className="space-y-1.5 font-medium text-foreground/75">
                {reasons.map((r) => (
                  <li key={r} className="flex gap-2">
                    <span className="text-mint">✓</span> {r}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                Prototype recommendation logic
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        {phone && <CallButton slug={resource.id} name={resource.name} size="sm" className="col-span-2" />}
        <Link
          to="/resource/$id"
          params={{ id: resource.id }}
          className={`btn-base btn-ink btn-sm${hasPlace ? "" : " col-span-2"}`}
        >
          View Details
        </Link>
        {!hasPlace ? null : onGetThere ? (
          <button type="button" onClick={() => onGetThere(resource)} className="btn-base btn-brand btn-sm">
            Get There
          </button>
        ) : (
          <Link to="/resource/$id" params={{ id: resource.id }} search={{ step: "get-there" }} className="btn-base btn-brand btn-sm">
            Get There
          </Link>
        )}
      </div>
      {resource.links?.map((l) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-bold text-sky underline-offset-4 hover:underline"
        >
          {l.label} ↗
        </a>
      ))}
      {contact?.website && !resource.links?.length && (
        <a
          href={contact.website}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-bold text-sky underline-offset-4 hover:underline"
        >
          Visit Website ↗
        </a>
      )}
      {!compact && (
        <div className="mt-2 flex flex-wrap items-center gap-x-1 gap-y-1 text-sm font-bold">
          <button
            type="button"
            onClick={() => {
              toggleSaved(resource.id);
              toast(isSaved ? "Removed from saved" : "Saved for later");
            }}
            className="inline-flex min-h-10 items-center gap-1 rounded-full px-3 text-foreground/70 hover:bg-foreground/5"
            aria-pressed={isSaved}
          >
            {isSaved ? <BookmarkCheck className="size-4 text-brand" /> : <Bookmark className="size-4" />}
            {isSaved ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => {
              markInterested(resource.id);
              toast.success("Great — we'll show you more like this.");
            }}
            className={`inline-flex min-h-10 items-center rounded-full px-3 hover:bg-foreground/5 ${isInterested ? "text-mint" : "text-foreground/70"}`}
          >
            {isInterested ? "✓ Interested" : "I'm Interested"}
          </button>
          <button
            type="button"
            onClick={() => {
              dismiss(resource.id);
              toast("Got it. We'll show fewer like this.");
            }}
            className="inline-flex min-h-10 items-center rounded-full px-3 text-muted-foreground hover:bg-foreground/5"
          >
            Not For Me
          </button>
        </div>
      )}
    </article>
  );
}
