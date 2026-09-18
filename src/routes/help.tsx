import { createFileRoute } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { SectionHeading } from "@/components/kih/SectionHeading";
import { VIDEOS } from "@/data/resources";
import { useApp } from "@/lib/app-store";

const TITLE = "Need Help? Watch Instead. — Video Guides | Know I'm Here";
const DESC = "Short video guides on finding resources, how recommendations work, transportation help, I'm Here check-in, reporting issues, and staying connected.";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Help,
});

function Help() {
  const { setTextSize, textSize } = useApp();
  return (
    <div className="container-kih py-8 sm:py-12">
      <SectionHeading eyebrow="Video guidance" title="Need Help? Watch Instead." text="Short, plain-language videos. Each one is under three minutes." />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {VIDEOS.map((v) => (
          <article key={v.id} className="card-pop overflow-hidden">
            <div className="relative grid aspect-video place-items-center bg-ink text-cream">
              <span className="text-5xl" aria-hidden>{v.emoji}</span>
              <span className="absolute bottom-3 right-3 chip bg-cream text-foreground text-[11px]">{v.length}</span>
              <span className="absolute grid size-14 place-items-center rounded-full bg-brand text-cream shadow-lg"><Play className="size-6" fill="currentColor" /></span>
            </div>
            <div className="p-4">
              <h2 className="font-display text-lg font-bold">{v.title}</h2>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">Video placeholder · Synthesia guide coming soon</p>
            </div>
          </article>
        ))}
      </div>

      <section className="card-flat mt-10 p-6">
        <h2 className="font-display text-2xl font-bold">Make it easier to read</h2>
        <p className="mt-1 text-foreground/70">Choose a text size. It stays on for every page.</p>
        <div className="mt-4 flex flex-wrap gap-2" aria-label="Text size">
          {(["Standard", "Large", "Extra Large"] as const).map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => setTextSize(index as 0 | 1 | 2)}
              className={`btn-base ${textSize === index ? "btn-brand" : "btn-outline"}`}
              aria-pressed={textSize === index}
            >
              {label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
