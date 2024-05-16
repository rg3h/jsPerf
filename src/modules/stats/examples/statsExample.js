// @fileoverview statsExample.js -- demos stats.js

import {createDiv} from '../../html/html.js';
import {Stats}     from '../../stats/stats.js';

window.addEventListener('load', main);

// main entry point for the app
async function main() {
  let parent = createDiv(document.body, 'middle');
  createTitle(parent);

  runTestWithSimpleList(parent);
  runTestWithMixedList(parent);

  runTestWithOverallStats(parent);
  runTestWithOverallStatsAndListParameter(parent);
  runTestWithOverallStatsAndMixedList(parent);
  runTestWithOverallStatsAndResetList(parent);
}

function createTitle(parent) {
  let container = createDiv(parent, 'top');
  let middle = createDiv(container, 'topMiddle');
  createDiv(middle, 'title', 'stats.js Example');
  createDiv(middle, 'version', Stats.getVersion());

  return container;
}


function runTestWithSimpleList(parent) {
  let container = createDiv(parent);
  container.innerHTML = '<h2>stats for a simple list of values</h2>'

  let stats = new Stats();
  let list = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let min = Stats.getMin(list);
  let max = Stats.getMax(list);
  let avg = Stats.getAvg(list);
  let count = Stats.getCount(list);

  container.innerHTML +=
    'list: [' + list + ']' +
    '&nbsp;&nbsp;count: ' + count +
    '&nbsp;&nbsp;min: ' + min +
    '&nbsp;&nbsp;max: ' + max +
    '&nbsp;&nbsp;avg: ' + avg +
    '<br>';
}

function runTestWithMixedList(parent) {
  let container = createDiv(parent);
  container.innerHTML = '<h2>stats for a mixed list of values</h2>'

  let stats = new Stats();
  let list = ['dog', 1, 'cat', 2, 'battle pony', 3, 4, 5, 6, 7, 8, 9];
  let min = Stats.getMin(list);
  let max = Stats.getMax(list);
  let avg = Stats.getAvg(list);
  let count = Stats.getCount(list);

  container.innerHTML +=
    'list: [' + list + ']' +
    '&nbsp;&nbsp;count: ' + count +
    '&nbsp;&nbsp;min: ' + min +
    '&nbsp;&nbsp;max: ' + max +
    '&nbsp;&nbsp;avg: ' + avg +
    '<br>';
}

function runTestWithOverallStats(parent) {
  let container = createDiv(parent);
  container.innerHTML = '<h2>stats for a overall list of values</h2>'

  let stats = new Stats();
  let list = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  for (let i = 0; i < list.length; ++i) {
    stats.addToOverallStats(list[i]);

    let min = stats.getOverallMin(list);
    let max = stats.getOverallMax(list);
    let avg = stats.getOverallAvg(list);
    let count = stats.getOverallCount(list);

    container.innerHTML +=
      'list: [' + list.slice(0, i+1) + ']' +
      '&nbsp;&nbsp;count: ' + count +
      '&nbsp;&nbsp;min: ' + min +
      '&nbsp;&nbsp;max: ' + max +
      '&nbsp;&nbsp;avg: ' + avg +
      '<br>';
  }

  let listResults = Stats.getListStats(list);
  let overallResults = stats.getOverallStats();

  container.innerHTML +=
    'list results: ' + JSON.stringify(listResults, null, ' ') + '<br>' +
    'overall results: ' + JSON.stringify(overallResults, null, ' ') + '<br>';
}

function runTestWithOverallStatsAndListParameter(parent) {
  let container = createDiv(parent);
  container.innerHTML =
    '<h2>stats for a overall list of values added in the constructor</h2>'

  let list = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let stats = new Stats(list);

  let min = stats.getOverallMin(list);
  let max = stats.getOverallMax(list);
  let avg = stats.getOverallAvg(list);
  let count = stats.getOverallCount(list);

  container.innerHTML +=
    'list: [' + list + ']' +
    '&nbsp;&nbsp;count: ' + count +
    '&nbsp;&nbsp;min: ' + min +
    '&nbsp;&nbsp;max: ' + max +
    '&nbsp;&nbsp;avg: ' + avg +
    '<br>';
}

function runTestWithOverallStatsAndMixedList(parent) {
  let container = createDiv(parent);
  container.innerHTML = '<h2>stats for a overall list of mixed values</h2>'

  let stats = new Stats();
  let list = ['dog', 1, 'cat', 2, 'battle pony', 3, 4, 5, 6, 7, 8, 9];

  for (let i = 0; i < list.length; ++i) {
    stats.addToOverallStats(list[i]);

    let min = stats.getOverallMin(list);
    let max = stats.getOverallMax(list);
    let avg = stats.getOverallAvg(list);
    let count = stats.getOverallCount(list);

    container.innerHTML +=
      'list: [' + list.slice(0, i+1) + ']' +
      '&nbsp;&nbsp;count: ' + count +
      '&nbsp;&nbsp;min: ' + min +
      '&nbsp;&nbsp;max: ' + max +
      '&nbsp;&nbsp;avg: ' + avg +
      '<br>';
  }

  let results = stats.getOverallStats();
  container.innerHTML += 'results: ' + JSON.stringify(results,null,' ')+'<br>';
}


function runTestWithOverallStatsAndResetList(parent) {
  let container = createDiv(parent);
  container.innerHTML = '<h2>stats for resetting a overall list of values</h2>'

  let list = ['dog', 1, 'cat', 2, 'battle pony', 3, 4, 5, 6, 7, 8, 9];
  let stats = new Stats(list);

  let min = stats.getOverallMin(list);
  let max = stats.getOverallMax(list);
  let avg = stats.getOverallAvg(list);
  let count = stats.getOverallCount(list);

  container.innerHTML +=
    'list: [' + list + ']' +
    '&nbsp;&nbsp;count: ' + count +
    '&nbsp;&nbsp;min: ' + min +
    '&nbsp;&nbsp;max: ' + max +
    '&nbsp;&nbsp;avg: ' + avg +
    '<br>';

  container.innerHTML += 'resetting and adding new values<br>';
  let list2 = [1,2,3,4,5];
  stats.resetOverallStats();
  for (let i = 0; i < list2.length; ++i) {
    stats.addToOverallStats(list2[i]);
  }

  min = stats.getOverallMin(list);
  max = stats.getOverallMax(list);
  avg = stats.getOverallAvg(list);
  count = stats.getOverallCount(list);

  container.innerHTML +=
    'list: [' + list2 + ']' +
    '&nbsp;&nbsp;count: ' + count +
    '&nbsp;&nbsp;min: ' + min +
    '&nbsp;&nbsp;max: ' + max +
    '&nbsp;&nbsp;avg: ' + avg +
    '<br>';
}
