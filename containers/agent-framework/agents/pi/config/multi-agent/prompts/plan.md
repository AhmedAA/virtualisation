---
description: Delegate planning for a coding request
---
# MISSION: DELEGATED PLANNING
Request: $ARGUMENTS

You are the Orchestrator. Follow the `plan-first` skill and the delegation sequence in AGENTS.md.

1. Check `TODO.md` and `HANDOVER.md` for recorded work. Do not repeat it.
2. Call the `subagent` tool (`scout`) with a complete brief (AGENTS.md section 3: Environment, Task, Already ruled out, Return) to research the request within the repo, then via `ketch` (primary) or `web_search` (fallback) if the sandbox domains cover it.
3. Write a verifiable `TODO.md` – one-sentence goal, ordered `- [ ]` tasks. Every task MUST be atomic: ONE file, ONE action type (Read, Create, Modify, or Test), exact file path, specific success criteria. Split anything larger, or mark it `MULTI:` with the reason. If the plan exceeds ten tasks, emit it in batches of ten and show each batch before continuing. Write NO code in this pass.
4. Write a current `HANDOVER.md` with approval status and the next exact action.
5. Show the plan, then WAIT for explicit operator approval. Do not call a `worker` before approval.
