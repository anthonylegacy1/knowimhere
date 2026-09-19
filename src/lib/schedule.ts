// Date-aware scheduling for Know I'm Here.
// All event interpretation happens in America/Detroit local time.
// Nothing here invents availability: when a date cannot be verified the
// verdict is "unknown", never "happening today".

export const DETROIT_TZ = "America/Detroit";

export interface ResourceSchedule {
  /**
   * "event" = happens at specific dates/times and MUST pass date validation
   * before appearing in a date-sensitive answer.
   * "resource" = a place/service that may be generally available; never
   * presented as confirmed for a given date.
   */
  kind: "event" | "resource";
  /** Recurring weekdays, 0 = Sunday. */
  daysOfWeek?: number[];
  /** Specific dated occurrences, "YYYY-MM-DD" in Detroit local time. */
  dates?: string[];
  /** Cancellations / skipped dates, "YYYY-MM-DD". */
  exceptions?: string[];
  /** Active period of the recurrence, "YYYY-MM-DD". */
  recurrenceStart?: string;
  recurrenceEnd?: string;
  /** Minutes from local midnight. */
  startMinutes?: number;
  endMinutes?: number;
  timezone?: string;
  /** False when only a general weekly pattern is known (dates can change). */
  datesConfirmed?: boolean;
}

export type ScheduleVerdict = "match" | "miss" | "unknown";

export interface TimeWindow {
  /** "any" = no date constraint; "dates" = hard date filter. */
  kind: "any" | "dates";
  /** Detroit local calendar dates, "YYYY-MM-DD". */
  dates: string[];
  /** Optional time-of-day constraint in minutes from midnight. */
  startMinutes?: number;
  endMinutes?: number;
  /** Plain label, e.g. "today" or "this weekend". */
  label: string;
}

/* ------------------------------ date helpers ----------------------------- */

