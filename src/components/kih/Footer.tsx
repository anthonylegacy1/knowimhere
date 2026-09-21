import { Link } from "@tanstack/react-router";
import { EXTERNAL_LINKS } from "@/data/resources";
import mark from "@/assets/kih-mark.png";

export function Footer() {
  return (
    <footer className="border-t-2 border-border bg-cream pb-28 lg:pb-8">
      <div className="container-kih py-10">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <img src={mark} alt="" width={32} height={32} className="size-8" loading="lazy" />
              <span className="font-display text-lg font-bold">Know I&apos;m Here</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Detroit has resources. Know I&apos;m Here helps residents find, understand and use them.
            </p>
            <p className="mt-3 text-xs font-semibold text-muted-foreground">
              Anthony Legacy Holdings LLC · Venture 313 Buildathon MVP
            </p>
          </div>
          <div>
            <p className="font-display font-bold">Explore</p>
            <ul className="mt-3 space-y-2 text-sm font-semibold text-foreground/70">
              <li><Link to="/for-you" className="hover:text-brand">For You Today</Link></li>
              <li><Link to="/ask" className="hover:text-brand">Ask KIH</Link></li>
              <li><Link to="/neighborhood" className="hover:text-brand">My Neighborhood</Link></li>
              <li><Link to="/opportunities" className="hover:text-brand">Education &amp; Youth Opportunities</Link></li>
              <li><Link to="/work-after-55" className="hover:text-brand">Work After 55</Link></li>
              <li><Link to="/learn" className="hover:text-brand">Everyday Connect Learning</Link></li>
              <li><Link to="/help" className="hover:text-brand">Need Help? Watch Instead.</Link></li>
              <li><Link to="/partners" className="hover:text-brand">Partners &amp; Impact</Link></li>
              <li><Link to="/changelog" className="hover:text-brand">Buildathon Changelog</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-display font-bold">Ecosystem &amp; Trust</p>
            <ul className="mt-3 space-y-2 text-sm font-semibold text-foreground/70">
              <li>
                <a href={EXTERNAL_LINKS.fastFreddy} target="_blank" rel="noreferrer" className="hover:text-brand">
                  Fast Freddy Experience ↗
                </a>
              </li>
              <li>
                <a href={EXTERNAL_LINKS.everydayConnect} target="_blank" rel="noreferrer" className="hover:text-brand">
                  Everyday Connect ↗
                </a>
              </li>
              <li><Link to="/story" className="hover:text-brand">How We Got Here</Link></li>
              <li><Link to="/privacy" className="hover:text-brand">Privacy · Responsible AI · Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-5">
          <p className="font-display font-bold">Contact Know I&apos;m Here</p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Questions, partnership opportunities, resource updates or community feedback?
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <a href="mailto:info@knowimhere.com" className="btn-base btn-brand text-sm">
              Email us
            </a>
            <a href="mailto:info@knowimhere.com" className="text-sm font-semibold text-foreground/70 hover:text-brand">
              info@knowimhere.com
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-5 text-xs text-muted-foreground">
          <p>
            Know I&apos;m Here is an independent prototype. It is not an official City of Detroit platform and is not
            endorsed by the Rise Higher Detroit initiative. Resource listings are realistic demonstration data unless
            marked as an official resource. For emergencies, call 911.
          </p>
          <p className="mt-2 font-semibold">Fast Freddy created the trust. Everyday Connect created the confidence. Know I&apos;m Here creates the connection.</p>
        </div>
        <div className="mt-6 border-t border-border pt-5 text-xs text-muted-foreground">
          <p className="font-display text-sm font-bold text-foreground">
            Know I&apos;m Here™
          </p>
          <p className="mt-1">A community connectivity concept developed by Anthony Legacy Holdings LLC.</p>
          <p className="mt-1">© 2026 Anthony Legacy Holdings LLC. All rights reserved.</p>
          <p className="mt-1 font-semibold text-foreground/80">Venture 313 Demonstration Prototype</p>
          <details className="group mt-4">
            <summary className="flex w-fit cursor-pointer list-none items-center gap-1 rounded text-sm font-semibold text-foreground/80 underline decoration-border underline-offset-4 transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-brand">
              Prototype, Privacy &amp; Legal Information <span aria-hidden="true" className="transition-transform group-open:rotate-180">↓</span>
            </summary>
            <div className="mt-4 space-y-5 max-w-3xl leading-relaxed">
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wide text-foreground/80">Prototype Notice</h3>
                <p className="mt-1">
                  Know I&apos;m Here is currently a demonstration prototype. Features, recommendations, organizations,
                  locations and resources may be presented for demonstration purposes. Items identified as &ldquo;Demo
                  Example&rdquo; are illustrative. Items identified as &ldquo;Real Detroit Example&rdquo; represent actual
                  community activities or resources as indicated.
                </p>
              </section>
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wide text-foreground/80">Organizations &amp; Partnerships</h3>
                <p className="mt-1">
                  References to third-party organizations, agencies, locations or resources are informational unless
                  otherwise stated. Their inclusion does not by itself indicate a partnership, sponsorship or endorsement.
                </p>
              </section>
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wide text-foreground/80">Ownership</h3>
                <p className="mt-1">
                  Know I&apos;m Here™ and its original branding, written content, interface concepts and creative
                  materials are proprietary to Anthony Legacy Holdings LLC, except for third-party names, trademarks,
                  photographs, content or other materials owned by their respective rights holders.
                </p>
              </section>
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wide text-foreground/80">Privacy &amp; Participation</h3>
                <p className="mt-1">
                  Know I&apos;m Here is designed around permission-based participation. Prototype demonstrations of
                  location, personalization, check-ins and engagement data illustrate intended functionality and should
                  not imply that production data systems or integrations are currently active.
                </p>
              </section>
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wide text-foreground/80">Information Disclaimer</h3>
                <p className="mt-1">
                  Information displayed by the prototype is intended for informational and demonstration purposes. Users
                  should verify time-sensitive information, eligibility, availability, transportation and other resource
                  details with the applicable provider.
                </p>
              </section>
            </div>
          </details>
        </div>
      </div>
    </footer>
  );
}
