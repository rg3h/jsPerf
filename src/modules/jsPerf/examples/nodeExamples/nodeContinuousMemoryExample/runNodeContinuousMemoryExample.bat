:: @fileoverview runNodeContinuousMemoryExample.bat
:: --expose-gc allows jsPerf to call the garbage collector explicitly
@echo off
setlocal
node --expose-gc ./nodeContinuousMemoryExample.js
endlocal
