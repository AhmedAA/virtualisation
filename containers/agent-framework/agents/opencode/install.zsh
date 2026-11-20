#!/bin/zsh
set -e

source "$HOME/.oh-my-zsh/custom/plugins/zsh-nvm/zsh-nvm.plugin.zsh"
npm install -g @opencode/cli@latest
npm cache clean --force
rm -rf "$HOME/.npm/_cacache"
