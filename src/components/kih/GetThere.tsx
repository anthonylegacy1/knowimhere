import { Link } from "@tanstack/react-router";
import { Bus, Footprints, Car, Smartphone, Users, HeartHandshake, Stethoscope, UserRound, Hand } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import type { Resource } from "@/data/resources";
import { cityResource } from "@/data/city-resources";
import { useLocationState } from "@/lib/location";
import { logEngagement } from "@/lib/impact";
import { track } from "@/lib/analytics";
import { distanceToResource } from "@/lib/resource-distance";
import { CityResourceCard } from "./CityResourceCard";

interface Option {
  id: string;
  label: string;
  icon: ReactNode;
  detail: string;
  status?: "coming-soon" | "potential";
  primary?: boolean;
}

export function GetThere({ resource, onDone }: { resource: Resource; onDone?: () => void }) {
  const dest = encodeURIComponent(resource.location);
  const { activeCoords, precise, areaLabel } = useLocationState();
  const live = distanceToResource(resource, activeCoords);
  const originParam = precise && activeCoords ? `&origin=${activeCoords.lat},${activeCoords.lng}` : "";
  const options: Option[] = [
    {
      id: "transit",
      label: "Bus / Public Transit",
      icon: <Bus className="size-5" />,
      detail: resource.transportation.find((t) => /bus|QLINE|People Mover/i.test(t)) ?? "Plan a DDOT / SMART trip",
      primary: true,
    },
    { id: "walk", label: "Walking", icon: <Footprints className="size-5" />, detail: resource.walkable ? "Walkable route" : `${resource.distanceMiles} mi — may be far to walk` },
    { id: "drive", label: "Driving", icon: <Car className="size-5" />, detail: "Open directions" },
    { id: "rideshare", label: "Rideshare", icon: <Smartphone className="size-5" />, detail: "Uber / Lyft", status: "potential" },
    { id: "community", label: "Community Transportation", icon: <Users className="size-5" />, detail: "Neighborhood ride network", status: "coming-soon" },
    { id: "senior", label: "Senior Transportation", icon: <UserRound className="size-5" />, detail: "Rides for adults 60+", status: "coming-soon" },
    { id: "medical", label: "Medical Transportation", icon: <Stethoscope className="size-5" />, detail: "For health appointments", status: "coming-soon" },
    { id: "family", label: "Family / Caregiver", icon: <HeartHandshake className="size-5" />, detail: "Share trip details" },
    { id: "assist", label: "Ride Assistance", icon: <Hand className="size-5" />, detail: "Request help getting there", status: "potential" },
  ];

  function choose(o: Option) {
    void logEngagement({
      type: "get_there",
      resourceSlug: resource.id,
      category: resource.category,
      neighborhood: resource.neighborhood,
    });
    void track("transportation_option_viewed", {
      resourceSlug: resource.id,
      category: resource.category,
      neighborhood: resource.neighborhood,
      subcategory: o.label,
    });
    if (o.id === "drive" || o.id === "walk" || o.id === "transit") {
      const mode = o.id === "drive" ? "driving" : o.id === "walk" ? "walking" : "transit";
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}${originParam}&travelmode=${mode}`, "_blank", "noopener");
      toast.success("Directions opened. Tap “I'm Here” when you arrive.");
    } else if (o.id === "family") {
      const text = `${resource.name} — ${resource.whenLabel} at ${resource.location}`;
      if (navigator.share) void navigator.share({ title: resource.name, text }).catch(() => undefined);
      else {
        void navigator.clipboard?.writeText(text);
        toast.success("Trip details copied to share with family.");
      }
    } else {
      toast(`${o.label}: ${o.status === "coming-soon" ? "Coming soon" : "Potential transportation option"} — not yet integrated.`);
    }
    onDone?.();
  }

  return (
    <div>
      <div className="flex items-start gap-3">
        <span className="text-3xl" aria-hidden>📍</span>
        <div>
          <p className="font-display text-xl font-bold">{resource.name}</p>
          <p className="text-sm text-foreground/60">
            {live ? `${live.label} • ` : resource.distanceMiles > 0 ? `${resource.distanceMiles} miles away • ` : ""}
            {resource.whenLabel}
          </p>
          <p className="text-sm text-foreground/60">{resource.location}</p>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            {precise
              ? "Directions start from your current location."
              : areaLabel
                ? `Directions start from ${areaLabel}. Turn on I'm Here to start from your current location.`
                : "Turn on I'm Here to start directions from your current location."}
          </p>
          {resource.accessibility.length > 0 && (
            <p className="mt-1 text-xs text-foreground/60">Access: {resource.accessibility.join(" · ")}</p>
          )}
        </div>
      </div>
      <div className="mt-5 rounded-2xl border-2 border-sun bg-sun/15 p-4">
        <p className="text-xs font-extrabold uppercase tracking-wide text-ink">Important near your route</p>
        <ul className="mt-2 grid gap-1.5 text-sm font-semibold text-foreground/75">
          <li>⚠️ Community-reported activity near this route — not yet verified by an official source.</li>
          <li>🚧 Official road closure affecting this route.</li>
        </ul>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link to="/live" className="btn-base btn-ink btn-sm">View update</Link>
          <button type="button" className="btn-base btn-sm border-2 border-border bg-card" onClick={() => toast("Prototype: route options would be compared here.")}>Compare route options</button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Buildathon demonstration data. Know I&apos;m Here shares relevant information; it does not calculate or guarantee a safe route.</p>
      </div>

      <div className="mt-5">
        <CityResourceCard
          resource={cityResource("ddot")}
          lead="Public transit · Route information, live Bus Tracker and service information."
          compact
        />
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => choose(o)}
            className={`flex min-h-16 items-center gap-3 rounded-2xl border-2 p-3 text-left transition-colors ${
              o.primary ? "border-brand bg-brand/10" : "border-border bg-card hover:bg-cream"
            }`}
          >
            <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${o.primary ? "bg-brand text-brand-foreground" : "bg-cream text-foreground"}`}>
              {o.icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display font-bold leading-tight">{o.label}</span>
              <span className="block truncate text-xs text-foreground/60">{o.detail}</span>
            </span>
            {o.status && (
              <span className="chip shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground">
                {o.status === "coming-soon" ? "Coming soon" : "Potential"}
              </span>
            )}
          </button>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Options marked “Coming soon” or “Potential” are not integrated yet and do not imply a partnership.
      </p>
    </div>
  );
}
