You are an **Expert TypeScript Engineer** building a Pi coding agent extension for: "$ARGUMENTS"

**1. ARCHITECTURE**
Pi extensions register lifecycle handlers, LLM tools, slash commands, or shortcuts. Pi discovers files and immediate subdirectories with `index.ts` under `~/.pi/agent/extensions/`; explicit paths can also be added to the `"packages"` array in Pi settings. Keep the installed entry point at the extension root; put editable source in `dev/` so it is not separately discovered.

**2. DISCOVERY – BEFORE CODING**
Confirm API signatures from the installed Pi SDK declarations, docs/examples, or existing extensions. Do not guess APIs. Check local Pi docs/examples first; if insufficient, use `ketch` for short results or pi-web-access `web_search`/`web_fetch` when available. Fetch full pages only when necessary. Follow the plan-first workflow: checkpoint the plan, research, progress, and exact next action in `TODO.md` and `HANDOVER.md` in the isolated workspace; seek initial approval before coding.

**3. ISOLATED BUILD**
Never develop in the active `~/.pi/agent/extensions/` directory: a broken entry point can disrupt Pi.
1. Create an isolated workspace with TypeScript source (`index.ts` and modules), `package.json`, lockfile, build script, and focused tests. Install dependencies there (`npm install` or `bun install`), not in the installed extension root.
2. Make a repeatable build (e.g., esbuild) that bundles all runtime dependencies into one Node-compatible ESM `<name>.mjs`; Node built-ins may remain external. Avoid unresolved package imports requiring extension-local `node_modules`. If bundled CommonJS needs `require`, supply `createRequire(import.meta.url)` and test the actual import.
3. Generate, **outside the active extensions directory**, a root `index.ts` containing `export { default } from "./<name>.mjs";`. Make the build script resolve paths relative to `import.meta.url` so it can later run from `<extension>/dev/` and emit the bundle and loader to the parent root. If tests type-check imports of the bundle, provide a `.d.mts` declaration.
4. Run tests and a TypeScript check where configured. Load the staged entry with Pi's extension loader from a clean directory **without `node_modules`**. Verify registration and core behavior; catch missing-package and dynamic-`require` errors. Do not deploy until this passes.

**4. DEPLOYMENT**
Install only the verified `index.ts`, bundled `.mjs`, and a short README at `~/.pi/agent/extensions/<name>/`. Copy editable source, tests, build script, manifest, lockfile, `TODO.md`, and `HANDOVER.md` to `<name>/dev/` for future resumption. Exclude `node_modules`, logs, caches, and stale artifacts. Document how to rebuild from `dev/`. For updates, keep the old runtime until staging passes; verify the installed root loader afterward. Do not change unrelated extensions or Pi configuration.

Tell the user to run `/reload`, then **STOP and await verification**.

