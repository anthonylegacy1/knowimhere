# Homepage Product-First Reorganization

## Goal
Shorten the default homepage journey and surface the working Know I’m Here experience before the deeper pilot story, while preserving every existing route, control, image, demo flow, accessibility preference, and content section.

## New homepage order
1. Detroit introduction and problem statement
2. My Neighborhood — “Know what’s happening around you.”
3. A clear early “View / Try the Demo” entry point linked to the existing interactive demo
4. Orange “I’M HERE ✓” private-participation card with its current phone image and demo link
5. Discover Detroit, retaining its current three featured cards and expandable additional locations
6. Remaining product-support sections, including personalized discovery, the on/off panel, opportunity hubs, front-door routing, transportation, and the compact persona preview
7. Fast Freddy Experience → Everyday Connect → Know I’m Here ecosystem and expanded pilot story
8. Partner impact, resident priorities, privacy, closing message, and the existing legal footer

The existing phone walkthrough will remain intact as a product tour, but will move below the core feature sequence so it supports rather than delays the early neighborhood and demo actions.

## Early product sequence
- Move the existing My Neighborhood card upward without changing its image, label, heading, description, or CTA.
- Place a focused demo entry beside or immediately after it, using the existing `/demo` experience rather than recreating demo steps on the homepage.
- Keep the orange private-participation card adjacent to the demo entry and preserve its current image, wording, and “See it in the demo” CTA.
- Keep this sequence compact on mobile with large touch targets and no hidden functionality.

## Collapsed resident preview
- Add a separate `showResidents` state, defaulting to collapsed.
- Keep the exact section heading and supporting copy.
- Show three compact indicators by default:
  - Dorothy, 68 — Older Adult
  - Marcus, 16 — Student
  - Working Parent — Family + Everyday Needs
- Add one accessible control labeled “See How KIH Works for Different Residents ↓”.
- Expand the existing full persona cards in place with the same smooth grid-row and opacity pattern already used by Discover Detroit.
- Change the control to “Show Less ↑” when open.
- Preserve each persona’s existing query, categories, and `/demo` link, while removing those links from keyboard navigation when collapsed.
- Keep the fictional-resident disclosure with the expanded details so the compact default view stays short.

## Scope safeguards
- Reorder existing homepage blocks rather than rebuilding them.
- Do not change copy or functionality outside the new early demo entry and required compact persona labels/control.
- Preserve Discover Detroit behavior, the A+ accessibility system, reduced-motion behavior, all links, prototype disclaimers, and the footer legal notice.

## Verification
- Confirm the new section order from the top of the homepage.
- Verify the demo entry and both “See it in the demo” paths open the existing demo.
- Verify personas start collapsed, expand/collapse smoothly, retain all content and links, and respect reduced motion.
- Check desktop and mobile layouts for shorter default scroll length, large tap targets, no overlap, and no horizontal overflow.
- Check console errors and the project’s automatic validation.
