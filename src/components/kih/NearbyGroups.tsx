import { Link } from "@tanstack/react-router";
import { CATEGORIES, RESOURCES, type CategoryId, type Resource } from "@/data/resources";
import { useLocationState } from "@/lib/location";
import { distanceToResource, resourceAccuracy } from "@/lib/resource-distance";
import { NearMeButton } from "./ImHere";

/** Category groups used when answering "what's around me right now?". */
const GROUPS: { label: string; categories: CategoryId[] }[] = [
  { label: "Entrepreneurship & Employment", categories: ["employment"] },
  { label: "Education", categories: ["education", "youth"] },
  { label: "Community Support", categories: ["community", "neighborhood", "housing", "food", "technology"] },
  { label: "Senior & Wellness", categories: ["senior", "health"] },
  { label: "Recreation", categories: ["recreation", "arts", "events"] },
  { label: "Transportation", categories: ["transportation"] },
];

interface Nearby {
  resource: Resource;
  miles: number;
  approximate: boolean;
}

/**
 * Answers "what resources are around me right now?" from the resident's real
 * location and the verified coordinates on each resource record. No AI, no
 * invented distances — everything here is calculated.
 */
export function NearbyGroups({ maxMiles = 3 }: { maxMiles?: number }) {
  const { on, activeCoords, areaLabel } = useLocationState();

  if (!on || !activeCoords) {
    return (
      <div className="card-flat mt-3 p-4 text-foreground/75">
        Turn on I&apos;m Here, or choose a neighborhood or ZIP code, and I can list what is closest to you right now.
        <div className="mt-3"><NearMeButton label="Turn On I'm Here" stayHere /></div>
      </div>
    );
  }

  const nearby: Nearby[] = [];
  for (const resource of RESOURCES) {
    const d = distanceToResource(resource, activeCoords);
    if (!d || d.miles > maxMiles) continue;
    nearby.push({ resource, miles: d.miles, approximate: d.approximate });
  }
  nearby.sort((a, b) => a.miles - b.miles);

  if (nearby.length === 0) {
    return (
      <div className="card-flat mt-3 p-4 text-foreground/75">
        Nothing on record within {maxMiles} miles of {areaLabel}. Try a wider search on{" "}
        <span className="font-bold">For You Today</span>.
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-5">
      <p className="text-sm text-foreground/70">
        Closest first, measured from your current area ({areaLabel}).
      </p>
      {GROUPS.map((group) => {
        const items = nearby.filter((n) => group.categories.includes(n.resource.category)).slice(0, 4);
        if (items.length === 0) return null;
        return (
          <section key={group.label}>
            <h3 className="text-xs font-extrabold uppercase tracking-wide text-brand">{group.label}</h3>
            <ul className="mt-2 space-y-2">
              {items.map(({ resource, miles, approximate }) => (
                <li key={resource.id} className="card-flat flex flex-wrap items-center gap-2 p-3">
                  <span aria-hidden>{CATEGORIES[resource.category].emoji}</span>
                  <span className="font-bold">{resource.name}</span>
                  <span className="text-sm text-foreground/65">{resource.location}</span>
                  <span className="chip ml-auto text-xs">
                    {approximate ? "~" : ""}
                    {miles.toFixed(1)} mi{approximate ? " (approximate)" : ""}
                  </span>
                  <Link to="/resource/$id" params={{ id: resource.id }} className="btn-base btn-outline btn-sm">
                    View details
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
        Distances calculated from your device location.{" "}
        {nearby.some((n) => resourceAccuracy(n.resource) !== "point_address")
          ? "Entries marked approximate use a neighborhood or street-intersection point, not a verified street address."
          : "All entries use verified street addresses."}
      </p>
    </div>
  );
}

/** Phrases that mean "list what is physically near me right now". */
export const NEARBY_QUESTION_PATTERN = /(around me|near me|nearby|close to me|closest|what'?s near|near by)/i;
