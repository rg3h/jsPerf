//@fileoverview: nodeContinuousMemoryExample.js show memory usage continuously
// node --expose-gc ./nodeContinuousMemoryExample.js

import {prettyNum}         from '../../../../math/math.js';
import {prettyDate, sleep} from '../../../../util/util.js';
import {getName,
        getVersion,
        getMemory}         from '../../../../jsPerf/jsPerf.js';

async function main() {
  console.log('nodeContinuousMemoryExample.js',
              getName(), 'v' + getVersion(), prettyDate(new Date()));

  if (!global.gc) {
    console.warn('warning: call node --export-gc',
                 'so that jsPerf can call the garbage collector');
  }

  console.log('Press control-C or command-C to stop the program.');

  while(true) {
    console.log('heap used:', prettyNum(await getMemory()).padStart(11, ' '));
    await sleep(1);  // sleep for 1 second

    /*
    let a = new Array(1e7);
    console.log('memory after allocating a 10 million item array:......',
    prettyNum(await getMemory()).padStart(11, ' '));
    a = null; // delete the array
    */
  }
}

main();
