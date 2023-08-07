#!/bin/bash

fileoperstate=/sys/class/net/enp1s0/operstate
oldoperstate="" 
operstate=""

while sleep 2; do
    operstate=$(cat "$fileoperstate")
    if [ "$oldoperstate" = "$operstate" ]; then
        continue
    fi
    oldoperstate="$operstate"
    echo "$operstate"
    if [ "$operstate" = "up" ]; then
        ip route add default via 10.198.0.1 dev enp1s0 metric 10
    fi
    if [ "$operstate" = "down" ]; then
        ip route del default dev enp1s0 
    fi
done

