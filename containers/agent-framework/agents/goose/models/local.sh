# Sourced by goose-sandbox before starting a sandboxed Goose CLI session.
# llama.cpp OpenAI-compatible endpoint, reachable from inside the container.
export GOOSE_PROVIDER=openai
export GOOSE_MODEL=qwen3.5
export OPENAI_HOST=http://127.0.0.1:11434
export OPENAI_BASE_PATH=v1/chat/completions
# Goose requires a non-empty key even if the local server ignores it.
export OPENAI_API_KEY=sk-dummy
