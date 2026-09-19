import { createFileRoute, Link } from "@tanstack/react-router";
import { Suspense, lazy, useMemo, useState } from "react";
import { Bookmark, BookmarkCheck, MapPin } from "lucide-react";
import { toast } from "sonner";
import { ImHereControl, RADIUS_OPTIONS, radiusLabel } from "@/components/kih/ImHere";
import { ResourceCard } from "@/components/kih/ResourceCard";
import { CallButton } from "@/components/kih/CallButton";
import { SectionHeading } from "@/components/kih/SectionHeading";
import { CATEGORIES, RESOURCES, type CategoryId } from "@/data/resources";
import { verifiedPhone } from "@/data/resource-contacts";
import { useApp } from "@/lib/app-store";
import { useCategoryFilters } from "@/lib/category-filters";
import { useLocationState } from "@/lib/location";
import { distanceToResource, isApproximate, resourceCoords } from "@/lib/resource-distance";
import type { MapMarkerData } from "@/components/kih/NearbyMap";

// The map library only downloads once the resident opens the map.
const NearbyMap = lazy(() => import("@/components/kih/NearbyMap"));

const TITLE = "Map What's Around Me — Nearby Detroit Resources | Know I'm Here";
const DESC = "See Detroit resources, programs and opportunities on a map around the area you choose, with real distances and directions.";

