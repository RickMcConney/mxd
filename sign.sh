#!/bin/bash
unclutter -idle 1 &
google-chrome  http://10.198.0.132 --window-size="2000,3000" --window-position="0,0" --user-data-dir=/home/mxd/m1 --pasword-store=basic --disable-session-crashed-bubble --kiosk &

