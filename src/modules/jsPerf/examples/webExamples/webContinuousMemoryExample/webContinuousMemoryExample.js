//@fileoverview: webContinuousMemoryExample.js gets memory usage continuously
import {prettyNum}         from '../../../../math/math.js';
import {prettyDate, sleep} from '../../../../util/util.js';
import {getName,
        getVersion,
        getMemory}         from '../../../../jsPerf/jsPerf.js';

async function main() {
  let a = new Array(1e7);
  let oList = [];
  while(true) {
    let headerMsg = '<b>webContinuousMemoryExample.js ' + getName() +
        ' v' + getVersion() + prettyDate(new Date(), true) + '</b><br>';

    oList.push(new Object());

    let msg = 'heap used: ' + prettyNum(await getMemory()).padStart(11, ' ');
    document.getElementsByClassName('resultsBox')[0].innerHTML = headerMsg+msg;
    await sleep(1);
  }
}

main();
