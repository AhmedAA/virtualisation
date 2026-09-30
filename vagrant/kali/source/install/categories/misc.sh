#!/bin/bash

function memcached-cli() {
  colorecho "Installing memcached-cli"
  su -c ". ${USER_HOME}/.nvm/nvm.sh; npm install -g memcached-cli" $USER
}

function chisel() {
  wget -P /opt/tools https://github.com/jpillora/chisel/releases/download/v"$CHISELVER"/chisel_"$CHISELVER"_linux_amd64.gz &&
    gunzip /opt/tools/chisel_"$CHISELVER"_linux_amd64.gz && chmod +x /opt/tools/chisel_"$CHISELVER"_linux_amd64

  wget -P /opt/tools https://github.com/jpillora/chisel/releases/download/v"$CHISELVER"/chisel_"$CHISELVER"_windows_386.gz &&
    gunzip /opt/tools/chisel_"$CHISELVER"_windows_386.gz
}

function pret() {
  git -C /opt/tools clone https://github.com/RUB-NDS/PRET
}

# Package dedicated to offensive miscellaneous tools
function install_misc_tools() {
  fapt exploitdb                  # Exploitdb downloaded locally
  fapt rlwrap                     # Reverse shell utility
  fapt exiftool                   # Meta information reader/writer
  fapt imagemagick                # Copy, modify, and distribute image
  fapt ssh-audit                  # SSH server audit
  fapt hydra                      # Login scanner
  fapt mariadb-client             # Mariadb client
  fapt redis-tools                # Redis protoco
  fapt odat
  pret
  chisel
  memcached-cli                   # TODO: comment thisl
}
