// Approximate Detroit area centers used to place prototype resources on a map
// grid and to support ZIP / neighborhood selection without a geocoding provider.
//
// IMPORTANT: these are APPROXIMATE area centers, not verified street coordinates.
// Distances derived from them are shown as approximate ("about X miles").
// Replace with geocoded resource coordinates once a geocoding provider is configured.

import type { Coords } from "@/lib/geo";

export const NEIGHBORHOOD_CENTERS: Record<string, Coords> = {
  Downtown: { lat: 42.3314, lng: -83.0458 },
  Midtown: { lat: 42.3536, lng: -83.0632 },
  Corktown: { lat: 42.3317, lng: -83.07 },
  "Southwest Detroit": { lat: 42.312, lng: -83.108 },
  "North End": { lat: 42.383, lng: -83.076 },
  "East English Village": { lat: 42.4, lng: -82.945 },
  "Jefferson Chalmers": { lat: 42.366, lng: -82.943 },
  Osborn: { lat: 42.43, lng: -82.993 },
  Brightmoor: { lat: 42.403, lng: -83.25 },
  "Rosedale Park": { lat: 42.4, lng: -83.22 },
  Bagley: { lat: 42.422, lng: -83.156 },
  "Palmer Park": { lat: 42.418, lng: -83.108 },
  Morningside: { lat: 42.407, lng: -82.95 },
  Islandview: { lat: 42.358, lng: -82.991 },
  Warrendale: { lat: 42.356, lng: -83.22 },
  "Cody Rouge": { lat: 42.365, lng: -83.24 },
};

/** Approximate centers for Detroit ZIP codes (area level, not address level). */
export const ZIP_CENTERS: Record<string, { coords: Coords; area: string }> = {
  "48201": { coords: { lat: 42.348, lng: -83.061 }, area: "Midtown" },
  "48202": { coords: { lat: 42.371, lng: -83.073 }, area: "New Center" },
  "48203": { coords: { lat: 42.423, lng: -83.096 }, area: "North End / Highland Park area" },
  "48204": { coords: { lat: 42.365, lng: -83.145 }, area: "Nardin Park / West Detroit" },
  "48205": { coords: { lat: 42.431, lng: -82.988 }, area: "Osborn" },
  "48206": { coords: { lat: 42.377, lng: -83.113 }, area: "Dexter-Linwood" },
  "48207": { coords: { lat: 42.353, lng: -83.019 }, area: "Islandview / Lafayette Park" },
  "48208": { coords: { lat: 42.346, lng: -83.096 }, area: "Core City" },
  "48209": { coords: { lat: 42.309, lng: -83.11 }, area: "Southwest Detroit" },
  "48210": { coords: { lat: 42.339, lng: -83.135 }, area: "Chadsey Condon" },
  "48211": { coords: { lat: 42.379, lng: -83.036 }, area: "Milwaukee Junction" },
  "48212": { coords: { lat: 42.41, lng: -83.058 }, area: "Davison / Hamtramck area" },
  "48213": { coords: { lat: 42.395, lng: -82.995 }, area: "East Side" },
  "48214": { coords: { lat: 42.368, lng: -82.982 }, area: "Jefferson Chalmers" },
  "48215": { coords: { lat: 42.374, lng: -82.947 }, area: "East Riverfront" },
  "48216": { coords: { lat: 42.327, lng: -83.076 }, area: "Corktown" },
  "48217": { coords: { lat: 42.278, lng: -83.152 }, area: "Boynton / Delray" },
  "48219": { coords: { lat: 42.423, lng: -83.244 }, area: "Brightmoor / Rosedale" },
  "48221": { coords: { lat: 42.426, lng: -83.15 }, area: "Bagley / University District" },
  "48223": { coords: { lat: 42.386, lng: -83.246 }, area: "Cody Rouge" },
  "48224": { coords: { lat: 42.41, lng: -82.945 }, area: "Morningside / East English Village" },
  "48226": { coords: { lat: 42.332, lng: -83.047 }, area: "Downtown" },
  "48227": { coords: { lat: 42.389, lng: -83.191 }, area: "Northwest Detroit" },
  "48228": { coords: { lat: 42.359, lng: -83.213 }, area: "Warrendale" },
  "48234": { coords: { lat: 42.428, lng: -83.035 }, area: "Northeast Detroit" },
  "48235": { coords: { lat: 42.426, lng: -83.19 }, area: "Bagley / Schulze" },
  "48238": { coords: { lat: 42.39, lng: -83.135 }, area: "Russell Woods" },
  "48239": { coords: { lat: 42.393, lng: -83.263 }, area: "Redford border" },
};

/** Fallback center of Detroit, used only for the "all of Detroit" view. */
export const DETROIT_CENTER: Coords = { lat: 42.3314, lng: -83.0458 };

export interface ResolvedArea {
  label: string;
  coords: Coords;
  kind: "zip" | "neighborhood";
  /** Approximate area center, never a street address. */
  approximate: true;
}

/** Resolve a resident-entered ZIP code or neighborhood name to an approximate area. */
export function resolveArea(input: string): ResolvedArea | null {
  const q = input.trim();
  if (!q) return null;

  const zip = q.match(/\b\d{5}\b/)?.[0];
  if (zip) {
    const hit = ZIP_CENTERS[zip];
    if (!hit) return null;
    return { label: `${zip} · ${hit.area}`, coords: hit.coords, kind: "zip", approximate: true };
  }

  const lower = q.toLowerCase();
  const names = Object.keys(NEIGHBORHOOD_CENTERS);
  const exact = names.find((n) => n.toLowerCase() === lower);
  const partial = exact ?? names.find((n) => n.toLowerCase().includes(lower) || lower.includes(n.toLowerCase()));
  if (!partial) return null;
  return { label: partial, coords: NEIGHBORHOOD_CENTERS[partial]!, kind: "neighborhood", approximate: true };
}

/** Nearest known Detroit area to a set of coordinates — a resident-friendly label. */
export function nearestAreaLabel(coords: Coords): string {
  let best: { label: string; d: number } | null = null;
  for (const [label, center] of Object.entries(NEIGHBORHOOD_CENTERS)) {
    const d = (center.lat - coords.lat) ** 2 + (center.lng - coords.lng) ** 2;
    if (!best || d < best.d) best = { label, d };
  }
  // ~0.09 degrees is roughly six miles; beyond that we don't claim a neighborhood.
  if (!best || best.d > 0.09 ** 2) return "Your current area";
  return best.label;
}
