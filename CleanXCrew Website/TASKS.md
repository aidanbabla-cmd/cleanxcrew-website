# Outline Home Services — AI task board

Canonical statuses: `PROPOSED` → `APPROVED` → `IN PROGRESS` → `READY FOR REVIEW` → `ACCEPTED`. Use `NEEDS FIXES` or `BLOCKED` when warranted. An agent must not self-approve a product decision or mark a feature done from code inspection alone.

## Workflow setup
### SYS-001 — Build persistent architect → implementer → reviewer workflow
- Status: READY FOR REVIEW
- Scope: instruction files, repo-local Codex skills, and JS syntax-only CI. No product code changes.
- Acceptance: AGENTS.md loads from repository root; three skills exist; architecture and task board are usable; CI is configured; changes proposed through a PR.
- Verification: inspect the new file paths and PR diff, confirm syntax check workflow runs on PR. CI execution status is unverified until GitHub reports a result.

## Next proposed product work (not yet approved for implementation)
### ANIM-001 — Evaluate cinematic homepage opening and interaction polish
- Status: PROPOSED
- Architect output: inspect `index.html`, `script.js`, `styles.css`, and `night-switch.css`. Identify the actual intro and hero behavior; propose a concrete motion storyboard with timings, keyboard/skip handling, reduced-motion path, mobile fallback, performance constraints, and specific target files.
- Acceptance for plan: at least one coherent before/after interaction concept; no copy/branding replacement; each implementation slice has a visual acceptance test and a rollback option.
- Owner gate: approve visual direction and specific implementation slices before Luna edits UI.
- Implementation: NOT STARTED.

### ANIM-002 — Navigation and lookbook motion refinement
- Status: PROPOSED
- Architect output: inspect actual menu/lookbook interactions, find any motion or usability problems, and specify focused corrections. Keep photo/video content and existing URLs.
- Acceptance for plan: responsive desktop/mobile/reduced-motion behavior specified; visual verification steps included.
- Implementation: NOT STARTED.

### CONV-001 — Audit lead form reliability without changing sales copy
- Status: PROPOSED
- Architect output: trace existing quote and referral paths and identify non-invasive test cases only.
- Acceptance for plan: no live submissions, no CRM schema changes, no unapproved qualification fields or pricing.
- Implementation: NOT STARTED.

## Handoff log (append entries, newest first)
- 2026-10-14 | System bootstrapped on isolated branch `codex/outline-ai-dev-workflow`. No website features implemented. Next: review PR / run CI, then select a product task for architect planning.

## Task entry template
- ID / title:
- Status: PROPOSED
- Goal and business reason:
- Exact relevant files (verified):
- What to change / what to preserve:
- Acceptance criteria:
- Checks (automated + desktop/mobile/manual):
- Evidence or screenshots:
- Risks / rollback:
- Reviewer findings:
- Owner decision / next task:
