// @fileoverview utilExample.js -- demos util.js

import {createBr, createDiv}   from '../../html/html.js';
import {
  getVersion,
  isBrowser,
  isNode,
  prettyDate,
  saveFile,
  sleep,
  updateOnTheMinute,
} from '../../util/util.js';

window.addEventListener('load', main);

// main entry point for the app
async function main() {
  let parent = createDiv(document.body, 'middle');
  createTitle(parent);

  createDiv(parent, '<h2>Functions</h2>');
  createDiv(parent, null, 'version() = ' + getVersion());
  createDiv(parent, null, 'isBrowser() = ' + isBrowser());
  createDiv(parent, null, 'isNode() = ' + isNode());
  createDiv(parent, null, 'prettyDate() = ' + prettyDate());
  createDiv(parent, null, 'prettyDate(now) = ' + prettyDate(new Date()));
  createDiv(parent, null, 'prettyDate(null, false, false, false) = ' +
            prettyDate(null, false, false, false));
  createDiv(parent, null, 'prettyDate(null, true, true, true) = ' +
            prettyDate(null, true, true, true));

  let dateStr = new Date().toString();
  createDiv(parent, null, 'prettyDate(' + dateStr + ') = ' +
            prettyDate(dateStr));

  createBr(parent);
  createDiv(parent, null, 'sleep() start ' +
            prettyDate(null,true,true,true) + '...');
  await sleep();
  createDiv(parent, null, 'sleep() end ' +
            prettyDate(null,true,true,true));
  createBr(parent);

  createDiv(parent, null, 'sleep(5) start ' +
            prettyDate(null,true,true,true) + '...');
  await sleep(5);
  createDiv(parent, null, 'sleep(5) end ' +
            prettyDate(null,true,true,true));
  createBr(parent);

  await sleep(2);
  createDiv(parent, null, 'saveFile(\'utilExampleSavedFile\', \'hello\')');
  saveFile('utilExampleSavedFile', 'hello');

  createDiv(parent, 'date', 'update date periodically');
  showPrettyDate();
  updateOnTheMinute(showPrettyDate);
}

function createTitle(parent) {
  let container = createDiv(parent, 'top');
  let middle = createDiv(container, 'topMiddle');
  let title = createDiv(middle, 'title', 'util.js Example ');
  createDiv(middle, 'version', 'v' + getVersion());

  return container;
}

function showPrettyDate() {
  document.getElementsByClassName('date')[0].innerHTML = prettyDate();
}
