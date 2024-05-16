:: @fileoverview runLinePlotExamples.bat
@echo off
clear
setlocal
start node ../../../../tools/server/simpleServer.js --webroot "../../"
start chrome "https://localhost:8000/src/modules/linePlot/examples/linePlotExample.html"
endlocal
