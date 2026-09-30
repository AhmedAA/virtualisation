#!/bin/bash

function frida() {
  pip3 install frida-tools
}

function grapefruit() {
  su -c ". ${USER_HOME}/.nvm/nvm.sh; npm install -g igf" $USER
}

function mobsf() {
  git -C /opt/tools clone https://github.com/MobSF/Mobile-Security-Framework-MobSF.git
  cd /opt/tools/Mobile-Security-Framework-MobSF
  python3 /opt/tools/Mobile-Security-Framework-MobSF/setup.sh
}

function fireprint() {
  git -C /opt/tools clone https://github.com/sahad-mk/Fireprint
  chmod +x /opt/tools/Fireprint/fireprint.py
}

# Package dedicated to mobile apps pentest tools
function install_mobile_tools() {
  frida
  grapefruit
  mobsf
  fireprint
}
