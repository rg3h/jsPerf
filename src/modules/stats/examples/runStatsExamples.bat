:: @fileoverview runStatsExamples.bat
@echo off
clear
setlocal
start node ../../../../tools/server/simpleServer.js --webroot "../../"
start chrome "https://localhost:8000/src/modules/stats/examples/statsExample.html"
endlocal