// Detroit center: used only when no area has been chosen yet.
const DETROIT = { lat: 42.3314, lng: -83.0458 };

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const { saved, toggleSaved } = useApp();
  const { on, activeCoords, areaLabel, precise, radiusMiles, setRadius } = useLocationState();
  const { selectedCategories, toggleCategory, clearFilters } = useCategoryFilters();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  // Presentation mode only. Both views render the same `sorted` dataset,
  // the same shared location state and the same shared category filters.
  const [view, setView] = useState<"map" | "list">("map");

  // Every mappable resource comes from the resource database — no invented points.
  const mapped = useMemo(
    () =>
      RESOURCES.map((r) => ({ resource: r, coords: resourceCoords(r) })).filter(
        (x): x is { resource: (typeof RESOURCES)[number]; coords: { lat: number; lng: number } } => x.coords !== null,
      ),
    [],
  );

  const filtered = useMemo(() => {
    const byCategory =
      selectedCategories.length === 0
        ? mapped
        : mapped.filter((x) => x.resource.tags.some((t) => selectedCategories.includes(t as CategoryId)));
    if (!activeCoords || radiusMiles === "all") return byCategory;
    return byCategory.filter((x) => {
      const d = distanceToResource(x.resource, activeCoords);
      return d ? d.miles <= radiusMiles : true;
    });
  }, [mapped, selectedCategories, activeCoords, radiusMiles]);

  const sorted = useMemo(() => {
    if (!activeCoords) return filtered;
    return [...filtered].sort((a, b) => {
      const da = distanceToResource(a.resource, activeCoords)?.miles ?? Infinity;
      const db = distanceToResource(b.resource, activeCoords)?.miles ?? Infinity;
      return da - db;
    });
  }, [filtered, activeCoords]);

  const markers: MapMarkerData[] = sorted.map((x) => ({
    id: x.resource.id,
    name: x.resource.name,
    lat: x.coords.lat,
    lng: x.coords.lng,
    emoji: CATEGORIES[x.resource.category].emoji,
    approximate: isApproximate(x.resource),
  }));

  const selected = sorted.find((x) => x.resource.id === selectedId) ?? null;
  const selectedDistance = selected ? distanceToResource(selected.resource, activeCoords) : null;
  const center = activeCoords ?? DETROIT;
  const youLabel = precise ? "You are here" : "Selected area";

  const preciseCount = mapped.filter((x) => !isApproximate(x.resource)).length;
  const approxCount = mapped.length - preciseCount;

  const cats = Array.from(new Set(RESOURCES.flatMap((r) => r.tags))) as CategoryId[];

  return (
    <div className="container-kih py-8 sm:py-12">
      <SectionHeading
        eyebrow="Map what's around me"
        title="See resources, programs and opportunities around the area you choose."
        text="The map uses the same location, resources and distances as the rest of Know I'm Here. It never asks for your location on its own, and your position is never shared or stored."
      />

      <div className="mt-6">
        <ImHereControl />
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card p-4">
        <p className="text-sm font-bold">
          {on
            ? `${precise ? "Current area" : "Selected area"}${areaLabel ? `: ${areaLabel}` : ""}`
            : "Turn on I'm Here or choose your ZIP code / neighborhood to center the map."}
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
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={selectedCategories.length === 0}
            onClick={clearFilters}
            className={`chip min-h-11 cursor-pointer px-4 ${selectedCategories.length === 0 ? "bg-ink text-cream" : ""}`}
          >
            All
          </button>
          {cats.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={selectedCategories.includes(c)}
              onClick={() => toggleCategory(c)}
              className={`chip min-h-11 cursor-pointer px-4 ${selectedCategories.includes(c) ? "bg-ink text-cream" : ""}`}
            >
              {CATEGORIES[c].emoji} {CATEGORIES[c].label}
            </button>
          ))}
        </div>
        <div className="mt-4 flex gap-2" role="group" aria-label="Choose how to view results">
          <button
            type="button"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
            className={`chip min-h-11 cursor-pointer px-4 ${view === "list" ? "bg-ink text-cream" : ""}`}
          >
            List
          </button>
          <button
            type="button"
            aria-pressed={view === "map"}
            onClick={() => setView("map")}
            className={`chip min-h-11 cursor-pointer px-4 ${view === "map" ? "bg-ink text-cream" : ""}`}
          >
            Map
          </button>
        </div>
      </div>

      {markers.length === 0 ? (
        <div className="card-flat mt-6 p-6 text-center">
          <p className="font-display text-lg font-bold">No mapped resources found in this area yet.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link to="/for-you" className="btn-base btn-ink min-h-12 px-5">
              View All Resources
            </Link>
            <a href="#im-here" className="btn-base btn-outline min-h-12 px-5">
              Change Area
            </a>
          </div>
        </div>
      ) : view === "map" ? (
        <div className="mt-6">
          <Suspense
            fallback={
              <div className="grid h-[45vh] min-h-[280px] place-items-center rounded-lg border-2 border-border bg-card text-sm font-bold text-muted-foreground sm:h-[420px]">
                Loading map…
              </div>
            }
          >
            <NearbyMap
              markers={markers}
              center={center}
              you={activeCoords}
              youLabel={youLabel}
              selectedId={selectedId}
              onSelect={setSelectedId}
              expanded={expanded}
            />
          </Suspense>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <p>
              {markers.length} mapped {markers.length === 1 ? "resource" : "resources"} · dashed markers are approximate
              locations · {youLabel.toLowerCase()} shown as a blue dot when location is on.
            </p>
            <button type="button" onClick={() => setExpanded((v) => !v)} className="btn-base btn-outline btn-sm min-h-11">
              {expanded ? "Shrink Map" : "Expand Map"}
            </button>
          </div>
        </div>
      ) : null}

      {selected && (
        <div className="card-pop mt-4 p-5">
          <span className="chip text-xs">{CATEGORIES[selected.resource.category].label}</span>
          <h2 className="mt-2 font-display text-xl font-bold">{selected.resource.name}</h2>
          <p className="mt-1 text-sm text-foreground/70">{selected.resource.summary}</p>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-xs font-bold text-muted-foreground">
            <MapPin className="size-3.5" aria-hidden />
            {selectedDistance ? selectedDistance.label : selected.resource.location}
            {isApproximate(selected.resource) && <span className="chip chip-sun">Approximate location</span>}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/resource/$id" params={{ id: selected.resource.id }} className="btn-base btn-ink btn-sm min-h-11">
              View Details
            </Link>
            {verifiedPhone(selected.resource.id) && (
              <CallButton slug={selected.resource.id} name={selected.resource.name} size="sm" />
            )}
            <Link
              to="/resource/$id"
              params={{ id: selected.resource.id }}
              search={{ step: "get-there" }}
              className="btn-base btn-brand btn-sm min-h-11"
            >
              Get There
            </Link>
            <button
              type="button"
              onClick={() => {
                toggleSaved(selected.resource.id);
                toast(saved.includes(selected.resource.id) ? "Removed from saved" : "Saved for later");
              }}
              aria-pressed={saved.includes(selected.resource.id)}
              className="btn-base btn-outline btn-sm min-h-11 gap-1"
            >
              {saved.includes(selected.resource.id) ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
              {saved.includes(selected.resource.id) ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      )}

      {markers.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-2xl font-bold">Nearby results</h2>
          <p className="mt-1 text-sm text-foreground/70">
            {view === "map"
              ? "Tap a card to highlight it on the map."
              : "Same nearby results, shown as a list. Switch to Map to see them placed around your area."}
          </p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.slice(0, 24).map((x) => (
              <button
                key={x.resource.id}
                type="button"
                onClick={() => setSelectedId(x.resource.id)}
                className={`text-left ${selectedId === x.resource.id ? "rounded-xl ring-4 ring-brand/40" : ""}`}
              >
                <ResourceCard resource={x.resource} compact />
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="mt-8 text-xs text-muted-foreground">
        Prototype map. {preciseCount} resources have street-verified coordinates and {approxCount} are approximate
        neighborhood locations. The map shows resources only — never other residents, check-ins or location history.
        Know I&apos;m Here does not provide turn-by-turn navigation; directions open your device&apos;s map app.
      </p>
    </div>
  );
}
