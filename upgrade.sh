#!/bin/bash
wget https://github.com/RickMcConney/mxd/releases/download/$1/flow.json -O flow.json 2>/dev/null
if jq empty flow.json 2>/dev/null; then
  echo "JSON is valid"
  mv flow.json .node-red/flows.json
  pm2 restart 0
else
  echo "JSON is invalid"
fi

