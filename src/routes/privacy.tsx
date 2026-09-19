import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/kih/SectionHeading";
import { EmergencyNotice } from "@/components/kih/EmergencyNotice";

const TITLE = "Privacy, Responsible AI & Terms | Know I'm Here";
const DESC = "How Know I'm Here handles location, check-ins and personal data, what our AI guide may and may not do, and prototype terms of use.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Privacy,
});

function List({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((i) => (
        <li key={i} className="flex gap-2 text-foreground/80"><span aria-hidden>•</span>{i}</li>
      ))}
    </ul>
  );
}

function Privacy() {
  return (
    <div className="container-kih py-8 sm:py-12">
      <SectionHeading eyebrow="Your trust matters" title="Privacy, Responsible AI & Terms" text="Plain language. No fine print tricks." />
      <div className="mt-6"><EmergencyNotice /></div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <section className="card-pop p-6" aria-labelledby="privacy">
          <h2 id="privacy" className="font-display text-2xl font-bold">🔒 Privacy</h2>
          <List items={[
            "Location is optional. Turn it on or off any time and choose your radius.",
            "You choose your interests — and can change them.",
            "I'm Here check-ins are private by default. You decide if family or a caregiver sees them.",
            "We never share your location automatically.",
            "Your data is not sold.",
            "We don't ask for sensitive information we don't need.",
            "Basic discovery works without sharing much at all.",
            "Prototype data may be simulated for demonstration.",
          ]} />
        </section>

        <section className="card-pop p-6" aria-labelledby="ai">
          <h2 id="ai" className="font-display text-2xl font-bold">🤖 Responsible AI</h2>
          <p className="mt-3 font-bold">The AI guide may:</p>
          <List items={["Understand your question", "Match your needs to resources", "Summarize information", "Personalize suggestions", "Simplify navigation"]} />
          <p className="mt-4 font-bold">It must not:</p>
          <List items={["Make medical diagnoses", "Draw legal conclusions", "Make emergency-response decisions", "Guarantee eligibility", "Declare a neighborhood “safe”", "Submit reports on your behalf", "Make high-stakes decisions for you"]} />
          <p className="mt-4 rounded-2xl bg-sun/30 px-4 py-3 text-sm font-semibold">Always verify important eligibility, health, legal, emergency and government information through the official provider.</p>
        </section>

        <section className="card-pop p-6" aria-labelledby="terms">
          <h2 id="terms" className="font-display text-2xl font-bold">📄 Terms (prototype)</h2>
          <List items={[
            "Know I'm Here is a prototype built for the Venture 313 Buildathon.",
            "Listings and metrics are realistic demonstration data unless marked official.",
            "External information should be verified with the provider.",
            "Third-party services (transit, rideshare, City reporting) are responsible for their own services.",
            "No partnership or endorsement is implied by naming an organization or the City of Detroit.",
            "Location and sharing features are consent-based.",
            "Know I'm Here is not an emergency-response platform. For emergencies, call 911.",
          ]} />
        </section>
      </div>

      <section id="kih-data" className="card-pop mt-8 scroll-mt-24 p-6" aria-labelledby="kih-data-title">
        <span className="eyebrow">About KIH data</span>
        <h2 id="kih-data-title" className="mt-3 font-display text-2xl font-bold">
          What we measure, why, and what we never sell or share
        </h2>
        <p className="mt-3 text-foreground/80">
          Know I&apos;m Here may measure how residents use the platform — such as resources viewed, directions
          requested, categories explored and voluntary check-ins — to understand what is useful and where community
          needs exist.
        </p>
        <p className="mt-2 font-bold">
          KIH does not need to create a history of everywhere you travel to measure community engagement.
        </p>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <div>
            <h3 className="font-display text-lg font-bold">What we measure</h3>
            <List items={[
              "Visits to the app, counted anonymously.",
              "Resources viewed, saved, called or opened on a provider website.",
              "Get There actions and which transportation option was chosen.",
              "Map opens and markers selected.",
              "Whether you used your current location or chose a ZIP / neighborhood, and your chosen distance.",
              "The general topic of an Ask KIH question — never the question itself.",
              "Voluntary check-ins, self-reported or location-verified.",
            ]} />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold">Why we measure it</h3>
            <List items={[
              "To see whether residents can actually find and reach community resources.",
              "To show organizations aggregate participation instead of flyer counts.",
              "To spot gaps — repeated needs with too few matching resources.",
              "To improve the parts of the experience residents struggle with.",
            ]} />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold">What we do not sell or share</h3>
            <List items={[
              "No exact location is recorded anywhere — no coordinates, no travel history.",
              "No individual resident identity, question history or private check-in record goes to partners.",
              "Neighborhood reporting is hidden unless at least five residents contributed to it.",
              "No advertising trackers and no cross-site tracking.",
              "Your data is not sold.",
              "Anonymous event records are kept for trend reporting and removed after 400 days.",
            ]} />
          </div>
        </div>
        <p className="mt-5 rounded-2xl bg-sun/30 px-4 py-3 text-sm font-semibold">
          Sponsor the connection — not the resident&apos;s data. Organizations can support the infrastructure and learn
          from aggregate engagement patterns without buying individual resident location histories or check-in records.
        </p>
      </section>
    </div>
  );
}
