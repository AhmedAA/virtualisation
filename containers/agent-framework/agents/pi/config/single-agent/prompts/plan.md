---
description: Plan a coding request with durable checkpoints
---
# MISSION: PLAN
Request: $ARGUMENTS

Follow the `plan-first` skill and the workflow in AGENTS.md.

1. Read `AGENTS.md` (if present), the repo structure, and existing `TODO.md` and `HANDOVER.md`. Do not repeat recorded work.
2. For a new request, ask only blocking questions and WAIT for answers.
3. Write a verifiable `TODO.md` – one-sentence goal, ordered `- [ ]` tasks, constraints. Every task MUST be atomic: ONE file, ONE action type (Read, Create, Modify, or Test), exact file path, specific success criteria. Split anything larger, or mark it `MULTI:` with the reason. If the plan exceeds ten tasks, emit it in batches of ten and show each batch before continuing. Write NO code in this pass.
4. Write a current `HANDOVER.md` with decisions, approval status, and the exact next action.
5. Show the plan and WAIT for explicit approval ("Reply YES to start, or tell me what to change"). Do not implement before approval.
On resumption, update the existing checkpoints rather than starting over.
