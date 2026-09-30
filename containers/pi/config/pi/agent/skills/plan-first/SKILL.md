---
name: plan-first
description: Durable plan and handover workflow for coding tasks. Inspect first, approve the initial plan, then implement one verified task at a time while checkpointing TODO.md and HANDOVER.md for context resets.
---

# Plan-First – durable checkpoints

Use for every new feature, bug fix, refactor, or implementation. Project-root `TODO.md` is the task ledger; `HANDOVER.md` is the latest resumable state. Keep both short and current, not as transcripts. Never implement before the initial plan is approved.

## 1. Inspect and plan

Read `AGENTS.md` if present, project structure, metadata/dependencies, build/test scripts, README, and existing `TODO.md` and `HANDOVER.md`. On resumption, read both checkpoints **before** researching or coding; trust them as a starting point, but check relevant files and verification results when needed. Do not redo recorded research without a reason.

For a new request, ask up to five **blocking** questions in one round; wait for answers. Create or update `TODO.md` in the project root with a one-sentence goal, small ordered/verifiable `- [ ]` tasks, and constraints/decisions. Create or update `HANDOVER.md` with approval status, current state, key findings/paths, outstanding checks, and the next exact action. Show the plan and ask: “Reply YES to start, or tell me what to change.” Wait for explicit approval; record that approval in `HANDOVER.md` before implementing. On revisions, update both files and request approval again.

## 2. Execute one task at a time

Before starting a task, write its identity, intended action and verification to `HANDOVER.md`. Perform only that task; run a focused check; mark it `[x]` in `TODO.md` **only after verification**. Update `HANDOVER.md` with outcome, changed paths, relevant decisions, remaining failures, and the next exact action. Then begin the next task. When research or implementation reveals a new **in-scope** task, append a small verifiable item to `TODO.md`, note why and where it fits in `HANDOVER.md`, and continue without re-approval. Ask approval before expanding the goal, materially increasing risk, or changing user requirements.

## 3. Checkpoint on every boundary

Update `HANDOVER.md` after consequential research/decisions, on failed or partial checks, before and after each task, and before ending a turn or handing control back. Checkpoint early if context is running low. Never claim an unchecked task is complete. Record the command/result for verification (briefly, not raw logs). State blockers and the exact next command/edit; do not depend on chat history. On interruption, the next session should start by reading `TODO.md` and `HANDOVER.md` and resume the first unfinished task, checking any partial work before retrying.

Keep completed `TODO.md` and `HANDOVER.md` as durable project records unless the user requests cleanup. On completion, set `HANDOVER.md` to complete with checks and any follow-up; report that all tasks are done.

## Checkpoint shapes

`TODO.md`: `# TODO`, `## Goal`, `## Tasks` (ordered checkboxes), `## Notes` (constraints/decisions).

`HANDOVER.md`: `# Handover`, `Status: planning | awaiting approval | approved | in progress | blocked | complete`, `Current task`, `Findings/decisions`, `Changed paths`, `Verification` (pass/fail/pending), `Next action` (exact command or edit). Replace stale details when updating; do not append a running diary.
