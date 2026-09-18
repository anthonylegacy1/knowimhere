import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, MapPin, MessageCircle } from "lucide-react";
import social from "@/assets/community-social.jpg";
import heroAsset from "@/assets/detroit-sunset-skyline.png.asset.json";
import spiritAsset from "@/assets/spirit-of-detroit.jpeg.asset.json";
import riverwalkAsset from "@/assets/detroit-riverwalk.jpeg.asset.json";
import hartPlazaAsset from "@/assets/hart-plaza.jpeg.asset.json";
import renaissanceAsset from "@/assets/renaissance-center.jpeg.asset.json";
import fordFieldAsset from "@/assets/ford-field.jpeg.asset.json";
import littleCaesarsAsset from "@/assets/little-caesars-arena.jpeg.asset.json";
import comericaAsset from "@/assets/comerica-park.png.asset.json";
import communityAsset from "@/assets/fast-freddy-community-class.jpeg.asset.json";
import { PhoneDemo } from "@/components/kih/PhoneDemo";
import { SectionHeading } from "@/components/kih/SectionHeading";
import { Button } from "@/components/ui/button";
import { PRIORITIES, EXTERNAL_LINKS, VIDEOS, PERSONAS, NEED_CATEGORIES, FRONT_DOOR, CATEGORIES } from "@/data/resources";

const TITLE = "Know I'm Here — Discover What Detroit Has For You";
const DESC =
  "Know I'm Here connects Detroit residents with nearby community resources, health programs, activities, neighborhood information, transportation options and opportunities personalized to their needs.";

export const Route = createFileRoute("/")({
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
  component: Index,
});

