import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronUp, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-store";

const REMEMBERS = [
  "Your interests",
  "Preferred resource categories",
  "Life stage",
  "ZIP or neighborhood",
  "Saved resources",
  "Favorite programs",
  "Accessibility preferences",
  "Voluntary check-in history",
  "Recommendation preferences",
];

const DISTINCTIONS = [
  { title: "Profile is not location access", text: "Creating a profile does not turn on GPS." },
  { title: "Location is not check-in", text: "Turning on location does not mean you attended a resource or event." },
  { title: "Check-in is voluntary", text: "You only check in when you choose to." },
];

/** Optional personalization entry point. Never gates any part of Know I'm Here. */
export function MyKIHCard() {
  const { profile } = useApp();
  const [open, setOpen] = useState(false);
  const [guest, setGuest] = useState(false);

  return (
    <article className="card-flat mt-8 p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand/15 text-brand"><UserRound className="size-5" /></span>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-brand">My KIH</p>
          <h3 className="text-xl font-extrabold text-ink">Make KIH more personal.</h3>
        </div>
      </div>
      <p className="mt-3 max-w-2xl text-foreground/70">
        Save your interests, favorite resources and preferences so Know I&apos;m Here can give you better recommendations over time.
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Button asChild className="min-h-12 w-full font-bold">
          <Link to="/onboarding">{profile.onboarded ? "Update My KIH Profile" : "Create My KIH Profile"}</Link>
        </Button>
        <Button type="button" variant="outline" className="min-h-12 w-full font-bold" onClick={() => setGuest(true)}>
          Continue as Guest
        </Button>
      </div>
      {guest && (
        <p role="status" className="mt-2 text-sm font-semibold text-sky">
          You&apos;re browsing as a guest. Everything in Know I&apos;m Here stays available.
        </p>
      )}
      <p className="mt-2 text-sm text-foreground/65">
        Creating a profile is optional. Location access is separate and always your choice.
      </p>

      <Button
        type="button"
        variant="ghost"
        className="mt-3 min-h-12 w-full justify-between px-3 font-bold text-ink sm:w-auto sm:justify-start sm:gap-2"
        aria-expanded={open}
        aria-controls="my-kih-remembers"
        onClick={() => setOpen((v) => !v)}
      >
        What can my KIH remember? {open ? <ChevronUp /> : <ChevronDown />}
      </Button>
      {open && (
        <div id="my-kih-remembers" className="mt-2 rounded-lg border border-border bg-background p-4">
          <ul className="grid gap-x-4 gap-y-1 text-sm text-foreground/80 sm:grid-cols-2">
            {REMEMBERS.map((r) => (
              <li key={r} className="flex gap-2"><span aria-hidden>•</span>{r}</li>
            ))}
          </ul>
          <dl className="mt-4 grid gap-2 sm:grid-cols-3">
            {DISTINCTIONS.map((d) => (
              <div key={d.title} className="rounded-lg border border-border bg-card p-3">
                <dt className="text-xs font-extrabold uppercase tracking-wide text-sky">{d.title}</dt>
                <dd className="mt-1 text-sm text-foreground/70">{d.text}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-sm text-foreground/70">
            KIH can use your selected preferences and activity to improve your recommendations.
          </p>
          <p className="mt-1 text-sm font-bold text-ink">You control your profile, location settings and preferences.</p>
        </div>
      )}
    </article>
  );
}
