import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ResourceCard } from "@/components/kih/ResourceCard";
import { ImHereControl } from "@/components/kih/ImHere";
import { greeting, useApp } from "@/lib/app-store";
import { scoreResources } from "@/lib/recommend";
import { CATEGORIES, RESOURCES, type CategoryId } from "@/data/resources";

const TITLE = "For You Today — Personalized Detroit Resources | Know I'm Here";
const DESC = "A personalized feed of nearby Detroit resources, programs and activities matched to your interests, location and how you get around.";

export const Route = createFileRoute("/for-you")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: ForYou,
});

function ForYou() {
  const { profile, dismissed, saved, hydrated } = useApp();
  const [filter, setFilter] = useState<CategoryId | "all" | "saved">("all");

  const scored = useMemo(() => scoreResources(profile, undefined, dismissed), [profile, dismissed]);
  const list =
    filter === "all"
      ? scored
      : filter === "saved"
        ? scored.filter((s) => saved.includes(s.resource.id))
        : scored.filter((s) => s.resource.tags.includes(filter));

  const cats = Array.from(new Set(RESOURCES.flatMap((r) => r.tags))) as CategoryId[];

  return (
    <div className="container-kih py-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-lg font-semibold text-brand">
            {hydrated ? greeting(profile.name || undefined) : "Hello."}
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Here&apos;s what Detroit has for you today.
          </h1>
          {!profile.onboarded && (
            <p className="mt-2 text-foreground/65">
              Showing general picks near Southwest Detroit.{" "}
              <Link to="/onboarding" className="font-bold text-sky underline-offset-2 hover:underline">
                Personalize in about a minute →
              </Link>
            </p>
          )}
          {profile.onboarded && profile.neighborhood && (
            <p className="mt-2 text-foreground/65">
              Near {profile.neighborhood} ·{" "}
              <Link to="/onboarding" className="font-bold text-sky underline-offset-2 hover:underline">
                Edit preferences
              </Link>
            </p>
          )}
        </div>
        <span className="chip chip-sun text-[11px] uppercase tracking-wide">Prototype recommendation logic</span>
      </div>

      <div className="mt-6">
        <ImHereControl />
      </div>


      <div className="mt-6 -mx-5 overflow-x-auto px-5 pb-1">
        <div className="flex w-max gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`chip min-h-10 cursor-pointer px-4 ${filter === "all" ? "bg-ink text-cream" : ""}`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter("saved")}
            className={`chip min-h-10 cursor-pointer px-4 ${filter === "saved" ? "bg-ink text-cream" : ""}`}
          >
            Saved ({saved.length})
          </button>
          {cats.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={`chip min-h-10 cursor-pointer px-4 ${filter === c ? "bg-ink text-cream" : ""}`}
            >
              {CATEGORIES[c].emoji} {CATEGORIES[c].label}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <p className="card-flat mt-8 p-6 text-center text-foreground/70">Nothing here yet. Save a resource or try another category.</p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => (
            <ResourceCard key={s.resource.id} resource={s.resource} reasons={s.reasons} />
          ))}
        </div>
      )}

      <div className="card-flat mt-10 p-6 text-sm text-foreground/70">
        <p className="font-display text-base font-bold text-foreground">Why am I seeing this?</p>
        <p className="mt-1">
          Recommendations are ranked with simple, transparent rules: matches your interests, near your location, free or
          low cost, available today, transportation available, and matches accessibility preferences. Tap “Why am I
          seeing this?” on any card to see the reasons. Listings are realistic demonstration data — verify details with
          the provider.
        </p>
      </div>
    </div>
  );
}
