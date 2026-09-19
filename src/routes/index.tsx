import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  Building2,
  BriefcaseBusiness,
  LineChart,
  Network,
  Store,
  TrendingUp,
  BusFront,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  HeartHandshake,
  LockKeyhole,
  MapPin,
  MessageCircle,
  Music,
  Navigation,
  PersonStanding,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import heroAsset from "@/assets/detroit-sunset-skyline.png.asset.json";
import spiritAsset from "@/assets/spirit-of-detroit.jpeg.asset.json";
import riverwalkAsset from "@/assets/detroit-riverwalk.jpeg.asset.json";
import hartPlazaAsset from "@/assets/hart-plaza.jpeg.asset.json";
import renaissanceAsset from "@/assets/renaissance-center.jpeg.asset.json";
import fordFieldAsset from "@/assets/ford-field.jpeg.asset.json";
import littleCaesarsAsset from "@/assets/little-caesars-arena.jpeg.asset.json";
import comericaAsset from "@/assets/comerica-park.png.asset.json";
import communityAsset from "@/assets/fast-freddy-class-wide.jpeg.asset.json";
import neighborhoodAsset from "@/assets/detroit-multigenerational-community.jpeg.asset.json";
import everydayAsset from "@/assets/everyday-connect-multigenerational.png.asset.json";
import everydayLearningAsset from "@/assets/everyday-connect-group-learning.jpeg.asset.json";
import kihConnectionAsset from "@/assets/know-im-here-detroit-connection.png.asset.json";
import imHerePhoneVisual from "@/assets/im-here-private-phone.jpg";
import ffEventAsset from "@/assets/fast-freddy-community-event-original.jpeg.asset.json";
import ffMayorAsset from "@/assets/fast-freddy-mayor-sheffield.jpg.asset.json";
import { PhoneDemo } from "@/components/kih/PhoneDemo";
import { ImHereControl, NearMeButton } from "@/components/kih/ImHere";
import { EverydayConnectTip } from "@/components/kih/EverydayConnectTip";
import { SectionHeading } from "@/components/kih/SectionHeading";
import { Button } from "@/components/ui/button";
import { CATEGORIES, EXTERNAL_LINKS, FRONT_DOOR, NEED_CATEGORIES, PERSONAS, PRIORITIES } from "@/data/resources";

const TITLE = "Know I'm Here — Discover What Detroit Has For You";
const DESC = "Know I'm Here connects Detroit residents with nearby resources, activities, transportation options and opportunities personalized to their needs.";

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

const featuredLandmarks = [
  { title: "Ford Field", type: "Sports + Entertainment", image: fordFieldAsset.url, text: "Games, events and experiences happening in the heart of downtown Detroit.", tags: ["Sports", "Events", "Downtown"] },
  { title: "Hart Plaza", type: "Community + Culture", image: hartPlazaAsset.url, text: "Festivals, community gatherings, music, culture and Detroit experiences.", tags: ["Community", "Culture", "Events"] },
  { title: "Detroit Riverwalk", type: "Public Health + Recreation", image: riverwalkAsset.url, text: "Walking, recreation, wellness and accessible outdoor experiences along Detroit’s riverfront.", tags: ["Wellness", "Recreation", "Outdoors"] },
];

const additionalLandmarks = [
  { title: "Spirit of Detroit", type: "Civic", image: spiritAsset.url, text: "City services, public information and downtown resources.", tags: ["Civic", "Downtown"] },
  { title: "Renaissance Center", type: "Landmark", image: renaissanceAsset.url, text: "A familiar skyline landmark connected to downtown discovery.", tags: ["Landmark", "Riverfront"] },
  { title: "Little Caesars Arena", type: "Entertainment", image: littleCaesarsAsset.url, text: "Entertainment, employment and activity in The District Detroit.", tags: ["Entertainment", "Events"] },
  { title: "Comerica Park", type: "Sports", image: comericaAsset.url, text: "Baseball, downtown experiences and seasonal events.", tags: ["Sports", "Seasonal"] },
];

const FF_PILLARS = [
  { icon: <PersonStanding />, label: "Move", text: "Seated movement, Detroit hustle, dance and active recreation." },
  { icon: <Users />, label: "Connect", text: "Social experiences that build friendship, belonging and recurring engagement." },
  { icon: <MapPin />, label: "Experience", text: "Senior-friendly excursions, group outings and memorable experiences." },
  { icon: <Music />, label: "Celebrate", text: "Detroit music, fashion, dance, storytelling and cultural history." },
  { icon: <HeartHandshake />, label: "Generations", text: "Experiences connecting older adults, youth and families through technology, culture and storytelling." },
  { icon: <Smartphone />, label: "Digital", text: "Technology Made Simple + Everyday Connect help build smartphone confidence and practical digital skills." },
];

