:: @fileoverview runServer.bat runs a local server and chrome with flags
@echo off
clear
setlocal
start node ./server/simpleServer.js --webroot "../../"
endlocal
