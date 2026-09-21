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
  ExternalLink,
  HeartHandshake,
  LockKeyhole,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  Music,
  Navigation,
  PersonStanding,
  Radio,
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
import joeLouisFistImage from "@/assets/joe-louis-fist.jpg";
import communityAsset from "@/assets/fast-freddy-class-wide.jpeg.asset.json";
import neighborhoodAsset from "@/assets/detroit-multigenerational-community.jpeg.asset.json";
import everydayAsset from "@/assets/everyday-connect-multigenerational.png.asset.json";
import everydayLearningAsset from "@/assets/everyday-connect-group-learning.jpeg.asset.json";
import kihConnectionAsset from "@/assets/know-im-here-detroit-connection.png.asset.json";
import imHerePhoneVisual from "@/assets/im-here-private-phone.jpg";
import ffEventAsset from "@/assets/fast-freddy-community-event-original.jpeg.asset.json";
import ffMayorAsset from "@/assets/fast-freddy-mayor-sheffield.jpg.asset.json";
import { PhoneDemo } from "@/components/kih/PhoneDemo";
import { DetroitROI } from "@/components/kih/DetroitROI";
import { ImHereControl, NearMeButton } from "@/components/kih/ImHere";
import { NearbyMapPreview } from "@/components/kih/NearbyMapPreview";
import { EverydayConnectTip } from "@/components/kih/EverydayConnectTip";
import { SectionHeading } from "@/components/kih/SectionHeading";
import { ResidentPriorities } from "@/components/kih/ResidentPriorities";
import { Button } from "@/components/ui/button";
import { EXTERNAL_LINKS } from "@/data/resources";
import { CITY_RESOURCES } from "@/data/city-resources";

const TITLE = "Know I'm Here — Discover What Detroit Has For You";
const DESC = "Know I'm Here connects Detroit residents with nearby resources, activities, transportation options and opportunities personalized to their needs.";
const SHARE_TITLE = "Your Detroit. Connected to You.";
const SHARE_DESC = "Discover nearby resources, events, wellness support and opportunities.";
const SHARE_IMAGE = "https://knowimhere.lovable.app/og-share.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: SHARE_TITLE },
      { property: "og:description", content: SHARE_DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://knowimhere.lovable.app/" },
      { property: "og:image", content: SHARE_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SHARE_TITLE },
      { name: "twitter:description", content: SHARE_DESC },
      { name: "twitter:image", content: SHARE_IMAGE },
    ],
    links: [{ rel: "canonical", href: "https://knowimhere.lovable.app/" }],
  }),
  component: Index,
});

