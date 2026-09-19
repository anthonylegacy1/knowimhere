import { Phone } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { verifiedPhone } from "@/data/resource-contacts";
import { track } from "@/lib/analytics";

/**
 * Click-to-call for a resource with a VERIFIED phone number.
 * Renders nothing when no verified number exists — no placeholders, ever.
 * A short confirmation appears first; nothing dials without a second tap.
 */
export function CallButton({
  slug,
  name,
  className = "",
  size = "default",
}: {
  slug: string;
  name: string;
  className?: string;
  size?: "default" | "sm";
}) {
  const contact = verifiedPhone(slug);
  const [confirm, setConfirm] = useState(false);
  if (!contact) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirm(true)}
        aria-label={`Call ${name} at ${contact.display}`}
        className={`btn-base btn-brand ${size === "sm" ? "btn-sm" : ""} ${className}`}
      >
        <Phone className="size-4" aria-hidden /> Call Now
      </button>

      {confirm &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] grid place-items-center bg-ink/60 p-5"
            role="dialog"
            aria-modal="true"
            aria-labelledby="call-title"
          >
            <div className="w-full max-w-sm rounded-lg bg-card p-6 text-center text-foreground shadow-lg">
              <h2 id="call-title" className="font-display text-2xl font-extrabold">Call {name}?</h2>
              <p className="mt-2 text-xl font-bold">{contact.display}</p>
              <p className="mt-1 text-sm text-foreground/65">
                This opens your phone app. Number verified from {contact.source}.
              </p>
              <div className="mt-5 grid gap-2">
                <a
                  href={`tel:${contact.tel}`}
                  className="btn-base btn-brand min-h-14 text-lg"
                  aria-label={`Call ${name} at ${contact.display}`}
                  onClick={() => {
                    void track("call_clicked", { resourceSlug: slug });
                    setConfirm(false);
                  }}
                >
                  <Phone className="size-5" aria-hidden /> Call
                </a>
                <Button type="button" variant="outline" className="min-h-12" onClick={() => setConfirm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

/** Tappable, readable phone number shown next to the call action. */
export function PhoneLine({ slug, name }: { slug: string; name: string }) {
  const contact = verifiedPhone(slug);
  if (!contact) return null;
  return (
    <a
      href={`tel:${contact.tel}`}
      onClick={() => void track("call_clicked", { resourceSlug: slug })}
      aria-label={`Call ${name} at ${contact.display}`}
      className="inline-flex min-h-11 items-center gap-1.5 text-base font-bold text-sky underline-offset-4 hover:underline"
    >
      <Phone className="size-4" aria-hidden /> {contact.display}
    </a>
  );
}
