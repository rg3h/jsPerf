// @fileoverview jsPerf nodeSimpleTimerExample.js

import {prettyNum}          from '../../../../math/math.js';
import {isNode, prettyDate} from '../../../../util/util.js';
import {getName,
        getVersion,
        getTime,
        startTime}          from '../../../../jsPerf/jsPerf.js';

function main() {
  console.log('nodeSimpleTimerExample.js',
              getName(), 'v' + getVersion(), prettyDate(new Date()));

  if (!isNode()) {
    console.log('error: not running node\n' +
                'usage: node nodeSimpleTimerExample.js');
    process.exit();
  }

  const count = 1_000_000_000;
  let start = startTime();
  // eslint-disable-next-line no-unused-vars
  for (let i = 0, sum = 0; i < count; ++i) { sum += i; }
  let results = getTime(start);

  console.log('time to run for loop', prettyNum(count), 'times:',
              prettyNum(results, 3), 'seconds');
}

main();
