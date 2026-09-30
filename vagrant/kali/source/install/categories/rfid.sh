#!/bin/bash

function proxmark3() {
  colorecho "Installing proxmark3 client"
  colorecho "Compiling proxmark client for generic usage with PLATFORM=PM3OTHER (read https://github.com/RfidResearchGroup/proxmark3/blob/master/doc/md/Use_of_Proxmark/4_Advanced-compilation-parameters.md#platform)"
  colorecho "It can be compiled again for RDV4.0 with 'make clean && make all && make install' from /opt/tools/proxmak3/"
  apt-get -y install --no-install-recommends git ca-certificates build-essential pkg-config libreadline-dev gcc-arm-none-eabi libnewlib-dev qtbase5-dev libbz2-dev libbluetooth-dev
  git -C /opt/tools/ clone https://github.com/RfidResearchGroup/proxmark3.git
  cd /opt/tools/proxmark3
  make clean
  make all PLATFORM=PM3OTHER
  make install PLATFORM=PM3OTHER
}

# Package dedicated to RFID pentest tools
function install_rfid_tools() {
  proxmark3                       # Proxmark3 scripts
  # TODO
}
