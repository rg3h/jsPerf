//@fileoverview: webSimpleMemoryExample.js get memory usage

import {prettyNum}  from '../../../../math/math.js';
import {prettyDate} from '../../../../util/util.js';
import {getName,
        getVersion,
        getMemory}  from '../../../../jsPerf/jsPerf.js';

async function main() {
  let headerMsg = '<b>webSimpleMemoryExample.js ' + getName() +
      ' v' + getVersion() + ' ' + prettyDate(new Date) + '</b><br>';

  // see the initial heap memory
  let msg = 'baseline heap used:................................... ' +
      prettyNum(await getMemory()).padStart(11, ' ') + '<br>';

  let a = new Array(1e7);
  msg += 'memory after allocating a 10 million item array:...... ' +
    prettyNum(await getMemory()).padStart(11, ' ') + '<br>';

  a = null; // delete the array
  msg += 'memory after de-allocating a 10 million item array:... ' +
    prettyNum(await getMemory()).padStart(11, ' ');

  document.getElementsByClassName('resultsBox')[0].innerHTML = headerMsg + msg;
}

main();
