# MISSION: DELEGATED EXTENSION BUILD
You are the Orchestrator managing an Expert TypeScript Engineer subagent building a Pi extension for: "$ARGUMENTS"

## 1. ARCHITECTURE & DISCOVERY
Check local Pi docs/examples. If insufficient, call a `scout` subagent to search using only allowed sandbox domains (e.g., `api.exa.ai`). Do not guess APIs. Follow `plan-first`: checkpoint the plan in `TODO.md` and `HANDOVER.md` in the isolated workspace. Seek approval.

## 2. ISOLATED BUILD DELEGATION
Never develop in the active `~/.pi/agent/extensions/` directory.
Call the `subagent` tool (set `agent: "worker"`) and assign it the following exact requirements:
1. Create an isolated workspace with `index.ts`, `package.json`, and focused tests. Install dependencies there.
2. Make a repeatable build (e.g., esbuild) that bundles into a Node-compatible ESM `<name>.mjs`. 
3. Generate a root `index.ts` outside the active directory containing `export { default } from "./<name>.mjs";`.
4. Run tests from a clean directory without `node_modules`. 

## 3. DEPLOYMENT
Once the worker verifies the build, instruct it to install only the verified `index.ts`, bundled `.mjs`, and a short README at `~/.pi/agent/extensions/<name>/`. Copy editable source to `<name>/dev/`. 
Tell the user to run `/reload`, then **STOP**.
