// Regression tests for date-aware Ask KIH filtering.
// Run: bun tests/schedule-regression.ts
import assert from "node:assert";
import { RESOURCES } from "../src/lib/../data/../data/resources";
import { getSchedule } from "../src/lib/resource-schedule";
import { evaluateSchedule, parseTimeWindow, detroitNow, formatDateLabel } from "../src/lib/schedule";

// Saturday, September 19 2026, 2:00 PM Detroit (18:00 UTC).
const SATURDAY = new Date("2026-09-19T18:00:00Z");

const byId = (id: string) => RESOURCES.find((r) => r.id === id)!;
const office = byId("ff-the-office"); // Wednesdays 6:30–10 PM
const chandler = byId("ff-chandler-park"); // Fridays
const rotating = byId("ff-oak-street-jefferson"); // rotating, unknown dates

let failures = 0;
function check(name: string, fn: () => void) {
  try {
    fn();
    console.log(`PASS  ${name}`);
  } catch (err) {
    failures++;
    console.log(`FAIL  ${name}: ${(err as Error).message}`);
  }
}

check("Detroit date resolves as Saturday Sept 19", () => {
  const now = detroitNow(SATURDAY);
  assert.equal(now.date, "2026-09-19");
  assert.equal(now.weekday, 6);
  assert.equal(formatDateLabel(now.date), "SATURDAY, SEPTEMBER 19");
});

check("'What's going on today?' excludes the Wednesday Fast Freddy event", () => {
  const w = parseTimeWindow("What's going on today?", "today", SATURDAY);
  assert.equal(w.kind, "dates");
  assert.deepEqual(w.dates, ["2026-09-19"]);
  assert.equal(evaluateSchedule(getSchedule(office), w), "miss");
});

check("'What's happening tonight?' excludes the Wednesday evening event", () => {
  const w = parseTimeWindow("What's happening tonight?", "today", SATURDAY);
  assert.equal(w.startMinutes, 17 * 60);
  assert.equal(evaluateSchedule(getSchedule(office), w), "miss");
});

check("'What can I do tomorrow?' resolves Sunday Sept 20", () => {
  const w = parseTimeWindow("What can I do tomorrow?", "tomorrow", SATURDAY);
  assert.deepEqual(w.dates, ["2026-09-20"]);
  assert.equal(evaluateSchedule(getSchedule(office), w), "miss");
});

check("'What's happening this weekend?' covers Sat + Sun", () => {
  const w = parseTimeWindow("What's happening this weekend?", "weekend", SATURDAY);
  assert.deepEqual(w.dates, ["2026-09-19", "2026-09-20"]);
  assert.equal(evaluateSchedule(getSchedule(chandler), w), "miss");
});

check("'What is Fast Freddy doing Wednesday?' matches the Wednesday event", () => {
  const w = parseTimeWindow("What is Fast Freddy doing Wednesday?", "any", SATURDAY);
  assert.deepEqual(w.dates, ["2026-09-23"]);
  assert.equal(evaluateSchedule(getSchedule(office), w), "match");
});

check("Rotating-date events are never confirmed for a date", () => {
  const w = parseTimeWindow("What's going on today?", "today", SATURDAY);
  assert.equal(evaluateSchedule(getSchedule(rotating), w), "unknown");
});

check("No dated event survives a 'today' filter unless it runs Saturday", () => {
  const w = parseTimeWindow("Are there any food events today?", "today", SATURDAY);
  for (const r of RESOURCES) {
    const s = getSchedule(r);
    if (s.kind !== "event") continue;
    const verdict = evaluateSchedule(s, w);
    if (verdict === "match") assert.ok(s.daysOfWeek?.includes(6) || s.dates?.includes("2026-09-19"), `${r.id} wrongly matched`);
  }
});

check("Questions with no time words apply no date filter", () => {
  const w = parseTimeWindow("Where can I get a health screening?", "any", SATURDAY);
  assert.equal(w.kind, "any");
  assert.equal(evaluateSchedule(getSchedule(office), w), "match");
});

console.log(failures === 0 ? "\nAll schedule regression tests passed." : `\n${failures} failing test(s).`);
if (failures > 0) process.exit(1);
