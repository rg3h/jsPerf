# @fileoverview runNodeContinuousMemoryExample.sh
# --expose-gc allows jsPerf to call the garbage collector explicitly
node --expose-gc ./nodeContinuousMemoryExample.js
