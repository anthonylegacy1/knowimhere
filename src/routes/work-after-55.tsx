import { createFileRoute, Link } from "@tanstack/react-router";
import { ResourceCard } from "@/components/kih/ResourceCard";
import { SectionHeading } from "@/components/kih/SectionHeading";
import { EverydayConnectTip } from "@/components/kih/EverydayConnectTip";
import { RESOURCES } from "@/data/resources";

const TITLE = "Work After 55 — Senior Employment Resources in Detroit | Know I'm Here";
const DESC =
  "Job search help, part-time and flexible work, paid training, resume support and digital skills for Detroit adults 55 and older — plus transportation to work or training.";

export const Route = createFileRoute("/work-after-55")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: WorkAfter55,
});

const PATHS = [
  { emoji: "🔎", title: "Find a job", text: "Openings and hiring events across Detroit, including part-time and daytime shifts." },
  { emoji: "🕑", title: "Part-time opportunities", text: "Retail, customer service, office, hospitality and community work." },
  { emoji: "↩️", title: "Get back into the workforce", text: "Counseling for adults returning after a break, retirement or caregiving." },
  { emoji: "💵", title: "Earn while you train", text: "Paid training placements and stipend programs." },
  { emoji: "📄", title: "Resume & application help", text: "One-on-one help writing a resume and completing online applications." },
  { emoji: "📱", title: "Digital skills for work", text: "Email, online forms, video interviews — through Everyday Connect." },
  { emoji: "🚌", title: "Transportation to work or training", text: "Transit planning and ride options so getting there isn't the barrier." },
];

const IDS = ["work-after-55", "part-time-openings", "workforce-training", "digital-skills", "ride-assistance"];

function WorkAfter55() {
  const list = IDS.map((id) => RESOURCES.find((r) => r.id === id)!).filter(Boolean);

  return (
    <div className="container-kih py-8 sm:py-12">
      <SectionHeading
        eyebrow="Senior employment"
        title="Work After 55"
        text="Some people want the income. Some want the routine and the people. Either way, Know I'm Here helps you find the next step — and how to get there."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PATHS.map((p) => (
          <div key={p.title} className="card-flat p-5">
            <span className="text-2xl" aria-hidden>{p.emoji}</span>
            <h2 className="mt-2 font-display text-lg font-bold">{p.title}</h2>
            <p className="mt-1 text-sm text-foreground/70">{p.text}</p>
          </div>
        ))}
      </div>

      <div className="card-flat mt-8 p-5 text-sm text-foreground/75">
        <p className="font-bold text-foreground">Age-specific or simply useful?</p>
        <p className="mt-1">
          Cards marked <span className="font-bold">Ages 55+</span> are built for older adults. Others are general opportunities that may be a good fit
          — we don&apos;t claim every listing is age-specific.
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((r) => (
          <ResourceCard key={r.id} resource={r} />
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/ask" className="btn-base btn-brand">Ask: &ldquo;I&apos;m 65 and want a part-time job&rdquo;</Link>
        <Link to="/learn" className="btn-base btn-outline">Build digital confidence first</Link>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Buildathon demonstration data. Verify eligibility, pay and schedules directly with the provider.
      </p>
    </div>
  );
}
