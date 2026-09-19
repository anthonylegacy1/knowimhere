import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import type { Resource } from "@/data/resources";
import { useApp } from "@/lib/app-store";
import { persistCheckIn } from "@/lib/impact";
import { resourceCoords } from "@/lib/resource-distance";
import { VERIFICATION_POLICY, formatMiles, metersToMiles, verifyArrival, type ArrivalOutcome } from "@/lib/geo";

type Sharing = "private" | "family" | "caregiver";

export function CheckIn({ resource, onChecked }: { resource: Resource; onChecked?: () => void }) {
  const { addCheckIn, checkIns, followed, toggleFollow, toggleSaved, saved } = useApp();
  const [sharing, setSharing] = useState<Sharing>("private");
  const alreadyIn = checkIns.some((c) => c.resourceId === resource.id);
  const [done, setDone] = useState(alreadyIn);
  const [reminder, setReminder] = useState(false);
  const [checking, setChecking] = useState(false);
  const [outcome, setOutcome] = useState<ArrivalOutcome | null>(null);
  const [verified, setVerified] = useState(false);
  const destination = resourceCoords(resource);

  function record(status: "verified" | "self_reported", distanceMeters?: number) {
    void persistCheckIn({
      resourceSlug: resource.id,
      category: resource.category,
      neighborhood: resource.neighborhood,
      status,
      ...(distanceMeters !== undefined ? { distanceMeters } : {}),
    });
    addCheckIn({
      resourceId: resource.id,
      resourceName: resource.name,
      category: resource.category,
      neighborhood: resource.neighborhood,
      date: new Date().toISOString(),
      sharing,
      status,
      verificationMethod: status === "verified" ? "geolocation" : "resident_confirmation",
      ...(distanceMeters !== undefined ? { distanceAtCheckin: Math.round(distanceMeters) } : {}),
    });
    setVerified(status === "verified");
    setDone(true);
    onChecked?.();
  }

  async function verifyAndCheckIn() {
    if (!destination) {
      record("self_reported");
      return;
    }
    setChecking(true);
    setOutcome(null);
    const result = await verifyArrival(destination);
    setChecking(false);
    setOutcome(result);
    if (result.status === "verified") record("verified", result.distanceMeters);
  }

  if (!done) {
    return (
      <div className="rounded-3xl bg-brand p-6 text-brand-foreground shadow-[var(--shadow-pop-brand)]">
        <p className="font-display text-2xl font-bold">Are you here?</p>
        <p className="mt-1 text-brand-foreground/85">Check-in is private and optional. Nothing is recorded until you tap.</p>
        <button
          type="button"
          disabled={checking}
          aria-label="Check in at this resource"
          onClick={() => void verifyAndCheckIn()}
          className="btn-base anim-ring mt-5 w-full bg-card text-brand shadow-[0_5px_0_0_oklch(0_0_0/20%)] disabled:opacity-70 sm:w-auto sm:px-10 sm:text-2xl"
        >
          {checking ? "Checking your location…" : "I'M HERE ✓"}
        </button>

        {outcome && outcome.status !== "verified" && (
          <div className="mt-4 rounded-2xl bg-card p-4 text-foreground">
            <p className="font-display text-lg font-bold">
              {outcome.status === "out_of_range"
                ? "Not quite there yet"
                : outcome.status === "low_accuracy"
                  ? "We couldn't verify your location accurately enough yet."
                  : outcome.kind === "denied"
                    ? "Location access is off."
                    : "We couldn't get your location right now."}
            </p>
            <p className="mt-1 text-sm text-foreground/70">
              {outcome.status === "out_of_range"
                ? `It looks like you may not be at this location yet (about ${formatMiles(metersToMiles(outcome.distanceMeters))} away).`
                : outcome.status === "low_accuracy"
                  ? `Your location signal isn't precise enough right now (accuracy needs to be within ${VERIFICATION_POLICY.maxAccuracyMeters} meters).`
                  : "You can still check in without location verification."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {outcome.status !== "error" || outcome.kind !== "unsupported" ? (
                <button type="button" className="btn-base btn-outline btn-sm" onClick={() => void verifyAndCheckIn()}>
                  Try Again
                </button>
              ) : null}
              <button type="button" className="btn-base btn-brand btn-sm" onClick={() => record("self_reported")}>
                Check In Without Location Verification
              </button>
            </div>
            <p className="mt-2 text-xs text-foreground/60">
              A check-in without verification is saved as self-reported, never as location-verified.
            </p>
          </div>
        )}
        <p className="mt-3 text-xs text-brand-foreground/75">
          Verified check-ins compare a fresh location reading with this resource&apos;s recorded area
          (within {VERIFICATION_POLICY.proximityMeters} meters). Coordinates are not stored.
        </p>
        <fieldset className="mt-5">
          <legend className="text-sm font-bold text-brand-foreground/85">Who can see this check-in?</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {(
              [
                ["private", "Keep Private"],
                ["family", "Share With Family"],
                ["caregiver", "Share With Caregiver"],
              ] as const
            ).map(([v, l]) => (
              <label
                key={v}
                className={`cursor-pointer rounded-full border-2 px-4 py-2 text-sm font-bold ${
                  sharing === v ? "border-card bg-card text-brand" : "border-brand-foreground/40 text-brand-foreground"
                }`}
              >
                <input type="radio" name="sharing" value={v} className="sr-only" checked={sharing === v} onChange={() => setSharing(v)} />
                {l}
              </label>
            ))}
          </div>
        </fieldset>
        <p className="mt-3 text-xs text-brand-foreground/75">Private by default. Location is never shared automatically.</p>
      </div>
    );
  }

  const org = resource.organization;
  return (
    <div className="anim-pop card-pop p-6">
      <div className="text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-mint text-3xl text-card">✓</span>
        <p className="mt-3 font-display text-2xl font-bold">Thanks for checking in.</p>
        <p className="text-lg text-foreground/70">You&apos;re connected to your community.</p>
        <p className="mt-2">
          <span className={`chip text-xs font-extrabold uppercase ${verified ? "bg-mint/20" : ""}`}>
            {verified ? "Location-verified check-in" : "Self-reported check-in"}
          </span>
        </p>
        <p className="mt-1 text-xs font-semibold text-muted-foreground">
          Recorded: {resource.category} · {resource.neighborhood} · {sharing === "private" ? "Private" : `Shared with ${sharing}`}
        </p>
      </div>
      <p className="mt-6 font-display text-lg font-bold">Stay Connected</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => {
            toggleFollow(org);
            toast.success(followed.includes(org) ? `Unfollowed ${org}` : `Following ${org}`);
          }}
          className="btn-base btn-outline btn-sm justify-start"
        >
          {followed.includes(org) ? "✓ Following organization" : "Save This Organization"}
        </button>
        <button
          type="button"
          onClick={() => {
            if (!saved.includes(resource.id)) toggleSaved(resource.id);
            toast.success(`We'll show you more ${resource.category} opportunities.`);
          }}
          className="btn-base btn-outline btn-sm justify-start"
        >
          Follow Similar Opportunities
        </button>
        <button
          type="button"
          onClick={() => {
            setReminder(true);
            toast.success("Reminder set (prototype).");
          }}
          className="btn-base btn-outline btn-sm justify-start"
        >
          {reminder ? "✓ Reminder set" : "Remind Me About Future Events"}
        </button>
        <button type="button" onClick={() => toast("Thanks — feedback recorded (prototype).")} className="btn-base btn-outline btn-sm justify-start">
          Give Feedback
        </button>
      </div>
      <Link to="/for-you" className="btn-base btn-brand mt-3 w-full">
        Explore Something Nearby
      </Link>
    </div>
  );
}
