import maplibregl, { type Map as MapLibreMap, type Marker as MapLibreMarker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import type { Coords } from "@/lib/geo";

/**
 * Nearby resource map.
 *
 * - Never requests location itself. Everything it draws comes from the shared
 *   Know I'm Here location state and the existing resource database.
 * - Only real, stored resource coordinates are plotted. Approximate ones are
 *   drawn in a muted style and labeled by the surrounding page.
 * - Nothing about the resident is sent anywhere: the basemap is public tiles and
 *   the resident's point is drawn locally only.
 */

export interface MapMarkerData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  emoji: string;
  approximate: boolean;
}

const STYLE_URL = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

export default function NearbyMap({
  markers,
  center,
  you,
  youLabel,
  selectedId,
  onSelect,
  expanded = false,
}: {
  markers: MapMarkerData[];
  center: Coords;
  you: Coords | null;
  youLabel: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
  expanded?: boolean;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerRefs = useRef<Map<string, MapLibreMarker>>(new Map());
  const youRef = useRef<MapLibreMarker | null>(null);
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;

  useEffect(() => {
    if (!hostRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: hostRef.current,
      style: STYLE_URL,
      center: [center.lng, center.lat],
      zoom: 12.5,
      attributionControl: { compact: true },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markerRefs.current.clear();
      youRef.current = null;
    };
    // Initial center only; later recentering is handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the map centered on the resident's current or selected area.
  useEffect(() => {
    mapRef.current?.easeTo({ center: [center.lng, center.lat], duration: 400 });
  }, [center.lat, center.lng]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    window.setTimeout(() => map.resize(), 250);
  }, [expanded]);

  // Resident point — current location or chosen area center.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    youRef.current?.remove();
    youRef.current = null;
    if (!you) return;
    const el = document.createElement("div");
    el.className = "kih-you-dot";
    el.setAttribute("aria-label", youLabel);
    el.title = youLabel;
    youRef.current = new maplibregl.Marker({ element: el }).setLngLat([you.lng, you.lat]).addTo(map);
  }, [you, youLabel]);

  // Resource markers.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    for (const m of markerRefs.current.values()) m.remove();
    markerRefs.current.clear();

    for (const data of markers) {
      const el = document.createElement("button");
      el.type = "button";
      el.className = `kih-marker${data.approximate ? " kih-marker-approx" : ""}`;
      el.textContent = data.emoji;
      el.setAttribute("aria-label", `${data.name}${data.approximate ? " (approximate location)" : ""}`);
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        selectRef.current(data.id);
      });
      markerRefs.current.set(
        data.id,
        new maplibregl.Marker({ element: el }).setLngLat([data.lng, data.lat]).addTo(map),
      );
    }
  }, [markers]);

  // Highlight whichever resource the resident selected, from a card or a marker.
  useEffect(() => {
    for (const [id, marker] of markerRefs.current) {
      marker.getElement().classList.toggle("kih-marker-active", id === selectedId);
    }
    if (!selectedId) return;
    const target = markers.find((m) => m.id === selectedId);
    if (target) mapRef.current?.easeTo({ center: [target.lng, target.lat], duration: 400 });
  }, [selectedId, markers]);

  return (
    <div
      ref={hostRef}
      role="application"
      aria-label="Map of nearby Know I'm Here resources"
      className={`w-full overflow-hidden rounded-lg border-2 border-border ${expanded ? "h-[70vh]" : "h-[45vh] min-h-[280px] sm:h-[420px]"}`}
    />
  );
}
