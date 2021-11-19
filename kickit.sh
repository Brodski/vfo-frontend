#!/bin/bash
# sudo nohup npm run deploy &
# using thebars oauth screen

# Prod
$ sudo npm run build
$ sudo nohup npm run deploy &

# Dev
$ npm run start
wait 1 minute or so, then go to localhost:8080