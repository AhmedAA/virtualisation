#!/bin/bash

# Package dedicated to network pentest tools
function install_network_tools() {
  DEBIAN_FRONTEND=noninteractive fapt wireshark # Wireshark packet sniffer
  dpkg-reconfigure wireshark-common # to add wireshark group to the system
  DEBIAN_FRONTEND=noninteractive fapt tshark    # Tshark packet sniffer
  fapt hping3                     # Discovery tool
  fapt masscan                    # Port scanner
  fapt nmap                       # Port scanner
  fapt iproute2                   # Firewall rules
  fapt tcpdump                    # Capture TCP traffic
  fapt dnsutils
  fapt ldnsutils
}
