---
name: plan-first
description: Durable plan and handover workflow for coding tasks. Inspect first, approve the initial plan, then implement one verified task at a time while checkpointing TODO.md and HANDOVER.md for context resets.
---

# Plan-First – Durable Checkpoints

Use for every new feature, bug fix, refactor, or implementation. Project-root `TODO.md` is the task ledger; `HANDOVER.md` is the latest resumable state. Keep both short and current, not transcripts. NEVER implement before the initial plan is approved.

## 1. Inspect and Plan
1. Read `AGENTS.md` if present, then project structure, metadata/dependencies, build/test scripts, README, and existing `TODO.md` and `HANDOVER.md`.
2. On resumption, read both checkpoints BEFORE researching or coding. Trust them as a starting point, but check relevant files and verification results. Do not redo recorded research without a reason.
3. For a new request, ask up to five blocking questions in one round and WAIT for answers.
4. Create or update `TODO.md`: one-sentence goal, ordered `- [ ]` tasks, constraints/decisions. Every task MUST be ATOMIC:
   * Touches a maximum of ONE file.
   * Requires ONE type of action only (Read, Create, Modify, or Test).
   * Names the exact file path and the specific success criteria.
   A task that cannot obey these rules (e.g. a rename across a package, a test importing several files) MUST be split, or marked `MULTI:` with the reason and the list of files it touches. Never bundle "set up X and Y" into one task.
   If the plan exceeds ten tasks, write it in batches of ten: show each batch to the operator and WAIT for a go-ahead before writing the next batch.
5. The planning pass writes NO code. Plans, file paths, and success criteria only.
6. Create or update `HANDOVER.md`: approval status, current state, key findings/paths, outstanding checks, next exact action.
7. Show the plan: "Reply YES to start, or tell me what to change." WAIT for explicit approval; record it in `HANDOVER.md` before implementing. On revisions, update both files and request approval again.

## 2. Execute One Task at a Time
1. Before starting a task, write its identity, intended action, and verification to `HANDOVER.md`.
2. Perform ONLY that task; run a focused check.
3. Mark `[x]` in `TODO.md` ONLY after verification passes.
4. Update `HANDOVER.md` with outcome, changed paths, relevant decisions, remaining failures, and the next exact action. Then begin the next task.
5. When work reveals a new in-scope task, append a small verifiable item to `TODO.md`, note where it fits in `HANDOVER.md`, and continue without re-approval. Ask approval before expanding the goal, materially increasing risk, or changing requirements.

## 3. Checkpoint on Every Boundary
Update `HANDOVER.md` after consequential decisions, on failed or partial checks, before and after each task, and before ending a turn or handing control back. Checkpoint early when context is running low.
1. Never claim an unchecked task is complete. Record the verification command and result briefly, not raw logs.
2. State blockers and the exact next command or edit. Do not depend on chat history.
3. On interruption, the next session starts by reading `TODO.md` and `HANDOVER.md` and resumes the first unfinished task, checking partial work before retrying.
4. Keep completed `TODO.md` and `HANDOVER.md` as durable project records unless the operator requests cleanup. On completion, set `HANDOVER.md` to complete with checks and follow-ups, then report.

## Checkpoint Shapes
`TODO.md`: `# TODO`, `## Goal`, `## Tasks` (ordered checkboxes), `## Notes` (constraints/decisions).
`HANDOVER.md`: `# Handover`, `Status: planning | awaiting approval | approved | in progress | blocked | complete`, `Current task`, `Findings/decisions`, `Changed paths`, `Verification` (pass/fail/pending), `Next action` (exact command or edit). Replace stale details when updating; do not append a running diary.
