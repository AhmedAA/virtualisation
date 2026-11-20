#!/bin/zsh
set -e

source "$HOME/.oh-my-zsh/custom/plugins/zsh-nvm/zsh-nvm.plugin.zsh"
nvm install --lts
npm install -g @ast-grep/cli ketch-cli
npm cache clean --force
rm -rf "$HOME/.nvm/.cache" "$HOME/.npm/_cacache"
