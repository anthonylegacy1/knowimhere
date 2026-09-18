import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SectionHeading } from "@/components/kih/SectionHeading";
import { EXTERNAL_LINKS } from "@/data/resources";
import communityAsset from "@/assets/fast-freddy-class-wide.jpeg.asset.json";
import mayorPhotoAsset from "@/assets/fast-freddy-mayor-sheffield.jpg.asset.json";
import everydayLearningAsset from "@/assets/everyday-connect-group-learning.jpeg.asset.json";
import kihConnectionAsset from "@/assets/know-im-here-detroit-connection.png.asset.json";

const TITLE = "Our Story — How We Got Here | Know I'm Here";
const DESC = "Fast Freddy created the trust. Everyday Connect created the confidence. Know I'm Here creates the connection. The story behind a Detroit-built community-access platform.";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Story,
});

const CARDS = [
  {
    step: "01",
    name: "Fast Freddy Experience",
    theme: "Trust + Community",
    tone: "bg-sun/30",
    text: "A Detroit experience brand that brought people together in real rooms. It proved something simple: residents show up when the invitation is trusted and the experience is welcoming.",
    image: communityAsset.url,
    imageAlt: "Fast Freddy leading a community movement class in Detroit",
    link: { href: EXTERNAL_LINKS.fastFreddy, label: "Visit the official Fast Freddy site" },
  },
  {
    step: "02",
    name: "Everyday Connect",
    theme: "Digital Confidence",
    tone: "bg-sky/15",
    text: "Digital confidence for everyday life — not a seniors-only program. Older adults, working adults, parents and students all build the practical skills to use the technology they already own.",
    image: everydayLearningAsset.url,
    imageAlt: "Older adults learning to use smartphones with guidance from an instructor",
    link: { href: EXTERNAL_LINKS.everydayConnect, label: "View the Everyday Connect prototype" },
  },
  {
    step: "03",
    name: "Know I'm Here",
    theme: "Connection",
    tone: "bg-brand/10",
    text: "The connection layer. Take that trust and confidence and point it at the real problem: Detroit has resources, but the last mile between a resident and the right one is still hard.",
    image: kihConnectionAsset.url,
    imageAlt: "A daughter helps her father use a phone beside the Detroit riverfront and skyline",
    link: null,
  },
];

function Story() {
  const [open, setOpen] = useState(false);
  return (
    <div className="container-kih py-8 sm:py-12">
      <SectionHeading eyebrow="Our story" title="How We Got Here" text="Three chapters, one thread: making it easier for Detroiters to participate in what's already around them." />

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {CARDS.map((c) => (
          <article key={c.step} className={`card-pop overflow-hidden ${c.tone}`}>
            <img src={c.image} alt={c.imageAlt} className="aspect-[16/9] w-full object-cover object-center" />
            <div className="p-6">
            <p className="font-display text-sm font-bold text-foreground/50">{c.step}</p>
            <h2 className="mt-1 font-display text-2xl font-bold">{c.name}</h2>
            <p className="chip mt-2 bg-card">{c.theme}</p>
            <p className="mt-4 text-foreground/75">{c.text}</p>
            {c.link && (
              <a href={c.link.href} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center font-bold text-sky">
                {c.link.label} ↗
              </a>
            )}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 font-display text-2xl font-bold sm:text-3xl">
        <span className="text-sun">TRUST</span>
        <span className="text-foreground/30">→</span>
        <span className="text-sky">CONFIDENCE</span>
        <span className="text-foreground/30">→</span>
        <span className="text-brand">CONNECTION</span>
      </div>

      <section className="card-flat mt-12 overflow-hidden sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div className="flex h-full min-h-64 flex-col">
          <img src={mayorPhotoAsset.url} alt="Fast Freddy with Detroit Mayor Mary Sheffield" className="w-full flex-1 object-cover" />
          <p className="px-4 py-3 text-sm text-foreground/60">Fast Freddy with Detroit Mayor Mary Sheffield</p>
        </div>
        <div className="p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold">Fast Freddy as a pilot ground</h2>
          <p className="mt-2 text-foreground/75">
          Community experiences are a natural place to test the Know I&apos;m Here loop before scaling it citywide: QR-code entry, on-site recommendations, saved information, transportation help, and aggregate (never individual) engagement insight for organizers.
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {["QR entry", "Recommendations", "Saved info", "Transportation", "Aggregate engagement"].map((i) => (
            <li key={i} className="chip justify-center bg-card py-2">{i}</li>
          ))}
          </ul>
        </div>
      </section>

      <section className="mt-8">
        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="btn-base btn-outline w-full justify-between sm:w-auto">
          Community Spotlight {open ? "▴" : "▾"}
        </button>
        {open && (
          <div className="card-flat mt-3 p-6">
            <img src={communityAsset.url} alt="Fast Freddy Experience community activity in Detroit" className="mb-5 aspect-[16/7] w-full rounded-lg object-cover" />
            <p className="text-foreground/75">
              Fast Freddy Experience is one real-world example of the kind of community organization Know I&apos;m Here is built to connect residents with — alongside recreation centers, health clinics, block clubs, workforce programs, libraries and faith communities across Detroit. Know I&apos;m Here remains the primary, scalable brand; partner spotlights rotate.
            </p>
          </div>
        )}
      </section>

      <p className="mt-12 text-center font-display text-xl font-semibold text-foreground/80">
        Fast Freddy showed us the power of trusted community engagement. Everyday Connect helps people build the digital confidence to
        participate. <span className="text-brand">Know I&apos;m Here uses that confidence to connect residents with the resources and opportunities around them.</span>
      </p>
      <p className="mt-6 text-center font-display text-lg font-bold">
        Senior or student. Job or health resource. Community event or career opportunity. The question is the same:{" "}
        <span className="text-brand">what does Detroit have for me?</span>
      </p>
    </div>
  );
}