function Index() {
  const [showAllDetroit, setShowAllDetroit] = useState(false);
  const [showResidents, setShowResidents] = useState(false);

  return (
    <div>
      <section className="home-hero relative overflow-hidden">
        <img src={heroAsset.url} alt="Detroit skyline and Renaissance Center glowing at sunset across the river" width={1672} height={941} className="absolute inset-0 size-full object-cover" />
        <div className="container-kih relative z-10 flex min-h-[34rem] flex-col items-center px-5 pb-14 pt-16 text-center text-cream sm:min-h-[39rem] sm:pb-20 sm:pt-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-cream/25 bg-ink/55 px-4 py-2 text-xs font-extrabold uppercase tracking-wider backdrop-blur"><MapPin className="size-3.5 text-aqua" /> Venture 313 Buildathon Prototype · Detroit</span>
          <h1 className="mt-6 max-w-4xl text-5xl font-extrabold leading-[1.04] sm:text-7xl">Your Detroit. Connected to You.</h1>
          <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-cream/90 sm:text-lg">Know I&apos;m Here helps Detroit residents discover nearby resources, services, activities, programs and opportunities based on where they are, what they need and what matters to them.</p>
          <div className="mt-7 grid w-full max-w-sm gap-3">
            <NearMeButton className="min-h-14 bg-aqua text-ink shadow-lg hover:bg-aqua/90" />
            <Button asChild size="lg" variant="outline" className="min-h-14 border-cream/40 bg-ink/65 text-cream backdrop-blur hover:bg-ink hover:text-cream"><Link to="/ask"><MessageCircle /> Ask Know I&apos;m Here</Link></Button>
            <Button asChild variant="link" className="text-cream hover:text-aqua"><Link to="/for-you">Explore Detroit Resources <ArrowRight /></Link></Button>
          </div>
          <ArrowDown className="mt-6 size-5 text-aqua" aria-hidden />
        </div>
      </section>

      <section className="product-demo-band bg-background pb-14 pt-8 sm:pt-10">
        <div className="container-kih">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-wider text-sky">See Know I&apos;m Here in action</p>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">One connection layer. Different needs.</h2>
            <p className="mt-3 text-foreground/65">See how Know I&apos;m Here can surface relevant opportunities, resources and support based on what matters to each resident.</p>
          </div>
          <div className="mt-8"><PhoneDemo /></div>
        </div>
      </section>

      <section className="bg-card pb-12 pt-12 text-center">
        <div className="container-kih">
          <p className="mx-auto max-w-3xl text-2xl font-extrabold leading-tight text-ink sm:text-3xl">Detroit has resources.<span className="mt-1.5 block text-lg font-medium text-foreground/65 sm:text-xl">The challenge is connecting the right resource to the right resident at the right time.</span></p>
          <p aria-label="Discover, Connect, Get There, Check In, Stay Connected" className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5">
            {["Discover", "Connect", "Get There", "Check In", "Stay Connected"].map((step, index) => (
              <span key={step} className="flex items-center gap-2">
                {index > 0 && <ArrowRight className="size-4 shrink-0 text-sky" aria-hidden />}
                <span className="rounded-full border border-border bg-background px-3.5 py-1.5 text-sm font-bold text-ink sm:text-base">{step}</span>
              </span>
            ))}
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-foreground/65">From finding the right opportunity to getting there and staying connected, Know I&apos;m Here helps close the loop.</p>
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="container-kih py-14">
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <article className="overflow-hidden rounded-lg border border-border bg-background">
              <img src={neighborhoodAsset.url} alt="Detroit residents connecting across generations in their neighborhood" className="aspect-[16/9] w-full object-cover" loading="eager" />
              <div className="p-6"><p className="text-xs font-extrabold uppercase text-sky">My Neighborhood</p><h2 className="mt-2 text-2xl font-bold">Know what&apos;s happening around you.</h2><p className="mt-2 text-foreground/65">See community meetings, recreation updates, cooling centers, road closures and official City notices—calmly filtered to your neighborhood.</p><Button asChild variant="outline" className="mt-5 min-h-12"><Link to="/neighborhood">See my neighborhood <ArrowRight /></Link></Button></div>
            </article>
            <article className="flex flex-col rounded-lg bg-brand p-6 text-brand-foreground sm:p-8">
              <div>
                <span className="grid size-12 place-items-center rounded-lg bg-card text-brand"><Check /></span>
                <p className="mt-5 text-xs font-extrabold uppercase text-brand-foreground/75">Private participation</p>
                <h2 className="mt-2 text-4xl font-extrabold sm:text-5xl">I&apos;M HERE ✓</h2>
                <p className="mt-3 max-w-2xl text-lg leading-relaxed text-brand-foreground/90">When you arrive, tap in. It closes the loop between a resource existing and a resident using it—without making your check-in public.</p>
              </div>
              <div className="mt-5 overflow-hidden rounded-lg border border-brand-foreground/20 bg-card shadow-lg">
                <img src={imHerePhoneVisual} alt="A Detroit resident holds a phone showing Know I'm Here switched on with private participation enabled" width={1408} height={912} className="aspect-[14/9] w-full object-cover" loading="eager" />
              </div>
              <ol className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center" aria-label="Interactive demo journey">
                <DemoJourneyStep icon={<Search />} title="Discover" text="Find local resources, events and activities." />
                <ArrowRight className="hidden size-5 text-brand-foreground/75 sm:block" aria-hidden />
                <DemoJourneyStep icon={<BusFront />} title="Get There" text="Get directions or ride assistance." />
                <ArrowRight className="hidden size-5 text-brand-foreground/75 sm:block" aria-hidden />
                <DemoJourneyStep icon={<Check />} title="Check In" text="Tap in privately when you arrive." />
              </ol>
              <Button asChild className="mt-6 min-h-14 self-start bg-card px-6 text-base text-brand hover:bg-card/90"><Link to="/demo">See it in the demo <ArrowRight /></Link></Button>
            </article>
          </div>
        </div>
      </section>



      <section className="container-kih py-14">
        <SectionHeading eyebrow="Personalized discovery" title="Start with what matters today." text="Choose a need, see what is nearby, or ask in your own words. You control what you share." />
        <div className="mt-6"><ImHereControl /></div>
        <div className="mt-7 flex flex-wrap gap-2.5">
          {NEED_CATEGORIES.map((id) => { const category = CATEGORIES[id]; return <Link key={id} to="/ask" search={{ q: `Show me ${category.label.toLowerCase()} near me.` }} className="chip min-h-12 cursor-pointer px-4 text-base hover:bg-card"><span aria-hidden>{category.emoji}</span> {category.label}</Link>; })}
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <article className="card-flat p-6 sm:p-8">
            <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-lg bg-sky/15 text-sky"><Sparkles /></span><div><p className="text-xs font-extrabold uppercase text-sky">For You Today</p><h3 className="text-2xl font-extrabold">A shorter path to what fits.</h3></div></div>
            <p className="mt-4 text-foreground/70">See relevant resources and opportunities based on the interests and location you choose—not assumptions about your age.</p>
            <Button asChild variant="outline" className="mt-5"><Link to="/for-you">See personalized picks <ArrowRight /></Link></Button>
          </article>
          <article className="card-flat bg-ink p-6 text-cream sm:p-8">
            <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-lg bg-aqua text-ink"><MessageCircle /></span><div><p className="text-xs font-extrabold uppercase text-aqua">Ask KIH</p><h3 className="text-2xl font-extrabold">Ask the way you normally would.</h3></div></div>
            <p className="mt-4 text-cream/75">“What can I do with my kids this weekend?” “Where can I get resume help?” Start with your question.</p>
            <Button asChild className="mt-5 bg-aqua text-ink hover:bg-aqua/90"><Link to="/ask">Ask Know I&apos;m Here <ArrowRight /></Link></Button>
          </article>
        </div>
      </section>

      <section className="container-kih py-14">
        <SectionHeading eyebrow="Opportunities for every stage" title="More than one kind of next step." text="Explore learning, work, youth opportunity, health, recreation and everyday digital confidence." />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <HubCard icon={<Users />} title="Education & Youth Opportunities" text="After-school, tutoring, summer jobs, internships, mentoring, sports, STEM and youth wellness." to="/opportunities" action="Open the hub" />
          <HubCard icon={<BriefcaseBusiness />} title="Work After 55" text="Part-time and flexible work, paid training, resume help, digital skills and transportation support." to="/work-after-55" action="Explore work support" />
          <HubCard icon={<HeartHandshake />} title="Health & Community Support" text="Find trusted programs, practical help and a clear next action close to home." to="/for-you" action="See resources" />
        </div>
      </section>

      <section className="border-y border-border bg-card"><div className="container-kih py-14">
        <SectionHeading eyebrow="One intelligent front door" title="Find the right door without replacing Detroit’s trusted organizations." text="The provider delivers the service. Know I'm Here helps residents understand where to start and what to do next." />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{FRONT_DOOR.map((item) => <div key={item.need} className="card-flat flex items-center gap-3 p-4"><span aria-hidden>{item.emoji}</span><span className="font-bold">{item.need}</span><ArrowRight className="size-4 text-muted-foreground" /><span className="text-sm font-semibold text-foreground/70">{item.route}</span></div>)}</div>
      </div></section>

      <section className="container-kih py-14"><div className="grid items-center gap-8 lg:grid-cols-2">
        <div><SectionHeading eyebrow="Help me get there" title="Finding something useful is only half the solution." text="Compare practical ways to get there. Non-integrated options stay clearly marked as potential or coming soon." /><div className="mt-5 flex flex-wrap gap-2"><span className="chip bg-sky/15 text-sky"><BusFront className="size-4" /> Bus / Transit</span><span className="chip bg-mint/15 text-mint"><Navigation className="size-4" /> Walking</span><span className="chip bg-brand/15 text-brand">Ride Assistance</span><span className="chip bg-card text-foreground/60">Community Ride · Coming Soon</span></div><div className="mt-5"><EverydayConnectTip text="Need help using maps or transportation apps? Everyday Connect can walk you through it." /></div></div>
        <article className="card-flat p-6"><p className="text-xs font-extrabold uppercase text-sky">Example route</p><h3 className="mt-2 text-xl font-bold">Patton Recreation Center</h3><p className="mt-1 text-sm text-foreground/60">1.8 miles away · Tuesday · 11:00 AM</p><div className="mt-5 grid grid-cols-2 gap-2"><Button asChild variant="outline"><Link to="/resource/$id" params={{ id: "senior-fitness" }} search={{ step: "get-there" }}>Bus Route</Link></Button><Button asChild><Link to="/resource/$id" params={{ id: "senior-fitness" }} search={{ step: "get-there" }}>Ride help</Link></Button></div></article>
      </div></section>

      <section className="container-kih py-14"><div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-hidden rounded-lg border border-border bg-card"><img src={everydayAsset.url} alt="Everyday Connect is not a seniors-only program — people of all generations building technology confidence, shown with six accessible phone screens" className="aspect-[16/10] w-full object-contain" loading="lazy" /></div>
        <div><p className="text-xs font-extrabold uppercase text-sky">Digital confidence</p><h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Everyday Connect</h2><p className="mt-4 text-foreground/70">Practical digital confidence for older adults, working adults, parents, students and youth—from smartphone basics and accessibility to healthcare technology and useful AI.</p><div className="mt-5 flex flex-wrap gap-2"><span className="chip">Easy to use</span><span className="chip">Safe & secure</span><span className="chip">Everyday support</span></div><Button asChild variant="outline" className="mt-6"><Link to="/learn">Start learning <ArrowRight /></Link></Button></div>
      </div></section>

      <section className="bg-ink text-cream"><div className="container-kih py-14">
        <div className="max-w-3xl"><p className="text-xs font-extrabold uppercase text-aqua">How we got here</p><h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Trust → Confidence → Connection</h2><p className="mt-3 text-cream/70">Know I&apos;m Here grew from real Detroit community engagement—not a theoretical technology idea.</p></div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <a href={EXTERNAL_LINKS.fastFreddy} target="_blank" rel="noreferrer" className="overflow-hidden rounded-lg border border-cream/15 bg-cream/5 transition-colors hover:bg-cream/10"><img src={communityAsset.url} alt="Fast Freddy leading a Detroit community movement class" className="aspect-[16/9] w-full object-cover" loading="lazy" /><div className="p-6"><p className="text-xs font-bold uppercase text-sun">Trust + Community</p><h3 className="mt-1 text-xl font-bold">Fast Freddy Experience</h3><p className="mt-2 text-sm text-cream/70">One real Detroit example of culture, movement and welcoming in-person community engagement.</p><p className="mt-4 text-sm font-bold text-sun">Visit Fast Freddy Experience →</p></div></a>
          <a href={EXTERNAL_LINKS.everydayConnect} target="_blank" rel="noreferrer" className="overflow-hidden rounded-lg border border-cream/15 bg-cream/5 transition-colors hover:bg-cream/10"><img src={everydayLearningAsset.url} alt="Older adults learning to use smartphones with guidance from an instructor" className="aspect-[16/9] w-full object-cover object-center" loading="lazy" /><div className="p-6"><p className="text-xs font-bold uppercase text-aqua">Digital confidence</p><h3 className="mt-1 text-xl font-bold">Everyday Connect</h3><p className="mt-2 text-sm text-cream/70">Build confidence with everyday technology, healthcare tools and useful AI.</p><p className="mt-4 text-sm font-bold text-aqua">Explore Everyday Connect →</p></div></a>
          <Link to="/story" className="overflow-hidden rounded-lg border border-brand-deep bg-brand text-brand-foreground"><img src={kihConnectionAsset.url} alt="A daughter helps her father use a phone beside the Detroit riverfront and skyline" className="aspect-[16/9] w-full object-cover object-center" loading="lazy" /><div className="p-6"><p className="text-xs font-bold uppercase text-brand-foreground/75">Connection</p><h3 className="mt-1 text-xl font-bold">Know I&apos;m Here</h3><p className="mt-2 text-sm text-brand-foreground/85">Use that confidence to connect with nearby people, resources and opportunities.</p><p className="mt-4 text-sm font-bold">Read our story →</p></div></Link>
        </div>
      </div></section>

      <section className="container-kih py-14">
        <SectionHeading eyebrow="The experience behind the pilot" title="More Than Entertainment. A Platform for Active, Connected Living." />
        <div className="mx-auto mt-4 max-w-3xl space-y-3 text-center text-foreground/70">
          <p>Fast Freddy Experience helps older adults stay active, connected, confident and engaged through culturally relevant experiences built around movement, music, Detroit culture, technology, social connection and shared experiences.</p>
          <p>Powered by the legacy of Detroit dance and fashion icon Frederick “Fast Freddy” Anderson, the model brings trusted in-person experiences together with modern tools that can extend participation beyond the room.</p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl rounded-lg border border-sun/40 bg-sun/10 px-5 py-4 text-center text-lg font-extrabold text-ink">Creating Joy. Building Community. Celebrating Every Generation.</p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FF_PILLARS.map((pillar) => (
            <article key={pillar.label} className="card-flat flex items-start gap-3 p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-sky/15 text-sky">{pillar.icon}</span>
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-ink">{pillar.label}</h3>
                <p className="mt-1 text-sm text-foreground/65">{pillar.text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <figure className="overflow-hidden rounded-lg border border-border"><img src={ffEventAsset.url} alt="A Fast Freddy Experience community event gathering in Detroit" className="aspect-[4/3] w-full object-cover" loading="lazy" /></figure>
          <figure className="overflow-hidden rounded-lg border border-border"><img src={ffMayorAsset.url} alt="Fast Freddy with Detroit Mayor Mary Sheffield" className="aspect-[4/3] w-full object-cover" loading="lazy" /><figcaption className="p-2 text-center text-xs text-muted-foreground">Fast Freddy with Detroit Mayor Mary Sheffield</figcaption></figure>
        </div>

        <div className="mt-10 rounded-lg border border-border bg-card p-6 sm:p-8">
          <h3 className="text-2xl font-extrabold text-ink">From Community Experience to Community Infrastructure</h3>
          <p className="mt-3 max-w-3xl text-foreground/70">Fast Freddy Experience creates the reason to participate. Everyday Connect helps build the digital confidence to participate. Know I&apos;m Here helps residents discover what is available, decide what fits their needs and connect with the opportunity.</p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {["Discover", "Get There", "Participate", "Check In", "Stay Connected"].map((step, index) => (
              <span key={step} className="flex items-center gap-2">
                <span className={`rounded-full border border-border bg-background px-3 py-1.5 text-sm font-bold text-ink ${index === 2 ? "border-brand bg-brand text-brand-foreground" : ""}`}>{step}</span>
                {index < 4 && <ArrowRight className="size-4 text-muted-foreground" aria-hidden />}
              </span>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-sm text-foreground/65">A Fast Freddy program can become a real-world testing ground for the Know I&apos;m Here loop — from discovering an activity and getting transportation help to privately checking in and receiving relevant opportunities afterward.</p>
        </div>

        <div className="mt-8">
          <p className="text-xs font-extrabold uppercase tracking-wider text-sky">Proposed pilot capabilities · Prototype concepts</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["QR Entry", "Personalized Recommendations", "Saved Information", "Transportation Support", "Private “I’m Here” Check-In", "Aggregate Engagement Insights"].map((capability) => <span key={capability} className="chip bg-card text-sm">{capability}</span>)}
          </div>
          <p className="mt-3 text-sm text-foreground/60">Measure participation patterns without making an individual resident&apos;s check-in public. These capabilities are proposed for the prototype and are not currently operational services.</p>
        </div>

        <details className="group mt-8 rounded-lg border border-border bg-card p-5">
          <summary className="cursor-pointer list-none text-sm font-extrabold uppercase tracking-wider text-ink">
            What the Fast Freddy Experience Can Include <span className="ml-2 text-sky group-open:hidden">+</span><span className="ml-2 hidden text-sky group-open:inline">–</span>
          </summary>
          <p className="mt-3 text-sm text-foreground/70">Get Down While Sitting Down · Detroit Hustle Basics · Fast Freddy Social Club · Technology Made Simple · Senior Adventures · Detroit Through the Decades · Generations Exchange · Everyday Connect</p>
        </details>

        <div className="mt-8 rounded-lg border border-brand/25 bg-brand/5 p-6">
          <p className="text-xs font-extrabold uppercase tracking-wider text-brand">The opportunity</p>
          <p className="mt-2 max-w-4xl text-foreground/75">Senior-serving organizations need programming that people want to attend — while residents may also face isolation, transportation barriers and difficulty navigating technology. Fast Freddy Experience addresses the human experience; Everyday Connect builds digital confidence; Know I&apos;m Here can help close the last mile between residents and opportunities.</p>
        </div>
      </section>

      <section className="container-kih pb-14 pt-6">
        <p className="text-xs font-extrabold uppercase tracking-wider text-brand">From one experience to an entire city</p>
        <div className="mt-3">
          <SectionHeading eyebrow="Detroit around you" title="Discover Detroit" text="Landmarks, gathering places and everyday spaces where residents connect—and where Know I'm Here helps surface what is nearby." />
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {featuredLandmarks.map((place) => <DetroitPlaceCard key={place.title} place={place} featured />)}
        </div>
        <div id="more-detroit-locations" className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none ${showAllDetroit ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"}`} aria-hidden={!showAllDetroit}>
          <div className="overflow-hidden">
            <div className="grid gap-5 pt-5 sm:grid-cols-2 lg:grid-cols-4">
              {additionalLandmarks.map((place) => <DetroitPlaceCard key={place.title} place={place} interactive={showAllDetroit} />)}
            </div>
          </div>
        </div>
        <div className="mt-7 flex justify-center">
          <Button type="button" variant="outline" size="lg" className="min-h-12 border-2 border-ink/15 bg-card px-6 font-bold text-ink shadow-sm" aria-expanded={showAllDetroit} aria-controls="more-detroit-locations" onClick={() => setShowAllDetroit((current) => !current)}>
            {showAllDetroit ? <>Show Less <ChevronUp /></> : <>Explore More of Detroit <ChevronDown /></>}
          </Button>
        </div>
        <p className="mt-5 text-xs text-muted-foreground">Location photography is used for discovery context. Verify resource availability with the official provider.</p>
      </section>

      <section className="border-y border-border bg-card">
        <div className="container-kih py-14">
          <SectionHeading eyebrow="One Detroit. Different needs." title="One connection layer." text="A 68-year-old, a 16-year-old and a working parent ask different questions. The same system can guide all three." />
          <div className="mt-7 grid gap-3 md:grid-cols-3" aria-label="Resident examples">
            {[{ initial: "D", name: "Dorothy, 68", role: "Older Adult" }, { initial: "M", name: "Marcus, 16", role: "Student" }, { initial: "W", name: "Working Parent", role: "Family + Everyday Needs" }].map((resident) => <div key={resident.name} className="flex min-h-20 items-center gap-3 rounded-lg border border-border bg-background p-4"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-sun font-bold text-ink">{resident.initial}</span><div><p className="font-bold text-ink">{resident.name}</p><p className="text-sm text-foreground/60">{resident.role}</p></div></div>)}
          </div>
          <div id="resident-details" className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none ${showResidents ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"}`} aria-hidden={!showResidents}>
            <div className="overflow-hidden">
              <div className="grid gap-4 pt-6 md:grid-cols-3">
                {PERSONAS.map((persona) => <article key={persona.id} className="card-flat flex flex-col p-6"><div className="flex items-center gap-3"><span className="grid size-12 place-items-center rounded-full bg-sun font-bold">{persona.initial}</span><div><h3 className="text-xl font-bold">{persona.name}, {persona.age}</h3><p className="text-sm text-foreground/60">{persona.tagline}</p></div></div><p className="mt-4 rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-cream">“{persona.query}”</p><ul className="mt-3 flex flex-wrap gap-1.5">{persona.needs.slice(0, 4).map((need) => <li key={need} className="chip bg-card text-xs text-foreground/70">{need}</li>)}</ul><Button asChild variant="outline" className="mt-5 self-start"><Link to="/demo" tabIndex={showResidents ? undefined : -1}>See {persona.name}&apos;s demo</Link></Button></article>)}
              </div>
              <p className="mt-6 text-center text-xs text-muted-foreground">Dorothy, Marcus and Tasha are fictional residents created for the Buildathon demonstration.</p>
            </div>
          </div>
          <div className="mt-7 flex justify-center"><Button type="button" variant="outline" size="lg" className="min-h-12 border-2 border-ink/15 bg-background px-6 font-bold text-ink shadow-sm" aria-expanded={showResidents} aria-controls="resident-details" onClick={() => setShowResidents((current) => !current)}>{showResidents ? <>Show Less <ChevronUp /></> : <>See How KIH Works for Different Residents <ChevronDown /></>}</Button></div>
        </div>
      </section>

      <section className="container-kih py-14"><SectionHeading eyebrow="Buildathon demonstration data" title="See connection—not surveillance." text="Partners can learn what residents are finding and using through aggregate patterns, while individual check-ins remain private." />
        <div className="mt-8 grid gap-4 sm:grid-cols-3"><Metric icon={<Eye />} value="1,240" label="Resource views" /><Metric icon={<Navigation />} value="386" label="Get-there plans" /><Metric icon={<Check />} value="214" label="Private check-ins" /></div>
        <div className="mt-6 flex flex-wrap gap-3"><Button asChild><Link to="/partners"><BarChart3 /> View partner impact</Link></Button><Button asChild variant="outline"><Link to="/privacy"><ShieldCheck /> Read privacy commitments</Link></Button></div>
        <p className="mt-4 text-xs text-muted-foreground">Fictional Buildathon demonstration data. No paying partners, integrations or measured outcomes are claimed.</p>
      </section>

      <section className="border-y border-border bg-card">
        <div className="container-kih py-14">
          <SectionHeading
            eyebrow="Detroit economic impact"
            title="More connection. More impact. Better use of city resources."
            text="Know I'm Here helps Detroit get more value from the resources it already invests in."
          />
          <p className="mt-4 max-w-3xl text-foreground/70">
            Detroit and its community partners already invest in health programs, recreation, transportation, workforce
            development, senior services, youth programs, neighborhood initiatives, events and other resources. The
            opportunity is making sure residents can find them, reach them and use them.
          </p>

          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ImpactStep icon={<Search />} title="Discover" text="Residents find what is nearby." />
            <ImpactStep icon={<BusFront />} title="Get There" text="Directions or ride assistance." />
            <ImpactStep icon={<Check />} title="Check In" text="Private, opt-in participation." />
            <ImpactStep icon={<BarChart3 />} title="Measure Impact" text="Aggregate insight closes the loop." accent />
          </ol>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ValueCard icon={<TrendingUp />} title="Maximize existing investment" text="Increase awareness and participation in programs and services that are already funded." />
            <ValueCard icon={<Network />} title="Reduce fragmented outreach" text="One connected discovery layer that can complement flyers, individual websites, social campaigns and manual outreach." />
            <ValueCard icon={<LineChart />} title="Turn participation into insight" text="Privacy-conscious, aggregated engagement patterns show what residents are discovering and where more outreach may be needed." />
            <ValueCard icon={<Store />} title="Strengthen the local economy" text="Connect residents with local businesses, employment, training, events and neighborhood organizations so activity circulates in Detroit." />
            <ValueCard icon={<Building2 />} title="Improve future investment decisions" text="Give participating organizations better information to evaluate outreach, program utilization and community demand." />
            <div className="card-flat flex flex-col justify-center bg-aqua-soft/60 p-6">
              <p className="text-xs font-extrabold uppercase tracking-wide text-sky">Privacy first</p>
              <p className="mt-2 text-sm font-semibold text-foreground/75">
                Insights are aggregated and opt-in. Know I&apos;m Here does not sell individual resident information and
                does not track residents automatically.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-xl bg-ink p-8 text-center text-cream sm:p-12">
            <p className="text-xs font-extrabold uppercase tracking-widest text-sun">The goal isn&apos;t simply to spend more.</p>
            <p className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold leading-tight sm:text-5xl">
              It&apos;s to get more impact from what Detroit is <span className="text-sun">already investing</span>.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <h3 className="text-2xl font-extrabold">A model that keeps residents free.</h3>
              <p className="mt-3 text-foreground/70">
                As Know I&apos;m Here grows, the platform is designed to support a sustainable model where residents
                access the core experience for free, while municipalities, institutions, community partners, sponsors and
                participating businesses can help fund the infrastructure.
              </p>
            </div>
            <div className="space-y-2 text-center">
              <div className="card-flat p-4"><p className="text-sm font-extrabold uppercase text-brand">Residents</p><p className="text-sm text-foreground/70">Free core access</p></div>
              <div className="flex justify-center text-foreground/40"><ArrowDown className="size-5" aria-hidden /></div>
              <div className="rounded-lg bg-brand p-4 text-brand-foreground"><p className="text-sm font-extrabold uppercase">Know I&apos;m Here</p><p className="text-sm">Community connection infrastructure</p></div>
              <div className="flex justify-center text-foreground/40"><ArrowDown className="size-5 rotate-180" aria-hidden /></div>
              <div className="card-flat p-4"><p className="text-sm font-extrabold uppercase text-sky">Cities · Institutions · Community partners · Sponsors · Businesses</p><p className="text-sm text-foreground/70">Support the ecosystem</p></div>
            </div>
          </div>

          <ol className="mt-10 grid gap-4 sm:grid-cols-3">
            <StageCard n="1" title="Detroit pilot" text="Measure discovery, transportation engagement, resource interactions and check-ins." />
            <StageCard n="2" title="Prove impact" text="Evaluate participation, utilization, repeat engagement and community demand." />
            <StageCard n="3" title="Scale" text="Expand successful use cases across Detroit and eventually into additional communities." />
          </ol>

          <p className="mt-8 max-w-3xl text-lg font-bold">
            Detroit already has resources. Know I&apos;m Here helps more residents find them, reach them, use them — and
            helps community partners measure the impact.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Prototype concept. No guaranteed savings, revenue, pricing or measured outcomes are claimed.
          </p>
        </div>
      </section>



      <section className="border-y border-border bg-card"><div className="container-kih grid gap-6 py-14 lg:grid-cols-[0.8fr_1.2fr]"><div><p className="text-xs font-extrabold uppercase text-sky">Privacy + responsible AI</p><h2 className="mt-2 text-3xl font-extrabold">You stay in control.</h2><p className="mt-3 text-foreground/70">Check-ins are private by default. Recommendations explain why they appear. Know I&apos;m Here identifies official resources but never files a City report for you.</p><Button asChild variant="outline" className="mt-5"><Link to="/privacy">Read our commitments <ArrowRight /></Link></Button></div><div className="grid gap-3 sm:grid-cols-3"><Promise icon={<LockKeyhole />} title="Private by default" /><Promise icon={<Eye />} title="Explain the match" /><Promise icon={<ShieldCheck />} title="You choose what to share" /></div><p className="lg:col-span-2 text-sm font-bold text-brand">For emergencies, call 911. Know I&apos;m Here is not an emergency service.</p></div></section>

      <section className="mx-auto max-w-4xl px-5 py-16 text-center"><p className="mx-auto max-w-2xl text-xl font-bold leading-snug">Senior or student. Job or health resource. Community event or career opportunity.<br /><span className="text-brand">The question is the same: what does Detroit have for me?</span></p><p className="mt-10 text-2xl font-bold text-brand">KNOW I&apos;M HERE</p><h2 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl">The right resource. The right opportunity.<br />For the right Detroit resident.<br /><span className="text-sky">At the right moment.</span></h2><p className="mt-4 font-medium text-foreground/60">Different generations. Different needs. One connection layer.</p><div className="mt-7 flex flex-wrap justify-center gap-3"><Button asChild><Link to="/onboarding">Find What I Need</Link></Button><Button asChild variant="outline"><Link to="/for-you">Explore Around Me</Link></Button></div></section>
    </div>
  );
}

function HubCard({ icon, title, text, to, action }: { icon: ReactNode; title: string; text: string; to: "/opportunities" | "/work-after-55" | "/for-you"; action: string }) {
  return <Link to={to} className="card-flat p-6 transition-transform hover:-translate-y-0.5"><span className="grid size-11 place-items-center rounded-lg bg-aqua-soft text-sky">{icon}</span><h3 className="mt-4 text-xl font-bold">{title}</h3><p className="mt-2 text-sm text-foreground/65">{text}</p><p className="mt-4 text-sm font-bold text-brand">{action} →</p></Link>;
}

function ImpactStep({ icon, title, text, accent = false }: { icon: ReactNode; title: string; text: string; accent?: boolean }) {
  return (
    <li className={`flex min-h-24 items-center gap-3 rounded-lg border p-4 ${accent ? "border-brand/30 bg-brand/10" : "border-border bg-background"}`}>
      <span className={`grid size-11 shrink-0 place-items-center rounded-lg ${accent ? "bg-brand text-brand-foreground" : "bg-aqua-soft text-sky"}`} aria-hidden>{icon}</span>
      <span>
        <span className="block text-sm font-extrabold uppercase">{title}</span>
        <span className="mt-1 block text-sm leading-snug text-foreground/65">{text}</span>
      </span>
    </li>
  );
}

function ValueCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <article className="card-flat p-6 transition-transform hover:-translate-y-0.5 motion-reduce:transition-none">
      <span className="grid size-11 place-items-center rounded-lg bg-aqua-soft text-sky" aria-hidden>{icon}</span>
      <h3 className="mt-4 text-lg font-extrabold uppercase leading-snug">{title}</h3>
      <p className="mt-2 text-sm text-foreground/65">{text}</p>
    </article>
  );
}

function StageCard({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <li className="card-flat p-5">
      <p className="text-xs font-extrabold uppercase tracking-wide text-brand">Stage {n}</p>
      <h3 className="mt-1 text-xl font-extrabold">{title}</h3>
      <p className="mt-2 text-sm text-foreground/65">{text}</p>
    </li>
  );
}

function Metric({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return <article className="card-flat p-5"><span className="text-sky">{icon}</span><p className="mt-3 text-3xl font-extrabold text-ink">{value}</p><p className="mt-1 text-sm font-semibold text-foreground/65">{label}</p></article>;
}

function Promise({ icon, title }: { icon: ReactNode; title: string }) {
  return <div className="card-flat flex min-h-32 flex-col justify-between p-5"><span className="text-sky">{icon}</span><p className="mt-4 font-bold">{title}</p></div>;
}

function DemoJourneyStep({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <li className="flex min-h-24 items-center gap-3 rounded-lg border border-brand-foreground/20 bg-brand-foreground/10 p-3 sm:min-h-32 sm:flex-col sm:items-start sm:justify-center">
      <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-card text-brand" aria-hidden>{icon}</span>
      <span>
        <span className="block text-sm font-extrabold uppercase">{title}</span>
        <span className="mt-1 block text-sm leading-snug text-brand-foreground/85">{text}</span>
      </span>
    </li>
  );
}

type DetroitPlace = { title: string; type: string; image: string; text: string; tags: string[] };

function DetroitPlaceCard({ place, featured = false, interactive = true }: { place: DetroitPlace; featured?: boolean; interactive?: boolean }) {
  return (
    <article className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={place.image} alt={`${place.title} in Detroit`} className="size-full object-cover transition-transform duration-300 hover:scale-[1.02] motion-reduce:transition-none" loading={featured ? "eager" : "lazy"} width={640} height={400} />
        <span className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] rounded-full bg-ink/85 px-3 py-1.5 text-[10px] font-extrabold uppercase leading-tight text-cream backdrop-blur">{place.type}</span>
      </div>
      <div className={featured ? "p-5" : "p-4"}>
        <h3 className={featured ? "text-xl font-extrabold" : "text-lg font-bold"}>{place.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground/65">{place.text}</p>
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={`${place.title} categories`}>
          {place.tags.map((tag) => <li key={tag} className="phone-chip bg-aqua-soft">{tag}</li>)}
        </ul>
        <Link to="/ask" search={{ q: `What's around ${place.title}?` }} tabIndex={interactive ? undefined : -1} className="mt-3 inline-flex min-h-10 items-center gap-1 text-sm font-bold text-sky">Explore nearby <ArrowRight className="size-4" /></Link>
      </div>
    </article>
  );
}