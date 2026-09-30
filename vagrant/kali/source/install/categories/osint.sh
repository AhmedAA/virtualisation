#!/bin/bash

function waybackurls() {
  colorecho "Installing waybackurls"
  su -c "GOPATH=$GOPATH go install github.com/tomnomnom/waybackurls@latest" $USER
}

function holehe() {
  colorecho "Installing holehe"
  pip3 install holehe
}

function maigret_pip() {
  colorecho "Installing maigret"
  git clone https://github.com/soxoj/maigret
  cd /opt/tools/maigret
  python3 -m pip install -r requirements.txt
}

function twint() {
  # https://github.com/twintproject/twint
  pip3 install twint
}

function ghunt() {
  git -C /opt/tools clone https://github.com/mxrch/GHunt
}

function depix() {
  git -C /opt/tools clone https://github.com/beurtschipper/Depix.git
}

function depixhmm() {
  git -C /opt/tools clone https://github.com/JonasSchatz/DepixHMM.git
}

function osint-search-tools() {
  git -C /opt/tools clone https://github.com/HOPain/OSINT-Search-Tools
}

function iky() {
  git -C /opt/tools clone https://github.com/kennbroorg/iKy
  # run it with docker:
  # docker-compose up --build
}

function profil3r() {
  git -C /opt/tools clone https://github.com/MrNonoss/Profil3r-docker
  pip3 install PyInquirer jinja2 bs4
  cd /opt/tools/Profil3r-docker
  python3 setup.py install
}

function osintgram() {
  git -C /opt/tools clone https://github.com/Datalux/Osintgram
}

function gowitness() {
  su -c 'GOPATH=$GOPATH go install github.com/sensepost/gowitness@latest' $USER
}

# https://github.com/Primus27/Credentials-Scanner
# Package dedicated to osint, recon and passive tools
function install_osint_tools() {
  fapt dnsenum                    # Subdomain bruteforcer
  fapt dnsrecon                   # Subdomain bruteforcer
  fapt recon-ng                   # External recon tool
  fapt whois                      # See information about a specific domain name or IP address
  waybackurls                     # Website history
  fapt sherlock                   # Hunt down social media accounts by username across social networks
  holehe                          # Check if the mail is used on different sites
  fapt theharvester               # Gather emails, subdomains, hosts, employee names, open ports and banners
  maigret                         # Search pseudos and information about users on many platforms
  twint                           # twitter osint tools
  ghunt                           # google account osint
  depix                           # attempt to break image blurring to get cleartext
  osint-search-tools
  iky
  profil3r
  osintgram
}
