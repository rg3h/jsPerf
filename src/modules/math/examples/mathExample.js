// @fileoverview mathExample.js -- demos math.js

import {createDiv}   from '../../html/html.js';
import {
  getVersion,
  isNumber,
  normalize,
  prettyNum,
  rnd,
}    from '../../math/math.js';

window.addEventListener('load', main);

// main entry point for the app
async function main() {
  let parent = createDiv(document.body, 'middle');
  createTitle(parent);

  createDiv(parent, '<h2>Functions</h2>');
  createDiv(parent, null, 'isNumber() = ' + isNumber());
  createDiv(parent, null, 'isNumber(null) = ' + isNumber(null));
  createDiv(parent, null, 'isNumber(\'a33\') = ' + isNumber('a33'));
  createDiv(parent, null, 'isNumber(\'12px\') = ' + isNumber('12px'));
  createDiv(parent, null, 'isNumber(\'12\') = ' + isNumber('12px'));
  createDiv(parent, null, 'isNumber(12) = ' + isNumber(12));
  createDiv(parent, null, '');

  createDiv(parent, null, 'rnd(0, 100) = ' + rnd(0, 100));
  createDiv(parent, null, 'normalize(12, 0, 1) = ' + normalize(12,0,1));
  createDiv(parent, null, 'normalize(12, 10, 100) = ' + normalize(12,10,100));
  createDiv(parent, null, 'prettyNum(12.3) = ' + prettyNum(12.3));
  createDiv(parent, null, 'prettyNum(123) = ' + prettyNum(123));
  createDiv(parent, null, 'prettyNum(12345) = ' + prettyNum(12345));
  createDiv(parent, null, 'prettyNum(12345.67) = ' + prettyNum(12345.67));
  createDiv(parent, null, 'prettyNum(12345, 4) = ' + prettyNum(12345,4));
  createDiv(parent, null, 'prettyNum(12345.333333333, 2) = ' + prettyNum(12345.333333333, 2));
  createDiv(parent, null, '');
}

function createTitle(parent) {
  let container = createDiv(parent, 'top');
  let middle = createDiv(container, 'topMiddle');
  let title = createDiv(middle, 'title', 'math.js Example ');
  createDiv(middle, 'version', 'v' + getVersion());

  return container;
}
