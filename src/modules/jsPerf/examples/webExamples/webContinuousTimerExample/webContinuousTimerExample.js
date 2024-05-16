// @fileoverview jsPerf webContinuousTimerExample.js

import {prettyNum}         from '../../../../math/math.js';
import {prettyDate, sleep} from '../../../../util/util.js';
import {getName,
        getVersion,
        getTime,
        startTime}         from '../../../../jsPerf/jsPerf.js';

async function main() {
  let headerMsg = '<b>webContinuousTimerExample.js ' +
      getName() + ' v' + getVersion() + ' ' + prettyDate(new Date) + '</b><br>';

  const count = 1_000_000_000;
  while(true) {
    let start = startTime();
    // eslint-disable-next-line no-unused-vars
    for (let i = 0, sum = 0; i < count; ++i) { sum += i; }
    let results = getTime(start);


    document.getElementsByClassName('resultsBox')[0].innerHTML =
      headerMsg +
      'time to run for loop ' + prettyNum(count) + ' times: ' +
      '<span style="color:green;font-weight:bold;">' +
      prettyNum(results, 3) + '</span> seconds<br>';

    await sleep(0.5);
  }
}

main();
