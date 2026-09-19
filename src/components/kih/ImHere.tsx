import { Link, useNavigate } from "@tanstack/react-router";
import { Check, Loader2, MapPin, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-store";
import { useLocationState } from "@/lib/location";
import { CATEGORIES, NEED_CATEGORIES, NEIGHBORHOODS } from "@/data/resources";

export const RADIUS_OPTIONS: (number | "all")[] = [1, 3, 5, "all"];

export function radiusLabel(r: number | "all") {
  return r === "all" ? "All nearby" : `Within ${r} mile${r === 1 ? "" : "s"}`;
}

function interestLabels(interests: string[]) {
  const source = interests.length ? interests : NEED_CATEGORIES.slice(0, 4);
  return source
    .map((id) => CATEGORIES[id as keyof typeof CATEGORIES])
    .filter(Boolean)
    .map((c) => `${c.emoji} ${c.label}`);
}

/** Subtle status indicator. No animation, no tracking imagery. */
export function ImHereBadge({ className = "" }: { className?: string }) {
  const { on, areaLabel } = useLocationState();
  if (!on) return null;
  return (
    <span className={`chip text-xs font-bold ${className}`}>
      <MapPin className="size-3.5" aria-hidden /> I&apos;m Here · On{areaLabel ? ` · ${areaLabel}` : ""}
    </span>
  );
}

/** Pre-permission explanation. The browser prompt only fires after "Use my location". */
function PrePermissionDialog({
  onUse,
  onManual,
  onClose,
  busy,
}: {
  onUse: () => void;
  onManual: () => void;
  onClose: () => void;
  busy: boolean;
}) {
  return createPortal(
    <div className="fixed inset-0 z-[100] grid place-items-center bg-ink/60 p-5" role="dialog" aria-modal="true" aria-labelledby="use-location-title">
      <div className="w-full max-w-md rounded-lg bg-card p-6 text-left text-foreground shadow-lg">
        <h2 id="use-location-title" className="font-display text-2xl font-extrabold">Use your location?</h2>
        <p className="mt-2 text-foreground/70">
          Know I&apos;m Here can use your current area to show nearby resources, opportunities and neighborhood
          information. Precise location is not made public. You can turn it off anytime.
        </p>
        <div className="mt-6 grid gap-2">
          <Button type="button" className="min-h-14 text-lg" disabled={busy} onClick={onUse} aria-label="Turn on location personalization">
            {busy ? <><Loader2 className="size-5 animate-spin" /> Getting your location…</> : "Use My Location"}
          </Button>
          {busy && (
            <p className="text-center text-sm font-semibold text-foreground/70" role="status" aria-live="polite">
              This may take a few seconds, especially indoors.
            </p>
          )}
          <Button type="button" variant="outline" className="min-h-12" disabled={busy} onClick={onClose}>Not Now</Button>
          <Button type="button" variant="link" onClick={onManual} aria-label="Choose neighborhood manually">
            Choose my area manually instead
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** ZIP / neighborhood entry. Works with location permission off. */
export function AreaPicker({ onDone, compact = false }: { onDone?: () => void; compact?: boolean }) {
  const { setManualArea, savedArea, clearSavedArea } = useLocationState();
  const { setProfile } = useApp();
  const [area, setArea] = useState("");
  const [invalid, setInvalid] = useState(false);

  function apply() {
    const ok = setManualArea(area);
    setInvalid(!ok);
    if (ok) {
      setProfile({ neighborhood: area.trim() });
      setArea("");
      onDone?.();
    }
  }

  return (
    <div className={compact ? "" : "rounded-lg border border-border bg-card p-5"}>
      {!compact && <p className="font-display text-lg font-bold">Choose your area</p>}
      <p className="mt-1 text-sm text-foreground/65">
        Enter a Detroit ZIP code or neighborhood. Precise location is not required to use Know I&apos;m Here.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <label className="sr-only" htmlFor="imhere-area">ZIP code or neighborhood</label>
        <input
          id="imhere-area"
          list="imhere-hoods"
          value={area}
          onChange={(e) => { setArea(e.target.value); setInvalid(false); }}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); apply(); } }}
          placeholder="48209 or Southwest Detroit"
          className="min-h-12 flex-1 rounded-lg border-2 border-input bg-background px-4 text-base"
        />
        <datalist id="imhere-hoods">
          {NEIGHBORHOODS.map((n) => <option key={n} value={n} />)}
        </datalist>
        <Button type="button" className="min-h-12" onClick={apply}>Use This Area</Button>
      </div>
      {invalid && (
        <p className="mt-2 text-sm font-bold text-brand">
          We don&apos;t have that area yet. Try a Detroit ZIP code (for example 48204) or a neighborhood name.
        </p>
      )}
      {savedArea && (
        <button
          type="button"
          onClick={clearSavedArea}
          className="mt-3 inline-flex min-h-11 items-center text-sm font-bold text-sky underline-offset-4 hover:underline"
        >
          Clear saved area ({savedArea.label})
        </button>
      )}
    </div>
  );
}

