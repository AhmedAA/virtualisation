#!/bin/bash

function Empire() {
  colorecho "Installing Empire"
  export STAGING_KEY=$(echo empire | md5sum | cut -d ' ' -f1)
  python -m pip install pefile
  git -C /opt/tools/ clone https://github.com/BC-SECURITY/Empire
  cd /opt/tools/Empire/setup
  ./install.sh
}

# Package dedicated to command & control frameworks
function install_c2_tools() {
  Empire                          # Exploit framework
  # Metasploit is already installed in the base image i am using
  #fapt metasploit-framework       # Offensive framework
  # TODO: add Silentrinity
  # TODO: add starkiller
}
