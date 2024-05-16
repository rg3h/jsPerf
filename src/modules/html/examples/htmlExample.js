// @fileoverview htmlExample.js -- demos html.js

import {
  getVersion as getMathSymbolsVersion,
  DEGREE_SYM,
  DIV_SYM,
  MULT_SYM,
  NOT_EQUALS_SYM,
  PLUS_MINUS_SYM,
  PLUS_SYM,
} from '../../html/mathSymbols.js';

import {
  createBr,
  createButton,
  createDiv,
  createEle,
  getEleByClass,
  getStyle,
  getRgbStr,
  getVersion as getHtmlVersion,
  removeEle,
} from '../../html/html.js';

window.addEventListener('load', main);

// main entry point for the app
async function main() {
  let parent = createDiv(document.body, 'middle');
  createTitle(parent);

  testCreateBr(parent);
  testCreateButton(parent);
  testCreateDiv(parent);
  testGetEleByClass(parent);
  testGetStyle(parent);
  testGetRgbStr(parent);
  testMathSymbols(parent);
  testRemoveEle(parent);
}


function createResultsDiv(parent, titleText) {
  let container = createDiv(parent, 'resultsDiv');
  createDiv(container, 'resultsDivTitle', titleText);
  return container;
}

function createTitle(parent) {
  let container = createDiv(parent, 'top');
  let middle = createDiv(container, 'topMiddle');
  createDiv(middle, 'title', 'html.js Example');
  createDiv(middle, 'version',
            '(html v' + getHtmlVersion() + ')' +
            ' (mathSymbols v' + getMathSymbolsVersion() + ')');

  return container;
}

function testCreateBr(parent) {
  let container = createResultsDiv(parent, 'testCreateBr');
  createDiv(container, null, 'some text');
  createDiv(container, null, 'some text');
  createBr(container);
  createDiv(container, null, 'some text');
}

function testCreateDiv(parent) {
  let container = createResultsDiv(parent, 'testCreateDiv');
  let divEle = createDiv(container, 'testDiv', 'div example');
}

function testCreateButton(parent) {
  let container = createResultsDiv(parent, 'testCreateButton');
  createButton(container, 'testButton', 'button no cb');
  createButton(container, 'testButton', 'button', e => alert('hi!'));
}

function testGetEleByClass(parent) {
  let ele, msg;
  let container = createResultsDiv(parent, 'testGetEleByClass');

  ele = getEleByClass('foo');
  if (ele === null) {
    msg = 'getEleByClass(\'foo\') correctly returned null';
    createDiv(container, 'resultsDivRow', msg);
  } else {
    msg = 'getEleByClass(\'foo\') = ' + ele + ' but expected null';
    console.error(msg);
    createDiv(container, 'resultsDivRowError', msg);
  }

  let className = 'testGetEleClass';
  let firstEleText = 'ele01';
  let e1 = createDiv(container, className, firstEleText);
  let e2 = createDiv(container, className, 'ele02');
  ele = getEleByClass(className);
  removeEle(e1);
  removeEle(e2);

  if (ele.textContent === firstEleText) {
    msg = 'getEleByClass(\'' + className + '\') correctly === ' + firstEleText;
    createDiv(container, 'resultsDivRow', msg);
  } else {
    msg = 'getEleByClass(\'' + className + '\') = ' + ele.textContent +
      ' but expected ' + firstEleText;
    console.error(msg);
    createDiv(container, 'resultsDivRowError', msg);
  }
}

function testGetStyle(parent) {
  let ele, msg;
  let container = createResultsDiv(parent, 'testGetStyle');

  ele = createDiv(container, 'testStyle', 'ele example');
  let borderStyle = getStyle(ele, 'border');
  const expectedBorderStyle = '0px none rgb(0, 0, 0)';
  removeEle(ele);

  if (borderStyle === expectedBorderStyle) {
    msg = 'getStyle(\'border\') correctly === ' + expectedBorderStyle;
    createDiv(container, 'resultsDivRow', msg);
  } else {
    msg = 'getStyle(\'border\') = ' + borderStyle +
      ' but expected ' + expectedBorderStyle;
    console.error(msg);
    createDiv(container, 'resultsDivRowError', msg);
  }
}

function testGetRgbStr(parent) {
  let ele, msg;
  let container = createResultsDiv(parent, 'testGetRgbStr');

  let rgbStr = getRgbStr(255, 100, 50);
  let expectedRgbStr = 'rgb(255,100,50)';

  if (rgbStr === expectedRgbStr) {
    msg = 'getRgbStr(255, 100, 50) correctly === ' + expectedRgbStr;
    createDiv(container, 'resultsDivRow', msg);
  } else {
    msg = 'getRgbStr(255, 100, 50) = ' + rgbStr +
      ' but expected ' + expectedRgbStr;
    console.error(msg);
    createDiv(container, 'resultsDivRowError', msg);
  }
}

function testMathSymbols(parent) {
  let container = createResultsDiv(parent, 'testMathSymbols');

  createDiv(container, '<h2>Symbols</h2>');
  createDiv(container, null, 'DEGREE_SYM ' + DEGREE_SYM);
  createDiv(container, null, 'DIV_SYM ' + DIV_SYM);
  createDiv(container, null, 'MULT_SYM ' + MULT_SYM);
  createDiv(container, null, 'NOT_EQUALS_SYM ' + NOT_EQUALS_SYM);
  createDiv(container, null, 'PLUS_MINUS_SYM ' + PLUS_MINUS_SYM);
  createDiv(container, null, 'PLUS_SYM ' + PLUS_SYM);
}

function testRemoveEle(parent) {
  let ele;
  let container = createResultsDiv(parent, 'testRemoveEle');
  ele = createDiv(container, null, 'div example');
  removeEle(ele);
  removeEle();
  removeEle(null);
  ele = createDiv(null, null, 'div example');
  removeEle(ele);
  createDiv(container, null,
            'If no errors and no divs in this container, removeEle worked');
}
