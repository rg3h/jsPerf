:: @fileoverview runJsPerfWebExamples.bat runs a server and chrome w/ flags
@echo off
clear
setlocal
start node ../server/simpleServer.js --webroot "../../"
start chrome --js-flags="--expose-gc" --enable-precise-memory-info "https://localhost:8000/src/modules/jsPerfWidget/examples/jsPerfWidgetExample.html"
endlocal
