#!/bin/bash

# function john() {
#   colorecho "Installing john the ripper"
#   fapt qtbase5-dev
#   git -C /opt/tools/ clone https://github.com/openwall/john
#   cd /opt/tools/john/src
#   ./configure --disable-openmp
#   make -s clean && make -sj4
#   mv ../run/john ../run/john-non-omp
#   ./configure CPPFLAGS='-DOMP_FALLBACK -DOMP_FALLBACK_BINARY="\"john-non-omp\""'
#   make -s clean && make -sj4
#   sudo make shell-completion
# }

# Package dedicated to offline cracking/bruteforcing tools
function install_cracking_tools() {
  # both are installed by default in the base image
  fapt hashcat                    # Password cracker
  fapt john                       # Password cracker
  #fapt fcrackzip                  # Zip cracker
  #fapt bruteforce-luks            # Find the password of a LUKS encrypted volume
}
