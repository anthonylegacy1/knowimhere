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
  readTimeoutMs: 15_000,
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
