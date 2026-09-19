// Verified contact details, keyed by resource slug.
//
// A phone number only appears here after it was read from the organization's
// own official website on the date recorded below. Nothing is invented, and a
// resource with no entry here shows no calling option at all.

export interface VerifiedContact {
  /** Dial string for the tel: link, E.164. */
  tel: string;
  /** Human-readable number shown on screen and to screen readers. */
  display: string;
  /** Where the number was verified. */
  source: string;
  /** ISO date the number was checked. */
  verifiedAt: string;
  /** Verified official website, when one was confirmed reachable. */
  website?: string;
}

export const RESOURCE_CONTACTS: Record<string, VerifiedContact> = {
  "bamboo-midtown": {
    tel: "+13132593700",
    display: "(313) 259-3700",
    source: "bamboocowork.com/locations/midtown",
    verifiedAt: "2026-09-19",
    website: "https://www.bamboocowork.com/locations/midtown",
  },
  "the-source-semi": {
    tel: "+12485723334",
    display: "(248) 572-3334",
    source: "thesourcemi.org",
    verifiedAt: "2026-09-19",
    website: "https://www.thesourcemi.org/",
  },
  "hannan-center": {
    tel: "+13138331300",
    display: "(313) 833-1300",
    source: "hannan.org/contact",
    verifiedAt: "2026-09-19",
    website: "https://www.hannan.org/",
  },
  "cleary-detroit": {
    tel: "+18006861883",
    display: "(800) 686-1883",
    source: "cleary.edu",
    verifiedAt: "2026-09-19",
    website: "https://www.cleary.edu/",
  },
};

export function verifiedContact(slug: string): VerifiedContact | null {
  return RESOURCE_CONTACTS[slug] ?? null;
}

export function verifiedPhone(slug: string): VerifiedContact | null {
  const c = RESOURCE_CONTACTS[slug];
  return c?.tel ? c : null;
}
