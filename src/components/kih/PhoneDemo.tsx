import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  BusFront,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  HeartHandshake,
  HeartPulse,
  Home,
  Vote,
  Landmark,
  MapPin,
  Navigation,
  Route,
  Search,
  ShieldCheck,
  Store,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-store";
import transportImage from "@/assets/carousel-transport-detroit.jpg";
import opportunityImage from "@/assets/carousel-opportunity-detroit.jpg";
import healthImage from "@/assets/carousel-health-detroit.jpg";
import neighborhoodImage from "@/assets/carousel-neighborhood-detroit.jpg";
import foodImage from "@/assets/carousel-food-detroit.jpg";
import shelterImage from "@/assets/carousel-shelter-detroit.jpg";
import civicImage from "@/assets/carousel-civic-detroit.jpg";
import skylineAsset from "@/assets/detroit-sunset-skyline.png.asset.json";
import riverwalkAsset from "@/assets/detroit-riverwalk.jpeg.asset.json";
import communityClassAsset from "@/assets/fast-freddy-class-wide.jpeg.asset.json";
import communityEventAsset from "@/assets/fast-freddy-community-event-original.jpeg.asset.json";
import spiritAsset from "@/assets/spirit-of-detroit-original.jpeg.asset.json";

type Slide = {
  id: string;
  label: string;
  secondaryLabel?: string;
  title: string;
  subtext: string;
  footer: string;
  icon: typeof Search;
  image?: { src: string; alt: string; position?: string; caption?: string };
  tags: string[];
  body: ReactNode;
};