function ErrorPanel() {
  const { error, requestGps, phase, staleReading } = useLocationState();
  const [manual, setManual] = useState(false);
  if (!error) return null;
  const retryable = error.kind !== "unsupported";
  const trouble = error.kind === "timeout" || error.kind === "unavailable";
  return (
    <div className="mt-4 rounded-lg border-2 border-sun bg-sun/15 p-4" role="status" aria-live="polite">
      <p className="font-bold">{error.message}</p>
      {trouble && !staleReading && (
        <p className="mt-1 text-sm font-semibold text-foreground/70">
          We&apos;re having trouble getting a precise location right now.
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {retryable && (
          <Button type="button" variant="outline" className="min-h-12" disabled={phase === "requesting"} onClick={() => void requestGps()}>
            {phase === "requesting" ? <><Loader2 className="size-5 animate-spin" /> Getting your location…</> : staleReading ? "Try Again" : "Try Location Again"}
          </Button>
        )}
        <Button type="button" className="min-h-12" onClick={() => setManual((v) => !v)}>
          {staleReading || !retryable ? "Choose Area Manually" : "Use My Area Instead"}
        </Button>
      </div>
      {manual && <div className="mt-3"><AreaPicker compact onDone={() => setManual(false)} /></div>}
    </div>
  );
}

/** Compact on/off switch used in tight spots. */
export function ImHereSwitch({ className = "" }: { className?: string }) {
  const { on, turnOff } = useLocationState();
  const [ask, setAsk] = useState(false);
  const { requestGps, phase } = useLocationState();
  return (
    <>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={on ? "Turn off location personalization" : "Turn on location personalization"}
        onClick={() => (on ? turnOff() : setAsk(true))}
        className={`inline-flex min-h-14 items-center gap-3 rounded-full border-2 px-3 py-2 text-lg font-extrabold transition-colors ${
          on ? "border-brand bg-brand text-brand-foreground" : "border-border bg-card text-foreground/70"
        } ${className}`}
      >
        <span
          className={`grid size-10 place-items-center rounded-full ${on ? "bg-card text-brand" : "bg-foreground/10 text-foreground/60"}`}
          aria-hidden
        >
          {on ? <Check className="size-6" /> : <X className="size-6" />}
        </span>
        <span className="pr-2">{on ? "I'm Here is ON" : "Turn On I'm Here"}</span>
      </button>
      {ask && (
        <PrePermissionDialog
          busy={phase === "requesting"}
          onClose={() => setAsk(false)}
          onManual={() => setAsk(false)}
          onUse={() => void requestGps().then((ok) => { if (ok) setAsk(false); })}
        />
      )}
    </>
  );
}

/** The primary I'm Here control: real permission flow, manual fallback, off switch. */
export function ImHereControl() {
  const {
    on, mode, precise, areaLabel, phase, requestGps, turnOff, radiusMiles, setRadius, error, savedArea, lowConfidence,
  } = useLocationState();
  const { profile } = useApp();
  const [ask, setAsk] = useState(false);
  const [manual, setManual] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  return (
    <div className="card-flat overflow-hidden">
      <div className={`flex flex-wrap items-center gap-4 p-5 sm:p-6 ${on ? "bg-brand/5" : ""}`}>
        <span
          className={`grid size-12 place-items-center rounded-lg ${on ? "bg-brand text-brand-foreground" : "bg-foreground/10 text-foreground/60"}`}
          aria-hidden
        >
          {on ? <Check className="size-7" /> : <MapPin className="size-6" />}
        </span>
        <div className="mr-auto min-w-[14rem]">
          <p className="text-xl font-extrabold">
            I&apos;m Here: <span className={on ? "text-brand" : "text-foreground/60"}>{on ? "ON ✓" : "OFF"}</span>
          </p>
          <p className="mt-1 text-base text-foreground/70">
            {on
              ? precise
                ? "Using your current area to personalize nearby resources."
                : "Using the area you selected to personalize nearby resources."
              : "Turn on location to personalize nearby resources and opportunities."}
          </p>
          {phase === "requesting" && (
            <p className="mt-2 text-sm font-bold text-foreground/70" role="status" aria-live="polite">
              Getting your location… This may take a few seconds, especially indoors.
            </p>
          )}
          {on && precise && lowConfidence && (
            <p className="mt-2 text-sm font-semibold text-foreground/70">
              This is an approximate location reading — good enough to show what&apos;s nearby, but a check-in still
              needs a precise reading.
            </p>
          )}
          {on && areaLabel && (
            <p className="mt-2 text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
              Your area · <span className="text-foreground">{areaLabel}</span>
              <span className="ml-2 font-bold normal-case tracking-normal text-foreground/60">
                {precise ? "Current location" : "Selected area"}
              </span>
            </p>
          )}
        </div>

        {on ? (
          <div className="flex flex-wrap gap-2">
            {precise && (
              <Button
                type="button"
                variant="outline"
                className="min-h-14"
                disabled={phase === "requesting"}
                aria-label="Update current location"
                onClick={() => void requestGps()}
              >
                {phase === "requesting" ? <Loader2 className="size-5 animate-spin" /> : null} Update My Location
              </Button>
            )}
            <Button type="button" variant="outline" className="min-h-14" onClick={() => setManual((v) => !v)} aria-label="Choose neighborhood manually">
              Change Area
            </Button>
            <Button type="button" className="min-h-14" onClick={turnOff} aria-label="Turn off location personalization">
              Turn Off
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Button type="button" className="min-h-14 px-6 text-lg font-extrabold" onClick={() => setAsk(true)} aria-label="Turn on location personalization">
              Turn On I&apos;m Here
            </Button>
            <Button type="button" variant="outline" className="min-h-14" onClick={() => setManual((v) => !v)} aria-label="Choose neighborhood manually">
              Choose Area Manually
            </Button>
          </div>
        )}
      </div>

      <div className="border-t border-border px-5 pb-5 pt-4 sm:px-6">
        <p className="text-sm font-semibold text-foreground/70">
          Know I&apos;m Here uses your location to personalize nearby information. Precise location is not made public,
          and you can turn this off anytime.
        </p>

        {error && <ErrorPanel />}
        {manual && <div className="mt-4"><AreaPicker onDone={() => setManual(false)} /></div>}

        <button
          type="button"
          className="mt-3 inline-flex min-h-12 items-center gap-2 rounded-lg px-1 text-base font-bold text-sky underline-offset-4 hover:underline"
          aria-expanded={openSettings}
          aria-controls="imhere-settings"
          onClick={() => setOpenSettings((v) => !v)}
        >
          Location &amp; Personalization Settings {openSettings ? "↑" : "↓"}
        </button>

        <div
          id="imhere-settings"
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${openSettings ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"}`}
          aria-hidden={!openSettings}
        >
          <div className="overflow-hidden">
            <div className="pt-4">
              <Button asChild variant="outline" className="min-h-12" tabIndex={openSettings ? undefined : -1}>
                <Link to="/onboarding">Change My Interests</Link>
              </Button>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-xs font-extrabold uppercase text-muted-foreground">Your area</p>
                  <p className="mt-1 text-lg font-bold">{areaLabel ?? savedArea?.label ?? "Not set"}</p>
                  <p className="mt-1 text-xs text-foreground/60">
                    {mode === "gps" ? "Current location" : mode === "manual" ? "Selected area" : "Location is off"}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-xs font-extrabold uppercase text-muted-foreground">What&apos;s near me</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {RADIUS_OPTIONS.map((r) => (
                      <button
                        key={String(r)}
                        type="button"
                        tabIndex={openSettings ? undefined : -1}
                        aria-pressed={radiusMiles === r}
                        onClick={() => setRadius(r)}
                        className={`chip min-h-10 cursor-pointer px-3 ${radiusMiles === r ? "bg-ink text-cream" : ""}`}
                      >
                        {r === "all" ? "All nearby" : `${r} mi`}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-xs font-extrabold uppercase text-muted-foreground">Interests</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {interestLabels(profile.interests).map((label) => (
                      <li key={label} className="chip bg-background text-xs">{label}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4">
                <AreaPicker />
              </div>

              <ul className="mt-4 grid gap-2 text-sm font-semibold text-foreground/70 sm:grid-cols-2">
                <li>🔒 Location is optional.</li>
                <li>🔁 You can turn Know I&apos;m Here off anytime.</li>
                <li>⛔ Turning it off clears your current location from this session.</li>
                <li>👤 Check-ins stay private unless you choose to share them.</li>
              </ul>
              <p className="mt-2 text-sm text-foreground/60">
                Precise location is kept for this browser session only. Your location is never shared automatically
                with family, organizations or partners.
              </p>
            </div>
          </div>
        </div>
      </div>

      {ask && (
        <PrePermissionDialog
          busy={phase === "requesting"}
          onClose={() => setAsk(false)}
          onManual={() => { setAsk(false); setManual(true); }}
          onUse={() => void requestGps().then((ok) => { if (ok) setAsk(false); })}
        />
      )}
    </div>
  );
}

/** "Find What's Near Me" entry point that asks first when I'm Here is off. */
export function NearMeButton({
  className = "",
  label = "Find What's Near Me",
  stayHere = false,
}: {
  className?: string;
  label?: string;
  /** Keep the resident on the current page instead of sending them to For You Today. */
  stayHere?: boolean;
}) {
  const { on, requestGps, phase } = useLocationState();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function go() {
    if (stayHere) return;
    void navigate({ to: "/for-you" });
  }

  return (
    <>
      <Button type="button" size="lg" className={className} onClick={() => (on ? go() : setOpen(true))}>
        <MapPin /> {label}
      </Button>

      {open && (
        <PrePermissionDialog
          busy={phase === "requesting"}
          onClose={() => setOpen(false)}
          onManual={() => { setOpen(false); go(); }}
          onUse={() => void requestGps().then(() => { setOpen(false); go(); })}
        />
      )}
    </>
  );
}
