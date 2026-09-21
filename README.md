# Know I'm Here

**Live site:** https://knowimhere.com

Know I'm Here (KIH) is a Detroit **connection layer**. Detroit already has resources,
programs and investment — the hard part is connecting the right resource to the right
resident at the right time. KIH helps residents discover what is relevant nearby,
understand the next step, get there, participate, and stay connected.

Built by Anthony Legacy Holdings LLC for the Venture 313 Buildathon.
Primary Venture 313 pillar: **Community + Public Health**.

## The Detroit problem

Residents may not know a program exists, may not know if it applies to them, may not
know how to reach it, and organizations rarely learn whether outreach turned into
participation. Fragmented outreach means funded capacity goes unused.

## Core resident journey

**Discover → Know → Get There → Check In → Stay Connected**

## Key features

- **Ask KIH** — plain-language and voice questions, date- and day-aware so events are
  never suggested for a day they do not happen
- **Personalized discovery** — interests, life stage, area, accessibility and transport
  preferences, all optional
- **Location-aware results** — opt-in precise location or manual ZIP / neighborhood
- **Map** — shared location, filters and radius; verified vs approximate resources shown differently
- **Get There** — transit, walking and ride-assistance options via official sources
- **Private check-in** — voluntary, self-reported or location-verified; never inferred
- **KIH Live / My Neighborhood** — community reports kept distinct from official notices
- **Everyday Connect bridge** — digital confidence support
- **Fast Freddy pilot** — a trusted, real-world community environment
- **Partner analytics** — privacy-safe aggregates only

## Tech stack

TanStack Start (React 19, Vite 7), TypeScript, Tailwind CSS v4, MapLibre GL,
Lovable Cloud (Postgres, row-level security) and the Lovable AI Gateway.

## Running the project

```sh
npm install
npm run dev
```

The app runs at http://localhost:8080. Backend credentials and the admin analytics
passphrase are provided as environment variables and are not stored in this repository.

## Responsible AI and privacy

- AI assists discovery and personalization; it does not decide eligibility
- Location is opt-in, session-only, and never tracked in the background
- Precise coordinates are never stored or displayed publicly
- Check-in is voluntary and always requires an explicit resident action
- Location access is **not** a check-in
- Manual area selection always works without GPS
- Community reports are clearly separated from verified/official information
- KIH does not replace 911 or emergency services
- Demonstration data and fictional residents are labeled as such
- Partner and admin reporting shows aggregates only, with small groups suppressed

## Buildathon context

Prototype built for the Venture 313 Buildathon. Partner and sponsor content describes
**potential** alignment; no partnership, endorsement or integration is claimed.
