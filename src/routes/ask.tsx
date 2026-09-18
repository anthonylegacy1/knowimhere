import { createFileRoute } from "@tanstack/react-router";
import { AskKIH, EXAMPLE_QUESTIONS } from "@/components/kih/AskKIH";
import { useApp } from "@/lib/app-store";

const TITLE = "Ask KIH — Your Detroit Community Guide | Know I'm Here";
const DESC = "Ask in plain language and get personalized Detroit resources, programs and activities with transportation options.";

export const Route = createFileRoute("/ask")({
  validateSearch: (s: Record<string, unknown>): { q?: string } => (typeof s["q"] === "string" ? { q: s["q"] } : {}),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: AskPage,
});

function AskPage() {
  const { q } = Route.useSearch();
  const { profile } = useApp();
  return (
    <div className="container-kih py-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <span className="eyebrow">Your Community Guide</span>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">Ask KIH</h1>
        <p className="mt-3 text-lg text-foreground/70">
          Tell me what you need in your own words. I&apos;ll match{" "}
          <span className="font-bold">who you are</span>, <span className="font-bold">what you need</span> and{" "}
          <span className="font-bold">where you are</span> with what&apos;s available nearby.
          {!profile.onboarded && " Personalize your results in about a minute from Find What I Need."}
        </p>
        <div className="mt-6">
          <AskKIH {...(q ? { initialQuestion: q, autoRun: true } : {})} />
        </div>
        <div className="mt-10">
          <p className="font-display font-bold">Try asking</p>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {EXAMPLE_QUESTIONS.map((ex) => (
              <li key={ex} className="card-flat px-4 py-3 text-sm font-semibold text-foreground/70">
                “{ex}”
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-8 text-xs text-muted-foreground">
          Know I&apos;m Here uses AI to understand your question and prototype rules to match resources. It does not make
          medical, legal or eligibility decisions. For emergencies, call 911.
        </p>
      </div>
    </div>
  );
}
