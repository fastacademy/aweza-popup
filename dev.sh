#!/usr/bin/env bash

# Start processes
node_modules/.bin/parcel watch --no-hmr src/index.jsx --out-file aweza-popup.js & jspid=$!
node_modules/.bin/csso src/style.css --watch --output dist/aweza-popup.css & csspid=$!
php -S localhost:8882 & servpid=$!
PID_LIST+="$jspid $csspid $servpid";

# Kill these processess on ctrl+c
trap "kill $PID_LIST" SIGINT
echo; echo "Open http://localhost:8882/example.html to develop"; echo

# Exit this script when the processes exit
wait $PID_LIST