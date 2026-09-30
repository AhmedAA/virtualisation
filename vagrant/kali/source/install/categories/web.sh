#!/bin/bash

function SSRFmap() {
  colorecho "Installing SSRFmap"
  git -C /opt/tools/ clone https://github.com/swisskyrepo/SSRFmap
}

function gopherus() {
  colorecho "Installing gopherus"
  git -C /opt/tools/ clone https://github.com/tarunkant/Gopherus
}

function NoSQLMap() {
  colorecho "Installing NoSQLMap"
  git -C /opt/tools clone https://github.com/codingo/NoSQLMap.git
}

function XSStrike() {
  colorecho "Installing XSStrike"
  git -C /opt/tools/ clone https://github.com/s0md3v/XSStrike.git
}

function Bolt() {
  colorecho "Installing Bolt"
  git -C /opt/tools/ clone https://github.com/s0md3v/Bolt.git
}

function droopescan() {
  colorecho "Installing droopescan"
  git -C /opt/tools clone https://github.com/droope/droopescan.git
}

function magescan() {
  colorecho "Installing magescan"
  wget -P /opt/tools https://github.com/steverobbins/magescan/releases/download/v1.12.9/magescan.phar
}

function OneForAll() {
  colorecho "Installing OneForAll"
  git -C /opt/tools/ clone https://github.com/shmilylty/OneForAll.git
}

function jwt_tool() {
  colorecho "Installing JWT tool"
  git -C /opt/tools/ clone https://github.com/ticarpi/jwt_tool
  pip3 install pycryptodomex
  pip3 install termcolor
  pip3 install cprint
  pip3 install requests
  pip3 install pyjwt
}

function jwt_cracker() {
  colorecho "Installing JWT cracker"
  su -c ". ${USER_HOME}/.nvm/nvm.sh; npm install -g jwt-cracker" $USER
}

function gittools() {
  colorecho "Installing GitTools"
  git -C /opt/tools/ clone https://github.com/internetwache/GitTools.git
}

function git-dumper() {
  colorecho "Installing git-dumper"
  git -C /opt/tools/ clone https://github.com/arthaud/git-dumper
}

function ysoserial() {
  colorecho "Installing ysoserial"
  mkdir /opt/tools/ysoserial/
  wget -O /opt/tools/ysoserial/ysoserial.jar "https://jitpack.io/com/github/frohoff/ysoserial/master-SNAPSHOT/ysoserial-master-SNAPSHOT.jar"
}

function remote-method-guesser() {
  colorecho "Installing rmg (remote-method-guesser)"
  git -C /opt/tools/ clone https://github.com/qtc-de/remote-method-guesser
}

function ysoserial_net() {
  colorecho "Downloading ysoserial"
  url=$(curl -s https://github.com/pwntester/ysoserial.net/releases/latest | grep -o '"[^"]*"' | tr -d '"' | sed 's/tag/download/')
  tag=${url##*/}
  prefix=${tag:1}
  mkdir /opt/resources/windows/ysoserial.net
  wget -O /opt/resources/windows/ysoserial.net/ysoserial.zip "$url/ysoserial-$prefix.zip"
  unzip -d /opt/resources/windows/ysoserial.net /opt/tools/ysoserial.net/ysoserial.zip
  rm /opt/resources/windows/ysoserial.net/ysoserial.zip
}

function dorkscout() {
  colorecho "Installing dorkscout"
  su -c "GOPATH=$GOPATH go get -v github.com/R4yGM/dorkscout; cd $GOPATH/src/github.com/R4yGM/dorkscout; go install" $USER
}

function gowitness() {
  su -c "GOTPATH=$GOPATH go install github.com/sensepost/gowitness@latest" $USER
}

# Package dedicated to applicative and active web pentest tools
function install_web_tools() {
  fapt gobuster                   # Web fuzzer (pretty good for several extensions)
  fapt feroxbuster                # Web fuzzer
  #fapt amass                      # Web fuzzer
  #fapt ffuf                       # Web fuzzer (little favorites)
  #fapt dirb                       # Web fuzzer
  #fapt dirbuster                  # Web fuzzer
  fapt wfuzz                      # Web fuzzer (second favorites)
  fapt nikto                      # Web scanner
  fapt sqlmap                     # SQL injection scanner
  SSRFmap                         # SSRF scanner
  gopherus                        # SSRF helper
  NoSQLMap                        # NoSQL scanner
  XSStrike                        # XSS scanner
  #fapt xsser                      # XSS scanner
  Bolt                            # CSRF scanner
  #fapt dotdotpwn                  # LFI scanner
  #fapt patator                    # Login scanner
  #fapt joomscan                   # Joomla scanner
  fapt wpscan                     # Wordpress scanner
  #droopescan                      # Drupal scanner
  #magescan                        # Magento scanner
  #fapt testssl.sh                 # SSL/TLS scanner
  fapt sslscan                    # SSL/TLS scanner
  #fapt weevely                    # Awesome secure and light PHP webshell
  gowitness
  OneForAll                       # TODO: comment this
  fapt wafw00f                    # Waf detector
  jwt_tool                        # Toolkit for validating, forging, scanning and tampering JWTs
  jwt_cracker                     # JWT cracker and bruteforcer
  git-dumper                      # Dump a git repository from a website
  gittools                        # Dump a git repository from a website
  #fapt padbuster
  remote-method-guesser           # Java RMI enum and exploitation
  ysoserial                       # Deserialization payloads
  ysoserial_net                   # Deserialization payloads
  dorkscout
  fapt whatweb                    # Recognises web technologies including content management
}
