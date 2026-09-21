import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AskKIH } from "@/components/kih/AskKIH";
import { ResourceCard } from "@/components/kih/ResourceCard";
import { ImHereControl } from "@/components/kih/ImHere";
import { GetThere } from "@/components/kih/GetThere";
import { CheckIn } from "@/components/kih/CheckIn";
import { IssueFlow } from "@/components/kih/IssueFlow";
import { PERSONAS, getResource, type Persona, type Resource } from "@/data/resources";
import { greeting, useApp, type Profile } from "@/lib/app-store";
import { scoreResources } from "@/lib/recommend";

const TITLE = "Demo Experience — Dorothy, Marcus & Tasha | Know I'm Here";
const DESC =
  "A 90-second walkthrough of Know I'm Here across generations: discover, connect, get there, check in and stay connected — as an older adult, a teenager and a working parent.";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Demo,
});

const STEPS = ["Choose a Resident", "Turn On I'm Here", "For You Today", "Ask KIH", "Neighborhood", "Get There", "I'm Here", "Stay Connected"];

function toProfile(p: Persona): Profile {
  return {
    name: p.name,
    neighborhood: p.neighborhood,
    ageRange: p.ageRange,
    lifeStages: p.lifeStage ? [p.lifeStage] : [],
    interests: p.interests,
    transportation: p.transportation,
    accessibility: p.accessibility,
    lowCost: p.lowCost,
    onboarded: true,
    isDemo: true,
  };
}

const FALLBACK: Record<Persona["id"], string> = {
  dorothy: "community-social",
  marcus: "coding-workshop",
  tasha: "daytime-training",
};

