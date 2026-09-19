import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { EMPTY_PROFILE, useApp, type Profile } from "@/lib/app-store";
import {
  ACCESS_OPTIONS,
  AGE_RANGES,
  CATEGORIES,
  LIFE_STAGES,
  NEIGHBORHOODS,
  TRANSPORT_OPTIONS,
  type AccessPref,
  type CategoryId,
  type TransportMode,
} from "@/data/resources";

const TITLE = "Find What I Need — Personalize Know I'm Here";
const DESC = "Tell Know I'm Here a little about yourself to get personalized Detroit resources. You control what you share.";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Onboarding,
});

const STEPS = ["About you", "Interests", "Getting around", "Accessibility"];

const CORE_CATEGORIES: CategoryId[] = ["community", "health", "senior", "youth", "employment", "neighborhood"];
const MORE_CATEGORIES: CategoryId[] = ["food", "transportation", "housing", "recreation", "technology", "arts", "education", "events"];

function Toggle({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`min-h-12 rounded-2xl border-2 px-4 py-2.5 text-left text-base font-bold transition-colors ${
        on ? "border-brand bg-brand/10 text-brand" : "border-border bg-card text-foreground hover:bg-cream"
      }`}
    >
      {on ? "✓ " : ""}
      {label}
    </button>
  );
}

