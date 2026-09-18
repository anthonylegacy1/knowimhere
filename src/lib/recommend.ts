import { RESOURCES, type CategoryId, type Resource, type When } from "@/data/resources";
import type { Profile } from "./app-store";

// Prototype recommendation logic — transparent rules, not machine learning.

export interface Intent {
  categories: CategoryId[];
  needsTransit: boolean;
  walkingOnly: boolean;
  when: When | "any";
  freeOnly: boolean;
  forYouth: boolean;
  forSenior: boolean;
  isIssueReport: boolean;
  isEmergency: boolean;
  summary: string;
}

export const EMPTY_INTENT: Intent = {
  categories: [],
  needsTransit: false,
  walkingOnly: false,
  when: "any",
  freeOnly: false,
  forYouth: false,
  forSenior: false,
  isIssueReport: false,
  isEmergency: false,
  summary: "",
};

export interface Scored {
  resource: Resource;
  score: number;
  reasons: string[];
}

export function scoreResources(profile: Profile, intent: Intent = EMPTY_INTENT, exclude: string[] = []): Scored[] {
  const out: Scored[] = [];
  for (const r of RESOURCES) {
    if (exclude.includes(r.id)) continue;
    if (r.id === "neighborhood-reporting" && !intent.isIssueReport && intent.categories.length > 0) continue;
    let score = 0;
    const reasons: string[] = [];

    const interestHit = r.tags.some((t) => profile.interests.includes(t));
    if (interestHit) {
      score += 3;
      reasons.push("Matches your interests");
    }
    const intentHit = intent.categories.length > 0 && r.tags.some((t) => intent.categories.includes(t));
    if (intentHit) {
      score += 6;
      reasons.push("Matches what you asked for");
    } else if (intent.categories.length > 0) {
      score -= 4;
    }
    if (r.distanceMiles <= 1.5) {
      score += 2;
      reasons.push("Near your location");
    }
    if (profile.neighborhood && r.neighborhood === profile.neighborhood) {
      score += 1.5;
      if (!reasons.includes("Near your location")) reasons.push("In your neighborhood");
    }
    if (r.cost === "Free" || r.cost === "Low cost") {
      if (profile.lowCost || intent.freeOnly) {
        score += 1.5;
        reasons.push("Free or low cost");
      }
    } else if (intent.freeOnly) {
      score -= 3;
    }
    if (r.when === "today") {
      score += 1;
      reasons.push("Available today");
    }
    if (intent.when !== "any") {
      if (r.when === intent.when || r.when === "ongoing") score += 2;
      else if (intent.when === "this-week" && (r.when === "today" || r.when === "tomorrow")) score += 1.5;
      else score -= 2;
    }
    const noCar =
      profile.transportation.length > 0 && !profile.transportation.includes("drive");
    if ((noCar || intent.needsTransit) && r.transitFriendly) {
      score += 1.5;
      reasons.push("Transportation available");
    }
    if (intent.walkingOnly) {
      if (r.walkable) {
        score += 2;
        reasons.push("Within walking distance");
      } else score -= 3;
    }
    if (profile.accessibility.length > 0 && r.accessibility.length > 0) {
      score += 1;
      reasons.push("Matches accessibility preferences");
    }
    if ((profile.ageRange === "65+" || intent.forSenior) && r.seniorFriendly) score += 1.5;
    if (intent.forYouth) {
      if (r.youthFriendly) score += 3;
      else score -= 3;
    }
    if (intent.forSenior && !r.seniorFriendly) score -= 2;

    out.push({ resource: r, score, reasons: Array.from(new Set(reasons)) });
  }
  return out.sort((a, b) => b.score - a.score);
}

// Keyword fallback used when the AI intent parser is unavailable.
export function keywordIntent(q: string): Intent {
  const s = q.toLowerCase();
  const intent: Intent = { ...EMPTY_INTENT, categories: [] };
  const map: [CategoryId, string[]][] = [
    ["health", ["health", "screening", "doctor", "blood pressure", "wellness", "clinic", "flu", "vaccine"]],
    ["senior", ["senior", "older", "elder", "retire"]],
    ["community", ["community", "meet", "neighbors", "social", "fun", "something to do"]],
    ["recreation", ["recreation", "rec center", "walk", "exercise", "fitness", "swim", "sports", "gym"]],
    ["food", ["food", "grocer", "pantry", "meal", "hungry", "produce"]],
    ["employment", ["job", "work", "training", "career", "hiring", "apprentice", "certif"]],
    ["youth", ["teen", "kid", "child", "son", "daughter", "15", "16", "17", "after school", "after-school", "youth", "student"]],
    ["transportation", ["transportation", "ride", "bus", "transit", "get around", "car", "drive"]],
    ["neighborhood", ["neighborhood", "streetlight", "dumping", "pothole", "report", "city", "trash", "vacant lot", "cooling"]],
    ["housing", ["roof", "house repair", "home repair", "furnace", "housing", "rent", "landlord", "evict"]],
    ["technology", ["phone", "computer", "internet", "tech", "digital", "smartphone"]],
    ["arts", ["music", "art", "dance", "concert", "jazz", "motown", "culture"]],
    ["education", ["class", "learn", "school", "ged", "college", "tutor"]],
    ["events", ["event", "weekend", "happening", "festival", "tonight"]],
  ];
  for (const [cat, words] of map) if (words.some((w) => s.includes(w))) intent.categories.push(cat);
  if (/don'?t drive|no car|don'?t have a car|without a car|bus|transit|ride/.test(s)) intent.needsTransit = true;
  if (/walk(ing)? distance|walkable|can walk/.test(s)) intent.walkingOnly = true;
  if (/today|tonight|right now/.test(s)) intent.when = "today";
  else if (/tomorrow/.test(s)) intent.when = "tomorrow";
  else if (/weekend|saturday|sunday/.test(s)) intent.when = "weekend";
  else if (/this week|week/.test(s)) intent.when = "this-week";
  if (/free|cheap|low cost|low-cost|afford/.test(s)) intent.freeOnly = true;
  if (/teen|kid|child|son|daughter|1[3-9][- ]year|youth/.test(s)) intent.forYouth = true;
  if (/senior|older adult|elder|retire/.test(s)) intent.forSenior = true;
  if (/dump|streetlight|street light|pothole|abandoned|vacant|sidewalk|missed pickup|graffiti|report/.test(s))
    intent.isIssueReport = true;
  // transport is a need, not a category, when combined with other intent
  if (intent.needsTransit && intent.categories.length > 1)
    intent.categories = intent.categories.filter((c) => c !== "transportation");
  if (intent.categories.includes("transportation") && /\b(car|drive)\b/.test(s) && intent.categories.length === 1 && !/ride|bus|transit|transportation/.test(s))
    intent.categories = [];
  intent.summary = "";
  return intent;
}
