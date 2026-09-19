// Real geographic helpers for the Know I'm Here location MVP.
// No coordinates, distances or permissions are simulated here.

export interface Coords {
  lat: number;
  lng: number;
}

export interface GeoReading {
  coords: Coords;
  /** Device-reported accuracy radius, in meters. */
  accuracyMeters: number;
  timestamp: number;
}

export type GeoErrorKind = "unsupported" | "denied" | "unavailable" | "timeout";

export class GeoError extends Error {
  kind: GeoErrorKind;
  constructor(kind: GeoErrorKind, message: string) {
    super(message);
    this.kind = kind;
    this.name = "GeoError";
  }
}

/**
 * THE single check-in verification policy. Nothing else in the app may
 * hard-code a proximity threshold, an accuracy limit or retry behaviour.
 */
export const VERIFICATION_POLICY = {
  /** Distance from the destination that still counts as "here", in meters. */
  proximityMeters: 150,
  /** Readings with a wider accuracy radius than this can never verify a check-in. */
  maxAccuracyMeters: 120,
  /** Automatic re-reads attempted before asking the resident what to do. */
  maxRetries: 1,
  /** Per-attempt timeout for a verification reading, in ms. */
  readTimeoutMs: 8_000,
} as const;

export const CHECKIN_PROXIMITY_METERS = VERIFICATION_POLICY.proximityMeters;
export const MAX_VERIFY_ACCURACY_METERS = VERIFICATION_POLICY.maxAccuracyMeters;

export const EARTH_RADIUS_METERS = 6_371_000;

export function haversineMeters(a: Coords, b: Coords): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.min(1, Math.sqrt(h)));
}

export const metersToMiles = (m: number) => m / 1609.344;

export function formatMiles(miles: number): string {
  if (miles < 0.1) return "less than 0.1 miles";
  return `${miles.toFixed(1)} miles`;
}

export function geolocationSupported(): boolean {
  return typeof navigator !== "undefined" && "geolocation" in navigator;
}

/**
 * One-shot browser location request. Never called without an explicit
 * resident action; there is no background watching anywhere in the app.
 */
export function getCurrentPositionOnce(options?: PositionOptions): Promise<GeoReading> {
  return new Promise((resolve, reject) => {
    if (!geolocationSupported()) {
      reject(new GeoError("unsupported", "Geolocation is not supported by this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          accuracyMeters: Number.isFinite(pos.coords.accuracy) ? pos.coords.accuracy : Number.POSITIVE_INFINITY,
          timestamp: pos.timestamp,
        }),
      (err) => {
        const kind: GeoErrorKind =
          err.code === err.PERMISSION_DENIED
            ? "denied"
            : err.code === err.TIMEOUT
              ? "timeout"
              : "unavailable";
        reject(new GeoError(kind, err.message));
      },
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 0, ...options },
    );
  });
}

/**
 * Discovery reads (nearby resources, For You Today, Get There origin) go for a
 * usable position FAST. A wide-radius fix is fine for sorting and distances.
 * Check-in verification keeps its own stricter policy above.
 */
export const DISCOVERY_FAST_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 5_000,
  maximumAge: 60_000,
};

/** Used only if the fast read fails — never as the first thing a resident waits on. */
export const DISCOVERY_PRIMARY_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 12_000,
  maximumAge: 30_000,
};

/** Optional quiet upgrade after discovery is already working. */
export const PRECISION_UPGRADE_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 12_000,
  maximumAge: 30_000,
};

export interface GeoDiagnostic {
  at: number;
  mode: "fast" | "high_accuracy" | "precision_upgrade";
  outcome: "success" | "error";
  errorKind?: GeoErrorKind;
  accuracyMeters?: number;
  durationMs: number;
}

const diagnostics: GeoDiagnostic[] = [];

/** Development diagnostics only: never records coordinates, only quality signals. */
export function recordGeoDiagnostic(entry: GeoDiagnostic) {
  diagnostics.push(entry);
  if (diagnostics.length > 20) diagnostics.shift();
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[kih:geo]", entry);
  }
}

export function geoDiagnostics(): readonly GeoDiagnostic[] {
  return diagnostics;
}