const featuredLandmarks = [
  { title: "Ford Field", type: "Sports + Entertainment", image: fordFieldAsset.url, text: "Games, events and experiences happening in the heart of downtown Detroit.", tags: ["Sports", "Events", "Downtown"] },
  { title: "Hart Plaza", type: "Community + Culture", image: hartPlazaAsset.url, text: "Festivals, community gatherings, music, culture and Detroit experiences.", tags: ["Community", "Culture", "Events"] },
  { title: "Detroit Riverwalk", type: "Public Health + Recreation", image: riverwalkAsset.url, text: "Walking, recreation, wellness and accessible outdoor experiences along Detroit’s riverfront.", tags: ["Wellness", "Recreation", "Outdoors"] },
  { title: "Joe Louis Fist", type: "Landmarks + Culture", image: joeLouisFistImage, text: "An iconic Detroit landmark representing strength, history and civic pride in the heart of downtown.", tags: ["Landmark", "Culture", "Downtown"] },
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


const OPP_CHIP = "chip min-h-12 cursor-pointer px-4 text-base hover:bg-card";

const CORE_OPPORTUNITIES = [
  { emoji: "❤️", label: "Health & Wellness", q: "Health and wellness programs near me" },
  { emoji: "☀️", label: "Senior Programs", q: "Senior programs near me" },
  { emoji: "🤝", label: "Community Activities", q: "Community activities near me" },
  { emoji: "🏀", label: "Recreation", q: "Recreation near me" },
];

const MORE_OPPORTUNITIES = [
  { emoji: "🥬", label: "Food Resources", q: "Food resources near me" },
  { emoji: "🚌", label: "Transportation", q: "Transportation help near me" },
  { emoji: "🏠", label: "Housing Resources", q: "Housing resources near me" },
  { emoji: "📱", label: "Technology", q: "Technology help near me" },
  { emoji: "🎵", label: "Arts & Culture", q: "Arts and culture near me" },
  { emoji: "📚", label: "Education", q: "Education programs near me" },
  { emoji: "🏘️", label: "Neighborhood Information", q: "Neighborhood information" },
];

function Index() {
  const [showAllDetroit, setShowAllDetroit] = useState(false);
  const [showMoreOpportunities, setShowMoreOpportunities] = useState(false);
  const [showCityResources, setShowCityResources] = useState(false);
  const [showTransportOptions, setShowTransportOptions] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [showLoop, setShowLoop] = useState(false);
  const [showCityValue, setShowCityValue] = useState(false);

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

      <section className="bg-background py-12 sm:py-14">
        <div className="container-kih">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <span className="eyebrow">Welcome to Know I&apos;m Here</span>
              <p className="mt-3 text-foreground/65">
                See how Know I&apos;m Here helps connect Detroit residents to resources, opportunities and support already around them.
              </p>
            </div>
            <div className="card-pop mt-6 overflow-hidden p-2 sm:p-3">
              <div className="relative overflow-hidden rounded-lg" style={{ aspectRatio: "1920/1080" }}>
                <iframe
                  src="https://share.synthesia.io/embeds/videos/4f709c8e-32d2-40a5-bd27-2fa4e9bc27b9"
                  loading="lazy"
                  title="Synthesia video player - Know I'm Here Welcome Video - Connect Detroit to Resources"
                  allowFullScreen
                  allow="encrypted-media; fullscreen; microphone; screen-wake-lock;"
                  style={{ position: "absolute", width: "100%", height: "100%", top: 0, left: 0, border: "none", padding: 0, margin: 0, overflow: "hidden" }}
                />
              </div>
            </div>
          </div>
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

      <section className="container-kih pt-8 pb-4">
        <SectionHeading eyebrow="Personalized discovery" title="Start with what matters today." text="Choose a need, see what is nearby, or ask in your own words. You control what you share." />
        <div className="mt-6"><ImHereControl /></div>
        <div className="mt-6"><NearbyMapPreview /></div>
      </section>

      <section className="container-kih pb-14">

        <SectionHeading eyebrow="For You Today" title="Find what fits. Then find your way there." text="Ask in your own words or explore opportunities based on the interests and location you choose. When you find something useful, Know I'm Here can help you understand your next step and how to get there." />

        <article className="card-flat mt-6 bg-ink p-6 text-cream sm:p-8">
          <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-lg bg-aqua text-ink"><MessageCircle /></span><div><p className="text-xs font-extrabold uppercase text-aqua">Ask KIH</p><h3 className="text-2xl font-extrabold">Ask the way you normally would.</h3></div></div>
          <ul className="mt-4 grid gap-2 text-cream/80 sm:grid-cols-3">
            <li className="rounded-lg bg-cream/10 px-3 py-2 text-sm">“What can I do with my kids this weekend?”</li>
            <li className="rounded-lg bg-cream/10 px-3 py-2 text-sm">“Where can I get resume help?”</li>
            <li className="rounded-lg bg-cream/10 px-3 py-2 text-sm">“Are there free activities near me?”</li>
          </ul>
          <Button asChild className="mt-5 min-h-12 bg-aqua text-ink hover:bg-aqua/90"><Link to="/ask">Ask Know I&apos;m Here <ArrowRight /></Link></Button>
        </article>

        <article className="card-flat mt-4 p-6">
          <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-lg bg-sky/15 text-sky"><Sparkles /></span><div><p className="text-xs font-extrabold uppercase text-sky">Personalized for you</p><h3 className="text-xl font-extrabold">A shorter path to what fits.</h3></div></div>
          <p className="mt-3 text-foreground/70">See relevant resources and opportunities based on the interests and location you choose.</p>
          <Button asChild variant="outline" className="mt-4 min-h-12"><Link to="/for-you">See Personalized Picks <ArrowRight /></Link></Button>
        </article>

        <div className="mt-8">
          <p className="text-xs font-extrabold uppercase tracking-wider text-brand">Explore opportunities</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to="/opportunities" className={OPP_CHIP}><span aria-hidden>🎓</span> Youth &amp; Education</Link>
            <Link to="/work-after-55" className={OPP_CHIP}><span aria-hidden>💼</span> Jobs &amp; Training</Link>
            {CORE_OPPORTUNITIES.slice(0, 3).map((item) => <Link key={item.label} to="/ask" search={{ q: item.q }} className={OPP_CHIP}><span aria-hidden>{item.emoji}</span> {item.label}</Link>)}
            <Link to="/civic" className={OPP_CHIP}><span aria-hidden>🗳️</span> Voting &amp; Civic Access</Link>
            <Link to="/safety" hash="shelter" className={OPP_CHIP}><span aria-hidden>🏠</span> Housing &amp; Safe Shelter</Link>
            {CORE_OPPORTUNITIES.slice(3).map((item) => <Link key={item.label} to="/ask" search={{ q: item.q }} className={OPP_CHIP}><span aria-hidden>{item.emoji}</span> {item.label}</Link>)}
          </div>
          <p className="mt-2 max-w-xl text-sm text-foreground/65">Find trusted, official information about voting, registration, polling locations, and civic services.</p>
          <p className="mt-1 max-w-xl text-sm text-foreground/65">Find emergency shelter, temporary housing and safe-place resources when you need somewhere secure to stay.</p>
          {showMoreOpportunities && (
            <div id="more-opportunities" className="mt-2">
              <div className="flex flex-wrap gap-2">
                {MORE_OPPORTUNITIES.map((item) => <Link key={item.label} to="/ask" search={{ q: item.q }} className={OPP_CHIP}><span aria-hidden>{item.emoji}</span> {item.label}</Link>)}
                <Link to="/safety" className={OPP_CHIP}><span aria-hidden>🛡️</span> Safety &amp; Emergency Resources</Link>
              </div>
              <p className="mt-2 max-w-xl text-sm text-foreground/65">Find trusted safety information, emergency resources, and official reporting options for your school or neighborhood.</p>
            </div>
          )}
          <Button type="button" variant="ghost" className="mt-3 min-h-12 font-bold text-ink" aria-expanded={showMoreOpportunities} aria-controls="more-opportunities" onClick={() => setShowMoreOpportunities((v) => !v)}>
            {showMoreOpportunities ? <>Show Less <ChevronUp /></> : <>More Opportunities <ChevronDown /></>}
          </Button>
        </div>

        <p className="mt-10 text-sm font-bold uppercase tracking-wider text-sky">Finding the resource is only the first step.</p>
        <div id="help-me-get-there" className="mt-8 scroll-mt-24 rounded-lg border border-border bg-card p-6">
          <p className="text-xs font-extrabold uppercase tracking-wider text-sky">Help me get there</p>
          <h3 className="mt-2 text-xl font-extrabold">Found something useful? See how to get there.</h3>
          <p className="mt-2 text-sm font-semibold text-foreground/65">Bus / Transit · Walking · Ride Assistance</p>
          <Button type="button" variant="ghost" className="mt-3 min-h-12 font-bold text-ink" aria-expanded={showTransportOptions} aria-controls="transport-options" onClick={() => setShowTransportOptions((v) => !v)}>
            {showTransportOptions ? <>Hide transportation options <ChevronUp /></> : <>Explore transportation options <ChevronDown /></>}
          </Button>
          {showTransportOptions && (
            <div id="transport-options">
              <div className="mt-4 flex flex-wrap gap-2"><span className="chip bg-sky/15 text-sky"><BusFront className="size-4" /> Bus / Transit</span><span className="chip bg-mint/15 text-mint"><Navigation className="size-4" /> Walking</span><span className="chip bg-brand/15 text-brand">Ride Assistance</span><span className="chip bg-background text-foreground/60">Community Ride · Coming Soon</span></div>
              <p className="mt-3 text-xs text-muted-foreground">Know I&apos;m Here does not provide transportation. Non-integrated options stay clearly marked as potential or coming soon.</p>
              <div className="mt-4"><EverydayConnectTip text="Need help using maps or transportation apps? Everyday Connect can walk you through it." /></div>
              <details className="group mt-4 rounded-lg border border-border bg-background p-4">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 font-bold text-ink">View Example Route <ChevronDown className="size-5 transition-transform group-open:rotate-180" /></summary>
                <div className="mt-4">
                  <p className="text-xs font-extrabold uppercase text-sky">Example route</p>
                  <h4 className="mt-1 text-lg font-bold">Patton Recreation Center</h4>
                  <p className="mt-1 text-sm text-foreground/60">1.8 miles away · Tuesday · 11:00 AM</p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2"><Button asChild variant="outline"><Link to="/resource/$id" params={{ id: "senior-fitness" }} search={{ step: "get-there" }}>Bus Route</Link></Button><Button asChild><Link to="/resource/$id" params={{ id: "senior-fitness" }} search={{ step: "get-there" }}>Ride help</Link></Button></div>
                </div>
              </details>
            </div>
          )}
        </div>
      </section>


      <section className="bg-card pb-12 pt-12 text-center">
        <div className="container-kih">
          <p className="mx-auto max-w-3xl text-2xl font-extrabold leading-tight text-ink sm:text-3xl">Detroit has resources.<span className="mt-1.5 block text-lg font-medium text-foreground/65 sm:text-xl">The challenge is connecting the right resource to the right resident at the right time.</span></p>
          <p aria-label="Discover, Know, Get There, Check In, Stay Connected" className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5">
            {["Discover", "Know", "Get There", "Check In", "Stay Connected"].map((step, index) => (
              <span key={step} className="flex items-center gap-2">
                {index > 0 && <ArrowRight className="size-4 shrink-0 text-sky" aria-hidden />}
                <span className="rounded-full border border-border bg-background px-3.5 py-1.5 text-sm font-bold text-ink sm:text-base">{step}</span>
              </span>
            ))}
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-foreground/65">From finding the right opportunity to getting there and staying connected, Know I&apos;m Here helps close the loop.</p>
        </div>
      </section>

      <section id="community-public-health" className="container-kih scroll-mt-24 py-10">
        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-brand">Start with one everyday need.</p>
        <article className="card-flat p-6 sm:p-8">
          <span className="eyebrow">Community + public health</span>
          <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">Food support, connected around you.</h2>
          <p className="mt-2 max-w-2xl text-foreground/70">
            Detroit already has pantries, nutrition programs, grocery assistance and community health resources. Know I&apos;m Here helps residents find them in one place.
          </p>
          <Link to="/community-health" className="btn-base btn-brand mt-4 inline-flex min-h-12 items-center gap-2">
            Explore Community + Public Health <ArrowRight className="size-4" aria-hidden />
          </Link>
        </article>
      </section>



      <ResidentPriorities />

      <section id="my-neighborhood" className="container-kih scroll-mt-24 py-14">
        <p className="text-sm font-bold uppercase tracking-wider text-sky">Connection also means knowing what&apos;s happening around you.</p>
        <div className="mt-5 grid items-start gap-5 lg:grid-cols-2">
            <article className="overflow-hidden rounded-lg border border-border bg-background">
              <img src={neighborhoodAsset.url} alt="Detroit residents connecting across generations in their neighborhood" className="aspect-[16/9] w-full object-cover" loading="eager" />
              <div className="p-6"><p className="text-xs font-extrabold uppercase text-sky">My Neighborhood</p><h2 className="mt-2 text-2xl font-bold">Know what&apos;s happening around you.</h2><p className="mt-2 text-foreground/65">See community meetings, recreation updates, cooling centers, road closures and official City notices—calmly filtered to your neighborhood.</p><Button asChild variant="outline" className="mt-5 min-h-12"><Link to="/neighborhood">See my neighborhood <ArrowRight /></Link></Button></div>
            </article>
          <article className="rounded-lg border-2 border-sun bg-sun/15 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="grid size-11 place-items-center rounded-lg bg-ink text-cream"><Radio /></span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-ink">KIH Live</p>
              <h2 className="text-2xl font-extrabold">Know what&apos;s happening around you.</h2>
            </div>
            <span className="chip ml-auto bg-ink text-[10px] uppercase tracking-wide text-cream">Buildathon demonstration data</span>
          </div>
          <p className="mt-3 max-w-3xl text-foreground/70">Community reports, neighborhood updates, transportation information and local information—all connected to the area you choose.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Community reports", "Verified alerts", "Local news", "Transportation"].map((chip) => (
              <span key={chip} className="chip bg-background text-xs font-bold text-ink">{chip}</span>
            ))}
          </div>
          <Button asChild className="mt-5 min-h-12"><Link to="/live">Explore KIH Live <ArrowRight /></Link></Button>
        </article>
        </div>
      </section>

      <section id="im-here" className="border-y border-border bg-card scroll-mt-24">
        <div className="container-kih py-14">
          <p className="mb-5 text-sm font-bold uppercase tracking-wider text-brand">When the resident arrives, participation can become measurable&mdash;without making it public.</p>
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
              <ol className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] sm:items-center" aria-label="Interactive demo journey">
                <DemoJourneyStep icon={<Search />} title="Discover" text="Find local resources, events and activities." />
                <ArrowRight className="hidden size-5 text-brand-foreground/75 sm:block" aria-hidden />
                <DemoJourneyStep icon={<Radio />} title="Know" text="See what's happening around you first." />
                <ArrowRight className="hidden size-5 text-brand-foreground/75 sm:block" aria-hidden />
                <DemoJourneyStep icon={<BusFront />} title="Get There" text="Get directions or ride assistance." />
                <ArrowRight className="hidden size-5 text-brand-foreground/75 sm:block" aria-hidden />
                <DemoJourneyStep icon={<Check />} title="Check In" text="Tap in privately when you arrive." />
              </ol>
              <Button asChild className="mt-6 min-h-14 self-start bg-card px-6 text-base text-brand hover:bg-card/90"><Link to="/demo">See Know I&apos;m Here Resident Funnel <ArrowRight /></Link></Button>
            </article>
        </div>
      </section>

      <section className="container-kih py-14">
        <div className="max-w-3xl">
          <p className="text-xs font-extrabold uppercase text-sky">The ecosystem</p>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Connecting Resources Is Only Half the Solution</h2>
          <p className="mt-4 text-foreground/70">Detroit already has programs, services, opportunities, and digital resources. Know I&apos;m Here helps residents discover and reach them. Everyday Connect helps residents build the confidence and practical skills to use the technology required to access them.</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Fast Freddy Experience", "Creates trusted community access and a real-world pilot environment."],
            ["Everyday Connect", "Builds digital confidence through simple, practical technology education."],
            ["Know I'm Here", "Connects residents to relevant resources, programs, services, and opportunities."],
            ["Community Partners", "Gain privacy-conscious insight into discovery, engagement, and participation."],
          ].map(([title, text]) => (
            <article key={title} className="card-flat p-5">
              <h3 className="font-display text-lg font-bold uppercase leading-snug">{title}</h3>
              <p className="mt-2 text-sm text-foreground/70">{text}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 max-w-4xl border-l-4 border-brand pl-5 text-base text-foreground/75 sm:text-lg">Detroit already has resources. Know I&apos;m Here helps residents find and reach them. Everyday Connect helps residents build the digital confidence to use the technology required to access them. The Fast Freddy Experience gives us a trusted community environment to test whether that full loop works in real life.</p>
        <p className="mt-6 rounded-2xl bg-sun/30 px-5 py-4 text-base font-bold sm:text-lg">We are not just building a better way to find resources. We are helping make sure residents can confidently use the technology that connects them to those resources.</p>

        <div className="mt-10 grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-lg border border-border bg-card"><img src={everydayAsset.url} alt="Everyday Connect is not a seniors-only program — people of all generations building technology confidence, shown with six accessible phone screens" className="aspect-[16/10] w-full object-contain" loading="lazy" /></div>
          <div>
            <p className="text-xs font-extrabold uppercase text-sky">Everyday Connect</p>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Digital Confidence for Everyday Life</h2>
            <p className="mt-4 font-semibold text-foreground/80">Technology only creates access when people feel confident using it.</p>
            <p className="mt-3 text-foreground/70">Everyday Connect provides simple, practical digital-confidence training that helps residents use smartphones, QR codes, maps, online services, AI tools, transportation technology, and community platforms like Know I&apos;m Here.</p>
            <p className="mt-3 text-foreground/70">The goal is not simply to teach technology. It is to help people use technology to reach opportunities that already exist around them.</p>
            <p className="mt-3 text-sm text-foreground/65">Everyday Connect can support older adults, youth, families, caregivers, working adults, and community members who want more confidence using everyday technology.</p>
            <p className="mt-4 rounded-2xl bg-aqua-soft/60 px-5 py-4 text-base font-bold">Everyday Connect teaches people how to use the technology. Know I&apos;m Here helps them use that confidence to connect with opportunities around them.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button asChild className="min-h-14"><Link to="/learn">Start learning <ArrowRight /></Link></Button>
              <Button asChild variant="outline" className="min-h-14"><a href="https://everydayconnect.lovable.app/" target="_blank" rel="noopener noreferrer">Start connecting <ExternalLink /></a></Button>
            </div>
          </div>
        </div>
      </section>


      <section className="bg-ink text-cream"><div className="container-kih py-14">
        <div className="max-w-3xl"><p className="text-xs font-extrabold uppercase text-aqua">How we got here</p><h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Trust → Confidence → Connection</h2><p className="mt-3 text-cream/70">Know I&apos;m Here grew from real Detroit community engagement—not a theoretical technology idea.</p></div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <a href={EXTERNAL_LINKS.fastFreddy} target="_blank" rel="noreferrer" className="overflow-hidden rounded-lg border border-cream/15 bg-cream/5 transition-colors hover:bg-cream/10"><img src={communityAsset.url} alt="Fast Freddy leading a Detroit community movement class" className="aspect-[16/9] w-full object-cover" loading="lazy" /><div className="p-6"><p className="text-xs font-bold uppercase text-sun">Trust + Community</p><h3 className="mt-1 text-xl font-bold">Fast Freddy Experience</h3><p className="mt-2 text-sm text-cream/70">One real Detroit example of culture, movement and welcoming in-person community engagement.</p><p className="mt-4 text-sm font-bold text-sun">Visit Fast Freddy Experience →</p></div></a>
          <a href={EXTERNAL_LINKS.everydayConnect} target="_blank" rel="noreferrer" className="overflow-hidden rounded-lg border border-cream/15 bg-cream/5 transition-colors hover:bg-cream/10"><img src={everydayLearningAsset.url} alt="Older adults learning to use smartphones with guidance from an instructor" className="aspect-[16/9] w-full object-cover object-center" loading="lazy" /><div className="p-6"><p className="text-xs font-bold uppercase text-aqua">Digital confidence</p><h3 className="mt-1 text-xl font-bold">Everyday Connect</h3><p className="mt-2 text-sm text-cream/70">Build confidence with everyday technology, healthcare tools and useful AI.</p><p className="mt-4 text-sm font-bold text-aqua">Explore Everyday Connect →</p></div></a>
          <Link to="/story" className="overflow-hidden rounded-lg border border-brand-deep bg-brand text-brand-foreground"><img src={kihConnectionAsset.url} alt="A daughter helps her father use a phone beside the Detroit riverfront and skyline" className="aspect-[16/9] w-full object-cover object-center" loading="lazy" /><div className="p-6"><p className="text-xs font-bold uppercase text-brand-foreground/75">Connection</p><h3 className="mt-1 text-xl font-bold">Know I&apos;m Here</h3><p className="mt-2 text-sm text-brand-foreground/85">Use that confidence to connect with nearby people, resources and opportunities.</p><p className="mt-4 text-sm font-bold">Read our story →</p></div></Link>
        </div>
      </div></section>

      <section id="fast-freddy" className="container-kih scroll-mt-24 py-14">
        <div className="max-w-2xl">
          <span className="eyebrow">The experience behind the pilot</span>
          <div className="mt-3">
            <a
              href={EXTERNAL_LINKS.fastFreddy}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 text-sm font-extrabold uppercase tracking-wide text-brand transition-colors hover:bg-brand/20"
            >
              Connect With the Experience
              <ExternalLink className="size-4" aria-hidden />
            </a>
            <p className="mt-2 text-sm text-foreground/65">Explore the Fast Freddy Experience, upcoming programs, events and community engagement.</p>
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">More Than Entertainment. A Platform for Active, Connected Living.</h2>
        </div>
        <figure className="mx-auto mt-6 max-w-3xl overflow-hidden rounded-lg border border-border">
          <img src={ffMayorAsset.url} alt="Fast Freddy with Detroit Mayor Mary Sheffield" className="aspect-[4/3] w-full object-cover sm:aspect-[16/10]" loading="lazy" />
          <figcaption className="p-2 text-center text-xs text-muted-foreground">Fast Freddy with Detroit Mayor Mary Sheffield</figcaption>
        </figure>
        <div className="mx-auto mt-4 max-w-3xl space-y-3 text-center text-foreground/70">
          <p>Fast Freddy Experience helps older adults stay active, connected, confident and engaged through culturally relevant experiences built around movement, music, Detroit culture, technology, social connection and shared experiences.</p>
          <p>Powered by the legacy of Detroit dance and fashion icon Frederick “Fast Freddy” Anderson, the model brings trusted in-person experiences together with modern tools that can extend participation beyond the room.</p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl rounded-lg border border-sun/40 bg-sun/10 px-5 py-4 text-center text-lg font-extrabold text-ink">Creating Joy. Building Community. Celebrating Every Generation.</p>


        <div className="mt-8">
          <figure className="overflow-hidden rounded-lg border border-border"><img src={ffEventAsset.url} alt="A Fast Freddy Experience community event gathering in Detroit" className="aspect-[4/3] w-full object-cover" loading="lazy" /></figure>
        </div>

        <div className="mt-8 rounded-lg border border-border bg-card p-6 sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-wider text-brand">Real-world pilot</p>
          <p className="mt-2 max-w-3xl text-foreground/75">The Fast Freddy Experience gives Know I&apos;m Here a real community environment to test the resident journey—from discovering an activity and getting there to checking in and staying connected.</p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {["Discover", "Get There", "Check In", "Stay Connected"].map((step, index) => (
              <span key={step} className="flex items-center gap-2">
                <span className="rounded-full border border-border bg-background px-3 py-1.5 text-sm font-bold text-ink">{step}</span>
                {index < 3 && <ArrowRight className="size-4 text-muted-foreground" aria-hidden />}
              </span>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {["Personalized Recommendations", "Transportation Support", "Private “I’m Here” Check-In", "Aggregate Engagement Insights"].map((capability) => <span key={capability} className="chip bg-background text-sm">{capability}</span>)}
          </div>
          <p className="mt-3 text-sm text-foreground/60">Proposed pilot capabilities shown for demonstration.</p>
        </div>

        <details className="group mt-6 overflow-hidden rounded-lg border border-border bg-card">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-sm font-extrabold uppercase tracking-wider text-ink sm:p-6">
            Explore the Fast Freddy Pilot
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sky/15 text-lg font-bold text-sky"><span className="group-open:hidden">+</span><span className="hidden group-open:inline">–</span></span>
          </summary>
          <div className="animate-accordion-down space-y-8 border-t border-border p-5 sm:p-6">
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-sky">What the Fast Freddy Experience can include</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {FF_PILLARS.map((pillar) => (
                  <article key={pillar.label} className="flex items-start gap-3 rounded-lg border border-border bg-background p-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-sky/15 text-sky">{pillar.icon}</span>
                    <div>
                      <h4 className="text-sm font-extrabold uppercase tracking-wide text-ink">{pillar.label}</h4>
                      <p className="mt-1 text-sm text-foreground/65">{pillar.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-sky">Proposed pilot capabilities</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {["QR Entry", "Personalized Recommendations", "Saved Information", "Transportation Support", "Private “I’m Here” Check-In", "Aggregate Engagement Insights"].map((capability) => <span key={capability} className="chip bg-background text-sm">{capability}</span>)}
              </div>
              <p className="mt-3 text-sm text-foreground/60">Measure participation patterns without making an individual resident&apos;s check-in public. These capabilities are proposed for the prototype and are not currently operational services.</p>
            </div>

            <div className="rounded-lg border border-brand/25 bg-brand/5 p-5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand">The opportunity</h3>
              <p className="mt-2 max-w-4xl text-foreground/75">Senior-serving organizations need programming people want to attend, while residents may face isolation, transportation barriers and difficulty navigating technology. Fast Freddy Experience creates trusted community participation. Everyday Connect builds digital confidence. Know I&apos;m Here connects residents to the right opportunities and helps close the last mile.</p>
            </div>
          </div>
        </details>
      </section>



      <section id="partner-impact" className="container-kih scroll-mt-24 py-14">
        <p className="mb-4 text-sm font-bold uppercase tracking-wider text-sky">When residents connect, organizations can better understand participation.</p>
        <SectionHeading
          eyebrow="For organizations and partners"
          title="From outreach to measurable participation."
          text="Flyers tell you how many you printed. Know I'm Here helps participating organizations understand how discovery can move toward real participation."
        />

        <ol className="mt-8 flex flex-wrap items-stretch gap-3">
          {[
            { label: "Matched", text: "A resident sees a relevant opportunity." },
            { label: "Showed interest", text: "They save it or open the details." },
            { label: "Get there", text: "They plan directions or ride help." },
            { label: "Participated", text: "They check in privately on arrival." },
          ].map((stage, index, all) => (
            <li key={stage.label} className="flex flex-1 basis-56 items-center gap-3">
              <div className="card-flat h-full w-full p-5">
                <p className="text-xs font-extrabold uppercase tracking-wide text-sky">Step {index + 1}</p>
                <p className="mt-1 text-lg font-extrabold uppercase leading-snug">{stage.label}</p>
                <p className="mt-2 text-sm text-foreground/65">{stage.text}</p>
              </div>
              {index < all.length - 1 && <ArrowRight className="hidden size-5 shrink-0 text-foreground/35 lg:block" aria-hidden />}
            </li>
          ))}
        </ol>
        <p className="mt-4 max-w-2xl font-semibold text-foreground/75">Understand how residents move from discovering an opportunity to participating in it.</p>

        <div className="mt-8 rounded-xl bg-ink p-8 text-cream sm:p-10">
          <p className="text-xs font-extrabold uppercase tracking-widest text-sun">See connection — not surveillance</p>
          <p className="mt-3 max-w-3xl text-lg font-semibold text-cream/85">
            Partners can learn from privacy-conscious, aggregated engagement patterns while individual resident activity
            remains protected according to the platform&apos;s privacy controls.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="min-h-14 px-7 text-base font-extrabold">
              <Link to="/partners"><BarChart3 /> View Partner Impact <ArrowRight /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="min-h-14 border-cream/40 bg-transparent px-7 text-base font-extrabold text-cream hover:bg-cream/10 hover:text-cream">
              <Link to="/sponsorship">Partners + Sponsorship <ArrowRight /></Link>
            </Button>
            <Button asChild variant="ghost" className="min-h-12 text-cream underline underline-offset-4 hover:bg-cream/10 hover:text-cream">
              <Link to="/privacy"><ShieldCheck /> Read Privacy Commitments</Link>
            </Button>
          </div>
          <p className="mt-3 text-sm text-cream/70">Explore potential partner alignment and sponsorship opportunities.</p>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">Prototype concept. No paying partners, integrations or measured outcomes are claimed. Demonstration metrics appear inside the Partner Impact experience.</p>
      </section>


      <section id="detroit-economic-impact" className="scroll-mt-24 border-y border-border bg-card">

        <div className="container-kih py-14">
          <DetroitROI />

          <div className="mt-14 border-t border-border pt-10">
            <h3 className="font-display text-2xl font-bold">Current functionality in this prototype</h3>
            <p className="mt-2 max-w-3xl text-foreground/70">
              What Know I&apos;m Here already does today, and how the connection loop works.
            </p>
          </div>


          <button
            type="button"
            onClick={() => setShowLoop((v) => !v)}
            aria-expanded={showLoop}
            aria-controls="impact-loop-panel"
            className="mt-4 flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl border-2 border-ink/15 bg-card px-5 text-left font-extrabold text-ink shadow-sm transition-colors hover:bg-cream"
          >
            <span>{showLoop ? "Hide the KIH impact loop" : "Explore the KIH impact loop"}</span>
            {showLoop ? <Minus className="size-5 shrink-0 text-brand" aria-hidden /> : <Plus className="size-5 shrink-0 text-brand" aria-hidden />}
          </button>

          <div
            id="impact-loop-panel"
            className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none ${showLoop ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"}`}
            aria-hidden={!showLoop}
          >
            <div className="overflow-hidden">
              <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <ImpactStep icon={<Search />} title="Discover" text="Residents find what is nearby." />
                <ImpactStep icon={<BusFront />} title="Get There" text="Directions or ride assistance." />
                <ImpactStep icon={<Check />} title="Check In" text="Private, opt-in participation." />
                <ImpactStep icon={<BarChart3 />} title="Measure Impact" text="Aggregate insight closes the loop." accent />
              </ol>
            </div>
          </div>

          <ul className="mt-8 flex flex-wrap gap-2">
            {["Better resource use", "More participation", "Measurable impact", "Privacy-conscious insight"].map((c) => (
              <li key={c} className="chip">{c}</li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setShowCityValue((v) => !v)}
            aria-expanded={showCityValue}
            aria-controls="detroit-impact-panel"
            className="mt-4 flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl border-2 border-ink/15 bg-card px-5 text-left font-extrabold text-ink shadow-sm transition-colors hover:bg-cream"
          >
            <span>{showCityValue ? "Hide Detroit impact" : "Explore Detroit impact"}</span>
            {showCityValue ? <Minus className="size-5 shrink-0 text-brand" aria-hidden /> : <Plus className="size-5 shrink-0 text-brand" aria-hidden />}
          </button>

          <div
            id="detroit-impact-panel"
            className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none ${showCityValue ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"}`}
            aria-hidden={!showCityValue}
          >
            <div className="overflow-hidden">
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ValueCard icon={<TrendingUp />} title="Maximize existing investment" text="Increase awareness and participation in programs and services that are already funded." />
            <ValueCard icon={<Network />} title="Reduce fragmented outreach" text="One connected discovery layer that can complement flyers, individual websites, social campaigns and manual outreach." />
            <ValueCard icon={<LineChart />} title="Turn participation into insight" text="Privacy-conscious, aggregated engagement patterns show what residents are discovering and where more outreach may be needed." />
            <ValueCard icon={<Store />} title="Strengthen the local economy" text="Connect residents with local businesses, employment, training, events and neighborhood organizations so activity circulates in Detroit." />
            <ValueCard icon={<Building2 />} title="Improve future investment decisions" text="Give participating organizations better information to evaluate outreach, program utilization and community demand." />
            <div className="card-flat flex flex-col justify-center bg-card p-6">
              <p className="text-xs font-extrabold uppercase tracking-wide text-sky">Neighborhood awareness</p>
              <p className="mt-2 text-sm font-semibold text-foreground/75">
                Aggregated, privacy-conscious patterns could help participating organizations better understand where
                residents are encountering barriers, seeking information or reporting community concerns.
              </p>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Buildathon demonstration data</p>
            </div>
            <div className="card-flat flex flex-col justify-center bg-aqua-soft/60 p-6">
              <p className="text-xs font-extrabold uppercase tracking-wide text-sky">Privacy first</p>
              <p className="mt-2 text-sm font-semibold text-foreground/75">
                Insights are aggregated and opt-in. Know I&apos;m Here does not sell individual resident information and
                does not track residents automatically.
              </p>
            </div>
          </div>
            </div>
          </div>


          <div className="mt-10 rounded-xl bg-ink p-8 text-center text-cream sm:p-12">
            <p className="text-xs font-extrabold uppercase tracking-widest text-sun">The goal isn&apos;t simply to spend more.</p>
            <p className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold leading-tight sm:text-5xl">
              It&apos;s to get more impact from what Detroit is <span className="text-sun">already investing</span>.
            </p>
          </div>

          <div className="mt-10">
            <h3 className="text-2xl font-extrabold">A model that keeps residents free.</h3>
            <p className="mt-3 max-w-3xl text-foreground/70">
              As Know I&apos;m Here grows, the platform is designed to support a sustainable model where residents
              access the core experience for free, while municipalities, institutions, community partners, sponsors and
              participating businesses can help fund the infrastructure.
            </p>
            <p className="mt-4 inline-flex rounded-full bg-cream px-4 py-2 text-sm font-extrabold uppercase tracking-wide text-brand">
              Residents: free core access
            </p>

            <button
              type="button"
              onClick={() => setShowModel((v) => !v)}
              aria-expanded={showModel}
              aria-controls="sustainability-model-panel"
              className="mt-5 flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl border-2 border-ink/15 bg-card px-5 text-left font-extrabold text-ink shadow-sm transition-colors hover:bg-cream"
            >
              <span>{showModel ? "Hide sustainability model" : "View sustainability model"}</span>
              {showModel ? <Minus className="size-5 shrink-0 text-brand" aria-hidden /> : <Plus className="size-5 shrink-0 text-brand" aria-hidden />}
            </button>

            <div
              id="sustainability-model-panel"
              className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none ${showModel ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"}`}
              aria-hidden={!showModel}
            >
              <div className="overflow-hidden">
                <div className="mx-auto mt-6 max-w-lg space-y-2 text-center">
                  <div className="card-flat p-4"><p className="text-sm font-extrabold uppercase text-brand">Residents</p><p className="text-sm text-foreground/70">Free core access</p></div>
                  <div className="flex justify-center text-foreground/40"><ArrowDown className="size-5" aria-hidden /></div>
                  <div className="rounded-lg bg-brand p-4 text-brand-foreground"><p className="text-sm font-extrabold uppercase">Know I&apos;m Here</p><p className="text-sm">Community connection infrastructure</p></div>
                  <div className="flex justify-center text-foreground/40"><ArrowDown className="size-5 rotate-180" aria-hidden /></div>
                  <div className="card-flat p-4"><p className="text-sm font-extrabold uppercase text-sky">Cities · Institutions · Community partners · Sponsors · Businesses</p><p className="text-sm text-foreground/70">Support the ecosystem</p></div>
                </div>

                <ol className="mt-8 grid gap-4 sm:grid-cols-3">
                  <StageCard n="1" title="Detroit pilot" text="Measure discovery, transportation engagement, resource interactions and check-ins." />
                  <StageCard n="2" title="Prove impact" text="Evaluate participation, utilization, repeat engagement and community demand." />
                  <StageCard n="3" title="Scale" text="Expand successful use cases across Detroit and eventually into additional communities." />
                </ol>
              </div>
            </div>
          </div>

          <p className="mt-8 max-w-3xl text-lg font-bold">
            Detroit already has resources. Know I&apos;m Here helps more residents find them, reach them, use them — and
            helps community partners measure the impact.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Prototype concept. No guaranteed savings, revenue, pricing or measured outcomes are claimed.
          </p>
        </div>
      </section>

      <section id="discover-detroit" className="container-kih scroll-mt-24 py-14">
        <SectionHeading
          eyebrow="Detroit around you"
          title="Discover Detroit"
          text="Explore the places, programs, events, resources and opportunities that make Detroit move—from neighborhood spaces and community programs to recreation, culture and major city experiences."
        />
        <p className="mt-3 max-w-2xl text-lg text-foreground/65">Know I&apos;m Here helps residents discover what&apos;s around them and what&apos;s relevant to them.</p>
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

      {/* CONNECTED TO DETROIT'S EXISTING RESOURCES */}
      <section className="container-kih py-14" aria-labelledby="connected-resources">
        <p className="eyebrow">Connected to Detroit&apos;s existing resources</p>
        <h2 id="connected-resources" className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl">
          Detroit already has resources. Know I&apos;m Here helps you reach them.
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-foreground/70">
          Know I&apos;m Here is not designed to replace the services Detroit already provides. It helps residents understand which resource may fit
          their need and connects them to the right next step.
        </p>

        <button
          type="button"
          onClick={() => setShowCityResources((v) => !v)}
          aria-expanded={showCityResources}
          aria-controls="detroit-resources-panel"
          className="mt-7 flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl border-2 border-ink/15 bg-card px-5 text-left font-extrabold text-ink shadow-sm transition-colors hover:bg-cream"
        >
          <span>{showCityResources ? "Hide Detroit resources" : "Explore Detroit resources"}</span>
          {showCityResources ? <Minus className="size-5 shrink-0 text-brand" aria-hidden /> : <Plus className="size-5 shrink-0 text-brand" aria-hidden />}
        </button>

        <div
          id="detroit-resources-panel"
          className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none ${showCityResources ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"}`}
          aria-hidden={!showCityResources}
        >
          <div className="overflow-hidden">
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CITY_RESOURCES.map((r) => (
            <li key={r.id}>
              <a
                href={r.href}
                target="_blank"
                rel="noreferrer"
                className="card-flat flex h-full flex-col p-5 transition-colors hover:bg-cream"
              >
                <span className="font-display text-lg font-bold leading-tight">{r.name.split(" — ")[0]}</span>
                <span className="mt-1 text-sm text-foreground/60">{r.tile}</span>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-sky">
                  Open <ExternalLink className="size-4" aria-hidden />
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="card-pop mt-8 p-6 sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-wide text-brand">Detroit doesn&apos;t lack digital resources</p>
          <p className="mt-3 text-lg font-semibold">The problem: the resident has to know where to look.</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              ["Neighborhood issue", "Improve Detroit"],
              ["Job", "Detroit at Work"],
              ["Bus", "DDOT"],
              ["Park / recreation", "Park Finder"],
              ["Essential assistance", "211"],
              ["Activities", "Visit Detroit"],
              ["Technology support", "Connect 313"],
              ["Youth opportunity", "Youth & Education"],
            ].map(([need, dest]) => (
              <li key={need} className="flex items-center gap-2 rounded-xl bg-cream px-3 py-2 text-sm">
                <span className="font-bold">{need}</span>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                <span className="text-foreground/70">{dest}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl bg-ink p-6 text-cream">
            <p className="text-xs font-extrabold uppercase tracking-wide text-sun">Detroit needs a better front door</p>
            <p className="mt-2 font-display text-2xl font-bold">Know I&apos;m Here — one intelligent front door.</p>
            <ol className="mt-4 grid gap-2 text-sm font-semibold text-cream/80 sm:grid-cols-2">
              <li className="rounded-xl bg-cream/10 px-3 py-2">Resident asks: “What do I need?”</li>
              <li className="rounded-xl bg-cream/10 px-3 py-2">AI understands the request</li>
              <li className="rounded-xl bg-cream/10 px-3 py-2">Location + preferences + accessibility</li>
              <li className="rounded-xl bg-cream/10 px-3 py-2">Best trusted Detroit resource → clear next action</li>
            </ol>
            <p className="mt-4 text-sm font-bold text-sun">Different services. One intelligent front door.</p>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            These are recommended resource links for the Buildathon prototype. Know I&apos;m Here does not operate these services and no technical
            integration, partnership or endorsement is implied.
          </p>
        </div>
          </div>
        </div>
      </section>






      <section className="border-y border-border bg-card"><div className="container-kih grid gap-6 py-14 lg:grid-cols-[0.8fr_1.2fr]"><div><p className="text-xs font-extrabold uppercase text-sky">Privacy + responsible AI</p><h2 className="mt-2 text-3xl font-extrabold">You stay in control.</h2><p className="mt-3 text-foreground/70">Check-ins are private by default. Recommendations explain why they appear. Know I&apos;m Here identifies official resources but never files a City report for you.</p><Button asChild variant="outline" className="mt-5"><Link to="/privacy">Read our commitments <ArrowRight /></Link></Button></div><div className="grid gap-3 sm:grid-cols-3"><Promise icon={<LockKeyhole />} title="Private by default" /><Promise icon={<Eye />} title="Explain the match" /><Promise icon={<ShieldCheck />} title="You choose what to share" /></div><p className="lg:col-span-2 text-sm font-bold text-brand">For emergencies, call 911. Know I&apos;m Here is not an emergency service.</p></div></section>

      <section className="mx-auto max-w-4xl px-5 py-12 text-center sm:py-16">
        <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-brand">Know I&apos;m Here</p>
        <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-5xl">
          The right resource.<br />The right opportunity.<br />For the right Detroit resident.<br />
          <span className="text-sky">At the right moment.</span>
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3"><Button asChild><Link to="/onboarding">Find What I Need</Link></Button><Button asChild variant="outline"><Link to="/for-you">Explore Around Me</Link></Button></div>
      </section>
    </div>
  );
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