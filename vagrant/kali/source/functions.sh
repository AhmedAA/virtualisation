#!/bin/bash

RED='\033[1;31m'
BLUE='\033[1;34m'
GREEN='\033[1;32m'
NOCOLOR='\033[0m'

function colorecho() {
  echo -e "${BLUE}[BOOTSTRAP] $@${NOCOLOR}"
}

function update() {
  colorecho "Updating, upgrading, cleaning"
  export DEBIAN_FRONTEND=noninteractive
  apt-get update
  apt-mark hold grub*
  apt-get -y install apt-utils
  yes '' | apt-get -y -o DPkg::options::="--force-confdef" -o DPkg::options::="--force-confnew" dist-upgrade
  apt-mark unhold grub*
  apt-get -y autoremove && apt-get clean
}

function fapt() {
  colorecho "Installing APT package: $@"
  apt-get install -y "$@" || exit
}

function filesystem() {
  colorecho "Preparing filesystem"
  su -c "mkdir -p /home/$USER/go/bin" $USER
  su -c "mkdir -p /home/$USER/go/src" $USER
  mkdir -p /opt/tools/
  mkdir -p /opt/tools/bin/
  mkdir -p /data/
  mkdir -p /samba/payloads && chown nobody:nogroup /samba/payloads && chmod 777 /samba/payloads
  cp $BASE_DIR/source/smb/smb.conf /etc/samba/smb.conf
  mkdir -p /opt/resources/
  cp $BASE_DIR/source/python2-dockerfile /opt/resources/python2-dockerfile
  mkdir -p /opt/resources/windows/
  mkdir -p /opt/resources/linux/
  mkdir -p /opt/resources/mac/
  mkdir -p /opt/resources/webshells
  mkdir -p /opt/resources/webshells/PHP/
  mkdir -p /opt/resources/webshells/ASPX/
  mkdir -p /opt/resources/webshells/JSP/
  mkdir -p "/opt/resources/encrypted disks/"
}
