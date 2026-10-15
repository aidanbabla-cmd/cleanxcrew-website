# Outline Home Services — verified project context

Updated: 2026-10-14. This document separates observed repository facts from future goals.

## Current implementation (verified from this repository)
- Static site with HTML pages, vanilla JavaScript, and CSS; no front-end package manager configuration was observed in this website folder.
- `index.html`: Outline-branded Christmas lighting homepage; intro screen, navigation, hero, seasonal photo/video lookbook, service and contact paths.
- `styles.css` and `night-switch.css`: core styling and animated visual treatments.
- `script.js`: introduction timing and skip/replay, menu interactions, motion preference detection, and other homepage interactions.
- `light-lab.html`, `light-lab.css`, `light-lab.js`: existing Light Lab experience; preserve it unless the user requests a change. Do not automatically expand it into a client-facing mockup sales tool.
- `quote.html` + `quote.js`: lead form with Cloudflare Turnstile; posts to an Outline CRM Cloudflare Worker endpoint. Any changes require end-to-end testing; do not send real leads during tests.
- `referrals.html` + `referrals.js`: referral-specific page and script. Treat payout/referral logic as sensitive business functionality.
- `vercel.json`: redirects/rewrites for quote, referrals, and QR-linked pages. Deployment happens outside the AI workflow.
- Homepage includes Meta Pixel, public contact information, canonical URL, and social metadata; do not change these incidentally.

## Product direction (user-provided)
- High-end, cinematic, very interactive Christmas/holiday lighting experience for the Greater Montréal market.
- Meaningful opening animation, responsive transitions, strong scrolling experience, polished navigation; performance matters as much as visual drama.
- Existing branding, Christmas atmosphere, and copy must remain intact unless a specific change is approved.
- Conversion path: short lead qualification followed by personal consultation and custom mockups prepared by Outline, not a mandatory customer self-design process.
- Preserve current existing features even where a future sales-led redesign is discussed. Suggest conflicts; do not silently remove a feature.

## Technical / experience constraints
- Mobile-first responsiveness; no content concealed by animations.
- Honor `prefers-reduced-motion`; animations must be skippable and not block interaction.
- Favor transform/opacity animations over expensive layout reflows where feasible.
- Keep keyboard, focus, and contrast accessibility.
- Maintain existing form endpoint contracts, analytics, and Vercel routes.
- Record before/after visual evidence if a browser/screenshot environment is available.
- Automated syntax validation does not prove visuals, performance, or submissions work.

## Decision process
- Ideas enter `TASKS.md` as `PROPOSED` and require the owner's creative/product approval before structural or content changes.
- Architect translates approved direction into bite-sized `APPROVED` tasks with measurable acceptance criteria.
- Implementer executes one task, runs checks, and marks `READY FOR REVIEW`.
- Reviewer checks diff, acceptance criteria, browser behavior if available, and records `ACCEPTED` or `NEEDS FIXES`.
- Final merge/deployment is a separate decision. Skills guide agents but cannot autonomously select Sol/Luna in Codex.

## Unknowns to inspect when relevant
- Deployment environment and the current production branch.
- Whether this GitHub checkout is the version currently live at outlinehomeservices.com.
- Current mobile, browser, and real-form behavior (not verified merely by reading source).
