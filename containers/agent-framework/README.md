# Coding agent images

One shared `base` stage supports three separate build targets: `pi`, `opencode`, and `goose`.
Each resulting image installs only its selected agent. The base includes a non-root `agent`
user, nono, shared CLI tools, and zsh.
Builds require access to the upstream installers and package registries in `Containerfile`.

## Build

Run these commands from this directory:

```sh
podman build --target pi -t coding-agent:pi .
podman build --target opencode -t coding-agent:opencode .
podman build --target opencode --build-arg OPENCODE_MODELS=local \
  -t coding-agent:opencode-local .
podman build --target goose -t coding-agent:goose-local .
podman build --target goose --build-arg GOOSE_MODELS=marketplace \
  -t coding-agent:goose-marketplace .
```

Docker also works: use `docker build -f Containerfile` instead of `podman build`.
All model selections are **build-time choices**; changing a model profile requires a rebuild.
The final image receives only its selected config and nono policy, not the alternate files.

### Pi

The Pi defaults are `PI_MODELS=local` and `PI_WORKFLOW=multi-agent`, matching
`../pi/`. Select the Marketplace models and single-agent workflow with:

```sh
podman build --target pi --build-arg PI_MODELS=marketplace \
  --build-arg PI_WORKFLOW=single-agent -t coding-agent:pi-marketplace .
```

Model choices: `local`, `marketplace`. Workflow choices: `multi-agent`, `single-agent`.
Invalid values fail the build. The choice selects Pi's `models.json` and matching
nono policy together. Shared Pi settings and extension bundles are copied once;
editable extension sources and tests are not included in the final image.
`pi-subagents` is installed only for the multi-agent workflow; `pi-web-access`
is installed for both.

```sh
podman run -it --name pi -v "$PWD/../my-project:/home/agent/dev" coding-agent:pi
# Inside the container:
cd ~/dev
nono run --profile pi -- env -u NO_PROXY -u no_proxy pi
```

The local model servers use `127.0.0.1:11434` and `127.0.0.1:11435` **inside the
container**. On Linux, add `--network host` to `podman run` if those servers
bind only to the host's loopback interface. The multi-agent workflow needs
`subagents_enable`, so do not start it with `--exclude-tools subagents_enable`.

### OpenCode

`OPENCODE_MODELS=marketplace` is the default. `OPENCODE_MODELS=local` selects
Qwen 3.5 at `127.0.0.1:11434` as the default model, and also makes Ministral
at `127.0.0.1:11435` available. The local endpoints must speak the OpenAI-
compatible API and support tool calling. For host-bound loopback servers on
Linux, add `--network host` to the `podman run` command.

```sh
podman run -it --name oc -v "$PWD/../my-project:/home/agent/dev" \
  coding-agent:opencode
# Inside the container:
cd ~/dev
opencode-sandbox
```

Use `coding-agent:opencode-local` instead for local models. `opencode-sandbox`
loads the selected environment, bypasses inherited HTTP proxies for loopback
models, and runs OpenCode under nono. For local models it supplies a non-secret
dummy key. Invoking `opencode` directly skips that setup and nono isolation.

### Goose CLI

The Goose target uses the [official CLI-only installer](https://goose-docs.ai/docs/getting-started/installation/)
with non-interactive configuration (`CONFIGURE=false`). It does **not** install
Goose Desktop. Optionally pin a release with `--build-arg GOOSE_VERSION=vX.Y.Z`.

`GOOSE_MODELS=local` (default) selects `qwen3.5` at
`127.0.0.1:11434/v1/chat/completions`; `GOOSE_MODELS=marketplace` selects
`openai_gpt6_sol`. To use another model, edit `agents/goose/models/<choice>.sh`
and rebuild. Goose uses `OPENAI_HOST` plus `OPENAI_BASE_PATH` for these endpoints.

```sh
podman run -it --name goose --network host \
  -v "$PWD/../my-project:/home/agent/dev" coding-agent:goose-local
# Inside the container:
cd ~/dev
goose-sandbox session
# Or: goose-sandbox run --text "Summarize this project"
```

On Linux, use `--network host` only when required for a host-bound local server.
For Marketplace builds, omit it and supply the runtime credential as described
below. `goose-sandbox` loads the chosen provider settings and invokes nono;
direct `goose` calls bypass both. Goose's [provider](https://goose-docs.ai/docs/getting-started/providers/)
and [configuration](https://goose-docs.ai/docs/guides/config-files/) docs describe
the settings.

## Build and security notes

- The base retains the existing shared toolchain and passwordless `sudo`.
  Remove tools or sudo access if they do not suit your environment.
- Installer and package downloads are not fully pinned or checksum-verified.
  Pin releases and verify artifacts when reproducibility or supply-chain
  assurance matters.
- Download caches are cleaned in the same build steps that create them.
  Deleting files in a later layer does not shrink an earlier layer.

## Layout and checks

- `Containerfile`: shared base, configuration assembly stages, and one final
  stage per agent.
- `config/`: common shell configuration and a small shared build script.
- `agents/pi/`: Pi workflows, settings, extension bundles, models, nono policies,
  and agent-specific build scripts.
- `agents/opencode/`: local and Marketplace OpenCode configurations, nono
  policies, build scripts, and the `opencode-sandbox` launcher.
- `agents/goose/`: local and Marketplace Goose settings, nono policies, and the
  `goose-sandbox` launcher.

To add another agent, create `agents/<name>/` and a `FROM base AS <name>` target.
Install only that agent there, copy its config, and document its build and
runtime commands. Keep agent-specific installations out of `base`.
