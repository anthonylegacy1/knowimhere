import { NEIGHBORHOOD_CENTERS } from "@/data/geo-areas";
import { RESOURCE_GEOCODES, type CoordinateAccuracy } from "@/data/resource-geocodes";
import type { Resource } from "@/data/resources";
import { formatMiles, haversineMeters, metersToMiles, type Coords } from "./geo";

/**
 * Coordinates for a resource. Verified geocodes (street address looked up with a
 * real geocoder) are used when available; otherwise we fall back to the center of
 * the neighborhood the resource serves, and every distance built from that
 * fallback is presented as approximate.
 */
export function resourceCoords(resource: Resource): Coords | null {
  const geo = RESOURCE_GEOCODES[resource.id];
  if (geo) return { lat: geo.lat, lng: geo.lon };
  return NEIGHBORHOOD_CENTERS[resource.neighborhood] ?? null;
}

/** Street-entrance / routable point where the geocoder provided one. */
export function resourceRoutableCoords(resource: Resource): Coords | null {
  const geo = RESOURCE_GEOCODES[resource.id];
  if (geo?.routableLat !== undefined && geo.routableLon !== undefined) {
    return { lat: geo.routableLat, lng: geo.routableLon };
  }
  return resourceCoords(resource);
}

export function resourceAccuracy(resource: Resource): CoordinateAccuracy {
  return RESOURCE_GEOCODES[resource.id]?.accuracy ?? "neighborhood_centroid";
}

/**
 * Only high-confidence address-level coordinates may back a location-verified
 * check-in. Interpolated and approximate coordinates allow discovery, distance
 * (labeled approximate) and directions — never verification.
 */
export function canVerifyCheckIn(resource: Resource): boolean {
  return resourceAccuracy(resource) === "point_address";
}

export function isApproximate(resource: Resource): boolean {
  return resourceAccuracy(resource) !== "point_address";
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
  const approximate = isApproximate(resource);
  return {
    miles,
    label: approximate ? `about ${formatMiles(miles)} away` : `${formatMiles(miles)} away`,
    approximate,
  };
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
