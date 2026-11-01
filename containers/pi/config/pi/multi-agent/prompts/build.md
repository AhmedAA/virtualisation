---
description: Delegate execution of the approved task
---
# MISSION: DELEGATED EXECUTION
Task: $ARGUMENTS

You are the Orchestrator. Follow the `plan-first` skill and the delegation sequence in AGENTS.md.

1. Read `TODO.md` and `HANDOVER.md`. If the plan lacks operator approval, stop and request it.
2. Write the next exact action from `HANDOVER.md` into the handover.
3. Call the `subagent` tool (`worker`) with that one action. Instruct the worker to use `codemode` for heavy parsing and `rtk` for all terminal commands.
4. On success: mark `[x]` in `TODO.md`, update `HANDOVER.md` (outcome, changed paths, next exact action). One task at a time.
5. On failure: record the error and your diagnosis in `HANDOVER.md` and report. Retry at most twice before escalating to the operator.
