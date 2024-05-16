:: @fileoverview eslint.bat runs npm eslint
:: usage: eslint.bat modules/jsPerf/jsPerf.js
@echo off
setlocal
cd ../src
npx eslint %*
endlocal
