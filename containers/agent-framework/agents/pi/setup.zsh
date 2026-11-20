#!/bin/zsh
set -e

source "$HOME/.oh-my-zsh/custom/plugins/zsh-nvm/zsh-nvm.plugin.zsh"
"$HOME/.cargo/bin/rtk" init -g --agent pi
nono pull nolabs-ai/pi
"$HOME/.pi/agent/bin/pi" install git:github.com/nicobailon/pi-web-access

if [ "$PI_WORKFLOW" = multi-agent ]; then
  "$HOME/.pi/agent/bin/pi" install git:github.com/nicobailon/pi-subagents
fi

rm -rf "$HOME/.cache" "$HOME/.npm/_cacache" \
  "$HOME/.cargo/registry" "$HOME/.nvm/.cache" "$HOME/.zsh_history"
find "$HOME" -maxdepth 1 -name '.zcompdump*' -delete
