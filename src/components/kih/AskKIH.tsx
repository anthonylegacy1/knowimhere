import { useServerFn } from "@tanstack/react-start";
import { Search, Sparkle } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { parseIntent } from "@/lib/ask.functions";
import { useApp } from "@/lib/app-store";
import { EMPTY_INTENT, keywordIntent, scoreResources, type Intent, type Scored } from "@/lib/recommend";
import { formatDateLabel, parseTimeWindow, type TimeWindow } from "@/lib/schedule";
import { Link } from "@tanstack/react-router";
import { CATEGORIES, EMERGENCY_KEYWORDS, RESOURCES, type Resource } from "@/data/resources";
import { useLocationState } from "@/lib/location";
import { distanceMap } from "@/lib/resource-distance";
import { LIVE_QUESTION_KEYWORDS } from "@/data/live";
import { matchCityResources, DETROIT_OPPORTUNITIES } from "@/data/city-resources";
import { CityResourceCard } from "./CityResourceCard";
import { LiveSummary } from "./LiveSummary";
import { ResourceCard } from "./ResourceCard";
import { IssueFlow } from "./IssueFlow";
import { EmergencyNotice } from "./EmergencyNotice";
import { NearbyGroups, NEARBY_QUESTION_PATTERN } from "./NearbyGroups";
import { VoiceInput } from "./VoiceInput";

export const EXAMPLE_QUESTIONS = [
  "What resources are around me right now?",
  "What can I do near me today?",
  "What's happening around me?",
  "I need transportation.",
  "Find free senior activities.",
  "What programs are available for my teenager?",
  "Where can I get a health screening?",
  "Help me report a neighborhood problem.",
  "What job training is near me?",
  "When is my bus coming?",
  "Find a park near me.",
  "I need help paying my utilities.",
  "My 16-year-old needs a summer job.",
  "What is happening in my neighborhood this weekend?",
];

interface Turn {
  question: string;
  intent: Intent;
  results: Scored[];
  source: "ai" | "rules";
  window: TimeWindow;
}

