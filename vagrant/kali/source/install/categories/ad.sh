#!/bin/bash

function Responder() {
  colorecho "Installing Responder"
  fapt responder

  sed -i 's/ Random/ 1122334455667788/g' /usr/share/responder/Responder.conf
  sed -i 's/files\/AccessDenied.html/\/usr\/share\/responder\/files\/AccessDenied.html/g' /usr/share/responder/Responder.conf
  sed -i 's/files\/BindShell.exe/\/usr\/share\/responder\/files\/BindShell.exe/g' /usr/share/responder/Responder.conf
  sed -i 's/certs\/responder.crt/\/usr\/share\/responder\/certs\/responder.crt/g' /usr/share/responder/Responder.conf
  sed -i 's/certs\/responder.key/\/usr\/share\/responder\/certs\/responder.key/g' /usr/share/responder/Responder.conf
}

function CrackMapExec() {
  colorecho "Installing CrackMapExec"
  fapt crackmapexec

  # this is for having the ability to check the source code when working with modules and so on
  git -C /opt/tools/ clone https://github.com/byt3bl33d3r/CrackMapExec
}

function Impacket() {
  colorecho "Installing Impacket scripts"
  fapt impacket-scripts

  #git -C /opt/tools/ clone https://github.com/SecureAuthCorp/impacket
  #cd /opt/tools/impacket/
  #cp -v /root/sources/patches/0001-User-defined-password-for-LDAP-attack-addComputer.patch 0001-User-defined-password-for-LDAP-attack-addComputer.patch
  #git apply 0001-User-defined-password-for-LDAP-attack-addComputer.patch
  #python3 -m pip install .
}

function bloodhound.py() {
  colorecho "Installing Bloodhound and Python ingestor"
  fapt bloodhound
  pip3 install bloodhound
}

# function bloodhound() {
#   echo "Installing BloodHound from sources"
#   git -C /opt/tools/ clone https://github.com/BloodHoundAD/BloodHound/
#   mv /opt/tools/BloodHound /opt/tools/BloodHound4
#   npm install -g electron-packager
#   cd /opt/tools/BloodHound4
#   npm install
#   npm run linuxbuild
#   mkdir -p ~/.config/bloodhound
#   cp -v /root/sources/bloodhound/config.json ~/.config/bloodhound/config.json
#   cp -v /root/sources/bloodhound/customqueries.json ~/.config/bloodhound/customqueries.json
# }

function neo4j_install() {
  colorecho "Installing neo4j"
  wget -O - https://debian.neo4j.com/neotechnology.gpg.key | apt-key add -
  echo 'deb https://debian.neo4j.com stable latest' | tee /etc/apt/sources.list.d/neo4j.list
  apt-get update
  apt-get -y install --no-install-recommends gnupg libgtk2.0-bin libcanberra-gtk-module libx11-xcb1 libva-glx2 libgl1-mesa-glx libgl1-mesa-dri libgconf-2-4 libasound2 libxss1
  apt-get -y install neo4j
  mkdir /usr/share/neo4j/conf
  neo4j-admin set-initial-password neo4j
  mkdir -p /usr/share/neo4j/logs/
  touch /usr/share/neo4j/logs/neo4j.log
}

function evilwinrm() {
  colorecho "Installing evil-winrm"
  gem install evil-winrm
}

function enum4linux-ng() {
  colorecho "Installing enum4linux-ng"
  git -C /opt/tools/ clone https://github.com/cddmp/enum4linux-ng
}

function eternal_blue() {
  colorecho "Downloading helviojunior flavour MS17-010"
  git -C /opt/resources/windows clone https://github.com/helviojunior/MS17-010
}

# Package dedicated to internal Active Directory tools
function install_ad_tools() {
  Responder                       # LLMNR, NBT-NS and MDNS poisoner
  CrackMapExec                    # Network scanner
  neo4j_install                   # Bloodhound dependency
  bloodhound.py                   # AD cartographer
  evilwinrm                       # WinRM shell
  enum4linux-ng                   # Hosts enumeration
  fapt enum4linux                 # Hosts enumeration
  fapt krb5-user
  fapt nishang
  fapt impacket-scripts           # Impacket                        # Network protocols scripts
  fapt python3-lsassy             # Credentials extracter
  fapt powershell                 # Windows Powershell for Linux
  fapt mimikatz                   # AD vulnerability exploiter
  fapt python3-pypykatz           # Mimikatz implementation in pure Python
  fapt libmspack0                 # Library for some loosely related Microsoft compression format
  fapt samdump2                   # Dumps Windows 2k/NT/XP/Vista password hashes
  fapt smbclient                  # Small dynamic library that allows iOS apps to access SMB/CIFS file servers
  fapt smbmap                     # Allows users to enumerate samba share drives across an entire domain
  fapt passing-the-hash           # Pass the hash attack
  fapt smtp-user-enum             # SMTP user enumeration via VRFY, EXPN and RCPT
  fapt onesixtyone                # SNMP scanning
  fapt nbtscan                    # NetBIOS scanning tool
  fapt rpcbind                    # RPC scanning
  fapt gpp-decrypt                # Decrypt a given GPP encrypted string
  eternal_blue
}
