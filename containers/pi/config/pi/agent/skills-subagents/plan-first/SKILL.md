---
name: plan-first
description: Durable plan and handover workflow for coding tasks via subagent delegation. Inspect first, approve the initial plan, then delegate one verified task at a time while checkpointing TODO.md and HANDOVER.md for context resets.
---

# Plan-First – Durable Checkpoints (Delegation Workflow)

Use for every new feature, bug fix, refactor, or implementation. Project-root `TODO.md` is the task ledger; `HANDOVER.md` is the latest resumable state. Never delegate implementation to a subagent before the initial plan is approved.

## 1. Inspect and Plan
Read `AGENTS.md`, `TODO.md`, and `HANDOVER.md`. On resumption, read checkpoints **before** doing anything else. 
For a new request, ask up to five **blocking** questions; wait for answers. Formulate a one-sentence goal and verifiable `- [ ]` tasks in `TODO.md`. Update `HANDOVER.md` with approval status and the next exact action. Wait for explicit user approval before delegating work.

## 2. Delegate One Task at a Time
Before starting a task, write its intended action to `HANDOVER.md`. **Call the `subagent` tool** (typically the `worker` agent) and assign it this specific task. 
Once the subagent returns a successful result, mark the task `[x]` in `TODO.md`. Update `HANDOVER.md` with the outcome, changed paths, and the next exact action. Ask approval before expanding the goal.

## 3. Checkpoint on Every Boundary
Update `HANDOVER.md` after the subagent completes its work, on failed checks, and before handing control back. State blockers and the exact next command/edit. 

`TODO.md` Format: `# TODO`, `## Goal`, `## Tasks` (ordered checkboxes), `## Notes`.
`HANDOVER.md` Format: `# Handover`, `Status`, `Current task`, `Findings`, `Changed paths`, `Verification`, `Next action`.
