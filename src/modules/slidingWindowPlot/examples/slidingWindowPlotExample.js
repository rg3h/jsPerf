// @fileoverview slidingWindowPlotExample.js -- demos slidingWindowPlot.js

import {sleep}                from '../../util/util.js';
import {rnd}                  from '../../math/math.js';
import {createDiv, getRgbStr} from '../../html/html.js';
import {SlidingWindowPlot}    from '../../slidingWindowPlot/slidingWindowPlot.js';

window.addEventListener('load', main);

// main entry point for the app
async function main() {
  let parent = createDiv(document.body, 'middle');
  createTitle(parent);

  let container = createDiv(parent, 'gridContainer');
  /*await*/ createPlot01(container);
  /*await*/ createPlot02(container);
  /*await*/ createPlot03(container);
  /*await*/ createPlot04(container);
  /*await*/ createPlot05(container);
}

function createTitle(parent) {
  let container = createDiv(parent, 'top');
  let middle = createDiv(container, 'topMiddle');
  createDiv(middle, 'title', 'slidingWindowPlot.js Example');
  createDiv(middle, 'version', 'version ' + SlidingWindowPlot.getVersion());

  return container;
}

async function createPlot01(parent) {
  let container = createDiv(parent, 'plotContainer');

  let plot2 = new SlidingWindowPlot({
    parent: container,
    className: 'plot01',
    dataList: [0, 10, 300, 80, 10, 200, 100],  // avg 100
    dataWindowSize: 20,
    dataWindowSize: 10,
    plotOffset: 0,
    barMaxWidth: 20,
    barGap: 5,
    colorList: ['red', 'orange', 'gold', 'green', 'blue', 'magenta', 'purple'],
    showStatsFlag: false,
  });

  createDiv(container, 'plotMsg', 'Example 1: static plot');

  return container;
}


async function createPlot02(parent) {
  let container = createDiv(parent, 'plotContainer');

  let plot = new SlidingWindowPlot({parent: container, className: 'plot02'});
  createDiv(container, 'plotMsg', 'Example 2: adding elements');

  plot.addValue(0, getRgbStr(rnd(0,200), rnd(0,200), rnd(0,200)));
  await sleep(0.5);

  plot.addValue(10, getRgbStr(rnd(0,200), rnd(0,200), rnd(0,200)));
  await sleep(0.5);

  plot.addValue(20, getRgbStr(rnd(0,200), rnd(0,200), rnd(0,200)));
  await sleep(0.5);

  let newBarCount = 30;
  for (let i = 0; i < newBarCount; ++i) {
  plot.addValue(rnd(10, 100), getRgbStr(rnd(0,200), rnd(0,200), rnd(0,200)));
    await sleep(0.25);
  }

  // console.log(plot.getStats());

  return container;
}

async function createPlot03(parent) {
  let container = createDiv(parent, 'plotContainer');

  let plot = new SlidingWindowPlot({
    parent: container,
    className: 'plot03',
    dataList: [100, 50, 1000, 0, 250, 200, 800],
    dataWindowSize: 20,
    plotOffset: 0,  // show bars from 0 to value
    barMaxWidth: 20,    // comment out to compute this from the dataList size
    // barGap: 2,          // default is 2
    colorList: ['red', 'orange', 'gold', 'green', 'blue', 'magenta', 'purple'],
    showStatsFlag: false,
  });

  createDiv(container, 'plotMsg', 'Example 3: start with elements and add');

  await sleep(2);

  let newBarCount = 30;
  for (let i = 0; i < newBarCount; ++i) {
    plot.addValue(rnd(10, 1000), getRgbStr(rnd(0,200), rnd(0,200), rnd(0,200)));
    await sleep(0.25);
  }

  return container;
}

async function createPlot04(parent) {
  let container = createDiv(parent, 'plotContainer');

  let plot = new SlidingWindowPlot({
    parent: container,
    className: 'plot04',
    dataList: null,
    dataWindowSize: null,
    plotOffset:     null,
    barMaxWidth:    20,
    barGap:         10,
    colorList:      null,
    showStatsFlag:  false,});

  createDiv(container, 'plotMsg', 'Example 4: variations of parameters');

  await sleep(1);

  let newBarCount = 30;
  for (let i = 0; i < newBarCount; ++i) {
    plot.addValue(rnd(0, 1000), getRgbStr(rnd(0,200), rnd(0,200), rnd(0,200)));
    await sleep(0.5);
  }

  console.log(plot.getStats());

  return container;
}

async function createPlot05(parent) {
  let container = createDiv(parent, 'plotContainer');

  let plot = new SlidingWindowPlot({parent: container, className: 'plot05'});
  createDiv(container, 'plotMsg', 'Example 5: list with same values');

  for (let i = 0; i < 20; ++i) {
    plot.addValue(5, getRgbStr(rnd(100,255), rnd(100,255), rnd(100,255)));
    await sleep(0.5);
  }

  return container;
}
