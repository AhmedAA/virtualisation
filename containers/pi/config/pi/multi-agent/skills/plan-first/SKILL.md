---
name: plan-first
description: Durable plan and handover workflow for coding tasks via subagent delegation. Inspect first, approve the initial plan, then delegate one verified task at a time while checkpointing TODO.md and HANDOVER.md for context resets.
---

# Plan-First – Durable Checkpoints (Delegation Workflow)

Use for every new feature, bug fix, refactor, or implementation. Project-root `TODO.md` is the task ledger; `HANDOVER.md` is the latest resumable state. Never delegate implementation before the initial plan is approved.

## 1. Inspect and Plan
1. Read `AGENTS.md`, `TODO.md`, and `HANDOVER.md`. On resumption, read checkpoints before doing anything else.
2. For a new request, ask up to five blocking questions and WAIT for answers.
3. Write a one-sentence goal and verifiable `- [ ]` tasks to `TODO.md`. Write approval status and the next exact action to `HANDOVER.md`.
4. WAIT for explicit operator approval before delegating.

## 2. Delegate One Task at a Time
1. Before starting a task, write its intended action to `HANDOVER.md`.
2. Call the `subagent` tool (typically `worker`) with that task only.
3. On success: mark `[x]` in `TODO.md`; update `HANDOVER.md` with the outcome, changed paths, and next exact action. Ask approval before expanding the goal.

## 3. Checkpoint on Every Boundary
Update `HANDOVER.md` after each subagent returns, on failed checks, and before handing control back. State blockers and the exact next command or edit.

## Formats
`TODO.md`: `# TODO`, `## Goal`, `## Tasks` (ordered checkboxes), `## Notes`.
`HANDOVER.md`: `# Handover`, `Status`, `Current task`, `Findings`, `Changed paths`, `Verification`, `Next action`.
