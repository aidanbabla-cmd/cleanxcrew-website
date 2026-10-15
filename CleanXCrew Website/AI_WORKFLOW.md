# The Outline AI development system

## What is actually automated
- Codex can discover root `AGENTS.md` and the three repo-local skills in `.agents/skills/`.
- Tasks, constraints, and handoffs persist in this GitHub repository across conversations.
- A GitHub Actions check validates JavaScript syntax on pull requests.
- **Not** automated: selecting Sol/Luna, triggering the next Codex session, visual judgment, approving product changes, merging, and deploying. Those require Codex capabilities/settings or human action; do not pretend they happened.

## Minimal owner workflow
1. For a big idea, open this project in Codex, select Sol, and say: **Use $outline-architect. My goal is: [your idea]. Plan it against the actual code.**
2. Review the proposed direction in `TASKS.md`. Say **Approve ANIM-001 [or specific task ID]** in Codex; the agent records approval. Small bug fixes can skip architecture.
3. Select Luna and say: **Use $outline-implementer. Implement the next APPROVED task, run checks, and update TASKS.md.**
4. After multiple meaningful edits, select Sol and say: **Use $outline-reviewer. Review the tasks marked READY FOR REVIEW, inspect the actual diff and UI if browser access is available, and write only actionable fixes.**
5. Luna resolves `NEEDS FIXES`; merge only after final checks and human approval.

## Persistent handoff contract
Architect writes an `APPROVED` task only after explicit approval. Specify target files, constraints, exact desired behavior, mobile/reduced-motion cases, verification, and dependencies. Implementer commits focused changes and updates task status with evidence; never claims an unrun test passed. Reviewer inspects actual code/diff instead of trusting summaries, then records outcome. Keep short factual handoff notes in `TASKS.md` so new conversations don't need old chat history.

## How to limit expensive-model usage
- Simple and moderate changes: Luna can inspect, change, and self-verify directly.
- Ambiguous visual designs, major interactions, or architectural decisions: Sol plans once, Luna implements small slices, Sol reviews one grouped milestone.
- Escalate a task to Sol implementation only if Luna's repeated attempts fail or the code requires expert reasoning. Stop loops after two unproductive fix attempts and write down the blocker.
- Optimize for accepted working changes, not just token counts.

## Command and verification reference
- JavaScript parse check from repo root: `find "CleanXCrew Website" -maxdepth 1 -type f -name "*.js" -exec node --check {} \;`
- Browser checks: load homepage on desktop/mobile; replay and skip intro; verify menus, photo/video interaction, anchors, keyboard navigation, reduced-motion; avoid real lead submissions.
- The repository's workflow only checks JS syntax. It cannot verify animation appearance, endpoints, or real conversion paths.

## Safety and deployment
- Work on feature branches; do not write directly to production by default.
- Keep business URLs, forms, data-handling, marketing tags, pricing and copy stable unless explicitly requested.
- A draft PR is a review boundary. Merging and deployment remain separate from building features.
