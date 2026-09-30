#!/bin/bash

function bettercap_install() {
  colorecho "Installing Bettercap"
  fapt bettercap
  sed -i 's/set api.rest.username user/set api.rest.username bettercap/g' /usr/share/bettercap/caplets/http-ui.cap
  sed -i 's/set api.rest.password pass/set api.rest.password bettercap/g' /usr/share/bettercap/caplets/http-ui.cap
  sed -i 's/set api.rest.username user/set api.rest.username bettercap/g' /usr/share/bettercap/caplets/https-ui.cap
  sed -i 's/set api.rest.password pass/set api.rest.password bettercap/g' /usr/share/bettercap/caplets/https-ui.cap
}

function hcxtools() {
  colorecho "Installing hcxtools"
  git -C /opt/tools/ clone https://github.com/ZerBea/hcxtools
  cd /opt/tools/hcxtools/
  make
  make install
}

function hcxdumptool() {
  colorecho "Installing hcxdumptool"
  apt-get -y install libcurl4-openssl-dev libssl-dev
  git -C /opt/tools/ clone https://github.com/ZerBea/hcxdumptool
  cd /opt/tools/hcxdumptool
  make
  make install
  ln -s /usr/local/bin/hcxpcapngtool /usr/local/bin/hcxpcaptool
}

function wifite2() {
  colorecho "Installing wifite2"
  git -C /opt/tools/ clone https://github.com/derv82/wifite2.git
  cd /opt/tools/wifite2/
  python3 setup.py install
}

# Package dedicated to wifi pentest tools
function install_wifi_tools() {
  #fapt aircrack-ng                # WiFi security auditing tools suite
  #fapt hostapd-wpe                # Modified hostapd to facilitate AP impersonation attacks
  #fapt reaver                     # Brute force attack against Wifi Protected Setup
  #fapt bully                      # WPS brute force attack
  #fapt cowpatty                   # WPA2-PSK Cracking
  #wifite2                         # Retrieving password of a wireless access point (router)
  bettercap_install               # MiTM tool
  #hcxtools                        # Tools for PMKID and other wifi attacks
  #hcxdumptool                     # Small tool to capture packets from wlan devices
}
