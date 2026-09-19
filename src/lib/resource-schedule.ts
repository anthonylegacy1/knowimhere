import type { Resource } from "@/data/resources";
import { parseWhenLabel, type ResourceSchedule } from "./schedule";

// One place that answers "when does this actually happen?" for any resource.
// Explicit structured data wins; otherwise the human label is parsed into a
// weekly pattern. Labels with no weekday are treated as a general resource,
// never as a confirmed dated event.

const cache = new Map<string, ResourceSchedule>();

export function getSchedule(resource: Resource): ResourceSchedule {
  if (resource.schedule) return resource.schedule;
  const cached = cache.get(resource.id);
  if (cached) return cached;
  const parsed = parseWhenLabel(resource.whenLabel);
  const schedule: ResourceSchedule =
    parsed.daysOfWeek.length > 0
      ? {
          kind: "event",
          daysOfWeek: parsed.daysOfWeek,
          timezone: "America/Detroit",
          datesConfirmed: false,
          ...(parsed.startMinutes !== undefined ? { startMinutes: parsed.startMinutes } : {}),
          ...(parsed.endMinutes !== undefined ? { endMinutes: parsed.endMinutes } : {}),
        }
      : { kind: "resource", timezone: "America/Detroit" };
  cache.set(resource.id, schedule);
  return schedule;
}

export function isScheduledEvent(resource: Resource): boolean {
  return getSchedule(resource).kind === "event";
}
