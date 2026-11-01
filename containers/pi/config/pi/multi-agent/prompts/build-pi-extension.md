# MISSION: DELEGATED EXTENSION BUILD
Build a Pi extension for: "$ARGUMENTS"

You are the Orchestrator. Follow the `plan-first` skill.

## 1. Architecture and Discovery
1. Check local Pi docs and examples first.
2. If they are insufficient, call the `subagent` tool (`scout`) to research via the allowlisted sandbox domains only. Do not guess APIs.
3. Checkpoint the plan in `TODO.md` and `HANDOVER.md` in the isolated workspace and WAIT for operator approval.

## 2. Isolated Build Delegation
Never develop in the active `~/.pi/agent/extensions/` directory. Call the `subagent` tool (`worker`) with these exact requirements:
1. Create an isolated workspace with `index.ts`, `package.json`, and focused tests. Install dependencies there.
2. Make a repeatable build (e.g. esbuild) that bundles into a Node-compatible ESM `<name>.mjs`.
3. Generate a root `index.ts` outside the active directory containing `export { default } from "./<name>.mjs";`.
4. Run the tests from a clean directory without `node_modules`.

## 3. Deployment
Once the worker verifies the build, instruct it to install only the verified `index.ts`, bundled `.mjs`, and a short README at `~/.pi/agent/extensions/<name>/`, and to copy the editable source to `<name>/dev/`.
Tell the operator to run `/reload`, then STOP.
