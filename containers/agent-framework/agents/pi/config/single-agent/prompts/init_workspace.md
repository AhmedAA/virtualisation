# MISSION: WORKSPACE INITIALIZATION

Analyze the current directory, determine the technology stack and domain (Software Engineering, Infrastructure, or Offensive Security), and generate `.pi/AGENTS.md`.

## 1. Investigate
Run, through `rtk`:
```
rtk fd -d 2
rtk fd -d 2 -g '*.{json,toml,yaml,lock}'
```

## 2. Decide
* Directory empty → generate nothing. Ask the operator for the intended stack and purpose, then stop.
* Stack unclear → ask, then stop.
* Stack clear → research current best practices with `ketch` (primary) or `web_search` (fallback), restricted to the allowlisted domains.

## 3. Generate `.pi/AGENTS.md`
Use exactly the structure below. Replace each `{placeholder}` with concrete, verified content. Every constraint MUST come from evidence in the repo or from a research result – never invent one. Example of a filled constraint: `Tests run with \`bun test\`; do not modify files under dist/`.

```markdown
# ROLE: {one sentence, e.g. "You maintain a Python backend service"}
# STACK: {comma-separated technologies, verified from lockfiles}

## HARD CONSTRAINTS
* Use `codemode` for heavy lifting: multi-file reads, log parsing, searches. Codemode input is raw JavaScript source (no fences), e.g. `await tools.bash({ command: "rg -n pattern src" })`; report back via `text("summary")`. The sandbox has no Node APIs.
* Network is restricted to api.exa.ai, html.duckduckgo.com, mcp.grep.app, sourcegraph.com, GitHub and GitLab. Never request other domains.
* {verified constraint 3}

## PLAYBOOK (WORKFLOW)
1. {one workflow step aligned with researched best practices}

## PERMITTED TOOLS
* {only tools that exist in this environment}
```

## 4. Verify
Before writing the file, check that every tool name and path you wrote actually exists, e.g. `rtk fd -g 'ast-grep'`. Remove any that do not.
