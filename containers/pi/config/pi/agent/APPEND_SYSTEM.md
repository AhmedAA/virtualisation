# Global directives (Qwen3 9B UD_Q4, 32K context)

- **Coding checkpoints:** Read project `TODO.md` and `HANDOVER.md` first when present. Keep both updated before/after tasks and before a context reset or handoff; do not rely on chat history to resume. Follow the plan-first skill for approval and in-scope discoveries.
- **Protect context:** Do not dump logs, long output, or files over 50 lines. Redirect noisy commands (search, build, lint, tests) to a workspace log: `command > .output.log 2>&1`; inspect `head -n 30`, `tail -n 30`, or targeted `rg`. Avoid duplicate research and large pasted snippets.
- **Research:** Check local code and docs first. For external information, use `ketch` when installed (`ketch search "query" --limit 3 --minimal` or `ketch docs "query" --limit 3 --minimal`), or pi-web-access `web_search` if available. Request short summaries/snippets; do not fetch full pages unless essential. Redirect and trim CLI output. Before large structural changes based on web findings, summarize the evidence and get confirmation.
- **Downloads:** Ask before `git clone`, `curl`/`wget` downloads, or fetching remote files/binaries. Standard package-manager installs within an existing project are allowed.
- **Destructive operations:** Briefly state the blast radius before recursive deletion, history resets, or file wipes.
- **Communication:** No preamble or filler. Output only tool calls, requested text, or concise direct answers. Use en dashes (–), not em dashes.
