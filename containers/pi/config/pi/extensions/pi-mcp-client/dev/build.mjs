import { build } from "esbuild";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const dev = fileURLToPath(new URL(".", import.meta.url));
const root = join(dev, "..");

await build({
  entryPoints: [join(dev, "index.ts")],
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node22",
  outfile: join(root, "mcp.mjs"),
  banner: { js: 'import { createRequire as __piCreateRequire } from "node:module"; const require = __piCreateRequire(import.meta.url);' },
  packages: "bundle",
});
// Pi discovers the root index.ts; development TypeScript remains in dev/.
await writeFile(join(root, "index.ts"), 'export { default } from "./mcp.mjs";\n');