export interface DiscoveryFix {
  reading: GeoReading;
  /** "low" means the reading came from the network fallback or has a wide radius. */
  confidence: "high" | "low";
}

/**
 * One fast, low-power attempt so discovery can start within seconds, then one
 * high-accuracy attempt only if the fast read timed out or was unavailable.
 * A denial or unsupported browser stops immediately — we never re-prompt
 * residents who said no.
 */
export async function locateForDiscovery(): Promise<DiscoveryFix> {
  const attempts: { mode: GeoDiagnostic["mode"]; options: PositionOptions }[] = [
    { mode: "fast", options: DISCOVERY_FAST_OPTIONS },
    { mode: "high_accuracy", options: DISCOVERY_PRIMARY_OPTIONS },
  ];
  let lastError: GeoError = new GeoError("unavailable", "Location unavailable.");
  for (const attempt of attempts) {
    const started = Date.now();
    try {
      const reading = await getCurrentPositionOnce(attempt.options);
      recordGeoDiagnostic({
        at: started,
        mode: attempt.mode,
        outcome: "success",
        accuracyMeters: reading.accuracyMeters,
        durationMs: Date.now() - started,
      });
      const confidence =
        attempt.mode === "high_accuracy" && reading.accuracyMeters <= MAX_VERIFY_ACCURACY_METERS ? "high" : "low";
      return { reading, confidence };
    } catch (e) {
      const err = e instanceof GeoError ? e : new GeoError("unavailable", "Location unavailable.");
      recordGeoDiagnostic({
        at: started,
        mode: attempt.mode,
        outcome: "error",
        errorKind: err.kind,
        durationMs: Date.now() - started,
      });
      lastError = err;
      if (err.kind === "denied" || err.kind === "unsupported") throw err;
    }
  }
  throw lastError;
}

export interface ProximityResult {
  distanceMeters: number;
  accuracyMeters: number;
  withinRange: boolean;
  accuracyTooLow: boolean;
}

export function evaluateProximity(
  reading: GeoReading,
  destination: Coords,
  thresholdMeters = CHECKIN_PROXIMITY_METERS,
): ProximityResult {
  const distanceMeters = haversineMeters(reading.coords, destination);
  const accuracyTooLow = reading.accuracyMeters > MAX_VERIFY_ACCURACY_METERS;
  return {
    distanceMeters,
    accuracyMeters: reading.accuracyMeters,
    withinRange: !accuracyTooLow && distanceMeters <= thresholdMeters,
    accuracyTooLow,
  };
}

export type ArrivalOutcome =
  | { status: "verified"; distanceMeters: number; accuracyMeters: number }
  | { status: "out_of_range"; distanceMeters: number; accuracyMeters: number }
  | { status: "low_accuracy"; distanceMeters: number; accuracyMeters: number }
  | { status: "error"; kind: GeoErrorKind };

/**
 * Takes a FRESH device reading and decides whether arrival can be verified.
 * Both the distance threshold and the accuracy limit come from
 * VERIFICATION_POLICY — a coordinate that lands inside the threshold with a
 * poor accuracy radius is never treated as verified.
 */
export async function verifyArrival(destination: Coords): Promise<ArrivalOutcome> {
  let last: ArrivalOutcome | null = null;
  for (let attempt = 0; attempt <= VERIFICATION_POLICY.maxRetries; attempt += 1) {
    try {
      const reading = await getCurrentPositionOnce({ timeout: VERIFICATION_POLICY.readTimeoutMs });
      const p = evaluateProximity(reading, destination, VERIFICATION_POLICY.proximityMeters);
      if (p.accuracyTooLow) {
        last = { status: "low_accuracy", distanceMeters: p.distanceMeters, accuracyMeters: p.accuracyMeters };
        continue; // a retry may return a tighter fix
      }
      return p.withinRange
        ? { status: "verified", distanceMeters: p.distanceMeters, accuracyMeters: p.accuracyMeters }
        : { status: "out_of_range", distanceMeters: p.distanceMeters, accuracyMeters: p.accuracyMeters };
    } catch (e) {
      last = { status: "error", kind: e instanceof GeoError ? e.kind : "unavailable" };
      if (last.kind === "denied" || last.kind === "unsupported") return last;
    }
  }
  return last ?? { status: "error", kind: "unavailable" };
}
