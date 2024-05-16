:: @fileoverview runTimeYourCode.bat runs a server & chrome with flags
@echo off
clear
setlocal
start node ../../../../../../tools/server/simpleServer.js --webroot "../../"
start chrome --js-flags="--expose-gc" --enable-precise-memory-info "https://localhost:8000/src/modules/jsPerf/examples/webExamples/timeYourCode/timeYourCode.html"
endlocal
