import { Link, useNavigate } from "@tanstack/react-router";
import { Check, MapPin, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-store";
import { CATEGORIES, NEED_CATEGORIES, NEIGHBORHOODS } from "@/data/resources";

const RADIUS_OPTIONS = [1, 3, 5, 10];

function interestLabels(interests: string[]) {
  const source = interests.length ? interests : NEED_CATEGORIES.slice(0, 4);
  return source
    .map((id) => CATEGORIES[id as keyof typeof CATEGORIES])
    .filter(Boolean)
    .map((c) => `${c.emoji} ${c.label}`);
}

/** Big, unmistakable on/off switch. */
export function ImHereSwitch({ className = "" }: { className?: string }) {
  const { imHere, setImHere } = useApp();
  const on = imHere.on;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={on ? "Turn off I'm Here" : "Turn on I'm Here"}
      onClick={() => setImHere({ on: !on })}
      className={`inline-flex min-h-14 items-center gap-3 rounded-full border-2 px-3 py-2 text-lg font-extrabold transition-colors ${
        on ? "border-brand bg-brand text-brand-foreground" : "border-border bg-card text-foreground/70"
      } ${className}`}
    >
      <span
        className={`grid size-10 place-items-center rounded-full transition-transform ${
          on ? "translate-x-0 bg-card text-brand" : "bg-foreground/10 text-foreground/60"
        }`}
        aria-hidden
      >
        {on ? <Check className="size-6" /> : <X className="size-6" />}
      </span>
      <span className="pr-2">{on ? "I'm Here is ON" : "Turn On I'm Here"}</span>
    </button>
  );
}

/** The single primary I'm Here control: obvious on/off + expandable settings. */
export function ImHereControl() {
  const { imHere, setImHere, profile, setProfile } = useApp();
  const [openSettings, setOpenSettings] = useState(false);
  const [area, setArea] = useState("");
  const on = imHere.on;

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
              ? "Personalized opportunities can now use your selected location and interests."
              : "On when you want it. Off when you don't."}
          </p>
        </div>
        <Button
          type="button"
          variant={on ? "outline" : "default"}
          className="min-h-14 px-6 text-lg font-extrabold"
          aria-pressed={on}
          onClick={() => setImHere({ on: !on })}
        >
          {on ? "Turn Off" : "Turn On"}
        </Button>
      </div>

      <div className="border-t border-border px-5 pb-5 pt-4 sm:px-6">
        <p className="text-sm font-semibold text-foreground/70">
          Your location is only used when you choose to turn this on.
        </p>
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

              {on && (
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-xs font-extrabold uppercase text-muted-foreground">Your area</p>
                    <p className="mt-1 text-lg font-bold">{profile.neighborhood || "Detroit"}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-xs font-extrabold uppercase text-muted-foreground">What&apos;s near me</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {RADIUS_OPTIONS.map((r) => (
                        <button
                          key={r}
                          type="button"
                          tabIndex={openSettings ? undefined : -1}
                          aria-pressed={imHere.radiusMiles === r}
                          onClick={() => setImHere({ radiusMiles: r })}
                          className={`chip min-h-10 cursor-pointer px-3 ${imHere.radiusMiles === r ? "bg-ink text-cream" : ""}`}
                        >
                          {r} mi
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
              )}

              <div className="mt-4 rounded-lg border border-border bg-card p-5">
                <p className="font-bold">Prefer not to use your location?</p>
                <p className="mt-1 text-sm text-foreground/65">
                  Enter a ZIP code or choose your neighborhood instead. You can still use Know I&apos;m Here.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <label className="sr-only" htmlFor="imhere-area">ZIP code or neighborhood</label>
                  <input
                    id="imhere-area"
                    list="imhere-hoods"
                    value={area}
                    tabIndex={openSettings ? undefined : -1}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="48209 or Southwest Detroit"
                    className="min-h-12 flex-1 rounded-lg border-2 border-input bg-background px-4 text-base"
                  />
                  <datalist id="imhere-hoods">
                    {NEIGHBORHOODS.map((n) => <option key={n} value={n} />)}
                  </datalist>
                  <Button
                    type="button"
                    className="min-h-12"
                    tabIndex={openSettings ? undefined : -1}
                    onClick={() => {
                      if (!area.trim()) return;
                      setProfile({ neighborhood: area.trim() });
                      setArea("");
                    }}
                  >
                    Use this area
                  </Button>
                </div>
              </div>

              <ul className="mt-4 grid gap-2 text-sm font-semibold text-foreground/70 sm:grid-cols-2">
                <li>🔒 Location is optional.</li>
                <li>🔁 You can turn Know I&apos;m Here off anytime.</li>
                <li>⛔ Turning it off stops location-based recommendations.</li>
                <li>👤 Check-ins stay private unless you choose to share them.</li>
              </ul>
              <p className="mt-2 text-sm text-foreground/60">
                Your location is never shared automatically with family, organizations or partners.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


/** "Find What's Near Me" entry point that asks first when I'm Here is off. */
export function NearMeButton({ className = "", label = "Find What's Near Me" }: { className?: string; label?: string }) {
  const { imHere, setImHere } = useApp();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function go() {
    void navigate({ to: "/for-you" });
  }

  return (
    <>
      <Button
        type="button"
        size="lg"
        className={className}
        onClick={() => (imHere.on ? go() : setOpen(true))}
      >
        <MapPin /> {label}
      </Button>

      {open && createPortal(
        <div className="fixed inset-0 z-[100] grid place-items-center bg-ink/60 p-5" role="dialog" aria-modal="true" aria-labelledby="imhere-modal-title">
          <div className="w-full max-w-md rounded-lg bg-card p-6 text-left text-foreground shadow-lg">
            <h2 id="imhere-modal-title" className="text-2xl font-extrabold">Turn on Know I&apos;m Here to see resources around you.</h2>
            <p className="mt-2 text-foreground/70">Your location is only used when you choose to turn this on. You can turn it off anytime.</p>
            <div className="mt-6 grid gap-2">
              <Button
                type="button"
                className="min-h-14 text-lg"
                onClick={() => {
                  setImHere({ on: true });
                  setOpen(false);
                  go();
                }}
              >
                Turn On
              </Button>
              <Button type="button" variant="outline" className="min-h-12" onClick={() => setOpen(false)}>
                Not Now
              </Button>
              <Button type="button" variant="link" onClick={() => { setOpen(false); void navigate({ to: "/onboarding" }); }}>
                Enter ZIP code or choose my neighborhood instead
              </Button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
