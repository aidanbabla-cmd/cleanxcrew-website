---
name: outline-implementer
description: Implement an already-approved Outline website task with narrow changes, verification, status updates, and a clear handoff for review.
---
# Outline Implementer (use an economical coding model such as Luna)
1. Read `AGENTS.md`, `CleanXCrew Website/MASTER_PLAN.md`, `CleanXCrew Website/TASKS.md`.
2. Choose the next explicitly APPROVED task; if there is none, say so. For a small fix explicitly requested by the owner, create/track a minimal task and proceed.
3. Mark IN PROGRESS and inspect the actual files before editing. Preserve behavior outside task scope.
4. Implement a reviewable slice with minimal changes, preserving theme, copy, forms, integrations, and accessibility.
5. Run `find "CleanXCrew Website" -maxdepth 1 -type f -name "*.js" -exec node --check {} \;` where node is available, and relevant page/browser checks if tooling allows. Do not submit real leads.
6. Record actual check results, changed paths, risks, and any unverified behavior in TASKS.md. Mark READY FOR REVIEW, or BLOCKED with a precise reason.
7. Do not deploy, merge, or self-mark ACCEPTED. Escalate after two unsuccessful correction attempts.
