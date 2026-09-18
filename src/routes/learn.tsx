import { createFileRoute, Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { useState } from "react";
import { SectionHeading } from "@/components/kih/SectionHeading";
import { EXTERNAL_LINKS, LEARNING_TRACKS, VIDEOS } from "@/data/resources";

const TITLE = "Everyday Connect Learning — Digital Confidence for Everyday Life | Know I'm Here";
const DESC =
  "Everyday Connect builds the digital confidence people need to reach real opportunity — two pathways: Older Adults and Future Ready for students and young adults.";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Learn,
});

function Learn() {
  const [track, setTrack] = useState(LEARNING_TRACKS[0]!.id);
  const active = LEARNING_TRACKS.find((t) => t.id === track)!;
  const videos = VIDEOS.filter((v) => ["ec-seniors", "ec-students", "safety", "jobs"].includes(v.id));

  return (
    <div className="container-kih py-8 sm:py-12">
      <SectionHeading
        eyebrow="Everyday Connect Learning"
        title="Digital Confidence for Everyday Life"
        text="Everyday Connect is not a seniors-only program. It helps anyone build the confidence and practical skills to use the technology they already own — so they can reach the opportunities around them."
      />

      <p className="card-pop mt-6 p-5 font-display text-lg font-semibold">
        Everyday Connect teaches digital capability. <span className="text-brand">Know I&apos;m Here turns that capability into access to real opportunity.</span>
      </p>

      <div className="mt-8 flex flex-wrap gap-2" role="tablist">
        {LEARNING_TRACKS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={track === t.id}
            onClick={() => setTrack(t.id)}
            className={`chip min-h-12 cursor-pointer px-5 text-base ${track === t.id ? "bg-ink text-cream" : ""}`}
          >
            <span aria-hidden>{t.emoji}</span> {t.title}
          </button>
        ))}
      </div>

      <section className={`card-pop mt-4 p-6 sm:p-8 ${active.tone}`}>
        <h2 className="font-display text-2xl font-bold">{active.title}</h2>
        <p className="mt-1 text-foreground/70">{active.subtitle}</p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {active.topics.map((t) => (
            <li key={t} className="rounded-2xl bg-card px-4 py-3 font-semibold">
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Prototype curriculum outline · lessons and videos coming soon
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold">Video lessons</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {videos.map((v) => (
            <article key={v.id} className="card-flat overflow-hidden">
              <div className="relative grid aspect-video place-items-center bg-ink text-cream">
                <span className="text-4xl" aria-hidden>{v.emoji}</span>
                <span className="absolute grid size-12 place-items-center rounded-full bg-brand text-cream">
                  <Play className="size-5" fill="currentColor" />
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-display font-bold">{v.title}</h3>
                <p className="mt-1 text-xs font-semibold text-muted-foreground">Video placeholder · {v.length}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <a href={EXTERNAL_LINKS.everydayConnect} target="_blank" rel="noreferrer" className="btn-base btn-brand">
          Explore Everyday Connect ↗
        </a>
        <Link to="/opportunities" className="btn-base btn-outline">Youth opportunities</Link>
        <Link to="/work-after-55" className="btn-base btn-outline">Work After 55</Link>
      </div>
    </div>
  );
}
