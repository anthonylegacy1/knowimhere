import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  GeoError,
  geolocationSupported,
  getCurrentPositionOnce,
  locateForDiscovery,
  type Coords,
  type GeoErrorKind,
  type GeoReading,
} from "./geo";
import { nearestAreaLabel, resolveArea, type ResolvedArea } from "@/data/geo-areas";

/**
 * Know I'm Here location state.
 *
 * Privacy rules enforced here:
 * - Precise GPS coordinates live in memory for this session only. They are never
 *   written to storage and never restored automatically on a later visit.
 * - Only a resident-chosen area (ZIP / neighborhood) and the alert radius persist.
 * - There is no watchPosition / background tracking anywhere in the app.
 */

export type LocationMode = "off" | "gps" | "manual";
export type LocationPhase = "idle" | "requesting";

export interface SavedArea {
  label: string;
  coords: Coords;
  kind: "zip" | "neighborhood";
}

export interface LocationErrorState {
  kind: GeoErrorKind | "accuracy";
  message: string;
}

interface LocationValue {
  mode: LocationMode;
  phase: LocationPhase;
  on: boolean;
  /** Precise reading for this session only; null unless GPS is active. */
  reading: GeoReading | null;
  /** Coordinates currently used for distance work (precise or approximate area center). */
  activeCoords: Coords | null;
  /** True only when activeCoords came from the device. */
  precise: boolean;
  areaLabel: string | null;
  savedArea: SavedArea | null;
  radiusMiles: number | "all";
  error: LocationErrorState | null;
  /** True when the active reading came from the lower-accuracy fallback. */
  lowConfidence: boolean;
  /** True when a refresh failed but the earlier session reading is still in use. */
  staleReading: boolean;
  supported: boolean;
  hydrated: boolean;
  requestGps: () => Promise<boolean>;
  setManualArea: (input: string) => boolean;
  clearSavedArea: () => void;
  turnOff: () => void;
  setRadius: (r: number | "all") => void;
  clearError: () => void;
  /** Fresh one-shot reading for check-in verification. Does not change app state. */
  readFreshLocation: () => Promise<GeoReading>;
}

const KEY = "kih:location:v1";
const Ctx = createContext<LocationValue | null>(null);

const MESSAGES: Record<GeoErrorKind, string> = {
  unsupported: "Your browser doesn't support automatic location. Enter your ZIP code or neighborhood instead.",
  denied: "Location access is off. You can still use Know I'm Here by choosing your ZIP code or neighborhood.",
  timeout: "Getting your location is taking longer than expected.",
  unavailable: "We couldn't determine your current location.",
};

const STALE_MESSAGE = "Couldn't refresh your location. Showing your last location from this session.";

