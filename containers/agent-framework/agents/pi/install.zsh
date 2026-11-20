#!/bin/zsh
set -e
set -o pipefail

source "$HOME/.oh-my-zsh/custom/plugins/zsh-nvm/zsh-nvm.plugin.zsh"
curl -fsSL https://pi.dev/install.sh | sh
rm -rf "$HOME/.cache" "$HOME/.npm/_cacache"
