import { Link, useNavigate } from "@tanstack/react-router";
import { Check, MapPin, Sparkles, X } from "lucide-react";
import { useState } from "react";
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

/** Small status control for headers / homepage strips. */
export function ImHereStatus() {
  const { imHere, setImHere } = useApp();
  return (
    <div className="card-flat flex flex-wrap items-center gap-3 p-4">
      <span className="grid size-11 place-items-center rounded-lg bg-aqua-soft text-sky" aria-hidden>
        <MapPin />
      </span>
      <div className="mr-auto">
        <p className="font-bold">
          I&apos;m Here: <span className={imHere.on ? "text-brand" : "text-foreground/60"}>{imHere.on ? "ON ✓" : "OFF"}</span>
        </p>
        <p className="text-sm text-foreground/65">On when you want it. Off when you don&apos;t.</p>
      </div>
      <Button type="button" variant={imHere.on ? "outline" : "default"} className="min-h-12" onClick={() => setImHere({ on: !imHere.on })}>
        {imHere.on ? "Turn Off" : "Turn On"}
      </Button>
    </div>
  );
}

/** Full feature panel: off state, on state, fallback, Everyday Connect callout. */
export function ImHerePanel() {
  const { imHere, setImHere, profile, setProfile } = useApp();
  const [area, setArea] = useState("");
  const on = imHere.on;
  const place = profile.neighborhood || "Detroit";

  return (
    <div className="card-flat overflow-hidden">
      <div className={`p-6 sm:p-8 ${on ? "bg-brand/5" : ""}`}>
        <p className="text-xs font-extrabold uppercase tracking-wide text-sky">Location + personalization</p>
        <h2 className="mt-2 text-3xl font-extrabold">{on ? "I'm Here Is On ✓" : "Turn On Know I'm Here"}</h2>
        <p className="mt-3 max-w-2xl text-lg text-foreground/70">
          {on
            ? "Know I'm Here can now use your location and interests to recommend nearby resources, activities and opportunities."
            : "When activated, Know I'm Here uses your location and interests to surface useful opportunities around you."}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <ImHereSwitch />
          <span className="text-base font-bold text-foreground/60">{on ? "ON" : "OFF"}</span>
        </div>
        <p className="mt-3 text-base font-semibold text-foreground/70">
          {on ? "You can turn this off anytime." : "Your location is only used when you choose to turn this on."}
        </p>

        {on && (
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs font-extrabold uppercase text-muted-foreground">Your area</p>
              <p className="mt-1 text-lg font-bold">{place}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs font-extrabold uppercase text-muted-foreground">What&apos;s near me</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {RADIUS_OPTIONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    aria-pressed={imHere.radiusMiles === r}
                    onClick={() => setImHere({ radiusMiles: r })}
                    className={`chip min-h-10 cursor-pointer px-3 ${imHere.radiusMiles === r ? "bg-ink text-cream" : ""}`}
                  >
                    {r} mi
                  </button>
                ))}
              </div>
              <p className="mt-2 text-sm text-foreground/60">Within {imHere.radiusMiles} miles</p>
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

        <div className="mt-6 flex flex-wrap gap-3">
          {on ? (
            <>
              <Button asChild className="min-h-12"><Link to="/for-you"><Sparkles /> See What&apos;s Around Me</Link></Button>
              <Button asChild variant="outline" className="min-h-12"><Link to="/onboarding">Change My Preferences</Link></Button>
              <Button type="button" variant="outline" className="min-h-12" onClick={() => setImHere({ on: false })}>
                Turn Off I&apos;m Here
              </Button>
            </>
          ) : (
            <Button asChild variant="outline" className="min-h-12"><Link to="/onboarding">Change My Interests</Link></Button>
          )}
        </div>

        <div className="mt-7 rounded-lg border border-border bg-card p-5">
          <p className="font-bold">Prefer not to use your location?</p>
          <p className="mt-1 text-sm text-foreground/65">Enter a ZIP code instead, or choose your neighborhood. You can still use Know I&apos;m Here.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <label className="sr-only" htmlFor="imhere-area">ZIP code or neighborhood</label>
            <input
              id="imhere-area"
              list="imhere-hoods"
              value={area}
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

        <ul className="mt-6 grid gap-2 text-sm font-semibold text-foreground/70 sm:grid-cols-2">
          <li>🔒 Location is optional.</li>
          <li>🔁 You can turn Know I&apos;m Here off anytime.</li>
          <li>⛔ Turning it off stops location-based recommendations.</li>
          <li>👤 Check-ins stay private unless you choose to share them.</li>
        </ul>
        <p className="mt-3 text-sm text-foreground/60">
          Your location is never shared automatically with family, organizations or partners.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-border bg-ink p-5 text-cream">
        <div className="mr-auto">
          <p className="font-bold">Need help using this feature?</p>
          <p className="text-sm text-cream/70">Everyday Connect can help you learn how location, maps and phone settings work.</p>
        </div>
        <Button asChild className="min-h-12 bg-aqua text-ink hover:bg-aqua/90"><Link to="/learn">Learn With Everyday Connect →</Link></Button>
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

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-5" role="dialog" aria-modal="true" aria-labelledby="imhere-modal-title">
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
        </div>
      )}
    </>
  );
}
