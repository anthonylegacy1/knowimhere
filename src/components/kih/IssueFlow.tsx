import { useState } from "react";
import { toast } from "sonner";
import { EXTERNAL_LINKS, ISSUE_TYPES, type IssueType } from "@/data/resources";

export function detectIssue(text: string): IssueType {
  const s = text.toLowerCase();
  return ISSUE_TYPES.find((i) => i.keywords.some((k) => s.includes(k))) ?? ISSUE_TYPES[0]!;
}

export function IssueFlow({ text, neighborhood }: { text: string; neighborhood?: string }) {
  const issue = detectIssue(text);
  const [location, setLocation] = useState(neighborhood ? `Near my home in ${neighborhood}` : "");
  const [locConfirmed, setLocConfirmed] = useState(false);
  const [photo, setPhoto] = useState(false);

  return (
    <div className="card-pop p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="text-3xl" aria-hidden>{issue.emoji}</span>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-brand">Neighborhood issue · {issue.label}</p>
          <p className="mt-1 text-lg font-semibold leading-snug">{issue.response}</p>
        </div>
      </div>

      <ol className="mt-5 space-y-3">
        <li className="card-flat p-4">
          <p className="font-display font-bold">📍 Confirm location</p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Street or cross streets"
              className="min-h-12 flex-1 rounded-xl border-2 border-input bg-card px-4 text-base"
              aria-label="Issue location"
            />
            <button type="button" onClick={() => setLocConfirmed(true)} className="btn-base btn-ink btn-sm">
              {locConfirmed ? "✓ Confirmed" : "Confirm"}
            </button>
          </div>
        </li>
        <li className="card-flat p-4">
          <p className="font-display font-bold">📷 Add photo (optional)</p>
          <button
            type="button"
            onClick={() => {
              setPhoto(true);
              toast("Photo attached (prototype).");
            }}
            className="btn-base btn-outline btn-sm mt-2"
          >
            {photo ? "✓ Photo attached" : "Add a photo"}
          </button>
        </li>
        <li className="card-flat p-4">
          <p className="font-display font-bold">🏙️ Relevant reporting resource</p>
          <p className="mt-1 text-sm text-foreground/70">
            <span className="font-bold">{issue.resourceName}</span> — the City of Detroit&apos;s official channel for this type of concern.
          </p>
        </li>
      </ol>

      <a href={EXTERNAL_LINKS.improveDetroit} target="_blank" rel="noreferrer" className="btn-base btn-brand mt-5 w-full">
        ➡️ Continue to Official Reporting Resource
      </a>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Know I&apos;m Here does not replace City services. It helps residents find and use them. Reports are submitted through the official City resource, not through this prototype.
      </p>
    </div>
  );
}
