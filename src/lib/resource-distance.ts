import { NEIGHBORHOOD_CENTERS } from "@/data/geo-areas";
import type { Resource } from "@/data/resources";
import { formatMiles, haversineMeters, metersToMiles, type Coords } from "./geo";

/**
 * Approximate coordinates for a prototype resource, derived from the
 * neighborhood it serves. These are AREA centers, not geocoded addresses —
 * every distance built from them is presented as approximate.
 */
export function resourceCoords(resource: Resource): Coords | null {
  return NEIGHBORHOOD_CENTERS[resource.neighborhood] ?? null;
}

export interface ResourceDistance {
  miles: number;
  label: string;
  approximate: boolean;
}

export function distanceToResource(resource: Resource, from: Coords | null): ResourceDistance | null {
  if (!from) return null;
  const to = resourceCoords(resource);
  if (!to) return null;
  const miles = metersToMiles(haversineMeters(from, to));
  return { miles, label: `about ${formatMiles(miles)} away`, approximate: true };
}

export function distanceMap(resources: Resource[], from: Coords | null): Record<string, number> {
  const out: Record<string, number> = {};
  if (!from) return out;
  for (const r of resources) {
    const d = distanceToResource(r, from);
    if (d) out[r.id] = d.miles;
  }
  return out;
}