const slides: Slide[] = [
  {
    id: "welcome",
    label: "Detroit · Prototype",
    title: "Welcome to Know I’m Here",
    subtext: "Real People. Real Resources. A Stronger Detroit.",
    footer: "People. Places. Possibilities.",
    icon: Search,
    image: { src: skylineAsset.url, alt: "Detroit skyline at sunset" },
    tags: ["Health", "Community", "Opportunities", "Events"],
    body: <InfoCard icon={MapPin} title="Discover what’s around you" meta="Personalized for your needs and interests" />,
  },
  {
    id: "food-support",
    label: "Live · Community support",
    secondaryLabel: "Demo example",
    title: "Food Support in Your Area",
    subtext: "Saturday · 11 AM",
    footer: "Detroit community resource · Prototype",
    icon: HeartHandshake,
    image: { src: foodImage, alt: "Volunteers handing fresh produce to neighbors at a Detroit community food distribution", position: "center 45%" },
    tags: ["Resource found", "Caregiver Support · Available nearby", "Senior Resource · Matched to you"],
    body: (
      <div className="grid gap-2">
        <InfoCard icon={Store} title="Food Support in Your Area" meta="Saturday · 11 AM" />
        <InfoCard icon={HeartHandshake} title="Fresh food distribution nearby" meta="Community resource" />
      </div>
    ),
  },
  {
    id: "transport",
    label: "Live · Access support",
    title: "Transportation Help Available",
    subtext: "Rides nearby. Get where you need to go.",
    footer: "Support available near you · Prototype",
    icon: Navigation,
    image: { src: transportImage, alt: "Older Detroit resident beside a city bus in downtown Detroit", position: "center 48%" },
    tags: ["Access Support", "Transportation"],
    body: (
      <div className="grid gap-2">
        <InfoCard icon={Navigation} title="Help getting to appointments" meta="Resource matched" />
        <InfoCard icon={BusFront} title="View transit options" meta="Bus routes & ride assistance" />
      </div>
    ),
  },
  {
    id: "opportunity",
    label: "Live · Opportunity",
    title: "New Opportunity Near You",
    subtext: "Job & training session",
    footer: "Career support nearby · Prototype",
    icon: BriefcaseBusiness,
    image: { src: opportunityImage, alt: "Young Detroit job seeker at a workforce and skilled trades center", position: "center 42%" },
    tags: ["Career Opportunity", "Jobs & Training"],
    body: (
      <div className="grid gap-2">
        <InfoCard icon={BriefcaseBusiness} title="Resume and career support" meta="Seats available" />
        <InfoCard icon={Sparkles} title="Skilled trades information session" meta="Free · Thursday" />
      </div>
    ),
  },
  {
    id: "health",
    label: "Live · Health & wellness",
    title: "Health Resources Near You",
    subtext: "Clinics, screenings and more.",
    footer: "Healthier Detroit · Prototype",
    icon: HeartPulse,
    image: { src: healthImage, alt: "Smiling older Detroit resident outside a neighborhood health center", position: "center 42%" },
    tags: ["Healthcare", "Wellness"],
    body: (
      <div className="grid gap-2">
        <InfoCard icon={HeartPulse} title="Find nearby clinics and services" meta="Locations nearby" />
        <InfoCard icon={CalendarDays} title="Vaccination & wellness events" meta="This week" />
      </div>
    ),
  },
  {
    id: "wellness",
    label: "Live · Wellness + recreation",
    title: "Wellness Near You",
    subtext: "Detroit Riverwalk",
    footer: "Matched to your interests",
    icon: Route,
    image: { src: riverwalkAsset.url, alt: "People enjoying the Detroit Riverwalk" },
    tags: ["Recreation", "Nearby"],
    body: <InfoCard icon={Users} title="Fresh air, movement, and community" meta="Walking group · Today at 4 PM" />,
  },
  {
    id: "shelter",
    label: "Safe support + shelter",
    title: "Safe Shelter Near You",
    subtext: "Detroit",
    footer: "Matched to urgent needs · Prototype",
    icon: Home,
    image: { src: shelterImage, alt: "Staff member welcoming a resident at a Detroit shelter and housing support center", position: "center 45%" },
    tags: ["Shelter", "Nearby", "Support"],
    body: <InfoCard icon={Home} title="Need a safe place to stay?" meta="Emergency shelter · Temporary housing · Safe support" />,
  },
  {
    id: "civic",
    label: "Voting + civic access",
    title: "Voting Resources Near You",
    subtext: "Detroit",
    footer: "Matched to your interests · Nonpartisan information · Prototype",
    icon: Vote,
    image: { src: civicImage, alt: "Vote Here sign outside an official municipal building entrance", position: "center 50%" },
    tags: ["Voting", "Nearby", "Civic"],
    body: <InfoCard icon={Vote} title="Voter registration and polling information" meta="Check status · Register · Find polling place" />,
  },
  {
    id: "community-events",
    label: "Live · Community",
    title: "Community Events Near You",
    subtext: "Music. Culture. Food. Connections.",
    footer: "Stronger together · Prototype",
    icon: Users,
    image: { src: communityEventAsset.url, alt: "Fast Freddy in white leading a large indoor Detroit community event", position: "center 58%" },
    tags: ["Events", "Community"],
    body: (
      <div className="grid gap-2">
        <InfoCard icon={CalendarDays} title="Events this week" meta="Music, food, community & more" />
        <InfoCard icon={Users} title="Senior activities and classes" meta="Join in the fun" />
      </div>
    ),
  },
  {
    id: "community-activities",
    label: "Live · Community",
    title: "Recreational & Hustle Classes Near You",
    subtext: "Stay active. Stay connected.",
    footer: "Active people. Stronger Detroit. · Prototype",
    icon: Users,
    image: { src: communityClassAsset.url, alt: "Fast Freddy in a green outfit and hat leading a Detroit hustle class", position: "center center" },
    tags: ["Activities", "Senior Programs"],
    body: (
      <div className="grid gap-2">
        <InfoCard icon={Users} title="Dance & movement sessions" meta="All fitness levels" />
        <InfoCard icon={HeartHandshake} title="Weekly wellness classes" meta="Healthier, happier people" />
      </div>
    ),
  },
  {
    id: "neighborhoods",
    label: "Live · Safety",
    title: "Safer Neighborhoods. Stronger Communities.",
    subtext: "Stay informed. Get connected.",
    footer: "Together for a stronger Detroit · Prototype",
    icon: ShieldCheck,
    image: { src: neighborhoodImage, alt: "Detroit neighbors connecting on a cared-for residential block with a community mural", position: "center 48%" },
    tags: ["Safety", "Neighborhoods"],
    body: (
      <div className="grid gap-2">
        <InfoCard icon={ShieldCheck} title="Neighborhood updates & alerts" meta="Official local information" />
        <InfoCard icon={Users} title="Community resources & support" meta="Get involved" />
      </div>
    ),
  },
  {
    id: "discover-detroit",
    label: "Live · Detroit",
    title: "Discover Detroit",
    subtext: "People. Places. Possibilities.",
    footer: "Same city. More opportunities.",
    icon: Landmark,
    image: { src: spiritAsset.url, alt: "The original Spirit of Detroit statue photograph", position: "center center" },
    tags: ["Local Business", "Explore"],
    body: (
      <div className="grid gap-2">
        <InfoCard icon={MapPin} title="Explore local landmarks" meta="Parks, culture & more" />
        <InfoCard icon={Store} title="Support local businesses" meta="Shop. Dine. Discover." />
      </div>
    ),
  },
];