function Index() {
  return (
    <div>
      {/* IMMERSIVE DETROIT HERO */}
      <section className="home-hero relative overflow-hidden">
        <img
          src={heroAsset.url}
          alt="Detroit skyline and Renaissance Center glowing at sunset across the river"
          width={1672}
          height={941}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="container-kih relative z-10 flex min-h-[43rem] flex-col items-center px-5 pb-36 pt-16 text-center text-cream sm:pt-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-cream/25 bg-ink/55 px-4 py-2 text-xs font-extrabold uppercase tracking-wider backdrop-blur">
            <MapPin className="size-3.5 text-aqua" /> Venture 313 Buildathon Prototype · Detroit
          </span>
          <h1 className="mt-6 max-w-4xl font-sans text-5xl font-extrabold leading-[1.04] sm:text-7xl">
            Your Detroit. Connected to You.
          </h1>
          <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-cream/85 sm:text-lg">
            Know I&apos;m Here helps Detroit residents discover nearby resources, services, activities, programs and opportunities based on where they are, what they need and what matters to them.
          </p>
          <div className="mt-7 grid w-full max-w-sm gap-3">
            <Button asChild size="lg" className="min-h-14 rounded-md bg-aqua text-ink shadow-lg hover:bg-aqua/90">
              <Link to="/onboarding"><MapPin /> Find What&apos;s Near Me</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="min-h-14 rounded-md border-cream/40 bg-ink/65 text-cream backdrop-blur hover:bg-ink hover:text-cream">
              <Link to="/ask"><MessageCircle /> Ask Know I&apos;m Here</Link>
            </Button>
            <Button asChild variant="link" className="text-cream hover:text-aqua">
              <Link to="/for-you">Explore Detroit Resources <ArrowRight /></Link>
            </Button>
          </div>
          <ArrowDown className="mt-6 size-5 text-aqua" aria-hidden />
        </div>
      </section>

      {/* PHONE PRODUCT DEMO */}
      <section className="product-demo-band relative z-20 -mt-28 pb-16">
        <div className="container-kih">
          <PhoneDemo />
        </div>
      </section>

      {/* DISCOVER DETROIT */}
      <section className="bg-card py-14">
        <div className="container-kih">
          <SectionHeading
            eyebrow="Detroit around you"
            title="Discover Detroit"
            text="Landmarks, gathering places and everyday spaces where residents connect — and where Know I'm Here helps surface what is nearby."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Spirit of Detroit", type: "Civic", image: spiritAsset.url, text: "City services, public information and downtown resources." },
              { title: "Detroit Riverwalk", type: "Recreation", image: riverwalkAsset.url, text: "Walking, wellness, waterfront activity and community programs." },
              { title: "Hart Plaza", type: "Downtown", image: hartPlazaAsset.url, text: "Events, culture and gathering in the heart of Detroit." },
              { title: "Renaissance Center", type: "Landmark", image: renaissanceAsset.url, text: "A familiar skyline landmark connected to downtown discovery." },
              { title: "Ford Field", type: "Sports", image: fordFieldAsset.url, text: "Sports, major events and nearby community activity." },
              { title: "Little Caesars Arena", type: "Entertainment", image: littleCaesarsAsset.url, text: "Entertainment, employment and activity in The District Detroit." },
              { title: "Comerica Park", type: "Sports", image: comericaAsset.url, text: "Baseball, downtown experiences and seasonal events." },
            ].map((place) => (
              <article key={place.title} className="overflow-hidden rounded-lg border border-border bg-background">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={place.image} alt={place.title} className="size-full object-cover transition-transform duration-300 hover:scale-[1.02]" loading="lazy" />
                  <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-[10px] font-extrabold uppercase text-cream backdrop-blur">{place.type}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-sans text-lg font-bold">{place.title}</h3>
                  <p className="mt-1 text-sm text-foreground/65">{place.text}</p>
                  <Link to="/ask" search={{ q: `What's around ${place.title}?` }} className="mt-3 inline-flex min-h-10 items-center gap-1 text-sm font-bold text-sky">
                    Explore nearby <ArrowRight className="size-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-5 text-xs text-muted-foreground">Location photography is used for discovery context. Resource availability shown in this prototype should be verified with the official provider.</p>
        </div>
      </section>

      {/* CONNECTION STATEMENT + JOURNEY */}
      <section className="bg-card pb-16 text-center">
        <div className="container-kih">
          <p className="mx-auto max-w-3xl font-sans text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            Detroit has resources.
            <span className="mt-2 block font-medium text-foreground/65">The challenge is connecting the right resource to the right resident at the right time.</span>
          </p>
          <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {["Discover", "Connect", "Get There", "Check In", "Stay Connected"].map((step, index) => (
              <div key={step} className={`flex min-h-24 flex-col items-center justify-center rounded-md border border-border p-3 ${index === 4 ? "col-span-2 sm:col-span-1" : ""}`}>
                <span className="text-xs font-extrabold text-sky">0{index + 1}</span>
                <span className="mt-1 font-sans font-bold text-ink">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONNECTION GAP */}
      <section className="bg-background py-14">
        <div className="container-kih">
        <SectionHeading
          eyebrow="The Detroit Connection Gap"
          title="Different resources. One place to understand what matters to you."
          text="The City, nonprofits, businesses and community organizations already create resources. The hard part is helping the right resident actually reach the right one."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="card-flat p-6">
            <p className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">Today</p>
            <div className="mt-3 flex flex-col items-center gap-2 text-center">
              <span className="chip text-base">🧍 Resident</span>
              <span className="text-2xl text-muted-foreground">↓</span>
              <div className="flex flex-wrap justify-center gap-1.5">
                {[
                  "City websites",
                  "Nonprofits",
                  "Facebook pages",
                  "Health organizations",
                  "Flyers",
                  "Recreation centers",
                  "Transportation systems",
                  "Neighborhood groups",
                  "Community events",
                ].map((x) => (
                  <span key={x} className="chip bg-card text-foreground/70">
                    {x}
                  </span>
                ))}
              </div>
              <span className="text-2xl text-muted-foreground">↓</span>
              <span className="rounded-2xl bg-foreground/5 px-4 py-2 font-display text-lg font-bold text-foreground/60">
                Fragmented information
              </span>
            </div>
          </div>
          <div className="card-pop p-6">
            <p className="text-xs font-extrabold uppercase tracking-wide text-brand">With Know I&apos;m Here</p>
            <div className="mt-3 flex flex-col items-center gap-2 text-center">
              <span className="chip text-base">🧍 Resident</span>
              <span className="text-2xl text-muted-foreground">↓</span>
              <span className="rounded-2xl bg-brand px-5 py-3 font-display text-lg font-bold text-brand-foreground shadow-[var(--shadow-pop-brand)]">
                KNOW I&apos;M HERE AI
              </span>
              <span className="text-2xl text-muted-foreground">↓</span>
              <div className="grid w-full grid-cols-2 gap-2">
                {["Right resource", "Right resident", "Right time", "Clear next action"].map((x) => (
                  <span key={x} className="rounded-xl bg-mint/15 px-3 py-2 font-display font-bold text-mint">
                    {x}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <p className="mt-6 text-center font-display text-xl font-bold">
          WHO YOU ARE + WHAT YOU NEED + WHERE YOU ARE + WHAT IS AVAILABLE ={" "}
          <span className="text-brand">PERSONALIZED NEXT ACTION</span>
        </p>
        </div>
      </section>

      {/* ONE DETROIT — PERSONAS */}
      <section className="border-y-2 border-border bg-card">
        <div className="container-kih py-14">
          <SectionHeading
            eyebrow="One Detroit. Different needs."
            title="One connection layer."
            text="A 68-year-old, a 16-year-old and a working parent ask very different questions. The same system answers all three."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {PERSONAS.map((p) => (
              <div key={p.id} className="card-flat flex flex-col p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-full bg-sun font-display text-xl font-bold">{p.initial}</span>
                  <div>
                    <h3 className="font-display text-xl font-bold">{p.name}, {p.age}</h3>
                    <p className="text-sm text-foreground/60">{p.tagline}</p>
                  </div>
                </div>
                <p className="mt-4 rounded-2xl rounded-tl-sm bg-ink px-4 py-2.5 text-sm font-semibold text-cream">
                  &ldquo;{p.query}&rdquo;
                </p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {p.needs.slice(0, 5).map((n) => (
                    <li key={n} className="chip bg-card text-xs text-foreground/70">{n}</li>
                  ))}
                </ul>
                <Link to="/demo" className="btn-base btn-soft btn-sm mt-auto pt-0 self-start mt-4">
                  See {p.name}&apos;s demo
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Dorothy, Marcus and Tasha are fictional residents created for the Buildathon demonstration.
          </p>
        </div>
      </section>

      {/* WHAT DO YOU NEED TODAY */}
      <section className="container-kih py-14">
        <SectionHeading
          eyebrow="Personalized discovery"
          title="What do you need today?"
          text="Pick a starting point, or just ask in your own words. Your interests shape what comes back."
        />
        <div className="mt-7 flex flex-wrap gap-2.5">
          {NEED_CATEGORIES.map((id) => {
            const c = CATEGORIES[id];
            return (
              <Link
                key={id}
                to="/ask"
                search={{ q: `Show me ${c.label.toLowerCase()} near me.` }}
                className="chip min-h-12 cursor-pointer px-4 text-base hover:bg-card"
              >
                <span aria-hidden>{c.emoji}</span> {c.label}
              </Link>
            );
          })}
        </div>
      </section>

      {/* HUBS */}
      <section className="container-kih pb-14">
        <div className="grid gap-5 md:grid-cols-3">
          <Link to="/opportunities" className="card-pop p-6 transition-transform hover:-translate-y-0.5">
            <span className="text-3xl" aria-hidden>🎒</span>
            <h3 className="mt-2 font-display text-xl font-bold">Education &amp; Youth Opportunities</h3>
            <p className="mt-1 text-sm text-foreground/65">
              After-school, tutoring, summer jobs, internships, trades, college help, mentoring, sports, STEM and youth wellness.
            </p>
            <p className="mt-3 text-sm font-bold text-brand">Open the hub →</p>
          </Link>
          <Link to="/work-after-55" className="card-pop p-6 transition-transform hover:-translate-y-0.5">
            <span className="text-3xl" aria-hidden>💼</span>
            <h3 className="mt-2 font-display text-xl font-bold">Work After 55</h3>
            <p className="mt-1 text-sm text-foreground/65">
              Part-time and flexible work, paid training, resume help, digital skills and a ride to get there.
            </p>
            <p className="mt-3 text-sm font-bold text-brand">Senior employment →</p>
          </Link>
          <Link to="/learn" className="card-pop p-6 transition-transform hover:-translate-y-0.5">
            <span className="text-3xl" aria-hidden>📱</span>
            <h3 className="mt-2 font-display text-xl font-bold">Everyday Connect Learning</h3>
            <p className="mt-1 text-sm text-foreground/65">
              Digital confidence for everyday life — two pathways: Older Adults and Future Ready for students.
            </p>
            <p className="mt-3 text-sm font-bold text-brand">Start learning →</p>
          </Link>
        </div>
      </section>

      {/* FRONT DOOR */}
      <section className="border-y-2 border-border bg-card">
        <div className="container-kih py-14">
          <SectionHeading
            eyebrow="One intelligent front door"
            title="Know I'm Here helps you find the right door."
            text="The trusted organization provides the service. We don't replace Detroit's existing systems — we route you to the right one."
          />
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FRONT_DOOR.map((f) => (
              <div key={f.need} className="card-flat flex items-center gap-3 p-4">
                <span aria-hidden>{f.emoji}</span>
                <span className="font-display font-bold">{f.need}</span>
                <span className="text-muted-foreground">→</span>
                <span className="text-sm font-semibold text-foreground/70">{f.route}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RISE HIGHER PRIORITIES */}
      <section className="border-y-2 border-border bg-card">
        <div className="container-kih py-14">
          <SectionHeading
            eyebrow="Resident priorities"
            title="Detroit Already Told Us What Matters"
            text="The Rise Higher Detroit process collected thousands of resident responses and organized community priorities around six major areas. Know I'm Here helps residents connect with the resources and opportunities related to those priorities."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRIORITIES.map((p) => (
              <div key={p.title} className="card-flat p-5">
                <span className="text-2xl" aria-hidden>
                  {p.emoji}
                </span>
                <h3 className="mt-2 font-display text-lg font-bold">{p.title}</h3>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {p.items.map((i) => (
                    <li key={i} className="chip bg-card text-xs font-semibold text-foreground/70">
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-xs text-muted-foreground">
            Know I&apos;m Here is an independent prototype and is not an official City of Detroit platform or endorsed by
            the Rise Higher Detroit initiative. We don&apos;t claim to solve all six priorities — we help make the
            services, programs and opportunities connected to them easier to find, understand and use.
          </p>
        </div>
      </section>

      {/* GET THERE */}
      <section className="container-kih py-14">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Help me get there"
              title="Finding something useful is only half the solution."
              text="Know I'm Here also helps you figure out how to get there — with options that fit how you actually move."
            />
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-sky/15 px-4 py-2 text-sm font-bold text-sky">Bus / Transit</span>
              <span className="rounded-full bg-mint/15 px-4 py-2 text-sm font-bold text-mint">Walking</span>
              <span className="rounded-full bg-brand/15 px-4 py-2 text-sm font-bold text-brand">Ride Assistance</span>
              <span className="rounded-full bg-plum/15 px-4 py-2 text-sm font-bold text-plum">Rideshare</span>
              <span className="rounded-full bg-foreground/10 px-4 py-2 text-sm font-bold text-foreground/60">
                Community Ride · Coming Soon
              </span>
              <span className="rounded-full bg-foreground/10 px-4 py-2 text-sm font-bold text-foreground/60">
                Senior Transit · Coming Soon
              </span>
            </div>
          </div>
          <div className="card-pop p-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden>
                🏀
              </span>
              <div>
                <h3 className="font-display text-xl font-bold">Patton Recreation Center</h3>
                <p className="text-sm text-foreground/60">1.8 miles away · Tuesday • 11:00 AM</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link to="/resource/$id" params={{ id: "senior-fitness" }} search={{ step: "get-there" }} className="btn-base btn-ink btn-sm">
                Bus Route
              </Link>
              <Link to="/resource/$id" params={{ id: "senior-fitness" }} search={{ step: "get-there" }} className="btn-base btn-brand btn-sm">
                Community Ride
              </Link>
              <Link to="/resource/$id" params={{ id: "senior-fitness" }} search={{ step: "get-there" }} className="btn-base btn-soft btn-sm">
                Request Ride Assistance
              </Link>
              <Link to="/resource/$id" params={{ id: "senior-fitness" }} search={{ step: "get-there" }} className="btn-base btn-soft btn-sm">
                Rideshare
              </Link>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Non-integrated options are clearly marked “Coming Soon” or “Potential”.</p>
          </div>
        </div>
      </section>

      {/* NEIGHBORHOOD + CHECK-IN teaser */}
      <section className="border-y-2 border-border bg-card">
        <div className="container-kih grid gap-8 py-14 lg:grid-cols-2">
          <div className="card-flat overflow-hidden">
            <img
              src={social}
              alt="Seniors and young people dancing together at a Detroit community social"
              width={1280}
              height={853}
              loading="lazy"
              className="aspect-[3/2] w-full object-cover"
            />
            <div className="p-6">
              <p className="text-xs font-extrabold uppercase tracking-wide text-brand">My Neighborhood</p>
              <h3 className="mt-1 font-display text-2xl font-bold">Know What&apos;s Happening Around You</h3>
              <p className="mt-2 text-foreground/65">
                Community meetings, rec-center updates, cooling centers, road closures and City notices — calm, clear and
                filtered to your neighborhood.
              </p>
              <Link to="/neighborhood" className="btn-base btn-outline mt-4">
                See my neighborhood <ArrowRight className="size-5" />
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="rounded-3xl bg-brand p-6 text-brand-foreground shadow-[var(--shadow-pop-brand)]">
              <p className="text-xs font-extrabold uppercase tracking-wide text-brand-foreground/80">Signature feature</p>
              <h3 className="mt-1 font-display text-3xl font-bold">I&apos;M HERE ✓</h3>
              <p className="mt-2 text-brand-foreground/90">
                When you arrive, tap in. It closes the loop between a resource existing and a resident actually using it —
                and it&apos;s private by default.
              </p>
              <Link to="/demo" className="btn-base mt-4 bg-card text-brand shadow-[0_4px_0_0_oklch(0_0_0/20%)]">
                See it in the demo
              </Link>
            </div>
            <div className="card-flat p-6">
              <p className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">Need help? Watch instead.</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {VIDEOS.slice(0, 4).map((v) => (
                  <li key={v.id} className="flex items-center gap-2 text-sm font-semibold">
                    <span aria-hidden>{v.emoji}</span> {v.title}
                  </li>
                ))}
              </ul>
              <Link to="/help" className="mt-4 inline-flex min-h-11 items-center gap-1 font-bold text-sky">
                All video guides <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="bg-ink text-cream">
        <div className="container-kih py-14">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">How we got here.</h2>
          <p className="mt-3 max-w-xl text-cream/70">
            Know I&apos;m Here didn&apos;t start as a theoretical technology idea. It grew out of real community engagement.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <a
              href={EXTERNAL_LINKS.fastFreddy}
              target="_blank"
              rel="noreferrer"
              className="overflow-hidden rounded-lg border-2 border-cream/10 bg-cream/5 transition-colors hover:bg-cream/10"
            >
              <img src={communityAsset.url} alt="Fast Freddy leading a Detroit community movement class" className="aspect-[16/9] w-full object-cover" loading="lazy" />
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-wide text-sun">Trust + Community</p>
                <h3 className="mt-1 font-display text-xl font-bold">Fast Freddy Experience</h3>
                <p className="mt-2 text-sm text-cream/65">Culture, movement and senior programming that built real in-person trust.</p>
                <p className="mt-3 text-sm font-bold text-sun">Visit Fast Freddy Experience →</p>
              </div>
            </a>
            <a
              href={EXTERNAL_LINKS.everydayConnect}
              target="_blank"
              rel="noreferrer"
              className="rounded-3xl border-2 border-cream/10 bg-cream/5 p-6 transition-colors hover:bg-cream/10"
            >
              <span className="text-2xl" aria-hidden>📱</span>
              <p className="mt-2 text-xs font-bold uppercase tracking-wide text-sky">Digital Confidence</p>
              <h3 className="mt-1 font-display text-xl font-bold">Everyday Connect</h3>
              <p className="mt-2 text-sm text-cream/65">
                Digital confidence for everyday life — older adults, working adults, parents and students alike.
              </p>
              <p className="mt-3 text-sm font-bold text-sky">Explore Everyday Connect →</p>
            </a>
            <Link to="/story" className="rounded-3xl border-2 border-brand-deep bg-brand p-6 transition-transform hover:-translate-y-0.5">
              <span className="text-2xl" aria-hidden>🔗</span>
              <p className="mt-2 text-xs font-bold uppercase tracking-wide text-brand-foreground/80">Connection</p>
              <h3 className="mt-1 font-display text-xl font-bold text-brand-foreground">Know I&apos;m Here</h3>
              <p className="mt-2 text-sm text-brand-foreground/85">
                Once confident with tech, connect to people, resources and opportunities nearby.
              </p>
              <p className="mt-3 text-sm font-bold text-brand-foreground">Read our story →</p>
            </Link>
          </div>
          <p className="mt-6 text-center font-display text-lg font-bold text-sun">Trust → Confidence → Connection</p>
        </div>
      </section>

      {/* CLOSING */}
      <section className="mx-auto max-w-4xl px-5 py-16 text-center">
        <p className="mx-auto max-w-2xl font-display text-xl font-bold leading-snug">
          Senior or student. Job or health resource. Community event or career opportunity.
          <br />
          <span className="text-brand">The question is the same: what does Detroit have for me?</span>
        </p>
        <p className="mt-10 font-display text-2xl font-bold text-brand">KNOW I&apos;M HERE</p>
        <h2 className="mt-3 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          The right resource. The right opportunity.
          <br />
          For the right resident.
          <br />
          <span className="text-sky">At the right moment.</span>
        </h2>
        <p className="mt-4 font-medium text-foreground/60">Different generations. Different needs. One connection layer.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/onboarding" className="btn-base btn-brand">
            Find What I Need
          </Link>
          <Link to="/for-you" className="btn-base btn-outline">
            Explore Around Me
          </Link>
          <Link to="/demo" className="btn-base btn-ink">
            View Demo Experience
          </Link>
        </div>
      </section>
    </div>
  );
}
