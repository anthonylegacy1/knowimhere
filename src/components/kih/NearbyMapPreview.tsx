import { ClientOnly, Link } from "@tanstack/react-router";
import { Suspense, lazy, useState } from "react";

import { useNearbyResults } from "@/lib/nearby-results";

/**
 * Compact homepage preview of "Map what's around me".
 *
 * Presentation only. It reuses the same NearbyMap component, the same shared
 * location state, the same category filters and the same nearby results as the
 * full map page. It holds no map data of its own, and never requests location.
 */

const NearbyMap = lazy(() => import("@/components/kih/NearbyMap"));

export function NearbyMapPreview() {
  const { on, areaLabel, precise, activeCoords, markers, center, youLabel } = useNearbyResults();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="card-flat p-5">
      <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Map what&apos;s around me</p>
      <h3 className="mt-1 font-display text-xl font-bold">
        See resources, programs and opportunities around the area you choose.
      </h3>
      <p className="mt-1 text-sm text-foreground/70">
        {on
          ? `${precise ? "Current area" : "Selected area"}${areaLabel ? `: ${areaLabel}` : ""} · ${markers.length} mapped ${markers.length === 1 ? "resource" : "resources"}`
          : "Turn on I'm Here or choose your ZIP code / neighborhood to center the map."}
      </p>

      {markers.length > 0 && (
        <div className="mt-4">
          <ClientOnly
            fallback={
              <div className="grid h-[220px] place-items-center rounded-lg border-2 border-border bg-card text-sm font-bold text-muted-foreground">
                Loading map…
              </div>
            }
          >
            <Suspense
              fallback={
                <div className="grid h-[220px] place-items-center rounded-lg border-2 border-border bg-card text-sm font-bold text-muted-foreground">
                  Loading map…
                </div>
              }
            >
              <div className="[&_>div]:!h-[220px] [&_>div]:!min-h-0">
                <NearbyMap
                  markers={markers}
                  center={center}
                  you={activeCoords}
                  youLabel={youLabel}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              </div>
            </Suspense>
          </ClientOnly>
        </div>
      )}

      <div className="mt-4">
        <Link to="/map" className="btn-base btn-ink btn-sm min-h-11 px-5">
          View Map
        </Link>
      </div>
    </div>
  );
}
