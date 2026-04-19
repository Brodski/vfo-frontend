#!/bin/bash
# sudo nohup npm run deploy &
# using thebars oauth screen

# Prod

$ sudo npm run build
###   OR   ###
# sudo env GENERATE_SOURCEMAP=false NODE_OPTIONS="--max-old-space-size=4096" npm run build
$ sudo nohup npm run deploy &
$ sudo nohup npm run deploy > /dev/null 2>&1 & 

# Dev
$ npm run start
wait 1 minute or so, then go to localhost:8080
