#!/bin/bash

function virtual_box() {
  colorecho "Installing Virtualbox specific packages"
  fapt virtualbox-guest-dkms
}

function libvirt() {
  colorecho "Installing libvirt specific packages"
  fapt spice-vdagent
  fapt qemu-guest-agent
  fapt xserver-xorg-video-qxl
}

function fonts() {
  # FantasqueSansMono
  wget -P /tmp https://github.com/ryanoasis/nerd-fonts/releases/download/v2.1.0/FantasqueSansMono.zip && unzip /tmp/FantasqueSansMono.zip -d /usr/share/fonts/truetype
}

function shell() {
  # Default shell in Kali is actually quite decent now. Just enrich it with aliases and our own history
  colorecho "Installing history, aliases"
  #su -c "git clone https://github.com/ohmyzsh/ohmyzsh $USER_HOME/.oh-my-zsh" $USER
  su -c "cp -v $BASE_DIR/source/shell/zsh_history $USER_HOME/.zsh_history" $USER
  #su -c "cp -v $BASE_DIR/source/shell/zshrc $USER_HOME/.zshrc" $USER
  cp -v $BASE_DIR/source/shell/aliases /opt/.zsh_aliases
  
  # Append shit to the config ghetto style:
  su -c "echo 'export GOPATH=$HOME/go' | tee -a $USER_HOME/.zshrc" $USER
  su -c "echo 'export GO111MODULE=on' | tee -a $USER_HOME/.zshrc" $USER
  su -c "echo 'export PATH=/opt/tools/bin:$HOME/.npm/bin:$GOPATH/bin:$HOME/.cargo/bin:$PATH' | tee -a $USER_HOME/.zshrc" $USER

  su -c "echo 'source /opt/.zsh_aliases' | tee -a $USER_HOME/.zshrc" $USER
  su -c "echo 'source /usr/share/doc/fzf/examples/key-bindings.zsh' | tee -a $USER_HOME/.zshrc" $USER
  su -c "echo 'source /usr/share/doc/fzf/examples/completion.zsh' | tee -a $USER_HOME/.zshrc" $USER

  # Might need to delete below in the future
  #su -c "git -C $USER_HOME/.oh-my-zsh/custom/plugins/ clone https://github.com/zsh-users/zsh-autosuggestions" $USER
  #su -c "git -C $USER_HOME/.oh-my-zsh/custom/plugins/ clone https://github.com/zsh-users/zsh-syntax-highlighting" $USER
  #su -c "git -C $USER_HOME/.oh-my-zsh/custom/plugins/ clone https://github.com/zsh-users/zsh-completions" $USER
  #su -c "git -C $USER_HOME/.oh-my-zsh/custom/plugins/ clone https://github.com/agkozak/zsh-z" $USER

  #su -c "git clone https://github.com/denysdovhan/spaceship-prompt.git $USER_HOME/.oh-my-zsh/custom/themes/spaceship-prompt" $USER && \
  #  su -c "ln -s $USER_HOME/.oh-my-zsh/custom/themes/spaceship-prompt/spaceship.zsh-theme $USER_HOME/.oh-my-zsh/custom/themes/spaceship.zsh-theme" $USER
}

function locales() {
  colorecho "Configuring locales"
  apt-get -y install locales
  sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && locale-gen
}

function tmux() {
  colorecho "Installing tmux"
  apt -y install tmux
  cp -v $BASE_DIR/source/tmux/tmux.conf $USER_HOME/.tmux.conf
  touch $USER_HOME/.hushlogin

  colorecho "Setting up tmux plugin manager"
  su -c "mkdir -p $USER_HOME/.tmux/plugins" $USER
  su -c "git clone https://github.com/tmux-plugins/tpm $USER_HOME/.tmux/plugins/tpm" $USER
  # source tmux to install plugins so they are ready?
  # have no idea how to break it off, but command below should start it in theory
  # su -c "tmux source $USER_HOME/.tmux.conf" $USER
}

function ranger_fm() {
  colorecho "Installing ranger file manager"
  fapt ranger
  pip3 install ueberzug
  su -c "mkdir -p $USER_HOME/.config/ranger/plugins" $USER
  su -c "cp $BASE_DIR/source/ranger/rc.conf $USER_HOME/.config/ranger/rc.conf" $USER
  su -c "git clone https://github.com/alexanderjeurissen/ranger_devicons $USER_HOME/.config/ranger/plugins/ranger_devicons" $USER
}

