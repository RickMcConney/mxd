#!/bin/bash
echo "bostrend" > /tmp/bostrend.txt
sudo usb_modeswitch -KQ -v 0bda -p 1a2b
sudo modprobe 8852bu