function InfoCard({ icon: Icon, title, meta }: { icon: typeof Search; title: string; meta: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-sm">
      <span className="grid size-9 shrink-0 place-items-center rounded-md bg-aqua-soft text-sky"><Icon className="size-4" /></span>
      <div className="min-w-0">
        <p className="text-sm font-bold leading-tight text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{meta}</p>
      </div>
      <ArrowRight className="ml-auto size-4 shrink-0 text-sky" />
    </div>
  );
}

export function PhoneDemo() {
  const { accessibilityPreferences } = useApp();
  const [active, setActive] = useState(0);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    if (accessibilityPreferences.reduceMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 5000);
    return () => window.clearInterval(interval);
  }, [accessibilityPreferences.reduceMotion]);

  const goTo = (next: number) => setActive((next + slides.length) % slides.length);
  const slide = slides[active];
  if (!slide) return null;
  const Icon = slide.icon;

  return (
    <div className="phone-demo-wrap" aria-label="Know I'm Here product preview">
      <div className="phone-shell">
        <div className="phone-side phone-side-left" aria-hidden />
        <div className="phone-side phone-side-right" aria-hidden />
        <div className="phone-screen">
          <div className="phone-status" aria-hidden>
            <span>11:43</span><span className="phone-island" /><span>5G&nbsp; ◉</span>
          </div>
          <div className="phone-appbar">
            <span className="grid size-8 place-items-center rounded-full bg-brand text-xs font-extrabold text-brand-foreground">KIH</span>
            <div><p className="text-xs font-extrabold text-foreground">Know I’m Here</p><p className="text-[10px] text-muted-foreground">Detroit · Prototype</p></div>
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-mint/15 px-2 py-1 text-[10px] font-extrabold text-foreground"><span className="size-1.5 rounded-full bg-mint" /> I’m Here · On</span>
          </div>

          <div
            className="phone-slide"
            key={slide.id}
            onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }}
            onTouchEnd={(event) => {
              const start = touchStart.current;
              const end = event.changedTouches[0]?.clientX;
              if (start === null || end === undefined) return;
              if (Math.abs(start - end) > 45) goTo(active + (start > end ? 1 : -1));
              touchStart.current = null;
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="phone-eyebrow">{slide.label}</p>
                {slide.secondaryLabel && <p className="mt-1 text-[9px] font-extrabold uppercase text-brand">{slide.secondaryLabel}</p>}
              </div>
              <div className="phone-slide-icon"><Icon className="size-4" /></div>
            </div>
            <h2 className="mt-2 text-[1.45rem] font-extrabold leading-tight text-foreground">{slide.title}</h2>
            <p className="mt-1 text-sm font-semibold text-foreground/60">{slide.subtext}</p>
            {slide.image && (
              <div className="phone-photo mt-3">
                <img src={slide.image.src} alt={slide.image.alt} className="size-full object-cover" style={{ objectPosition: slide.image.position }} loading="lazy" width={1280} height={720} />
                {slide.image.caption && <p className="phone-photo-caption">{slide.image.caption}</p>}
              </div>
            )}
            <div className="mt-3">{slide.body}</div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {slide.tags.map((tag) => <span className="phone-chip" key={tag}>{tag}</span>)}
            </div>
            <p className="phone-slide-footer">{slide.footer}</p>
          </div>

          <div className="phone-controls">
            <Button variant="ghost" size="icon" onClick={() => goTo(active - 1)} aria-label="Previous phone demo slide"><ChevronLeft /></Button>
            <div className="flex gap-1" role="tablist" aria-label="Phone demo slides">
              {slides.map((item, index) => (
                <Button key={item.id} variant="ghost" size="icon" role="tab" aria-label={`Show ${item.label}`} aria-selected={index === active} onClick={() => goTo(index)} className="size-6 p-0">
                  <span className={`block h-1.5 rounded-full transition-all ${index === active ? "w-4 bg-sky" : "w-1.5 bg-border"}`} />
                </Button>
              ))}
            </div>
            <Button variant="ghost" size="icon" onClick={() => goTo(active + 1)} aria-label="Next phone demo slide"><ChevronRight /></Button>
          </div>
          <div className="mx-auto mb-2 h-1 w-24 rounded-full bg-ink/80" aria-hidden />
        </div>
      </div>
      <div className="phone-caption">
        <span className="inline-flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-mint" /> Live product walkthrough</span>
        <span className="inline-flex items-center gap-1"><Clock3 className="size-3" /> {accessibilityPreferences.reduceMotion ? "Auto-rotation paused · Swipe to explore" : "Auto-rotates · Swipe to explore"}</span>
      </div>
    </div>
  );
}