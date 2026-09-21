import { Link, useRouterState } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { useMenuOpen } from "@/lib/menu-state";

// Sticky mobile "Ask KIH" bar — the primary mobile entry point.
export function AskBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const menuOpen = useMenuOpen();
  if (pathname.startsWith("/ask") || pathname.startsWith("/demo") || pathname.startsWith("/onboarding")) return null;
  if (menuOpen) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 lg:hidden">
      <Link
        to="/ask"
        className="mx-auto flex max-w-xl items-center gap-3 rounded-3xl border-2 border-border bg-card p-2 pl-4 shadow-[0_8px_24px_-8px_oklch(0.24_0.03_265/40%)]"
      >
        <Search className="size-5 text-brand" aria-hidden />
        <span className="flex-1 truncate text-sm font-semibold text-muted-foreground">Ask KIH — what do you need today?</span>
        <span className="btn-base btn-brand btn-sm">Ask</span>
      </Link>
    </div>
  );
}