export function AskKIH({
  initialQuestion,
  autoRun = false,
  onGetThere,
  onResults,
  compact = false,
}: {
  initialQuestion?: string;
  autoRun?: boolean;
  onGetThere?: (r: Resource) => void;
  onResults?: (turn: Turn) => void;
  compact?: boolean;
}) {
  const { profile, dismissed } = useApp();
  const { activeCoords } = useLocationState();
  const parse = useServerFn(parseIntent);
  const [q, setQ] = useState(initialQuestion ?? "");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const ranRef = useRef<string | null>(null);

  async function ask(question: string) {
    const text = question.trim();
    if (!text || busy) return;
    setBusy(true);
    setQ(text);
    const lower = text.toLowerCase();
    let intent: Intent;
    let source: Turn["source"] = "rules";
    if (EMERGENCY_KEYWORDS.some((k) => lower.includes(k))) {
      intent = { ...EMPTY_INTENT, isEmergency: true, summary: "This may be an emergency." };
    } else {
      const profileSummary = profile.onboarded
        ? `${profile.name || "Resident"}, ${profile.ageRange || "age not shared"}, ${profile.neighborhood || "Detroit"}; interests: ${profile.interests
            .map((i) => CATEGORIES[i].label)
            .join(", ") || "none shared"}; transportation: ${profile.transportation.join(", ") || "not shared"}`
        : undefined;
      try {
        const res = await parse({ data: { question: text, profileSummary } });
        if (res.ok) {
          const i = res.intent;
          intent = {
            ...EMPTY_INTENT,
            ...i,
            categories: i.categories as Intent["categories"],
            when: (["today", "tomorrow", "this-week", "weekend", "ongoing"].includes(i.when) ? i.when : "any") as Intent["when"],
          };
          source = "ai";
        } else {
          intent = keywordIntent(text);
        }
      } catch {
        intent = keywordIntent(text);
      }
      // Merge keyword hints so a weak AI parse still yields sensible matches.
      const kw = keywordIntent(text);
      if (intent.categories.length === 0) intent.categories = kw.categories;
      intent.isIssueReport = intent.isIssueReport || kw.isIssueReport;
      intent.needsTransit = intent.needsTransit || kw.needsTransit;
    }
    // Resolve the requested Detroit-local date window, then filter by date
    // inside scoreResources before anything is ranked.
    const window = parseTimeWindow(text, intent.when);
    const results =
      intent.isEmergency || intent.isIssueReport
        ? []
        : scoreResources(profile, intent, dismissed, distanceMap(RESOURCES, activeCoords), window).slice(0, 4);
    const turn: Turn = { question: text, intent, results, source, window };
    setTurns((t) => [turn, ...t]);
    onResults?.(turn);
    setBusy(false);
  }

  useEffect(() => {
    if (autoRun && initialQuestion && ranRef.current !== initialQuestion) {
      ranRef.current = initialQuestion;
      void ask(initialQuestion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRun, initialQuestion]);

  function submit(e: FormEvent) {
    e.preventDefault();
    void ask(q);
  }

  return (
    <div>
      <form onSubmit={submit} className="card-pop p-2.5">
        <div className="flex items-center gap-2 px-3 py-2">
          <Sparkle className="size-5 text-brand" aria-hidden />
          <span className="font-display font-semibold text-foreground/80">Ask Know I&apos;m Here</span>
          <span className="ml-auto text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Your Community Guide</span>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border-2 border-border bg-cream px-3 py-2">
          <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="What can I do near me today?"
            aria-label="Ask Know I'm Here"
            className="min-h-11 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          <button type="submit" disabled={busy} className="btn-base btn-brand btn-sm shrink-0">
            {busy ? "Thinking…" : "Ask"}
          </button>
        </div>
        <div className="pt-2.5">
          <VoiceInput onTranscript={(text) => setQ(text)} />
        </div>
        {!compact && (
          <div className="flex flex-wrap gap-2 px-2 pt-2.5">
            {EXAMPLE_QUESTIONS.slice(0, 5).map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => void ask(ex)}
                className="chip min-h-9 cursor-pointer font-semibold text-foreground/70 hover:bg-card"
              >
                {ex}
              </button>
            ))}
          </div>
        )}
      </form>

      {busy && (
        <p className="mt-4 animate-pulse text-sm font-semibold text-muted-foreground">
          Understanding who you are, what you need and what&apos;s nearby…
        </p>
      )}

      <div className="mt-6 space-y-8">
        {turns.map((t, idx) => (
          <section key={`${t.question}-${idx}`} className="anim-rise" aria-label={`Answer to ${t.question}`}>
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink font-display font-bold text-cream">
                {(profile.name || "You").charAt(0)}
              </span>
              <p className="rounded-2xl rounded-tl-sm bg-ink px-4 py-2.5 font-semibold text-cream">{t.question}</p>
            </div>

            <div className="mt-4">
              {t.intent.isEmergency ? (
                <EmergencyNotice />
              ) : t.intent.isIssueReport ? (
                <IssueFlow text={t.question} neighborhood={profile.neighborhood} />
              ) : (
                <>
                  {LIVE_QUESTION_KEYWORDS.some((k) => t.question.toLowerCase().includes(k)) && (
                    <div className="mb-5"><LiveSummary /></div>
                  )}
                  {NEARBY_QUESTION_PATTERN.test(t.question) && (
                    <div className="mb-5">
                      <p className="text-xs font-extrabold uppercase tracking-wide text-brand">Around you right now</p>
                      <NearbyGroups />
                    </div>
                  )}
                  {t.window.kind === "dates" && (
                    <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-brand">
                      {t.window.label} · {formatDateLabel(t.window.dates[0] ?? "")}
                      {t.window.dates.length > 1 ? ` – ${formatDateLabel(t.window.dates[t.window.dates.length - 1] ?? "")}` : ""}
                    </p>
                  )}
                  <p className="text-lg">
                    {t.intent.summary ? (
                      <>
                        <span className="font-semibold">{t.intent.summary}</span>{" "}
                      </>
                    ) : null}
                    Here are the best options for you
                    {t.intent.needsTransit ? " — each one is reachable without a car." : "."}
                  </p>
                  {t.results.length === 0 ? (
                    <div className="card-flat mt-3 p-4 text-foreground/70">
                      {t.window.kind === "dates" ? (
                        <>
                          <p className="font-semibold text-foreground">
                            Nothing in the current KIH event data is confirmed for {t.window.label} yet.
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Link to="/live" className="btn-base btn-ink btn-sm">
                              See Upcoming Events
                            </Link>
                            <Link to="/for-you" className="btn-base btn-ghost btn-sm">
                              Explore Nearby Resources
                            </Link>
                            <button
                              type="button"
                              onClick={() => void ask("What's happening this weekend?")}
                              className="btn-base btn-ghost btn-sm"
                            >
                              Ask About This Weekend
                            </button>
                          </div>
                        </>
                      ) : (
                        <p>
                          I couldn&apos;t find a close match yet. Try asking another way, or browse{" "}
                          <span className="font-bold">For You Today</span>.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {t.results.map((s) => (
                        <ResourceCard
                          key={s.resource.id}
                          resource={s.resource}
                          reasons={s.reasons}
                          compact
                          onGetThere={onGetThere}
                          scheduleNote={s.scheduleLabel}
                          availabilityUnconfirmed={s.availabilityUnconfirmed ?? false}
                        />
                      ))}
                    </div>
                  )}
                  {(() => {
                    const matches = matchCityResources(t.question);
                    const list = matches.length > 0 ? matches : t.results.length === 0 ? [DETROIT_OPPORTUNITIES] : [];
                    if (list.length === 0) return null;
                    return (
                      <div className="mt-5">
                        <p className="text-xs font-extrabold uppercase tracking-wide text-brand">Connected resource</p>
                        <p className="mt-1 text-sm text-foreground/70">
                          Know I&apos;m Here matched your request to a trusted Detroit resource that already exists.
                        </p>
                        <div className="mt-3 grid gap-4 sm:grid-cols-2">
                          {list.map((c) => (
                            <CityResourceCard key={c.id} resource={c} showWhy compact />
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                  <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    {t.source === "ai" ? "AI-interpreted request · prototype recommendation logic" : "Keyword matching · prototype recommendation logic"}
                    {" · "}Verify details with the provider.
                  </p>
                </>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
