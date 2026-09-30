#!/bin/bash

# function seclists() {
#   colorecho "Fetching seclists"
#   git -C /opt/resources clone https://github.com/danielmiessler/SecLists.git

#   colorecho "Decompressing rockyou.txt"
#   tar xf /opt/resources/SecLists/Passwords/Leaked-Databases/rockyou.txt.tar.gz --directory /opt/resources/SecLists/Passwords/Leaked-Databases
# }

function bopscrk() {
  git -C /opt/tools clone https://github.com/r3nt0n/bopscrk.git

  cd /opt/tools/bopscrk
  pip3 install -r requirements.txt
}

function elpscrk() {
  git -C /opt/tools clone https://github.com/D4Vinci/elpscrk

  cd /opt/tools/elpscrk
  pip3 install -r requirements.txt
}

# https://github.com/berzerk0/Probable-Wordlists/tree/master/Real-Passwords
# Package dedicated to the installation of wordlists and tools like wl generators
function install_wordlists_tools() {
  fapt wordlists                  # Others wordlists (not the best)
  fapt cewl                       # Wordlist generator
  fapt seclists                   # Awesome wordlists
  bopscrk                         # Wordlist generator
  elpscrk                         # Wordlist generator
}
