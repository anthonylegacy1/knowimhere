import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/kih/SectionHeading";
import { EXTERNAL_LINKS } from "@/data/resources";
import { cityResource } from "@/data/city-resources";
import { CityResourceCard } from "@/components/kih/CityResourceCard";

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

const HELP_AREAS = [
  { emoji: "📱", label: "Smartphone skills" },
  { emoji: "♿", label: "Accessibility" },
  { emoji: "💬", label: "Communication" },
  { emoji: "🩺", label: "Healthcare technology" },
  { emoji: "🔐", label: "Digital safety" },
  { emoji: "🤖", label: "AI made simple" },
  { emoji: "💼", label: "Career & digital skills" },
];

const PATHWAYS = [
  {
    emoji: "🌻",
    title: "Everyday Connect: Older Adults",
    text: "Practical help with smartphones, healthcare technology, accessibility, digital safety and everyday digital tools.",
    tone: "bg-sun/10",
  },
  {
    emoji: "🚀",
    title: "Everyday Connect: Future Ready",
    text: "Digital skills for youth including AI, creativity, career readiness, digital safety and building with technology.",
    tone: "bg-sky/10",
  },
];

const FLOW = [
  { step: "Everyday Connect", label: "Learn how to use the technology", tone: "bg-sky/10 text-sky" },
  { step: "Build digital confidence", label: "Skills you can use every day", tone: "bg-sky/10 text-sky" },
  { step: "Know I'm Here", label: "Discover opportunities around you", tone: "bg-brand/10 text-brand" },
  { step: "Connect + participate", label: "Resources · Programs · Events · Health · Jobs · Recreation", tone: "bg-brand/10 text-brand" },
];

function Learn() {
  return (
    <div className="container-kih py-8 sm:py-12">
      <SectionHeading
        eyebrow="Everyday Connect Learning"
        title="Digital Confidence for Everyday Life"
        text="Everyday Connect is not a seniors-only program. It helps anyone build the confidence and practical skills to use the technology they already own — so they can reach the opportunities around them."
      />

      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold">Need help using the technology first?</h2>
        <p className="mt-3 max-w-3xl text-foreground/70">
          Having access to a smartphone or the internet does not always mean someone feels confident using it. Everyday Connect provides simple,
          step-by-step digital confidence training for older adults, youth, families, caregivers, working adults, and community members.
        </p>
        <p className="card-pop mt-5 p-5 font-display text-lg font-semibold">
          Everyday Connect teaches you how to use the technology.{" "}
          <span className="text-brand">Know I&apos;m Here helps you use that confidence to connect with opportunities around you.</span>
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold">Who it&apos;s for</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {PATHWAYS.map((p) => (
            <article key={p.title} className={`card-pop p-6 ${p.tone}`}>
              <span className="text-3xl" aria-hidden>{p.emoji}</span>
              <h3 className="mt-2 font-display text-xl font-bold">{p.title}</h3>
              <p className="mt-2 text-foreground/70">{p.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold">Everyday Connect can help with</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {HELP_AREAS.map((a) => (
            <li key={a.label} className="chip min-h-12 px-5 text-base">
              <span aria-hidden>{a.emoji}</span> {a.label}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted-foreground">
          Full lessons, videos and guided practice live on the Everyday Connect learning platform.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold">How Everyday Connect + Know I&apos;m Here work together</h2>
        <div className="card-pop mt-4 p-6 sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-wider text-brand">How it works</p>
          <p className="mt-3 max-w-2xl text-foreground/75">
            Everyday Connect helps people build the digital confidence to use technology. Know I&apos;m Here helps people use that confidence to
            discover resources, programs, services and opportunities around them.
          </p>
          <div className="mt-6 w-full overflow-hidden rounded-xl border border-border shadow-md">
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1920/1080" }}>
              <iframe
                src="https://share.synthesia.io/embeds/videos/099fb05f-20a2-4447-a486-a998e1387f69"
                loading="lazy"
                title="Synthesia video player - Connecting Know I'm Here & Everday Connect"
                allowFullScreen
                allow="encrypted-media; fullscreen; microphone; screen-wake-lock;"
                className="absolute left-0 top-0 m-0 h-full w-full border-0 p-0"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold">From confidence to connection</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FLOW.map((item) => (
            <li key={item.step} className="card-flat flex flex-col gap-2 p-4">
              <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${item.tone}`}>
                {item.step}
              </span>
              <span className="text-sm font-semibold text-foreground/70">{item.label}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="card-pop mt-10 p-6 sm:p-8">
        <h2 className="font-display text-2xl font-bold">Ready to start learning?</h2>
        <p className="mt-2 max-w-2xl text-foreground/70">
          Explore step-by-step lessons, videos, guided practice, and digital confidence tools on the full Everyday Connect learning platform.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href={EXTERNAL_LINKS.everydayConnect} target="_blank" rel="noreferrer" className="btn-base btn-brand min-h-14">
            Open Everyday Connect ↗
          </a>
          <Link to="/" className="btn-base btn-outline min-h-14">Back to Know I&apos;m Here</Link>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold">Need digital support?</h2>
        <p className="mt-2 max-w-2xl text-foreground/70">
          <span className="font-bold">Connect 313</span> is Detroit-wide digital inclusion infrastructure — devices, internet access and technical
          support. <span className="font-bold">Everyday Connect</span> is simple guided education that helps residents use technology comfortably. Both
          are useful, for different reasons.
        </p>
        <div className="mt-4">
          <CityResourceCard resource={cityResource("connect-313")} />
        </div>
      </section>
    </div>
  );
}
