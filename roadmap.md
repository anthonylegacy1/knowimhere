# Roadmap

- [x] Replace every Fast Freddy Experience URL with the non-www address.
- [x] Add uploaded Detroit and community imagery through project assets.
- [x] Use the Detroit skyline sunset in the homepage hero.
- [x] Add strong Detroit photography to the city discovery experience.
- [x] Enrich all six phone demo screens with imagery or route visuals.
- [x] Add the real community photo to Fast Freddy story content.
- [x] Verify desktop and mobile presentation and all updated links.

## Homepage visual and content refinement

- [x] Preserve current routes, functionality, demo mode, Ask KIH, resources, transportation, neighborhood, check-in, partner, and privacy features.
- [x] Refine hero proportions and responsive Detroit skyline framing.
- [x] Rebuild phone storytelling with content-specific imagery, labels, cards, chips, and preserved carousel behavior.
- [x] Add uploaded Everyday Connect and authentic Fast Freddy imagery in the requested sections.
- [x] Reorder homepage flow and move Discover Detroit near the bottom.
- [x] Add concise homepage previews for personalized discovery, Ask KIH, partner impact, and privacy where needed.
- [x] Unify typography, palette, buttons, cards, spacing, and mobile/desktop presentation.
- [x] Confirm every Fast Freddy link uses https://fastfreddyexperience.com.
- [x] Verify desktop and mobile rendering, carousel controls, links, and console/network health.

## Story card imagery

- [x] Replace the Everyday Connect chapter thumbnail with the uploaded guided smartphone-learning photo.
- [x] Add the uploaded Detroit father-and-daughter phone photo to the Know I'm Here chapter card.
- [x] Preserve consistent card proportions and verify meaningful crops on desktop and mobile.

## Turn On Know I'm Here

- [x] Big on/off control with plain-language copy and "On when you want it. Off when you don't."
- [x] Homepage status strip plus full panel section.
- [x] Full panel in the For You profile area.
- [x] "Turn On / Not Now" prompt before Find What's Near Me (never forced).
- [x] ZIP code / neighborhood fallback and Everyday Connect help callout.
- [x] New early Demo Mode step showing activation before recommendations.

## Senior Support phone slide

- [x] Replace the Senior Support image with the uploaded guided digital-learning photo.
- [x] Add the image caption and both requested support cards.
- [x] Verify the crop, text fit, and carousel controls at desktop and phone widths.

## I’m Here card visual

- [x] Add a warm phone-in-hand visual to the orange private-participation card.
- [x] Show the Know I’m Here interface with an unmistakable ON and private state.
- [x] Verify card balance, text readability, image crop, and action visibility on desktop and mobile.

## Detroit phone carousel

- [x] Preserve the Wellness Near You / Detroit Riverwalk slide exactly as-is.
- [x] Add Community Events and Recreational Activities slides with approved Fast Freddy photography.
- [x] Replace generated Discover Detroit artwork with the original Spirit of Detroit photo.
- [x] Keep Welcome, Transportation, Opportunity, Health, and Safer Neighborhoods in the walkthrough.
- [x] Verify all slides, exact titles, controls, image crops, and desktop/mobile rendering.

## Accessibility control

- [x] Open a clear accessibility panel from the existing A+ header button.
- [x] Add saved text size, high contrast, simplified view, and reduced motion preferences.
- [x] Add a dedicated reset action without clearing profile or saved activity.
- [x] Verify keyboard use, persistence, desktop/mobile presentation, and carousel motion behavior.

## Discover Detroit featured cards

- [x] Feature Ford Field, Hart Plaza, and Detroit Riverwalk first with distinct categories and tags.
- [x] Keep every other Detroit location in one accessible expanding area.
- [x] Verify expansion, collapse, imagery, desktop layout, and mobile layout.

## Homepage product-first reorganization

- [x] Move My Neighborhood, the demo entry, and private I’m Here participation near the top.
- [x] Move Discover Detroit ahead of supporting and ecosystem sections.
- [x] Convert resident examples to a compact, accessible expandable preview.
- [x] Verify section order, demo links, expansion behavior, and desktop/mobile rendering.

## Homepage demo consolidation

- [x] Remove the duplicate dark interactive demonstration card and its extra action.
- [x] Add the Discover → Get There → Check In journey to the orange private-participation card.
- [x] Keep the orange card linked to the existing interactive demo.
- [x] Verify the single demo entry, demo flow, and mobile presentation.

## Simplify "Detroit has resources" section
- [x] Replace five large numbered cards (Discover/Connect/Get There/Check In/Stay Connected) with compact inline DISCOVER → CONNECT → GET THERE → CHECK IN → STAY CONNECTED flow (wraps on mobile, no horizontal scroll)
- [x] Keep headline "Detroit has resources." + supporting statement; add sentence "From finding the right opportunity to getting there and staying connected, Know I'm Here helps close the loop."
- [x] Verify compact height, no overflow at 430, no console errors

