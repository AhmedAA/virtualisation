# MISSION: BUILD A PI EXTENSION
Build a Pi coding agent extension for: "$ARGUMENTS"

Follow the `plan-first` skill. Checkpoint plan, research, progress, and the exact next action in `TODO.md` and `HANDOVER.md` in the isolated workspace; seek initial approval before coding.

## 1. Architecture
Pi extensions register lifecycle handlers, LLM tools, slash commands, or shortcuts. Pi discovers `index.ts` files under `~/.pi/agent/extensions/` (and immediate subdirectories); explicit paths can be added to the `"packages"` array in settings. Keep the installed entry point at the extension root; put editable source in `dev/`.

## 2. Discovery – BEFORE CODING
1. Confirm API signatures from installed Pi SDK declarations, docs/examples, or existing extensions. Do not guess APIs.
2. If local sources are insufficient, use `ketch` (primary) or `pi-web-access` `web_search` (fallback), restricted to the allowlisted domains. Full pages only when essential.

## 3. Isolated Build
NEVER develop in the active `~/.pi/agent/extensions/` directory: a broken entry point disrupts Pi.
1. Create an isolated workspace with TypeScript source (`index.ts` and modules), `package.json`, lockfile, build script, and focused tests. Install dependencies there, not in the installed extension root.
2. Make a repeatable build (e.g. esbuild) bundling all runtime dependencies into one Node-compatible ESM `<name>.mjs`; Node built-ins may stay external. If bundled CommonJS needs `require`, supply `createRequire(import.meta.url)` and test the actual import.
3. Generate, outside the active extensions directory, a root `index.ts` containing `export { default } from "./<name>.mjs";`. Make the build script resolve paths relative to `import.meta.url` so it can run from `<extension>/dev/` and emit the bundle and loader to the parent root. If tests type-check the bundle, provide a `.d.mts` declaration.
4. Run tests and the TypeScript check where configured. Load the staged entry with Pi's extension loader from a clean directory WITHOUT `node_modules`. Verify registration and core behaviour; catch missing-package and dynamic-`require` errors. Do not deploy until this passes.

## 4. Deployment
1. Install only the verified `index.ts`, bundled `.mjs`, and a short README at `~/.pi/agent/extensions/<name>/`.
2. Copy editable source, tests, build script, manifest, lockfile, `TODO.md`, and `HANDOVER.md` to `<name>/dev/`. Exclude `node_modules`, logs, caches, and stale artifacts. Document how to rebuild from `dev/`.
3. For updates, keep the old runtime until staging passes; verify the installed root loader afterward. Do not change unrelated extensions or Pi configuration.
4. Tell the operator to run `/reload`, then STOP and await verification.
