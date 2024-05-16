
// @fileoverview jsPerf.js

export {
  getName,        // name of this module
  getVersion,     // get this module's version
  supportsMemory, // returns true if performance memory supported
  gcIsAvailable,  // returns true if this code can call the garbage collector
  startTime,      // start and return the performance start time
  getTime,        // get the time since startTime or absolute performance time
  getMemory,      // async getMemory() returns amount of memory used
}

/*export*/ function getName() {
  return 'jsPerf';
}

/*export*/ function getVersion() {
  return '1.1.0';
}

/*export*/ function supportsMemory() {
  let status = false;

  if (typeof performance !== 'undefined') {
    if (typeof performance.measureUserAgentSpecificMemory !== 'undefined' ||
        typeof performance.memory !== 'undefined') {
      status = true;
    }
  }

  if (status === false && typeof process !== 'undefined') {
    if (typeof proc.memoryUsage !== 'undefined') {
      status = true;
    }
  }

  return status;
}

/*export*/ function gcIsAvailable() {
  return
  (typeof global !== 'undefined' && typeof global.gc !== 'undefined') ||
    (typeof window !== 'undefined' && typeof window.gc !== 'undefined');
}

/*export*/ async function getMemory(callGcFlag=true) {
  if (callGcFlag) {
    if (typeof global !== 'undefined' && typeof global.gc !== 'undefined') {
      global.gc();
    } else if (typeof window!=='undefined' && typeof window.gc!=='undefined') {
      window.gc();
    }
  }

  let size = -1;
  let perf = typeof performance === 'undefined' ? null : performance;
  let proc = typeof process === 'undefined' ? null : process;

  if (typeof performance !== 'undefined') {
    if (typeof performance.measureUserAgentSpecificMemory !== 'undefined') {
      let results = await performance.measureUserAgentSpecificMemory();
      size = results.bytes;
    } else if (typeof performance.memory !== 'undefined') {
      size = perf.memory.usedJSHeapSize;
    }
  }

  if (size === -1 && typeof process !== 'undefined') {
    size = process.memoryUsage().heapUsed;
  }

  size < 0 ? size = 0 : null;

  return size;
}


/*export*/ function startTime() {
  return performance.now();
}

// get the time since start or absolute performance time if start not provided
/*export*/ function getTime(start) {
  const end = performance.now();
  return typeof start === 'undefined' ? end : (end - start)/1000;
}
