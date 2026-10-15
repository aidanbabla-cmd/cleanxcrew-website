# Outline Home Services — Codex instructions

This repository has a legacy CleanXCrew name, but the active website in `CleanXCrew Website/` is Outline Home Services. It is a static HTML/CSS/JavaScript site. Do not treat it as a React or Next.js app.

## Start here
- Read `CleanXCrew Website/AI_WORKFLOW.md` for the three-role workflow.
- Read `CleanXCrew Website/MASTER_PLAN.md` for verified site architecture and design boundaries.
- Read `CleanXCrew Website/TASKS.md` before substantial work; update task state and evidence when work finishes.
- Repository skills: `$outline-architect` (plan), `$outline-implementer` (build), `$outline-reviewer` (inspect and correct). Skills are role instructions, **not** automatic model switches.

## Non-negotiable constraints
- Preserve Outline's Christmas lighting theme, current brand, and existing copy unless the user explicitly requests a change.
- Do not invent student-founder stories, upfront pricing, or an expanded customer-facing design/mockup feature. Keep personal consultation as the core sales step. The existing Light Lab must not be removed without instruction.
- Protect working quote forms, referral flows, contact links, CRM/Cloudflare Worker integrations, analytics, consent, redirects, and SEO metadata.
- Prefer small, scoped changes to existing vanilla HTML/CSS/JS. Avoid new frameworks and dependencies without clear justification and approval.
- No secrets in commits. No automatic deployments, destructive data changes, or production configuration changes without explicit permission.
- Inspect actual source before promising behavior. Never report an unrun check as passing. Explain visual/browser checks that cannot be performed.

## Execution discipline
- For a simple fix: implement directly and verify; heavy planning is unnecessary.
- For complex design or cross-file work: use the architect skill to create an approved, measurable task before implementing.
- Implement one approved task at a time; keep changes reviewable. Never mark an unapproved idea as approved.
- Verify JS syntax (from repository root): `find "CleanXCrew Website" -maxdepth 1 -name "*.js" -type f -exec node --check {} \;`.
- Where possible inspect desktop and mobile behavior, reduced-motion support, keyboard navigation, and form interactions; list any checks you could not run.
- Summarize changed files, test outcomes, remaining risks, and the next recommended task.
