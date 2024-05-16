// @fileoverview jsPerf webSimpleTimerExample.js

import {prettyNum}  from '../../../../math/math.js';
import {prettyDate} from '../../../../util/util.js';
import {getName,
        getVersion,
        getTime,
        startTime} from '../../../../jsPerf/jsPerf.js';

function main() {
  const count = 1_000_000_000;

  let start = startTime();
  // eslint-disable-next-line no-unused-vars
  for (let i = 0, sum = 0; i < count; ++i) { sum += i; }
  let results = getTime(start);

  let msg = '<b>' + getName() + ' v' + getVersion() +
      ' ' + prettyDate(new Date) + '</b><br>' +
      'time to run for loop ' + prettyNum(count) +
      ' times: ' + prettyNum(results, 3) + ' seconds';

  document.getElementsByClassName('resultsBox')[0].innerHTML = msg;
}

main();
