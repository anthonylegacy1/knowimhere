// Buildathon demonstration data for the KIH Live prototype.
// None of this is real-time, official, or verified information.

export type LiveSource = "community" | "official" | "news" | "kih";
export type LiveScope = "near" | "neighborhood" | "detroit" | "transportation" | "community";

export interface LiveItem {
  id: string;
  /** Approximate coordinates for the prototype item, used for real radius filtering. */
  coords?: { lat: number; lng: number };
  source: LiveSource;
  emoji: string;
  title: string;
  place: string;
  distance?: string;
  ago: string;
  detail: string;
  scopes: LiveScope[];
  reports?: number;
  unverified?: boolean;
  sourceName?: string;
  primaryCta: string;
  secondaryCta?: string;
}

export const SOURCE_LABEL: Record<LiveSource, string> = {
  community: "Community reported",
  official: "Official source",
  news: "Local news",
  kih: "Know I'm Here resource",
};

export const LIVE_TABS: { id: LiveScope; label: string }[] = [
  { id: "near", label: "Near Me" },
  { id: "neighborhood", label: "My Neighborhood" },
  { id: "detroit", label: "Detroit" },
  { id: "transportation", label: "Transportation" },
  { id: "community", label: "Community" },
];

export const LIVE_ITEMS: LiveItem[] = [
  {
    id: "gunfire",
    coords: { lat: 42.3218, lng: -83.1012 },
    source: "community",
    emoji: "⚠️",
    title: "Possible gunfire reported",
    place: "Near Vernor Hwy & Clark area",
    distance: "0.8 miles away",
    ago: "7 minutes ago",
    detail:
      "Information submitted by participating community members. This report has not been confirmed by an official source.",
    scopes: ["near", "neighborhood", "detroit"],
    reports: 3,
    unverified: true,
    primaryCta: "View area",
    secondaryCta: "View updates",
  },
  {
    id: "road-closure",
    coords: { lat: 42.3652, lng: -83.1210 },
    source: "official",
    emoji: "🚧",
    title: "Road closure",
    place: "Grand River Avenue",
    distance: "1.4 miles away",
    ago: "12 minutes ago",
    detail: "Official transportation information. Lane closure in effect; plan an alternate route.",
    scopes: ["near", "neighborhood", "detroit", "transportation"],
    sourceName: "City transportation notice",
    primaryCta: "View details",
  },
  {
    id: "bus-delay",
    coords: { lat: 42.3419, lng: -83.0905 },
    source: "official",
    emoji: "🚌",
    title: "Bus route running behind schedule",
    place: "Route 21 · Grand River",
    distance: "0.6 miles away",
    ago: "25 minutes ago",
    detail: "Official transit service notice. Allow extra travel time this afternoon.",
    scopes: ["near", "detroit", "transportation"],
    sourceName: "Transit service notice",
    primaryCta: "View details",
  },
  {
    id: "news",
    coords: { lat: 42.3190, lng: -83.1180 },
    source: "news",
    emoji: "📰",
    title: "Developing local story",
    place: "Southwest Detroit",
    ago: "Published 40 minutes ago",
    detail: "City council reviews neighborhood infrastructure funding for southwest corridors.",
    scopes: ["neighborhood", "detroit"],
    sourceName: "Example Detroit News Source",
    primaryCta: "Read from source",
  },
  {
    id: "meeting",
    coords: { lat: 42.3305, lng: -83.0975 },
    source: "community",
    emoji: "🏘️",
    title: "Neighborhood meeting tonight",
    place: "Community center · 6:00 PM",
    distance: "1.2 miles away",
    ago: "Posted 2 hours ago",
    detail: "Block club update, neighborhood improvement discussion and open questions.",
    scopes: ["near", "neighborhood", "community"],
    primaryCta: "View details",
  },
  {
    id: "health",
    coords: { lat: 42.3480, lng: -83.0680 },
    source: "kih",
    emoji: "🩺",
    title: "Community health screening open today",
    place: "Neighborhood health partner",
    distance: "1.9 miles away",
    ago: "Open until 4:00 PM",
    detail: "A Know I'm Here resource match near the area you selected.",
    scopes: ["near", "neighborhood", "community"],
    primaryCta: "View details",
  },
];

export const REPORT_TYPES = [
  { id: "gunfire", emoji: "🔊", label: "Possible Gunfire" },
  { id: "robbery", emoji: "🚨", label: "Robbery / Theft" },
  { id: "accident", emoji: "🚗", label: "Accident" },
  { id: "fire", emoji: "🔥", label: "Fire / Emergency Activity" },
  { id: "hazard", emoji: "⚠️", label: "Road Hazard" },
  { id: "concern", emoji: "🏘️", label: "Neighborhood Concern" },
  { id: "other", emoji: "➕", label: "Other" },
];

export const REPORT_WHEN = ["Now", "Within 15 minutes", "Within 1 hour"];

export const ALERT_RADIUS = ["½ mile", "1 mile", "3 miles", "My neighborhood"] as const;
export type AlertRadius = (typeof ALERT_RADIUS)[number];

/** Radius labels mapped to real miles used for distance filtering. */
export const ALERT_RADIUS_MILES: Record<AlertRadius, number> = {
  "½ mile": 0.5,
  "1 mile": 1,
  "3 miles": 3,
  "My neighborhood": 3,
};

export const LIVE_ASK_SUMMARY: { label: string; source: string; text: string }[] = [
  { label: "Safety", source: "Community report", text: "1 recent community report within your selected area." },
  { label: "Transportation", source: "Official source", text: "2 nearby transportation updates." },
  { label: "Community", source: "Know I'm Here resource", text: "3 activities happening today." },
  { label: "Health", source: "Know I'm Here resource", text: "1 community health resource open nearby." },
  { label: "Local news", source: "Local news", text: "2 developing stories relevant to your selected area." },
];

export const LIVE_QUESTION_KEYWORDS = [
  "what's happening around me",
  "whats happening around me",
  "what is happening around me",
  "happening near me",
  "anything happening nearby",
  "is it safe",
  "kih live",
];