function Onboarding() {
  const { profile, setProfile, hydrated } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Profile>(EMPTY_PROFILE);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (hydrated) setDraft({ ...profile, isDemo: false });
  }, [hydrated, profile]);

  const toggleIn = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const moreSelected = MORE_CATEGORIES.filter((c) => draft.interests.includes(c)).length;

  function finish() {
    setProfile({ ...draft, onboarded: true, isDemo: false });
    void navigate({ to: "/for-you" });
  }

  return (
    <div className="container-kih py-8 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-extrabold uppercase tracking-wide text-brand">
          Step {step + 1} of {STEPS.length} · {STEPS[step]}
        </p>
        <div className="mt-2 flex gap-1.5" aria-hidden>
          {STEPS.map((s, i) => (
            <span key={s} className={`h-2 flex-1 rounded-full ${i <= step ? "bg-brand" : "bg-foreground/10"}`} />
          ))}
        </div>

        {step === 0 && (
          <section className="mt-6">
            <h1 className="font-display text-3xl font-bold sm:text-4xl">Let&apos;s keep this simple.</h1>
            <p className="mt-2 text-lg text-foreground/70">A few quick answers help us show what&apos;s relevant. Skip anything you like.</p>
            <label className="mt-6 block">
              <span className="font-bold">First name or nickname (optional)</span>
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="mt-1.5 min-h-13 w-full rounded-2xl border-2 border-input bg-card px-4 text-lg"
                placeholder="Dorothy"
              />
            </label>
            <label className="mt-5 block">
              <span className="font-bold">Detroit neighborhood or ZIP code</span>
              <input
                list="hoods"
                value={draft.neighborhood}
                onChange={(e) => setDraft({ ...draft, neighborhood: e.target.value })}
                className="mt-1.5 min-h-13 w-full rounded-2xl border-2 border-input bg-card px-4 text-lg"
                placeholder="Southwest Detroit or 48209"
              />
              <datalist id="hoods">
                {NEIGHBORHOODS.map((n) => (
                  <option key={n} value={n} />
                ))}
              </datalist>
            </label>
            <fieldset className="mt-5">
              <legend className="font-bold">Age range (optional)</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {AGE_RANGES.map((a) => (
                  <Toggle key={a} on={draft.ageRange === a} label={a} onClick={() => setDraft({ ...draft, ageRange: draft.ageRange === a ? "" : a })} />
                ))}
              </div>
            </fieldset>
            <fieldset className="mt-5">
              <legend className="font-bold">Life stage (optional) — pick all that apply</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {LIFE_STAGES.map((l) => (
                  <Toggle
                    key={l.id}
                    on={draft.lifeStages.includes(l.id)}
                    label={`${l.emoji} ${l.label}`}
                    onClick={() => setDraft({ ...draft, lifeStages: toggleIn(draft.lifeStages, l.id) })}
                  />
                ))}
              </div>
            </fieldset>
          </section>
        )}

        {step === 1 && (
          <section className="mt-6">
            <h1 className="font-display text-3xl font-bold sm:text-4xl">What are you interested in?</h1>
            <p className="mt-2 text-lg text-foreground/70">Pick as many as you like.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {CORE_CATEGORIES.map((c) => (
                <Toggle
                  key={c}
                  on={draft.interests.includes(c)}
                  label={`${CATEGORIES[c].emoji} ${CATEGORIES[c].label}`}
                  onClick={() => setDraft({ ...draft, interests: toggleIn(draft.interests, c) })}
                />
              ))}
            </div>
            <div
              id="more-categories"
              className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none ${
                showMore ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"
              }`}
              aria-hidden={!showMore}
              inert={!showMore}
            >
              <div className="overflow-hidden">
                <div className="flex flex-wrap gap-2 pt-2">
                  {MORE_CATEGORIES.map((c) => (
                    <Toggle
                      key={c}
                      on={draft.interests.includes(c)}
                      label={`${CATEGORIES[c].emoji} ${CATEGORIES[c].label}`}
                      onClick={() => setDraft({ ...draft, interests: toggleIn(draft.interests, c) })}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowMore(!showMore)}
                aria-expanded={showMore}
                aria-controls="more-categories"
                className="btn-base btn-outline min-h-12 cursor-pointer px-6"
              >
                {showMore ? "Show Less ↑" : "More Categories ↓"}
              </button>
              {!showMore && moreSelected > 0 && (
                <p role="status" className="text-sm font-semibold text-brand">
                  {moreSelected} additional categor{moreSelected === 1 ? "y" : "ies"} selected
                </p>
              )}
            </div>
            <div className="mt-5">
              <Toggle on={draft.lowCost} label="Prefer free / low-cost opportunities" onClick={() => setDraft({ ...draft, lowCost: !draft.lowCost })} />
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="mt-6">
            <h1 className="font-display text-3xl font-bold sm:text-4xl">How do you usually get around?</h1>
            <p className="mt-2 text-lg text-foreground/70">This helps us show options you can actually reach.</p>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {TRANSPORT_OPTIONS.map((t) => (
                <Toggle
                  key={t.id}
                  on={draft.transportation.includes(t.id)}
                  label={t.label}
                  onClick={() => setDraft({ ...draft, transportation: toggleIn<TransportMode>(draft.transportation, t.id) })}
                />
              ))}
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="mt-6">
            <h1 className="font-display text-3xl font-bold sm:text-4xl">Anything that makes things easier?</h1>
            <p className="mt-2 text-lg text-foreground/70">Optional. We&apos;ll highlight resources that fit.</p>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {ACCESS_OPTIONS.map((a) => (
                <Toggle
                  key={a.id}
                  on={draft.accessibility.includes(a.id)}
                  label={a.label}
                  onClick={() => setDraft({ ...draft, accessibility: toggleIn<AccessPref>(draft.accessibility, a.id) })}
                />
              ))}
            </div>
          </section>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={() => (step === 0 ? void navigate({ to: "/" }) : setStep(step - 1))} className="btn-base btn-outline">
            ← Back
          </button>
          <div className="flex gap-2">
            {step < STEPS.length - 1 ? (
              <>
                <button type="button" onClick={() => setStep(step + 1)} className="btn-base btn-soft">
                  Skip
                </button>
                <button type="button" onClick={() => setStep(step + 1)} className="btn-base btn-brand">
                  Continue →
                </button>
              </>
            ) : (
              <button type="button" onClick={finish} className="btn-base btn-brand">
                Show me what&apos;s for me
              </button>
            )}
          </div>
        </div>
        <p className="mt-6 text-center text-sm font-semibold text-muted-foreground">
          🔒 You control what you share. Location is optional and never shared automatically.
        </p>
      </div>
    </div>
  );
}