export function LocationProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<LocationMode>("off");
  const [phase, setPhase] = useState<LocationPhase>("idle");
  const [reading, setReading] = useState<GeoReading | null>(null);
  const [gpsArea, setGpsArea] = useState<string | null>(null);
  const [savedArea, setSavedArea] = useState<SavedArea | null>(null);
  const [radiusMiles, setRadiusMiles] = useState<number | "all">(3);
  const [error, setError] = useState<LocationErrorState | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [supported, setSupported] = useState(true);
  const [lowConfidence, setLowConfidence] = useState(false);
  const [staleReading, setStaleReading] = useState(false);
  // Guards against two GPS requests running at once (double taps, two controls).
  const inFlight = useRef(false);

  useEffect(() => {
    setSupported(geolocationSupported());
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { savedArea?: SavedArea; radiusMiles?: number | "all" };
        if (parsed.savedArea?.coords) {
          setSavedArea(parsed.savedArea);
          // A resident-chosen area may resume; precise GPS never resumes on its own.
          setMode("manual");
        }
        if (parsed.radiusMiles) setRadiusMiles(parsed.radiusMiles);
      }
    } catch {
      /* ignore unreadable storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(KEY, JSON.stringify({ savedArea, radiusMiles }));
  }, [hydrated, savedArea, radiusMiles]);

  const requestGps = useCallback(async () => {
    // Only ever one live request: repeated taps reuse the one already running.
    if (inFlight.current) return false;
    inFlight.current = true;
    setError(null);
    setStaleReading(false);
    setPhase("requesting");
    try {
      // Fast usable fix first: discovery starts as soon as this returns.
      const fix = await locateForDiscovery();
      const session = ++sessionToken.current;
      setReading(fix.reading);
      setLowConfidence(fix.confidence === "low");
      setGpsArea(nearestAreaLabel(fix.reading.coords));
      setMode("gps");
      if (fix.confidence === "low") {
        // Quiet accuracy upgrade on the already-granted permission. Never awaited.
        void refineDiscoveryLocation().then((better) => {
          // Discarded if the resident turned location off or changed it meanwhile.
          if (!better || sessionToken.current !== session) return;
          if (better.reading.accuracyMeters >= fix.reading.accuracyMeters) return;
          setReading(better.reading);
          setLowConfidence(better.confidence === "low");
          setGpsArea(nearestAreaLabel(better.reading.coords));
        });
      }
      return true;
    } catch (e) {
      const kind = e instanceof GeoError ? e.kind : "unavailable";
      // A failed refresh must not throw away a good reading from this session.
      if (reading && kind !== "denied") {
        setStaleReading(true);
        setError({ kind, message: STALE_MESSAGE });
        return false;
      }
      setError({ kind, message: MESSAGES[kind] });
      setReading(null);
      setLowConfidence(false);
      setMode((m) => (m === "gps" ? (savedArea ? "manual" : "off") : m));
      return false;
    } finally {
      inFlight.current = false;
      setPhase("idle");
    }
  }, [savedArea, reading]);

  const setManualArea = useCallback((input: string) => {
    const resolved: ResolvedArea | null = resolveArea(input);
    if (!resolved) return false;
    setSavedArea({ label: resolved.label, coords: resolved.coords, kind: resolved.kind });
    setReading(null);
    setGpsArea(null);
    setLowConfidence(false);
    setStaleReading(false);
    setMode("manual");
    setError(null);
    return true;
  }, []);

  const clearSavedArea = useCallback(() => {
    setSavedArea(null);
    setMode((m) => (m === "manual" ? "off" : m));
  }, []);

  const turnOff = useCallback(() => {
    // Clear the precise reading from active state immediately.
    setReading(null);
    setGpsArea(null);
    setLowConfidence(false);
    setStaleReading(false);
    setMode("off");
    setError(null);
  }, []);

  const readFreshLocation = useCallback(() => getCurrentPositionOnce(), []);

  const value = useMemo<LocationValue>(() => {
    const activeCoords = mode === "gps" && reading ? reading.coords : mode === "manual" && savedArea ? savedArea.coords : null;
    const areaLabel = mode === "gps" ? gpsArea : mode === "manual" ? (savedArea?.label ?? null) : null;
    return {
      mode,
      phase,
      on: mode !== "off" && activeCoords !== null,
      reading: mode === "gps" ? reading : null,
      activeCoords,
      precise: mode === "gps" && reading !== null,
      areaLabel,
      savedArea,
      radiusMiles,
      error,
      lowConfidence: mode === "gps" && lowConfidence,
      staleReading: mode === "gps" && staleReading,
      supported,
      hydrated,
      requestGps,
      setManualArea,
      clearSavedArea,
      turnOff,
      setRadius: setRadiusMiles,
      clearError: () => setError(null),
      readFreshLocation,
    };
  }, [mode, phase, reading, gpsArea, savedArea, radiusMiles, error, lowConfidence, staleReading, supported, hydrated, requestGps, setManualArea, clearSavedArea, turnOff, readFreshLocation]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLocationState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLocationState must be used within LocationProvider");
  return ctx;
}
