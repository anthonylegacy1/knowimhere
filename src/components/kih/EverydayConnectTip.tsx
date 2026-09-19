import { LifeBuoy } from "lucide-react";
import { EXTERNAL_LINKS } from "@/data/resources";

/** Small, optional support prompt pointing to Everyday Connect. */
export function EverydayConnectTip({ text, linkLabel = "Learn with Everyday Connect" }: { text: string; linkLabel?: string }) {
  return (
    <aside className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-lg border border-border bg-card px-4 py-3 text-sm">
      <LifeBuoy className="size-4 shrink-0 text-sky" aria-hidden />
      <span className="text-foreground/70">{text}</span>
      <a
        href={EXTERNAL_LINKS.everydayConnect}
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-8 items-center font-bold text-sky underline-offset-4 hover:underline"
      >
        {linkLabel} ↗
      </a>
    </aside>
  );
}