function vscodium() {
  colorecho "Installing VSCodium"
  wget -qO - https://gitlab.com/paulcarroty/vscodium-deb-rpm-repo/raw/master/pub.gpg \
    | gpg --dearmor \
    | dd of=/usr/share/keyrings/vscodium-archive-keyring.gpg

  echo 'deb [ signed-by=/usr/share/keyrings/vscodium-archive-keyring.gpg ] https://paulcarroty.gitlab.io/vscodium-deb-rpm-repo/debs vscodium main' \
    | tee /etc/apt/sources.list.d/vscodium.list

  apt update
  fapt codium
}

function dependencies() {
  colorecho "Installing most required dependencies"
  apt-get -y install python-setuptools python3-setuptools
  pip3 install wheel
}

function grc() {
  colorecho "Installing and configuring grc"
  fapt grc
  cp -v $BASE_DIR/source/grc/grc.conf /etc/grc.conf
}

function gf_install() {
  colorecho "Installing gf"
  mkdir $USER_HOME/.gf
  su -c "GOPATH=$GOPATH go get -v github.com/tomnomnom/gf; cd $GOPATH/src/github.com/tomnomnom/gf; go install" $USER
  echo 'source $GOPATH/src/github.com/tomnomnom/gf/gf-completion.zsh' | tee -a $USER_HOME/.zshrc
  cp -rv $GOPATH/src/github.com/tomnomnom/gf/examples/* $USER_HOME/.gf
  # TODO: fix this when building : cp: cannot stat '/root/go/src/github.com/tomnomnom/gf/examples/*': No such file or directory
  $GOPATH/bin/gf -save redirect -HanrE 'url=|rt=|cgi-bin/redirect.cgi|continue=|dest=|destination=|go=|out=|redir=|redirect_uri=|redirect_url=|return=|return_path=|returnTo=|rurl=|target=|view=|from_url=|load_url=|file_url=|page_url=|file_name=|page=|folder=|folder_url=|login_url=|img_url=|return_url=|return_to=|next=|redirect=|redirect_to=|logout=|checkout=|checkout_url=|goto=|next_page=|file=|load_file='
}

function sysinternals() {
  colorecho "Downloading SysinternalsSuite"
  wget -O /opt/resources/windows/sysinternals.zip "https://download.sysinternals.com/files/SysinternalsSuite.zip"
  unzip -d /opt/resources/windows/sysinternals /opt/resources/windows/sysinternals.zip
  rm /opt/resources/windows/sysinternals.zip
}

function pspy() {
  colorecho "Downloading pspy"
  mkdir -p /opt/resources/linux/pspy
  wget -O /opt/resources/linux/pspy/pspy32 "$(curl -s https://github.com/DominicBreuker/pspy/releases/latest | grep -o '"[^"]*"' | tr -d '"' | sed 's/tag/download/')/pspy32"
  wget -O /opt/resources/linux/pspy/pspy64 "$(curl -s https://github.com/DominicBreuker/pspy/releases/latest | grep -o '"[^"]*"' | tr -d '"' | sed 's/tag/download/')/pspy64"
  wget -O /opt/resources/linux/pspy/pspy32s "$(curl -s https://github.com/DominicBreuker/pspy/releases/latest | grep -o '"[^"]*"' | tr -d '"' | sed 's/tag/download/')/pspy32s"
  wget -O /opt/resources/linux/pspy/pspy64s "$(curl -s https://github.com/DominicBreuker/pspy/releases/latest | grep -o '"[^"]*"' | tr -d '"' | sed 's/tag/download/')/pspy64s"
}

function peass() {
  colorecho "Downloading PEAS Suite"
  wget -O /opt/resources/windows/winPEASx64.exe https://github.com/carlospolop/PEASS-ng/releases/download/20220814/winPEASx64.exe
  wget -O /opt/resources/windows/winPEASx86.exe https://github.com/carlospolop/PEASS-ng/releases/download/20220814/winPEASx86.exe
  wget -O /opt/resources/linux/linpeas.sh https://github.com/carlospolop/PEASS-ng/releases/download/20220814/linpeas.sh
}

function linux_smart_enumeration() {
  colorecho "Downloading Linux Smart Enumeration"
  wget -O /opt/resources/linux/lse.sh "https://github.com/diego-treitos/linux-smart-enumeration/raw/master/lse.sh"
}

function mailsniper() {
  colorecho "Downloading MailSniper"
  git -C /opt/resources/windows/ clone https://github.com/dafthack/MailSniper
}

function powersploit() {
  colorecho "Downloading PowerSploit"
  git -C /opt/resources/windows/ clone https://github.com/PowerShellMafia/PowerSploit
}

function windows_kernel_exploits() {
  git -C /opt/resources/windows clone https://github.com/SecWiki/windows-kernel-exploits.git
}

function linux_kernel_exploits() {
  git -C /opt/resources/linux clone https://github.com/SecWiki/linux-kernel-exploits.git
}

function rubeus() {
  colorecho "Downloading Rubeus"
  wget -P /opt/resources/windows/ "https://gitlab.com/onemask/pentest-tools/-/raw/master/windows/Rubeus_3.exe"
  wget -P /opt/resources/windows/ "https://gitlab.com/onemask/pentest-tools/-/raw/master/windows/Rubeus_4.5.exe"
}

function inveigh() {
  colorecho "Downloading Inveigh"
  git -C /opt/resources/windows clone https://github.com/Kevin-Robertson/Inveigh
}

function juicypotato() {
  colorecho "Downloading JuicyPotato"
  wget -P /opt/resources/windows/ "$(curl -s https://github.com/ohpe/juicy-potato/releases/latest | grep -o '"[^"]*"' | tr -d '"' | sed 's/tag/download/')/JuicyPotato.exe"
}

function webshells() {
  colorecho "Downloading webshells"
  git -C /opt/resources/webshells/PHP/ clone https://github.com/flozz/p0wny-shell
  wget -O /opt/resources/webshells/ASPX/webshell.aspx "https://raw.githubusercontent.com/xl7dev/WebShell/master/Aspx/ASPX%20Shell.aspx"
}

function nc() {
  colorecho "Downloading nc for Windows"
  cp -v /usr/bin/nc.traditional /opt/resources/linux/nc
  wget -P /tmp https://eternallybored.org/misc/netcat/netcat-win32-1.12.zip && unzip /tmp/netcat-win32-1.12.zip -d /opt/resources/windows/nc
}

function socat() {
  wget -P /opt/resources/linux https://github.com/andrew-d/static-binaries/raw/master/binaries/linux/x86_64/socat
}

function http-put-server() {
  colorecho "Downloading http-put-server for Python3"
  wget -O /opt/resources/linux/http-put-server.py https://gist.githubusercontent.com/mildred/67d22d7289ae8f16cae7/raw/214c213c9415da18a471d1ed04660022cce059ef/server.py
}

function spoolsample() {
  colorecho "Downloading SpoolSample"
  wget -P /opt/resources/windows/ "https://gitlab.com/onemask/pentest-tools/-/raw/master/windows/SpoolSample.exe"
  wget -P /opt/resources/windows/ "https://gitlab.com/onemask/pentest-tools/-/raw/master/windows/SpoolSample_v4.5_x64..exe"
}

function diaghub() {
  colorecho "Downloading DiagHub"
  wget -P /opt/resources/windows/ "https://gitlab.com/onemask/pentest-tools/-/raw/master/windows/diaghub.exe"
}

function lazagne() {
  colorecho "Downloading LaZagne"
  git -C /tmp/ clone https://github.com/AlessandroZ/LaZagne
  mv /tmp/LaZagne/Linux /opt/resources/linux/LaZagne
  mv /tmp/LaZagne/Mac /opt/resources/mac/LaZagne
  mv /tmp/LaZagne/Windows /opt/resources/windows/LaZagne
  wget -P /opt/resources/windows/LaZagne/ "$(curl -s https://github.com/AlessandroZ/LaZagne/releases/latest | grep -o '"[^"]*"' | tr -d '"' | sed 's/tag/download/')/lazagne.exe"
  rm -r /tmp/LaZagne
}

function sublinacl() {
  colorecho "Downloading Sublinacl"
  wget -P /opt/resources/windows/ "https://gitlab.com/onemask/pentest-tools/-/raw/master/windows/sublinacl.exe"
}

#function mimipy() {
#  colorecho "Downloading mimipy"
#  git -C /opt/resources/linux/ clone https://github.com/n1nj4sec/mimipy
#}

function deepce() {
  colorecho "Downloading deepce"
  wget -O /opt/resources/linux/deepce "https://github.com/stealthcopter/deepce/raw/master/deepce.sh"
}

function arsenal() {
  echo "Installing Arsenal"
  python3 -m pip install arsenal-cli
  #git -C /opt/tools/ clone https://github.com/Orange-Cyberdefense/arsenal
  #pip3 install -r /opt/tools/arsenal/requirements.txt
}

function bitleaker() {
  colorecho "Downloading bitleaker for BitLocker TPM attacks"
  git -C "/opt/resources/encrypted disks/" clone https://github.com/kkamagui/bitleaker
}

function napper() {
  colorecho "Download napper for TPM vuln scanning"
  git -C "/opt/resources/encrypted disks/" clone https://github.com/kkamagui/napper-for-tpm
}

function icmpdoor() {
  colorecho "Installing icmptools"
  git -C /opt/tools/ clone https://github.com/krabelize/icmpdoor
  mkdir -p /opt/resources/windows/icmptools/
  cp -v /opt/tools/icmpdoor/binaries/x86_64-linux/* /opt/resources/windows/icmptools/
  mkdir -p /opt/resources/linux/icmptools/
  cp -v /opt/tools/icmpdoor/binaries/x86_64-linux/* /opt/resources/linux/icmptools/
}

function node_version_manager() {
  colorecho "Installing node (through node version manager)"
  su -c "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v$NVMVER/install.sh | bash" $USER
  su -c ". ${USER_HOME}/.nvm/nvm.sh; nvm install stable" $USER

  # Append relevant lines to the shell config
  su -c "echo 'export NVM_DIR=\"$HOME/.nvm\"' | tee -a $USER_HOME/.zshrc" $USER
  # This loads nvm
  su -c "echo '[ -s \"$NVM_DIR/nvm.sh\" ] && \. \"$NVM_DIR/nvm.sh\"' | tee -a $USER_HOME/.zshrc" $USER
  # This loads nvm bash_completion
  su -c "echo '[ -s \"$NVM_DIR/bash_completion\" ] && \. \"$NVM_DIR/bash_completion\"' | tee -a $USER_HOME/.zshrc" $USER
}

function rust_up() {
  colorecho "Installing rustup"
  su -c "curl https://sh.rustup.rs -sSf | sh -s -- -y" $USER

  fapt libssl-dev

  colorecho "Installing topgrade"
  su -c "${USER_HOME}/.cargo/bin/cargo install topgrade cargo-update" $USER
}

function glow() {
  # fancy markdown reader
  colorecho "Installing Glow markdown reader"
  su -c "GOPATH=$GOPATH go get -v github.com/charmbracelet/glow; cd $GOPATH/src/github.com/charmbracelet/glow; go install" $USER
}

function install_core() {
  update || exit
  filesystem
  fonts
  shell
  locales
  tmux
  fapt atool
  fapt automake
  fapt autoconf
  fapt autojump
  fapt bat
  fapt cmake
  fapt docker-compose
  fapt docker.io
  fapt dos2unix
  fapt exa
  fapt flameshot
  fapt fzf
  fapt ghostscript
  fapt golang
  fapt hexyl
  fapt httpie
  fapt libemail-outlook-message-perl # used for msgconvert
  fapt libemail-sender-perl # used for msgconvert
  DEBIAN_FRONTEND=noninteractive fapt macchanger
  fapt p7zip-full
  fapt python3-pip
  fapt python3-venv
  fapt ripgrep
  fapt rlwrap
  fapt unrar
  fapt wkhtmltopdf
  fapt code-oss # vscodium from kali repos
  dependencies
  # virtual_box
  # libvirt
  #vscodium
  ranger_fm
  glow
  node_version_manager
  rust_up
  #gf_install                      # wrapper around grep
}

# Package dedicated to the download of resources
function install_resources() {
  sysinternals
  arsenal
  pspy
  peass
  linux_smart_enumeration
  powersploit
  windows_kernel_exploits
  linux_kernel_exploits
  rubeus
  inveigh
  juicypotato
  nc
  socat
  spoolsample
  diaghub
  lazagne
  sublinacl
  #mimipenguin
  #mimipy
  deepce
  webshells
  mailsniper
  bitleaker
  napper
  http-put-server
  icmpdoor
}
