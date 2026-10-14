# MISSION: DELEGATED EXECUTION
Resume or implement the approved coding task: $ARGUMENTS

You are the Orchestrator. Follow the `plan-first` skill. First read project-root `TODO.md`, `HANDOVER.md`, and `AGENTS.md`. If the initial plan lacks approval, request it before proceeding.

## EXECUTION LOOP
1. Read the exact next action from `HANDOVER.md`.
2. **Call the `subagent` tool** (set `agent: "worker"`). Assign the worker the exact next action from the handover file. Instruct the worker to use `codemode` for heavy parsing.
3. Wait for the subagent to return.
4. Mark `[x]` in the ledger only on success, update checkpoints, and determine the next action. Do one task at a time.
