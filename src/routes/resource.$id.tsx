import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Clock, Accessibility, Bus, Building2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CATEGORIES, getResource } from "@/data/resources";
import { GetThere } from "@/components/kih/GetThere";
import { CheckIn } from "@/components/kih/CheckIn";
import { useApp } from "@/lib/app-store";
import { logEngagement } from "@/lib/impact";
import { toast } from "sonner";
import { CallButton, PhoneLine } from "@/components/kih/CallButton";
import { verifiedContact, verifiedPhone } from "@/data/resource-contacts";
import { resourceCoords } from "@/lib/resource-distance";

export const Route = createFileRoute("/resource/$id")({
  validateSearch: (s: Record<string, unknown>): { step?: "get-there" | "check-in" } =>
    s["step"] === "get-there" || s["step"] === "check-in" ? { step: s["step"] } : {},
  loader: ({ params }) => {
    const r = getResource(params.id);
    if (!r) throw notFound();
    return { resource: r };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Resource not found — Know I'm Here" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.resource.name} — Know I'm Here`;
    return {
      meta: [
        { title: t },
        { name: "description", content: loaderData.resource.summary },
        { property: "og:title", content: t },
        { property: "og:description", content: loaderData.resource.summary },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container-kih py-16 text-center">
      <h1 className="font-display text-3xl font-bold">We couldn&apos;t find that resource.</h1>
      <Link to="/for-you" className="btn-base btn-brand mt-6">
        Back to For You
      </Link>
    </div>
  ),
  component: ResourcePage,
});

function ResourcePage() {
  const { resource } = Route.useLoaderData();
  const { step } = Route.useSearch();
  const { saved, toggleSaved } = useApp();
  const [stage, setStage] = useState<"details" | "get-there" | "check-in">(step ?? "details");
  const getThereRef = useRef<HTMLDivElement>(null);
  const checkInRef = useRef<HTMLDivElement>(null);
  const cat = CATEGORIES[resource.category];
  const phone = verifiedPhone(resource.id);
  const contact = verifiedContact(resource.id);
  const hasPlace = resourceCoords(resource) !== null;
  // Getting there stays the lead action when the next step is about travelling there.
  const travelFirst = resource.category === "transportation" || /ride|bus|transit|pick ?up/i.test(resource.nextStep);

  useEffect(() => {
    void logEngagement({
      type: "resource_view",
      resourceSlug: resource.id,
      category: resource.category,
      neighborhood: resource.neighborhood,
    });
  }, [resource.id, resource.category, resource.neighborhood]);

  useEffect(() => {
    if (stage === "get-there") getThereRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (stage === "check-in") checkInRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [stage]);

  return (
    <div className="container-kih py-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <Link to="/for-you" className="inline-flex min-h-11 items-center gap-1 font-bold text-foreground/70 hover:text-foreground">
          <ArrowLeft className="size-5" /> Back
        </Link>

        <article className="card-pop mt-4 p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <span className="text-4xl" aria-hidden>{cat.emoji}</span>
            <span className="chip">{cat.label}</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">{resource.name}</h1>
          <p className="mt-2 text-lg text-foreground/70">{resource.description}</p>

          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="card-flat p-3">
              <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground"><Clock className="size-3.5" /> When</dt>
              <dd className="mt-1 font-semibold">{resource.whenLabel}</dd>
            </div>
            <div className="card-flat p-3">
              <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground"><MapPin className="size-3.5" /> Where</dt>
              <dd className="mt-1 font-semibold">
                {resource.location}
                {resource.distanceMiles > 0 && <span className="text-foreground/60"> · {resource.distanceMiles} mi</span>}
              </dd>
            </div>
            <div className="card-flat p-3">
              <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Cost</dt>
              <dd className="mt-1 font-semibold">{resource.cost}</dd>
            </div>
            <div className="card-flat p-3">
              <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground"><Building2 className="size-3.5" /> Source</dt>
              <dd className="mt-1 font-semibold">{resource.organization}</dd>
            </div>
            <div className="card-flat p-3">
              <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground"><Accessibility className="size-3.5" /> Accessibility</dt>
              <dd className="mt-1 flex flex-wrap gap-1.5">
                {resource.accessibility.length ? resource.accessibility.map((a) => <span key={a} className="chip bg-card">{a}</span>) : <span className="font-semibold">Ask provider</span>}
              </dd>
            </div>
            <div className="card-flat p-3">
              <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground"><Bus className="size-3.5" /> Transportation</dt>
              <dd className="mt-1 flex flex-wrap gap-1.5">
                {resource.transportation.length ? resource.transportation.map((a) => <span key={a} className="chip bg-card">{a}</span>) : <span className="font-semibold">Online / phone</span>}
              </dd>
            </div>
          </dl>

          <p className="mt-5 rounded-2xl bg-sun/30 px-4 py-3 font-semibold">➡️ Next step: {resource.nextStep}</p>

          {phone && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <CallButton slug={resource.id} name={resource.name} className={travelFirst ? "btn-outline" : ""} />
              <PhoneLine slug={resource.id} name={resource.name} />
            </div>
          )}
          {resource.links?.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mr-4 mt-3 inline-flex min-h-11 items-center gap-1 font-bold text-sky underline-offset-4 hover:underline"
            >
              {l.label} ↗
            </a>
          ))}
          {contact?.website && !resource.links?.length && (
            <a
              href={contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-11 items-center gap-1 font-bold text-sky underline-offset-4 hover:underline"
            >
              Visit Website ↗
            </a>
          )}

          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {hasPlace && <button type="button" onClick={() => setStage("get-there")} className={`btn-base ${phone && !travelFirst ? "btn-outline" : "btn-brand"}`}>
              Help Me Get There
            </button>}
            <button
              type="button"
              onClick={() => {
                toggleSaved(resource.id);
                toast(saved.includes(resource.id) ? "Removed from saved" : "Saved for later");
              }}
              className="btn-base btn-outline"
            >
              {saved.includes(resource.id) ? "✓ Saved" : "Save"}
            </button>
            <button type="button" onClick={() => setStage("check-in")} className="btn-base btn-ink">
              I&apos;m Here ✓
            </button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {resource.sourceLabel
              ? `${resource.sourceLabel}.`
              : resource.isOfficialResource
                ? "Official resource."
                : "Realistic demonstration listing."} Always verify details, hours and eligibility with the provider.
          </p>
        </article>

        {(stage === "get-there" || stage === "check-in") && (
          <section ref={getThereRef} className="card-pop mt-5 scroll-mt-24 p-6 sm:p-8" aria-labelledby="get-there">
            <p className="text-xs font-extrabold uppercase tracking-wide text-brand">Step 2</p>
            <h2 id="get-there" className="font-display text-2xl font-bold">Help Me Get There</h2>
            <p className="mb-5 text-foreground/65">Pick the option that fits how you get around.</p>
            <GetThere resource={resource} onDone={() => setStage("check-in")} />
          </section>
        )}

        {stage === "check-in" && (
          <section ref={checkInRef} className="mt-5 scroll-mt-24" aria-labelledby="check-in">
            <p className="text-xs font-extrabold uppercase tracking-wide text-brand">Step 3</p>
            <h2 id="check-in" className="mb-3 font-display text-2xl font-bold">When you arrive</h2>
            <CheckIn resource={resource} />
          </section>
        )}
      </div>
    </div>
  );
}
