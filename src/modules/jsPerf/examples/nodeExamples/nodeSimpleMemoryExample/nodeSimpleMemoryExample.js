//@fileoverview: nodeSimpleMemoryExample.js show memory usage
// node --expose-gc ./nodeSimpleMemoryExample.js

import {prettyNum}                 from '../../../../math/math.js';
import {isNode, prettyDate}        from '../../../../util/util.js';
import {getName,
        getVersion,
        getMemory}                 from '../../../../jsPerf/jsPerf.js';

async function main() {
  console.log('nodeSimpleMemoryExample.js',
              getName(), 'v' + getVersion(), prettyDate(new Date()));

  if (!isNode()) {
    console.error('error: not running node\n',
                  'usage: node --export-gc nodeMemoryExample.js');
    process.exit();
  }

  if (!global.gc) {
    console.warn('warning: call node --export-gc',
                 'so that jsPerf can call the garbage collector');
  }

  // see the initial heap memory
  console.log('baseline heap used:...................................',
              prettyNum(await getMemory()).padStart(11, ' '));

  let a = new Array(1e7);
  console.log('memory after allocating a 10 million item array:......',
              prettyNum(await getMemory()).padStart(11, ' '));

  a = null; // delete the array
  console.log('memory after de-allocating a 10 million item array:...',
              prettyNum(await getMemory()).padStart(11, ' '));
}

main();
