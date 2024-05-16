// @fileoverview jsPerf nodeContinuousTimerExample.js

import {prettyNum}          from '../../../../math/math.js';
import {isNode, prettyDate} from '../../../../util/util.js';
import {getName,
        getVersion,
        getTime,
        startTime}         from '../../../../jsPerf/jsPerf.js';

function main() {
  console.log('nodeContinuousTimerExample.js',
              getName(), 'v' + getVersion(), prettyDate(new Date()));

  if (!isNode()) {
    console.error('error: not running node\n' +
                  'usage: node nodeContinuousTimerExample.js');
    process.exit();
  }

  console.log('Press control-C or command-C to stop the program.');

  const count = 1_000_000_000;
  while(true) {
    let start = startTime();
    // eslint-disable-next-line no-unused-vars
    for (let i = 0, sum = 0; i < count; ++i) { sum += i; }
    let results = getTime(start);

    console.log('time to run for loop', prettyNum(count), 'times:',
                prettyNum(results, 3), 'seconds');
  }
}

main();
