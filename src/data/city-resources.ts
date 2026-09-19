export type CityResourceBadge = "Official Detroit Resource" | "Trusted Community Resource";

export interface CityResource {
  id: string;
  name: string;
  badge: CityResourceBadge;
  /** Short label used in the ecosystem grid. */
  tile: string;
  blurb: string;
  href: string;
  cta: string;
  /** Second action, when the resource has a natural companion link. */
  secondary?: { label: string; href: string };
  /** Lowercase keywords used by the prototype routing logic in Ask KIH. */
  keywords: string[];
  /** Plain-language reason shown as "Why Know I'm Here recommended this". */
  why: string;
}

export const CITY_RESOURCES: CityResource[] = [
  {
    id: "improve-detroit",
    name: "Improve Detroit",
    badge: "Official Detroit Resource",
    tile: "Neighborhood reporting",
    blurb: "Report neighborhood problems directly to the City of Detroit and track the status of your request.",
    href: "https://detroitmi.gov/ImproveDetroit",
    cta: "Report Through Improve Detroit",
    keywords: ["pothole", "illegal dumping", "dumping", "street sign", "running water", "street light", "streetlight", "sidewalk", "abandoned", "trash", "graffiti", "report a problem", "neighborhood problem"],
    why: "You described a neighborhood or quality-of-life issue the City already handles.",
  },
  {
    id: "detroit-at-work",
    name: "Detroit at Work",
    badge: "Official Detroit Resource",
    tile: "Jobs & training",
    blurb: "Jobs, career support, training and recruitment opportunities for Detroit residents.",
    href: "https://detroitatwork.com/",
    cta: "Explore Jobs & Training",
    keywords: ["job", "jobs", "hiring", "work", "employment", "career", "resume", "training", "skilled trades", "apprenticeship", "workforce"],
    why: "You asked about work, training or career support.",
  },
  {
    id: "ddot",
    name: "DDOT — Detroit Department of Transportation",
    badge: "Official Detroit Resource",
    tile: "Transportation",
    blurb: "Route information, schedules and a live Bus Tracker for Detroit buses.",
    href: "https://detroitmi.gov/departments/detroit-department-transportation",
    cta: "View Bus Routes",
    secondary: { label: "Track My Bus", href: "https://www.myddotbus.com/" },
    keywords: ["bus", "ddot", "transit", "ride the bus", "bus stop", "bus route", "when is my bus", "transportation"],
    why: "Public transit looks like a reasonable way to get there.",
  },
  {
    id: "park-finder",
    name: "Detroit Park Finder",
    badge: "Official Detroit Resource",
    tile: "Recreation",
    blurb: "Search nearby parks and recreation facilities across Detroit.",
    href: "https://detroitmi.gov/ParkFinder",
    cta: "Open Detroit Park Finder",
    keywords: ["park", "parks", "somewhere to walk", "walk", "playground", "recreation center", "rec center", "recreation", "outdoors", "trail"],
    why: "You asked about parks, walking or recreation space near you.",
  },
  {
    id: "mi-211",
    name: "Michigan 211",
    badge: "Trusted Community Resource",
    tile: "Human services",
    blurb: "Connects people with community services and assistance including food, housing, utilities, health and transportation.",
    href: "https://mi211.org/",
    cta: "Find Help Through 211",
    keywords: ["food assistance", "food pantry", "utility", "utilities", "shut off", "rent", "eviction", "housing", "emergency housing", "assistance", "help paying", "benefits", "qualify"],
    why: "Your need may cross several services, and 211 can match you to the right one.",
  },
  {
    id: "visit-detroit",
    name: "Visit Detroit",
    badge: "Trusted Community Resource",
    tile: "Attractions & experiences",
    blurb: "Attractions, dining, entertainment and experiences around Detroit.",
    href: "https://visitdetroit.com/trip-planner-listings/?display=both&nearMe=on",
    cta: "Explore Visit Detroit",
    keywords: ["fun", "something to do", "attraction", "museum", "restaurant", "dining", "entertainment", "date night", "concert", "arts", "culture"],
    why: "You asked about things to do — Know I'm Here adds whether it fits your budget, access and interests.",
  },
  {
    id: "connect-313",
    name: "Connect 313",
    badge: "Trusted Community Resource",
    tile: "Digital inclusion",
    blurb: "Find digital-inclusion resources, technical-support programs and opportunities to improve digital skills.",
    href: "https://connect313.org/",
    cta: "Explore Connect 313",
    keywords: ["internet", "wifi", "wi-fi", "laptop", "computer", "device", "technology help", "help using technology", "digital", "tech support"],
    why: "You asked about technology, devices or getting online.",
  },
  {
    id: "youth-education",
    name: "Detroit Youth & Education",
    badge: "Official Detroit Resource",
    tile: "Youth programs & opportunities",
    blurb: "Programs, education and services for Detroit youth and families, from birth through age 26.",
    href: "https://detroitmi.gov/departments/youth-and-education",
    cta: "Explore Youth Resources",
    secondary: { label: "Explore GDYT (summer jobs, ages 14–24)", href: "https://gdyt.org/" },
    keywords: ["teen", "teenager", "youth", "my child", "my kid", "kids", "summer job", "summer", "student", "after school", "school"],
    why: "You asked about young people, school or youth opportunities.",
  },
];

export const DETROIT_OPPORTUNITIES: CityResource = {
  id: "detroit-opportunities",
  name: "Detroit Opportunities",
  badge: "Official Detroit Resource",
  tile: "City resource hub",
  blurb: "The City's hub for affordable housing, business, family, recreation, health, jobs and safety resources.",
  href: "https://detroitmi.gov/opportunities",
  cta: "Explore Detroit Opportunities",
  keywords: [],
  why: "A broad City resource hub when a more specific program isn't clear yet.",
};

export function matchCityResources(text: string, limit = 2): CityResource[] {
  const s = text.toLowerCase();
  const scored = CITY_RESOURCES.map((r) => ({
    resource: r,
    score: r.keywords.reduce((n, k) => (s.includes(k) ? n + k.length : n), 0),
  }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.resource);
}

export function cityResource(id: string): CityResource {
  return CITY_RESOURCES.find((r) => r.id === id) ?? DETROIT_OPPORTUNITIES;
}
