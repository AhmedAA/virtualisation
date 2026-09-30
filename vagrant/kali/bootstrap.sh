#!/bin/bash

### Bootstrapping script for new Kali VM
### REMEMBER TO REBOOT WHEN DONE!

# extras/vars #
# obviously set username to whatever user you have
USER='kali'
USER_HOME=/home/$USER

su -c "mkdir $USER_HOME/go" $USER
GOPATH=$USER_HOME/go

# get the working directory
BASE_DIR=$(dirname $(readlink -f $0))

# Check if versions are the latest (yes, this can be scripted, but i am lazy)
## https://github.com/nvm-sh/nvm/releases/latest
NVMVER='0.39.1'

## https://github.com/jpillora/chisel/releases/latest
CHISELVER='1.7.7'

# load functions in scope #
. $BASE_DIR/source/functions.sh

## debugging
colorecho "The username is: ${USER}"
colorecho "The users home dir is: ${USER_HOME}"
colorecho "GOPATH is: ${GOPATH}"
colorecho "The directory I am running from: ${BASE_DIR}"

###############
# environment #
###############
#   timezone  #
colorecho "Setting timezone"
timedatectl set-timezone Europe/Copenhagen

############
# software #
############
# install core #
colorecho "Installing core software and resources"
. $BASE_DIR/source/install/install.sh
install_core
install_resources

# install different categories #
# load category installation functions into scope
colorecho "Installing AD tools"
. $BASE_DIR/source/install/categories/ad.sh
install_ad_tools

#colorecho "Installing command and control tools"
#. $BASE_DIR/source/install/categories/c2.sh
#install_c2_tools

colorecho "Installing cracking tools"
. $BASE_DIR/source/install/categories/cracking.sh
install_cracking_tools

#colorecho "Installing forensics tools"
#. $BASE_DIR/source/install/categories/forensics.sh
#install_forensic_tools

colorecho "Installing misc tools"
. $BASE_DIR/source/install/categories/misc.sh
install_misc_tools

colorecho "Installing mobile pentesting tools"
. $BASE_DIR/source/install/categories/mobile.sh
install_mobile_tools

colorecho "Installing tools for network analysis"
. $BASE_DIR/source/install/categories/network.sh
install_network_tools

colorecho "Installing tools for OSINT"
. $BASE_DIR/source/install/categories/osint.sh
install_osint_tools

colorecho "Installing tools for reverse engineering"
. $BASE_DIR/source/install/categories/reversing.sh
install_reverse_tools

#colorecho "Installing tools for RFID testing"
#. $BASE_DIR/source/install/categories/rfid.sh
#install_rfid_tools

#colorecho "Installing tools for stego"
#. $BASE_DIR/source/install/categories/steganography.sh
#install_steganography_tools

colorecho "Installing tools web application pentesting"
. $BASE_DIR/source/install/categories/web.sh
install_web_tools

colorecho "Installing tools for wifi testing"
. $BASE_DIR/source/install/categories/wifi.sh
install_wifi_tools

colorecho "Installing wordlists"
. $BASE_DIR/source/install/categories/wordlists.sh
install_wordlists_tools

# Set permissions on everything we just added correctly
colorecho "Setting ownership of /home/$USER"
chown $USER:$USER -R $USER_HOME

colorecho "Setting ownership of different resources"
chown $USER:root -R /opt/tools
chown $USER:root -R /opt/resources

# Change login shell to zsh - if you use bash, comment out
colorecho "Setting default shell to zsh"
chsh --shell /usr/bin/zsh $USER

# Add user to extra groups
colorecho "Adding $USER to extra groups"
gpasswd -a $USER docker
#gpasswd -a $USER vboxsf # IF NOT USING VAGRANT (and using virtualbox)

colorecho "#####################"
colorecho "#       DONE        #"
colorecho "#    SSH IN AND     #"
colorecho "#    UPGRADE GRUB   #"
colorecho "#    REMEMBER TO    #"
colorecho "#      REBOOT       #"
colorecho "#####################"