## Mobile section accordions

- [x] Collapse Detroit existing resources, sustainability model, KIH impact loop and Detroit economic impact cards behind accordions.

## Location MVP (in progress)
- Real geolocation permission flow, manual ZIP/neighborhood fallback, session-only precise coords (done)
- Distance calc + radius filters on For You (done)
- Check-in proximity verification with centralized policy (threshold + max accuracy + retry) in src/lib/geo.ts
- Get There uses current location as origin
- KIH Live radius filtering
- Supabase persistence for checkins/resources: NOT implemented (backend not enabled)
- Final audit must cite evidence per acceptance criterion

## Location MVP status (verified in browser)
- Real geolocation behind explicit consent; manual ZIP/neighborhood fallback; turn off clears precise state.
- Distances via haversine from neighborhood centers (approximate by design).
- Check-in: verified / out-of-range / low-accuracy / self-reported all exercised in browser.
- Supabase (resources + checkins tables, RLS) NOT configured — no backend enabled on this project.

## Secure data layer (Lovable Cloud) — done
- [x] Cloud enabled; tables: resources, checkins, engagement_events, saved_locations, user_preferences, community_reports
- [x] RLS + narrowed grants verified with the public key (checkins/events insert-only, no public reads)
- [x] 27 resources seeded from existing verified/prototype data with neighborhood-center coordinates flagged `coordinate_precision`
- [x] Check-ins persist with status verified/self_reported; resource views + Get There clicks logged
- [x] Aggregate functions impact_totals() / impact_by_category(); Partner Impact shows "Live MVP data" separate from demonstration funnel
- [ ] Street-level coordinates per resource (replace neighborhood centers as verified data becomes available)
- [ ] Accounts / saved preferences sync (tables + policies exist; no sign-in flow yet by design)

## Jefferson Hub demo cluster (Venture 313 live demo)
- [x] Add 10 verified Midtown resource records around 950 Selden St with street-level geocodes
- [x] Verify GPS sorting places 950 Selden resources first when tested at Jefferson Hub
- [x] Voice (talk-to-text) input in Ask KIH using browser speech recognition, with typing fallback

- [x] Category filters must be true multi-select (array/Set + toggle, OR filtering, aria-pressed, survives Show More/Less) on home category pills, onboarding interests and For You Today
- [x] Fast Freddy Experience (hub + 5 street-verified class locations) and Everyday Connect added as real, non-demonstration resources
- [x] Life Stage is multi-select (array), Age Range stays single-select

- [x] Move existing Ask KIH card directly below I'm Here/location on homepage (no duplicate, keep sticky bar)
- [x] Homepage order: hero, phone, For You Today, Ask KIH, core problem

## Analytics upgrade + private admin dashboard
- [ ] Expanded privacy-safe engagement events (no GPS stored) and aggregate database functions.
- [ ] Track sessions, location choice, Ask KIH topics, saves, map use, calls, external opens, check-ins.
- [ ] Partner Impact page shows only approved live aggregates, clearly labeled.
- [ ] Private /admin/analytics dashboard (passphrase-protected, server-side) with overview, funnel, Ask KIH topics, category demand, resource performance, neighborhood insights (min 5 residents), resource gaps, location + map usage, partner summary builder with CSV/print.
- [ ] Privacy copy: what KIH measures + About KIH data.
- [ ] Admin dashboard sections menu: Overview, Resident Funnel, Ask KIH Insights, Category Demand, Resource Performance, Neighborhood Insights, Resource Gap Analysis, Location Usage, Map Engagement, Partner Report Builder.

- [x] Admin nav includes Resource Gap Analysis (anchor scroll) + report exact live URL

## Detroit Economic Impact & ROI section
- [x] Primary ROI headline: Detroit is already investing / KIH increases potential return + Discovery, Access, Participation, Utilization, Measurement.
- [x] Investment -> connection layer -> potential return flow diagram.
- [x] "More connection. More utilization. More impact per dollar." six ROI cards.
- [x] "How a single resident journey creates value" 5 steps + resident/organization split value.
- [x] "From providing information to measuring engagement" with consent/no-surveillance language.
- [x] Funded capacity -> actual participation vertical flow.
- [x] "What does ROI mean for Detroit?" + four benefit cards.
- [x] Pilot metrics to measure (resident engagement + partner ROI), no fake results.
- [x] "Why this can become a sustainable business" customer groups + revenue streams.
- [x] Closing ROI message; conditional claim language only; label current vs pilot vs future.
- [x] KIH_ANALYTICS_KEY server-side only: no browser storage, no client code, no logs; ROI page stays public.
