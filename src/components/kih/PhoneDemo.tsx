import { useEffect, useRef, useState } from "react";
import {
  Accessibility,
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
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    id: "discover",
    eyebrow: "Community discovery",
    title: "Explore Detroit Resources",
    description: "Around you now, based on your location and what matters to you.",
    icon: Search,
    content: (
      <div className="grid gap-2">
        <DemoCard icon={HeartHandshake} title="Community Wellness Day" meta="0.8 mi · Free · Today" />
        <DemoCard icon={Users} title="Neighborhood Activities" meta="1.2 mi · All ages" />
        <div className="flex flex-wrap gap-1.5 pt-1">
          {['Nearby', 'Personalized', 'Community resource'].map((item) => <span className="phone-chip" key={item}>{item}</span>)}
        </div>
      </div>
    ),
  },
  {
    id: "caregiver",
    eyebrow: "Senior + caregiver support",
    title: "Caregiver Support",
    description: "Practical help for older adults and the people who support them.",
    icon: HeartHandshake,
    content: (
      <div className="grid gap-2">
        <DemoCard icon={Users} title="Caregiver Coffee Hour" meta="Available nearby · Free" />
        <DemoCard icon={BusFront} title="Transportation Help" meta="Accessible rides · Request ahead" />
        <p className="phone-note">Senior-specific resource · Prototype listing</p>
      </div>
    ),
  },
  {
    id: "youth",
    eyebrow: "Youth + student opportunity",
    title: "After School, Near You",
    description: "Programs matched to age, interests, distance and schedule.",
    icon: Sparkles,
    content: (
      <div className="grid gap-2">
        <DemoCard icon={Sparkles} title="Free Coding Workshop" meta="Saturday · Ages 13–19" />
        <DemoCard icon={BriefcaseBusiness} title="Summer Youth Employment" meta="Registration open" />
        <div className="flex gap-1.5"><span className="phone-chip">Technology</span><span className="phone-chip">Career pathway</span></div>
      </div>
    ),
  },
  {
    id: "transport",
    eyebrow: "Transportation + access",
    title: "Help Me Get There",
    description: "Choose an option that fits how you move through Detroit.",
    icon: Navigation,
    content: (
      <div className="grid grid-cols-2 gap-2">
        <TransportTile icon={BusFront} label="Bus route" />
        <TransportTile icon={Navigation} label="Ride assistance" />
        <TransportTile icon={Users} label="Community ride" note="Potential" />
        <TransportTile icon={Accessibility} label="Accessible option" />
      </div>
    ),
  },
  {
    id: "checkin",
    eyebrow: "Participation",
    title: "I’M HERE ✓",
    description: "Thanks for checking in. You’re connected to your community.",
    icon: Check,
    content: (
      <div className="phone-checkin">
        <span className="grid size-12 place-items-center rounded-full bg-mint text-card"><Check className="size-6" /></span>
        <div>
          <p className="font-bold">Community Wellness Day</p>
          <p className="text-xs text-muted-foreground">September 18 · Southwest Detroit</p>
        </div>
        <span className="phone-chip">Private</span>
      </div>
    ),
  },
  {
    id: "ask",
    eyebrow: "AI community guide",
    title: "Ask KIH",
    description: "Ask a question in your own words. Get a relevant next step.",
    icon: MessageCircle,
    content: (
      <div className="grid gap-2">
        <div className="rounded-lg bg-ink p-3 text-sm font-semibold text-cream">“What can my teenager do after school?”</div>
        <DemoCard icon={Sparkles} title="3 opportunities nearby" meta="Matched by age · interests · distance" />
        <p className="phone-note">Prototype recommendation logic</p>
      </div>
    ),
  },
] as const;

function DemoCard({ icon: Icon, title, meta }: { icon: typeof Search; title: string; meta: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-sm">
      <span className="grid size-9 shrink-0 place-items-center rounded-md bg-sky/15 text-sky"><Icon className="size-4" /></span>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{meta}</p>
      </div>
      <ArrowRight className="ml-auto size-4 shrink-0 text-sky" />
    </div>
  );
}

function TransportTile({ icon: Icon, label, note }: { icon: typeof BusFront; label: string; note?: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <Icon className="size-5 text-sky" />
      <p className="mt-2 text-xs font-bold text-foreground">{label}</p>
      {note && <p className="mt-1 text-[10px] font-bold uppercase text-muted-foreground">{note}</p>}
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
            <MapPin className="ml-auto size-4 text-sky" />
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
            <div className="phone-slide-icon"><Icon className="size-5" /></div>
            <p className="phone-eyebrow">{slide.eyebrow}</p>
            <h2 className="mt-2 text-[1.55rem] font-extrabold leading-tight text-foreground">{slide.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground/65">{slide.description}</p>
            <div className="mt-5">{slide.content}</div>
          </div>

          <div className="phone-controls">
            <Button variant="ghost" size="icon" onClick={() => goTo(active - 1)} aria-label="Previous phone demo slide"><ChevronLeft /></Button>
            <div className="flex gap-1.5" role="tablist" aria-label="Phone demo slides">
              {slides.map((item, index) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="icon"
                  role="tab"
                  aria-label={`Show ${item.eyebrow}`}
                  aria-selected={index === active}
                  onClick={() => goTo(index)}
                  className="size-6 p-0"
                >
                  <span className={`block h-1.5 rounded-full transition-all ${index === active ? "w-5 bg-sky" : "w-1.5 bg-border"}`} />
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