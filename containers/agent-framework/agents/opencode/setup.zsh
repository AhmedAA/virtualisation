#!/bin/zsh
set -e

"$HOME/.cargo/bin/rtk" init -g --opencode
nono pull nolabs-ai/opencode

rm -rf "$HOME/.cache" "$HOME/.npm/_cacache" \
  "$HOME/.cargo/registry" "$HOME/.nvm/.cache" "$HOME/.zsh_history"
find "$HOME" -maxdepth 1 -name '.zcompdump*' -delete
