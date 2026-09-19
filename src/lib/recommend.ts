import { RESOURCES, type CategoryId, type Resource, type When } from "@/data/resources";
import type { Profile } from "./app-store";
import { getSchedule } from "./resource-schedule";
import {
  evaluateSchedule,
  occurrenceLabel,
  UNCONFIRMED_LABEL,
  type TimeWindow,
} from "./schedule";

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
  /** e.g. "SATURDAY, SEPTEMBER 19 · 2:00 PM–4:00 PM" when the date is validated. */
  scheduleLabel?: string;
  /** True when KIH cannot confirm availability for the requested date. */
  availabilityUnconfirmed?: boolean;
}

export function scoreResources(
  profile: Profile,
  intent: Intent = EMPTY_INTENT,
  exclude: string[] = [],
  /** Real calculated distances (miles) by resource id, when location is active. */
  distances: Record<string, number> = {},
  /**
   * Requested date/time window. Scheduled events are filtered against it
   * BEFORE any relevance ranking happens.
   */
  window?: TimeWindow,
): Scored[] {
  const out: Scored[] = [];
  const dateFiltered = window !== undefined && window.kind === "dates";
  for (const r of RESOURCES) {
    if (exclude.includes(r.id)) continue;
    if (r.id === "neighborhood-reporting" && !intent.isIssueReport && intent.categories.length > 0) continue;

    // ---- Step 1: hard date filter, before scoring ----
    const schedule = getSchedule(r);
    let scheduleLabel: string | null = null;
    let unconfirmed = false;
    if (dateFiltered) {
      const verdict = evaluateSchedule(schedule, window);
      // A scheduled event only survives when the requested date is validated.
      if (verdict === "miss") continue;
      if (verdict === "unknown" && schedule.kind === "event") continue;
      if (verdict === "match" && schedule.kind === "event") scheduleLabel = occurrenceLabel(schedule, window);
      if (verdict === "unknown") unconfirmed = true;
    }

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
    const realDistance = distances[r.id];
    if (realDistance !== undefined) {
      if (realDistance <= 1) {
        score += 2.5;
        reasons.push("Near your current area");
      } else if (realDistance <= 3) {
        score += 1.5;
        reasons.push("Near your current area");
      } else if (realDistance > 8) {
        score -= 1;
      }
    } else if (r.distanceMiles <= 1.5) {
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
    if (scheduleLabel) {
      score += 2;
      reasons.push(`Confirmed for ${window?.label ?? "the date you asked about"}: ${scheduleLabel}`);
    } else if (unconfirmed) {
      reasons.push(UNCONFIRMED_LABEL);
    } else if (!dateFiltered && r.when === "today") {
      score += 1;
      reasons.push("Listed as available today");
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
    // Every selected life stage counts; one never replaces another.
    const stageMatches = profile.lifeStages.filter((s) => r.lifeStages?.includes(s)).length;
    if (stageMatches > 0) {
      score += 2 + Math.min(stageMatches - 1, 2);
      reasons.push("Fits your life stage");
    }
    const onlyYouth = profile.lifeStages.length > 0 && profile.lifeStages.every((s) => s === "youth");
    const onlyOlder = profile.lifeStages.length > 0 && profile.lifeStages.every((s) => s === "older-adult");
    if (onlyYouth && r.audience === "senior-specific") score -= 4;
    if (onlyOlder && r.audience === "youth-specific") score -= 4;

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
