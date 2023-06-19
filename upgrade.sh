#!/bin/bash
wget https://github.com/RickMcConney/mxd/archive/refs/tags/$1.zip -O update.zip 2>/dev/null
unzip -joq update.zip 
chmod 777 *.sh
if jq empty flow.json 2>/dev/null; then
  echo "JSON is valid"
  mv flow.json .node-red/flows.json
  pm2 restart 0
else
  echo "JSON is invalid"
fi

