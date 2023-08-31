#!/bin/bash
ifaces=$(ip addr | grep UP | cut -d" " -f2 | tr -d \:)
for INTERFACE in $ifaces;
  do
      if [[ $INTERFACE = wlx* ]]
      then
         sudo nmcli d disconnect $INTERFACE
         sudo nmcli con delete wifi6
         sudo nmcli d wifi connect $1 password $2 ifname $INTERFACE name wifi6
         sudo nmcli device set $INTERFACE autoconnect yes
         nmcli -f IP4.ADDRESS dev show $INTERFACE
      fi
  done;

