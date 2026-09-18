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
        <div className="mt-8 border-t border-border pt-5 text-xs text-muted-foreground">
          <p>
            Know I&apos;m Here is an independent prototype. It is not an official City of Detroit platform and is not
            endorsed by the Rise Higher Detroit initiative. Resource listings are realistic demonstration data unless
            marked as an official resource. For emergencies, call 911.
          </p>
          <p className="mt-2 font-semibold">Fast Freddy created the trust. Everyday Connect created the confidence. Know I&apos;m Here creates the connection.</p>
        </div>
      </div>
    </footer>
  );
}
