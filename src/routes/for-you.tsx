import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ResourceCard } from "@/components/kih/ResourceCard";
import { ImHereControl, RADIUS_OPTIONS, radiusLabel } from "@/components/kih/ImHere";
import { greeting, useApp } from "@/lib/app-store";
import { useLocationState } from "@/lib/location";
import { distanceMap } from "@/lib/resource-distance";
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

const CORE_CATEGORIES: CategoryId[] = ["community", "health", "senior", "youth", "employment", "neighborhood"];
const FILTER_KEY = "kih:for-you:filters:v1";

function ForYou() {
  const { profile, dismissed, saved, hydrated } = useApp();
  const { on, activeCoords, areaLabel, precise, radiusMiles, setRadius } = useLocationState();
  // Interest categories are a true multi-select set; "saved" is a separate view.
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [showMore, setShowMore] = useState(false);

  // Restore the resident's selections for this device.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(FILTER_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { categories?: CategoryId[]; savedOnly?: boolean };
        if (Array.isArray(parsed.categories)) setSelectedCategories(parsed.categories);
        if (parsed.savedOnly) setSavedOnly(true);
      }
    } catch {
      /* ignore unreadable stored filters */
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(FILTER_KEY, JSON.stringify({ categories: selectedCategories, savedOnly }));
    } catch {
      /* storage unavailable — filters simply do not persist */
    }
  }, [selectedCategories, savedOnly]);

  const toggleCategory = (c: CategoryId) =>
    setSelectedCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  const showingAll = selectedCategories.length === 0 && !savedOnly;

  const distances = useMemo(() => distanceMap(RESOURCES, activeCoords), [activeCoords]);
  const scored = useMemo(
    () => scoreResources(profile, undefined, dismissed, distances),
    [profile, dismissed, distances],
  );
  // Multiple categories match with OR: a resource only has to match one of them.
  const bySaved = savedOnly ? scored.filter((s) => saved.includes(s.resource.id)) : scored;
  const byCategory =
    selectedCategories.length === 0
      ? bySaved
      : bySaved.filter((s) => s.resource.tags.some((t) => selectedCategories.includes(t)));
  const list =
    on && radiusMiles !== "all"
      ? byCategory.filter((s) => {
          const d = distances[s.resource.id];
          return d === undefined || d <= radiusMiles;
        })
      : byCategory;

  const cats = Array.from(new Set(RESOURCES.flatMap((r) => r.tags))) as CategoryId[];
  const coreCats = CORE_CATEGORIES.filter((c) => cats.includes(c));
  const moreCats = cats.filter((c) => !CORE_CATEGORIES.includes(c));
  const hiddenSelected = showMore ? 0 : moreCats.filter((c) => selectedCategories.includes(c)).length;

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

      {on && (
        <div className="mt-6 rounded-lg border border-border bg-card p-4">
          <p className="text-sm font-bold">
            Based on your selected interests and current area{areaLabel ? ` (${areaLabel})` : ""}.
            <span className="ml-1 font-semibold text-foreground/60">
              {precise ? "Distances are calculated from your current location." : "Distances are calculated from the area you selected."}
            </span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {RADIUS_OPTIONS.map((r) => (
              <button
                key={String(r)}
                type="button"
                aria-pressed={radiusMiles === r}
                onClick={() => setRadius(r)}
                className={`chip min-h-11 cursor-pointer px-4 ${radiusMiles === r ? "bg-ink text-cream" : ""}`}
              >
                {radiusLabel(r)}
              </button>
            ))}
          </div>
        </div>
      )}



      <div className="mt-6">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedCategories([]);
              setSavedOnly(false);
            }}
            aria-pressed={showingAll}
            className={`chip min-h-11 cursor-pointer px-4 ${showingAll ? "bg-ink text-cream" : ""}`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSavedOnly((v) => !v)}
            aria-pressed={savedOnly}
            className={`chip min-h-11 cursor-pointer px-4 ${savedOnly ? "bg-ink text-cream" : ""}`}
          >
            Saved ({saved.length})
          </button>
          {coreCats.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => toggleCategory(c)}
              aria-pressed={selectedCategories.includes(c)}
              className={`chip min-h-11 cursor-pointer px-4 ${selectedCategories.includes(c) ? "bg-ink text-cream" : ""}`}
            >
              {CATEGORIES[c].emoji} {CATEGORIES[c].label}
            </button>
          ))}
        </div>

        {showMore && (
          <div id="more-filter-categories" className="mt-2 flex flex-wrap gap-2">
            {moreCats.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleCategory(c)}
                aria-pressed={selectedCategories.includes(c)}
                className={`chip min-h-11 cursor-pointer px-4 ${selectedCategories.includes(c) ? "bg-ink text-cream" : ""}`}
              >
                {CATEGORIES[c].emoji} {CATEGORIES[c].label}
              </button>
            ))}
          </div>
        )}

        <div className="mt-3 flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={() => setShowMore((v) => !v)}
            aria-expanded={showMore}
            aria-controls="more-filter-categories"
            className="btn-base btn-outline min-h-12 px-5"
          >
            {showMore ? "Show Less ↑" : "More Categories ↓"}
          </button>
          {hiddenSelected > 0 && (
            <span className="text-sm font-bold text-brand">
              {hiddenSelected} additional {hiddenSelected === 1 ? "category" : "categories"} selected
            </span>
          )}
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
