#!/bin/bash
ifaces=$(ip addr | grep UP | cut -d" " -f2 | tr -d \:)
echo -e "{" 
for INTERFACE in $ifaces;
  do
      MAC=$(cat /sys/class/net/${INTERFACE}/address | tr -d :)
      IP=$(ip -f inet addr show ${INTERFACE} | awk '/inet / {print $2}')
      RX=$(cat /sys/class/net/${INTERFACE}/statistics/rx_bytes)
      TX=$(cat /sys/class/net/${INTERFACE}/statistics/tx_bytes)
      echo -e "\"$INTERFACE\":{\"rx\": $RX,\"tx\": $TX,\"ip\":\"${IP}\",\"mac\":\"${MAC}\"},"
  done;
echo -e "\"end\":{}}"

