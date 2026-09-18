import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  BusFront,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  HeartHandshake,
  MapPin,
  MessageCircle,
  Navigation,
  Route,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import skylineAsset from "@/assets/detroit-sunset-skyline.png.asset.json";
import riverwalkAsset from "@/assets/detroit-riverwalk.jpeg.asset.json";
import communityAsset from "@/assets/fast-freddy-class-wide.jpeg.asset.json";
import supportAsset from "@/assets/detroit-multigenerational-community.jpeg.asset.json";

type Slide = {
  id: string;
  label: string;
  secondaryLabel?: string;
  title: string;
  subtext: string;
  footer: string;
  icon: typeof Search;
  image?: { src: string; alt: string; position?: string };
  tags: string[];
  body: ReactNode;
};

const slides: Slide[] = [
  {
    id: "discover",
    label: "Live · City discovery",
    title: "Explore Detroit Resources",
    subtext: "Around you now",
    footer: "Detroit resources near you",
    icon: Search,
    image: { src: skylineAsset.url, alt: "Detroit skyline at sunset" },
    tags: ["Nearby", "Personalized"],
    body: <InfoCard icon={MapPin} title="Your city, personalized" meta="Based on your location" />,
  },
  {
    id: "support",
    label: "Live · Senior support",
    title: "Senior Support Resource",
    subtext: "Open now",
    footer: "Detroit support resource · Prototype",
    icon: HeartHandshake,
    image: { src: supportAsset.url, alt: "A multigenerational Detroit community gathering" },
    tags: ["Senior Resource", "Caregiver Support"],
    body: <InfoCard icon={HeartHandshake} title="Meals, rides, and caregiver support" meta="Available now · Verify with provider" />,
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
    id: "opportunity",
    label: "Live · Opportunity",
    title: "New Opportunity Near You",
    subtext: "Job & training session",
    footer: "Career support nearby · Prototype",
    icon: BriefcaseBusiness,
    tags: ["Career Opportunity", "Recommended"],
    body: (
      <div className="grid gap-2">
        <InfoCard icon={BriefcaseBusiness} title="Resume and career support" meta="Seats available" />
        <InfoCard icon={Sparkles} title="Skilled trades information session" meta="Free · Thursday" />
      </div>
    ),
  },
  {
    id: "fast-freddy",
    label: "Real Detroit example",
    secondaryLabel: "Live · Community movement",
    title: "Fast Freddy Hustle Class",
    subtext: "Sheffield Bridge Center",
    footer: "Detroit community activity",
    icon: Users,
    image: { src: communityAsset.url, alt: "Fast Freddy leading a Detroit community movement class" },
    tags: ["Real Detroit Example", "Community Activity"],
    body: <InfoCard icon={HeartHandshake} title="Music, movement, and social connection" meta="Today · 11:00 AM" />,
  },
  {
    id: "transport",
    label: "Live · Access support",
    title: "Transportation Help Available",
    subtext: "Rides nearby",
    footer: "Support available near you · Prototype",
    icon: Navigation,
    tags: ["Access Support", "Transportation"],
    body: (
      <div className="grid gap-2">
        <InfoCard icon={Navigation} title="Help getting to appointments" meta="Resource matched" />
        <div className="phone-route-map" aria-label="Example transportation route">
          <span className="phone-route-point" />
          <span className="phone-route-line" />
          <BusFront className="size-5 text-sky" />
          <span className="phone-route-line" />
          <MapPin className="size-5 text-brand" />
          <span className="text-[10px] font-bold text-muted-foreground">18 min</span>
        </div>
      </div>
    ),
  },
  {
    id: "checkin",
    label: "Live · Participation",
    title: "I’m Here ✓",
    subtext: "You’re connected to your community",
    footer: "Private by default",
    icon: Check,
    image: { src: supportAsset.url, alt: "Detroit residents connecting across generations" },
    tags: ["Checked In", "Private"],
    body: <InfoCard icon={Check} title="Community Wellness Day" meta="September 18 · Southwest Detroit" />,
  },
  {
    id: "ask",
    label: "Live · Ask KIH",
    title: "Ask in Your Own Words",
    subtext: "Get a relevant next step",
    footer: "Prototype recommendation logic",
    icon: MessageCircle,
    tags: ["Personalized", "Clear Next Step"],
    body: (
      <div className="grid gap-2">
        <div className="rounded-lg bg-ink p-3 text-sm font-semibold text-cream">“What can I do near me today?”</div>
        <InfoCard icon={MapPin} title="Detroit Riverwalk activities" meta="Open now · 1.2 mi" />
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
  const [active, setActive] = useState(0);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 5000);
    return () => window.clearInterval(interval);
  }, []);

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
                <img src={slide.image.src} alt={slide.image.alt} className="size-full object-cover" />
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
        <span className="inline-flex items-center gap-1"><Clock3 className="size-3" /> Auto-rotates · Swipe to explore</span>
      </div>
    </div>
  );
}