const PARTS = new Intl.DateTimeFormat("en-CA", {
  timeZone: DETROIT_TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const WEEKDAY_INDEX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

export interface DetroitNow {
  /** "YYYY-MM-DD" */
  date: string;
  /** 0 = Sunday */
  weekday: number;
  /** Minutes from local midnight */
  minutes: number;
}

/** Current (or given) instant expressed in Detroit local time. */
export function detroitNow(at: Date = new Date()): DetroitNow {
  const parts = PARTS.formatToParts(at);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const hour = Number(get("hour")) % 24;
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    weekday: WEEKDAY_INDEX[get("weekday")] ?? 0,
    minutes: hour * 60 + Number(get("minute")),
  };
}

function shiftDate(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

export function weekdayOf(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1)).getUTCDay();
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "SATURDAY, SEPTEMBER 19" */
export function formatDateLabel(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  void y;
  return `${DAY_NAMES[weekdayOf(date)]}, ${MONTH_NAMES[(m ?? 1) - 1]} ${d}`.toUpperCase();
}

function formatClock(minutes: number): string {
  const h24 = Math.floor(minutes / 60);
  const mm = minutes % 60;
  const suffix = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(mm).padStart(2, "0")} ${suffix}`;
}

export function formatTimeRange(startMinutes?: number, endMinutes?: number): string {
  if (startMinutes === undefined) return "";
  if (endMinutes === undefined) return formatClock(startMinutes);
  return `${formatClock(startMinutes)}–${formatClock(endMinutes)}`;
}

/* --------------------------- whenLabel parsing --------------------------- */

const DAY_PATTERNS: [number, RegExp][] = [
  [0, /\bsun(day)?s?\b/i],
  [1, /\bmon(day)?s?\b/i],
  [2, /\btue(s|sday)?s?\b/i],
  [3, /\bwed(nesday)?s?\b/i],
  [4, /\bthu(r|rs|rsday)?s?\b/i],
  [5, /\bfri(day)?s?\b/i],
  [6, /\bsat(urday)?s?\b/i],
];

function toMinutes(hour: number, minute: number, meridiem: string | undefined): number {
  let h = hour % 12;
  if (meridiem?.toLowerCase() === "pm") h += 12;
  if (!meridiem && hour >= 13) h = hour;
  return h * 60 + minute;
}

const TIME_RE = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/gi;

/** Parses a human label such as "Wednesdays • 6:30 – 10 PM" into structure. */
export function parseWhenLabel(label: string): { daysOfWeek: number[]; startMinutes?: number; endMinutes?: number } {
  const daysOfWeek: number[] = [];
  for (const [idx, re] of DAY_PATTERNS) if (re.test(label)) daysOfWeek.push(idx);
  if (/\bweekdays?\b/i.test(label) && daysOfWeek.length === 0) daysOfWeek.push(1, 2, 3, 4, 5);
  if (/\bweekends?\b/i.test(label) && daysOfWeek.length === 0) daysOfWeek.push(0, 6);

  const timePart = label.includes("•") ? label.slice(label.indexOf("•") + 1) : label;
  const found: { hour: number; minute: number; meridiem?: string }[] = [];
  TIME_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = TIME_RE.exec(timePart)) !== null) {
    const hour = Number(m[1]);
    if (hour < 1 || hour > 23) continue;
    const entry: { hour: number; minute: number; meridiem?: string } = { hour, minute: Number(m[2] ?? 0) };
    if (m[3]) entry.meridiem = m[3];
    found.push(entry);
  }
  const out: { daysOfWeek: number[]; startMinutes?: number; endMinutes?: number } = { daysOfWeek };
  if (found[0]) {
    // "6:30 – 10 PM": the first time borrows the meridiem of the second.
    const second = found[1];
    const firstMeridiem = found[0].meridiem ?? second?.meridiem;
    const start = toMinutes(found[0].hour, found[0].minute, firstMeridiem);
    out.startMinutes = start;
    if (second) {
      let end = toMinutes(second.hour, second.minute, second.meridiem ?? firstMeridiem);
      if (end < start) end += 12 * 60;
      out.endMinutes = end;
    }
  }
  return out;
}

/* ------------------------------ time windows ----------------------------- */

const EVENING = { startMinutes: 17 * 60, endMinutes: 23 * 60 + 59 };
const AFTERNOON = { startMinutes: 12 * 60, endMinutes: 17 * 60 };
const MORNING = { startMinutes: 5 * 60, endMinutes: 12 * 60 };

function nextWeekday(from: string, target: number): string {
  const diff = (target - weekdayOf(from) + 7) % 7;
  return shiftDate(from, diff);
}

/**
 * Resolves the date window a resident asked about, in Detroit local time.
 * Returns kind "any" when the question carries no time constraint.
 */
export function parseTimeWindow(question: string, intentWhen: string | undefined, at: Date = new Date()): TimeWindow {
  const now = detroitNow(at);
  const s = question.toLowerCase();
  const today = now.date;
  const any: TimeWindow = { kind: "any", dates: [], label: "" };

  const weekend = (): TimeWindow => {
    const sat = now.weekday === 0 ? shiftDate(today, -1) : nextWeekday(today, 6);
    const sun = shiftDate(sat, 1);
    return { kind: "dates", dates: [sat, sun], label: "this weekend" };
  };

  if (/\btonight\b|\bthis evening\b/.test(s)) return { kind: "dates", dates: [today], label: "tonight", ...EVENING };
  if (/\bthis afternoon\b/.test(s)) return { kind: "dates", dates: [today], label: "this afternoon", ...AFTERNOON };
  if (/\bthis morning\b/.test(s)) return { kind: "dates", dates: [today], label: "this morning", ...MORNING };
  if (/\btoday\b|\bright now\b|\bgoing on now\b/.test(s)) return { kind: "dates", dates: [today], label: "today" };
  if (/\btomorrow\b/.test(s)) return { kind: "dates", dates: [shiftDate(today, 1)], label: "tomorrow" };
  if (/\bweekend\b/.test(s)) return weekend();

  for (const [idx, re] of DAY_PATTERNS) {
    if (re.test(s)) {
      const date = nextWeekday(today, idx);
      return { kind: "dates", dates: [date], label: DAY_NAMES[idx]!.toLowerCase() };
    }
  }
  if (/\bthis week\b/.test(s)) {
    return { kind: "dates", dates: Array.from({ length: 7 }, (_, i) => shiftDate(today, i)), label: "this week" };
  }

  switch (intentWhen) {
    case "today":
      return { kind: "dates", dates: [today], label: "today" };
    case "tomorrow":
      return { kind: "dates", dates: [shiftDate(today, 1)], label: "tomorrow" };
    case "weekend":
      return weekend();
    case "this-week":
      return { kind: "dates", dates: Array.from({ length: 7 }, (_, i) => shiftDate(today, i)), label: "this week" };
    default:
      return any;
  }
}

/* -------------------------------- matching ------------------------------- */

function overlaps(window: TimeWindow, schedule: ResourceSchedule): boolean {
  if (window.startMinutes === undefined) return true;
  if (schedule.startMinutes === undefined) return false; // time unknown → cannot confirm
  const end = schedule.endMinutes ?? schedule.startMinutes + 60;
  return schedule.startMinutes <= (window.endMinutes ?? 24 * 60) && end >= window.startMinutes;
}

function activeOn(schedule: ResourceSchedule, date: string): boolean {
  if (schedule.recurrenceStart && date < schedule.recurrenceStart) return false;
  if (schedule.recurrenceEnd && date > schedule.recurrenceEnd) return false;
  if (schedule.exceptions?.includes(date)) return false;
  return true;
}

/**
 * Does this schedule happen inside the requested window?
 * "unknown" means KIH cannot verify the date — callers must not present it
 * as happening then.
 */
export function evaluateSchedule(schedule: ResourceSchedule | undefined, window: TimeWindow): ScheduleVerdict {
  if (window.kind === "any") return "match";
  if (!schedule) return "unknown";
  if (schedule.kind === "resource") return "unknown";

  // Date-specific occurrences always win over a generic weekly pattern.
  if (schedule.dates?.length) {
    const hit = schedule.dates.some((d) => window.dates.includes(d) && activeOn(schedule, d));
    if (hit) return overlaps(window, schedule) ? "match" : "miss";
    // A fully dated event with no matching date does not occur then.
    if (!schedule.daysOfWeek?.length) return "miss";
  }

  if (schedule.daysOfWeek?.length) {
    const hit = window.dates.some((d) => schedule.daysOfWeek!.includes(weekdayOf(d)) && activeOn(schedule, d));
    if (!hit) return "miss";
    return overlaps(window, schedule) ? "match" : "miss";
  }

  return "unknown"; // an event with no usable date data
}

/** The first matching occurrence, for labeling. */
export function matchingOccurrence(schedule: ResourceSchedule, window: TimeWindow): string | null {
  for (const d of window.dates) {
    if (!activeOn(schedule, d)) continue;
    if (schedule.dates?.includes(d)) return d;
    if (schedule.daysOfWeek?.includes(weekdayOf(d))) return d;
  }
  return null;
}

/** "SATURDAY, SEPTEMBER 19 · 2:00 PM–4:00 PM" */
export function occurrenceLabel(schedule: ResourceSchedule, window: TimeWindow): string | null {
  const date = matchingOccurrence(schedule, window);
  if (!date) return null;
  const time = formatTimeRange(schedule.startMinutes, schedule.endMinutes);
  return time ? `${formatDateLabel(date)} · ${time}` : formatDateLabel(date);
}

/** Shown when KIH has no verified availability for the requested date. */
export const UNCONFIRMED_LABEL = "Availability not confirmed — check current hours with provider.";
