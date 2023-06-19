#!/bin/bash
MAC=$(cat /sys/class/net/enp1s0/address | tr -d :)
IPERF=$(ps -ef | grep iperf | grep -v grep)
LEN=${#IPERF}
if [ ${LEN} == 0 ]
then
  echo -e "{\"mac\":\"${MAC}\",\"iperf\":\"stopped\",\"ifname\":\"${IFNAME}\"}"
else
   IFNAME=$(echo ${IPERF} | awk '{ print $15 }')
   echo -e "{\"mac\":\"${MAC}\",\"iperf\":\"running\",\"ifname\":\"${IFNAME}\"}"
fi