function Demo() {
  const { profile, setProfile, hydrated, dismissed } = useApp();
  const [personaId, setPersonaId] = useState<Persona["id"]>("dorothy");
  const persona = PERSONAS.find((p) => p.id === personaId)!;
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<Resource>(getResource("community-social")!);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!profile.isDemo || profile.name !== persona.name) setProfile(toProfile(persona));
  }, [hydrated, persona, profile.isDemo, profile.name, setProfile]);

  useEffect(() => {
    setPicked(getResource(FALLBACK[personaId])!);
    setChecked(false);
  }, [personaId]);

  const feed = useMemo(
    () => scoreResources(toProfile(persona), undefined, dismissed).slice(0, 4),
    [persona, dismissed],
  );

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="container-kih py-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">Know I&apos;m Here Resident Funnel</h1>
          <p className="mt-3 text-foreground/70">Three residents. Three different needs. One platform designed to help each find the right opportunity, resource and next step.</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="eyebrow">Real Detroit KIH funnel example · fictional residents</span>
          <span className="text-xs font-bold text-muted-foreground">
            Step {step + 1} of {STEPS.length} · {STEPS[step]}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setPersonaId(p.id);
                setStep(0);
              }}
              aria-pressed={personaId === p.id}
              className={`chip min-h-12 cursor-pointer px-4 text-base ${personaId === p.id ? "bg-brand text-brand-foreground" : ""}`}
            >
              {p.name}, {p.age}
            </button>
          ))}
        </div>

        <div className="mt-3 flex gap-1" aria-hidden>
          {STEPS.map((s, i) => (
            <span key={s} className={`h-2 flex-1 rounded-full ${i <= step ? "bg-brand" : "bg-foreground/10"}`} />
          ))}
        </div>

        <div className="mt-6">
          {step === 0 && (
            <div className="card-pop p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <span className="grid size-16 place-items-center rounded-full bg-sun font-display text-3xl font-bold">
                  {persona.initial}
                </span>
                <div>
                  <h2 className="font-display text-3xl font-bold">Meet {persona.name}</h2>
                  <p className="text-foreground/65">Age {persona.age} · {persona.tagline}</p>
                </div>
              </div>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {persona.facts.map(([k, v]) => (
                  <li key={k} className="card-flat p-3">
                    <p className="text-[11px] font-extrabold uppercase tracking-wide text-muted-foreground">{k}</p>
                    <p className="font-semibold">{v}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex flex-wrap gap-1.5">
                {persona.needs.map((n) => (
                  <span key={n} className="chip bg-card text-xs">{n}</span>
                ))}
              </p>
              <p className="mt-5 text-foreground/70">
                Same intelligence layer, different generation. In about 90 seconds you&apos;ll see{" "}
                <span className="font-bold">Discover → Connect → Get There → Check In → Stay Connected</span>.
              </p>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="font-display text-2xl font-bold">{persona.name} turns on Know I&apos;m Here</h2>
              <p className="mt-1 text-foreground/65">On when you want it. Off when you don&apos;t. Once it is on, recommendations become local.</p>
              <div className="mt-4"><ImHereControl /></div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="font-display text-lg font-semibold text-brand">{greeting(persona.name)}</p>
              <h2 className="font-display text-3xl font-bold">
                {persona.id === "dorothy" ? "Here's what Detroit has for you today." : "Opportunities picked for you."}
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {feed.map((s) => (
                  <ResourceCard
                    key={s.resource.id}
                    resource={s.resource}
                    reasons={s.reasons}
                    compact
                    onGetThere={(r) => {
                      setPicked(r);
                      setStep(5);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-display text-2xl font-bold">{persona.name} asks:</h2>
              <div className="mt-3">
                <AskKIH
                  key={persona.id}
                  initialQuestion={persona.query}
                  autoRun
                  compact
                  onGetThere={(r) => {
                    setPicked(r);
                    setStep(5);
                  }}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="font-display text-2xl font-bold">And when something is wrong on the block:</h2>
              <div className="mt-3 flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink font-display font-bold text-cream">
                  {persona.initial}
                </span>
                <p className="rounded-2xl rounded-tl-sm bg-ink px-4 py-2.5 font-semibold text-cream">
                  There is dumping happening near my house.
                </p>
              </div>
              <div className="mt-4">
                <IssueFlow text="dumping near my house" neighborhood={persona.neighborhood} />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="card-pop p-6 sm:p-8">
              <p className="text-xs font-extrabold uppercase tracking-wide text-brand">{persona.name} picked something</p>
              <h2 className="font-display text-2xl font-bold">Help Me Get There</h2>
              <p className="mb-5 text-foreground/65">
                {persona.id === "dorothy"
                  ? "Dorothy doesn't drive, so transit and ride options come first."
                  : persona.id === "marcus"
                    ? "Marcus takes the bus or walks, so those options come first."
                    : "Tasha drives some days and takes the bus on others."}
              </p>
              <GetThere resource={picked} onDone={next} />
            </div>
          )}

          {step === 6 && (
            <div>
              <h2 className="mb-3 font-display text-2xl font-bold">
                {persona.name} arrives at {picked.name}
              </h2>
              <CheckIn resource={picked} onChecked={() => setChecked(true)} />
            </div>
          )}

          {step === 7 && (
            <div className="card-pop p-6 text-center sm:p-8">
              <p className="font-display text-2xl font-bold text-brand">That&apos;s the whole loop.</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-display font-semibold">
                <span className="text-sun">Discover</span>→<span className="text-sky">Connect</span>→
                <span className="text-mint">Get There</span>→<span className="text-brand">Check In</span>→
                <span className="text-plum">Stay Connected</span>
              </div>
              <p className="mt-4 text-foreground/70">
                {persona.name} found something relevant, learned how to get there, showed up and stayed connected. The organization now
                has a measurable participant — not just an impression.
                {checked ? "" : " (You can go back and tap I'm Here to complete the check-in.)"}
              </p>
              <p className="mt-3 font-display font-bold">
                Same system. {PERSONAS.map((p) => `${p.name} (${p.age})`).join(" · ")}.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <Link to="/partners" className="btn-base btn-brand">See partner impact</Link>
                <Link to="/onboarding" className="btn-base btn-outline">Try it as yourself</Link>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <button type="button" onClick={back} disabled={step === 0} className="btn-base btn-outline">← Back</button>
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next} className="btn-base btn-brand">Next →</button>
          ) : (
            <button type="button" onClick={() => setStep(0)} className="btn-base btn-ink">Restart demo</button>
          )}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Dorothy, Marcus and Tasha are fictional residents. All listings and metrics are Buildathon demonstration data.
        </p>
      </div>
    </div>
  );
}
