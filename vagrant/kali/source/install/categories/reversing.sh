#!/bin/bash

function pwntools() {
  colorecho "Installing pwntools"
  python3 -m pip install pwntools
}

function pwndbg() {
  colorecho "Installing pwndbg"
  git -C /opt/tools/ clone https://github.com/pwndbg/pwndbg
  cd /opt/tools/pwndbg
  ./setup.sh
  echo 'source /opt/tools/pwndbg/gdbinit.py' >> $USER_HOME/.gdbinit
  echo 'set disassembly-flavor intel' >> $USER_HOME/.gdbinit
}

function checksec_py() {
  colorecho "Installing checksec.py"
  pip3 install checksec.py
}

function uncompyle() {
  pip3 install uncompyle6
}

# Package dedicated to reverse engineering tools
function install_reverse_tools() {
  pwntools                        # CTF framework and exploit development library
  pwndbg                          # Advanced Gnu Debugger
  checksec_py                     # Check security on binaries
  uncompyle
  fapt ghidra
  fapt nasm                       # Netwide Assembler
  fapt radare2                    # Awesome debugger
}
