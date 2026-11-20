# Pi MCP client

Provides Pi's `/mcp` command and dynamically registered MCP server tools. Configuration and authentication remain in `~/.pi/agent/mcps.json` and `~/.pi/agent/mcp-auth.json`.

## Development

Editable source, a local MCP smoke test, and the build script are in `dev/`. In `dev/`, run `npm install` (only if dependencies are missing), then `npm test` (builds and tests tool registration and invocation), or `npm run build` to regenerate the root `index.ts` and `mcp.mjs`. Run `/reload` to activate an updated bundle. The extension root needs no `node_modules` or npm install. The standalone `mcp-cli.mjs` is not included.
