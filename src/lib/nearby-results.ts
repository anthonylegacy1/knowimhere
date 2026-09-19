import { useMemo } from "react";
import { CATEGORIES, RESOURCES, type CategoryId, type Resource } from "@/data/resources";
import { useCategoryFilters } from "@/lib/category-filters";
import { useLocationState } from "@/lib/location";
import { distanceToResource, isApproximate, resourceCoords } from "@/lib/resource-distance";
import type { MapMarkerData } from "@/components/kih/NearbyMap";
import type { Coords } from "@/lib/geo";

/**
 * ONE shared nearby-results pipeline.
 *
 * Every presentation of "what's around me" — the full map page, its list view and
 * the compact homepage preview — reads this hook. There is no second resource
 * query, no second filter state and no second location state, and nothing here
 * ever requests GPS: it consumes the shared location state only.
 */

// Detroit center: used only when no area has been chosen yet.
export const DETROIT: Coords = { lat: 42.3314, lng: -83.0458 };

export interface NearbyResult {
  resource: Resource;
  coords: Coords;
}

// Every mappable resource comes from the resource database — no invented points.
const MAPPED: NearbyResult[] = RESOURCES.map((r) => ({ resource: r, coords: resourceCoords(r) })).filter(
  (x): x is NearbyResult => x.coords !== null,
);

export const MAPPED_PRECISE_COUNT = MAPPED.filter((x) => !isApproximate(x.resource)).length;
export const MAPPED_APPROX_COUNT = MAPPED.length - MAPPED_PRECISE_COUNT;

export function useNearbyResults() {
  const { on, activeCoords, areaLabel, precise, radiusMiles, setRadius } = useLocationState();
  const { selectedCategories, toggleCategory, clearFilters } = useCategoryFilters();

  const filtered = useMemo(() => {
    const byCategory =
      selectedCategories.length === 0
        ? MAPPED
        : MAPPED.filter((x) => x.resource.tags.some((t) => selectedCategories.includes(t as CategoryId)));
    if (!activeCoords || radiusMiles === "all") return byCategory;
    return byCategory.filter((x) => {
      const d = distanceToResource(x.resource, activeCoords);
      return d ? d.miles <= radiusMiles : true;
    });
  }, [selectedCategories, activeCoords, radiusMiles]);

  const results = useMemo(() => {
    if (!activeCoords) return filtered;
    return [...filtered].sort((a, b) => {
      const da = distanceToResource(a.resource, activeCoords)?.miles ?? Infinity;
      const db = distanceToResource(b.resource, activeCoords)?.miles ?? Infinity;
      return da - db;
    });
  }, [filtered, activeCoords]);

  const markers = useMemo<MapMarkerData[]>(
    () =>
      results.map((x) => ({
        id: x.resource.id,
        name: x.resource.name,
        lat: x.coords.lat,
        lng: x.coords.lng,
        emoji: CATEGORIES[x.resource.category].emoji,
        approximate: isApproximate(x.resource),
      })),
    [results],
  );

  return {
    on,
    activeCoords,
    areaLabel,
    precise,
    radiusMiles,
    setRadius,
    selectedCategories,
    toggleCategory,
    clearFilters,
    results,
    markers,
    center: activeCoords ?? DETROIT,
    youLabel: precise ? "You are here" : "Selected area",
    preciseCount: MAPPED_PRECISE_COUNT,
    approxCount: MAPPED_APPROX_COUNT,
  };
}
