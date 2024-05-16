:: @fileoverview runNodeSimpleMemoryExample.bat
:: --expose-gc allows jsPerf to call the garbage collector explicitly
@echo off
setlocal
node --expose-gc ./nodeSimpleMemoryExample.js
endlocal
