# @fileoverview runJsPerfWidgetExample.sh
clear
bg node ../../../../tools/server/simpleServer.js --webroot "../"
chrome --js-flags="--expose-gc" --enable-precise-memory-info "https://localhost:8000/src/modules/jsPerfWidget/examples/jsPerfWidgetExample.html"
