---
description: Implement the approved plan
---
# MISSION: BUILD
Task: $ARGUMENTS

Follow the `plan-first` skill and the workflow in AGENTS.md.

1. Read `TODO.md`, `HANDOVER.md`, and `AGENTS.md` (if present). If the plan lacks approval, STOP and request it.
2. Take the next exact action from `HANDOVER.md`. Check partial work before repeating it.
3. Write the task's intended action and verification to `HANDOVER.md` BEFORE implementing.
4. Implement that one task. Use `codemode` for heavy parsing and `rtk` for all terminal commands.
5. Verify with a focused check. Mark `[x]` in `TODO.md` ONLY on success; update `HANDOVER.md` with outcome, changed paths, and the next exact action. One task at a time.
6. On failure: record the error and your diagnosis in `HANDOVER.md` and report. Retry at most twice before escalating to the operator.
7. New in-scope discoveries: append a small verifiable item to `TODO.md` and continue. Ask approval only for expanded scope, materially greater risk, or changed requirements.
8. Update both files before ending the turn, when blocked, or when context is low.
