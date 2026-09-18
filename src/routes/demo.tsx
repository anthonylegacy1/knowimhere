import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AskKIH } from "@/components/kih/AskKIH";
import { ResourceCard } from "@/components/kih/ResourceCard";
import { GetThere } from "@/components/kih/GetThere";
import { CheckIn } from "@/components/kih/CheckIn";
import { IssueFlow } from "@/components/kih/IssueFlow";
import { DEMO_PROFILE, getResource, type Resource } from "@/data/resources";
import { greeting, useApp } from "@/lib/app-store";
import { scoreResources } from "@/lib/recommend";

const TITLE = "Demo Experience — Meet Dorothy | Know I'm Here";
const DESC = "A 90-second walkthrough of Know I'm Here: discover, connect, get there, check in and stay connected — through the eyes of a Detroit resident.";

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

const STEPS = ["Meet Dorothy", "For You Today", "Ask: no car", "Ask: dumping", "Get There", "I'm Here", "Stay Connected"];

function Demo() {
  const { profile, setProfile, hydrated, dismissed } = useApp();
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<Resource>(getResource("community-social")!);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (hydrated && !profile.isDemo) setProfile({ ...DEMO_PROFILE, onboarded: true, isDemo: true });
  }, [hydrated, profile.isDemo, setProfile]);

  const feed = useMemo(() => scoreResources({ ...DEMO_PROFILE, onboarded: true }, undefined, dismissed).slice(0, 5), [dismissed]);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="container-kih py-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="eyebrow">Buildathon Demo Mode · fictional resident</span>
          <span className="text-xs font-bold text-muted-foreground">Step {step + 1} of {STEPS.length} · {STEPS[step]}</span>
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
                <span className="grid size-16 place-items-center rounded-full bg-sun font-display text-3xl font-bold">D</span>
                <div>
                  <h1 className="font-display text-3xl font-bold">Meet Dorothy</h1>
                  <p className="text-foreground/65">Age 68 · Southwest Detroit</p>
                </div>
              </div>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {[
                  ["Interests", "Health, music, community"],
                  ["Transportation", "Does not regularly drive"],
                  ["Preference", "Free / low-cost opportunities"],
                  ["Accessibility", "Simple navigation preferred"],
                ].map(([k, v]) => (
                  <li key={k} className="card-flat p-3">
                    <p className="text-[11px] font-extrabold uppercase tracking-wide text-muted-foreground">{k}</p>
                    <p className="font-semibold">{v}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-foreground/70">
                In about 90 seconds you&apos;ll see the full loop: <span className="font-bold">Discover → Connect → Get There → Check In → Stay Connected</span>.
              </p>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="font-display text-lg font-semibold text-brand">{greeting("Dorothy")}</p>
              <h2 className="font-display text-3xl font-bold">Here&apos;s what Detroit has for you today.</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {feed.map((s) => (
                  <ResourceCard key={s.resource.id} resource={s.resource} reasons={s.reasons} compact onGetThere={(r) => { setPicked(r); setStep(4); }} />
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-display text-2xl font-bold">Query 1 — Dorothy asks:</h2>
              <div className="mt-3">
                <AskKIH initialQuestion="What can I do tomorrow if I don't have a car?" autoRun compact onGetThere={(r) => { setPicked(r); setStep(4); }} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-display text-2xl font-bold">Query 2 — Dorothy asks:</h2>
              <div className="mt-3 flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink font-display font-bold text-cream">D</span>
                <p className="rounded-2xl rounded-tl-sm bg-ink px-4 py-2.5 font-semibold text-cream">There is dumping happening near my house.</p>
              </div>
              <div className="mt-4">
                <IssueFlow text="dumping near my house" neighborhood="Southwest Detroit" />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="card-pop p-6 sm:p-8">
              <p className="text-xs font-extrabold uppercase tracking-wide text-brand">Dorothy picked an activity</p>
              <h2 className="font-display text-2xl font-bold">Help Me Get There</h2>
              <p className="mb-5 text-foreground/65">Dorothy doesn&apos;t drive, so transit and ride options come first.</p>
              <GetThere resource={picked} onDone={next} />
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="mb-3 font-display text-2xl font-bold">Dorothy arrives at {picked.name}</h2>
              <CheckIn resource={picked} onChecked={() => setChecked(true)} />
            </div>
          )}

          {step === 6 && (
            <div className="card-pop p-6 text-center sm:p-8">
              <p className="font-display text-2xl font-bold text-brand">That&apos;s the whole loop.</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-display font-semibold">
                <span className="text-sun">Discover</span>→<span className="text-sky">Connect</span>→<span className="text-mint">Get There</span>→<span className="text-brand">Check In</span>→<span className="text-plum">Stay Connected</span>
              </div>
              <p className="mt-4 text-foreground/70">
                Dorothy found something relevant, learned how to get there, showed up, and stayed connected. Her organization now has a measurable participant — not just an impression.
                {checked ? "" : " (You can go back and tap I'm Here to complete the check-in.)"}
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
        <p className="mt-6 text-center text-xs text-muted-foreground">Dorothy is a fictional resident. All listings and metrics are Buildathon demonstration data.</p>
      </div>
    </div>
  );
}
