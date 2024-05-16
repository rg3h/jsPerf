//@fileoverview: jsPerfWidgetExample/main.js
import {prettyNum, rnd}     from '../../math/math.js';
import {sleep}              from '../../util/util.js';
import {JsPerfWidget}       from '../../jsPerfWidget/jsPerfWidget.js';
import {getTime, startTime} from '../../jsPerf/jsPerf.js';

window.addEventListener('load', main);

let itemList = [], total = 0;

function main() {
  showMemoryResults();
}

function showMemoryResults() {
  let jsPerfWidget = new JsPerfWidget({parent: document.body,
                                       maxBarWidth: 10,
                                       updateFreq: 1,
                                       sampleSize: 15});

  // if the browser does not support memory monitoring, show a message
  if (jsPerfWidget.supportsMemory()) {
    createMemorySlider();
    createMemoryButtons();
    createMemoryResultsSection();
  } else {
    let slider = document.getElementsByClassName('memorySliderContainer')[0];
    slider.style.display = 'none';
    let buttonList = document.getElementsByClassName('memoryButtonList')[0];
    buttonList.style.display = 'none';

    let resultsEle = document.getElementsByClassName('memoryResults')[0];
    resultsEle.style.color = 'red';
    let msg = 'This browser does not support the memory monitoring functions.';
    // resultsEle.textContent = msg;
    resultsEle.innerHTML = '<br>' + msg;
  }


  let memorySection = document.getElementsByClassName('memorySection')[0];
  memorySection.style.visibility = 'visible';
}


function createMemorySlider() {
  let slider = document.getElementsByClassName('memorySlider')[0];
  let low = 100_000;
  let high =  1_000_000;
  let step = Math.floor((high - low)/10);
  let val = low + Math.floor((high - low)/2);

  slider.min = low;
  slider.max = high;
  slider.step = step;
  slider.value = val;

  slider.oninput = handleMemorySlider;

  let lowEle = document.getElementsByClassName('memorySliderLow')[0];
  lowEle.textContent = prettyNum(slider.min);
  let highEle = document.getElementsByClassName('memorySliderHigh')[0];
  highEle.textContent = prettyNum(slider.max);
}


function handleMemorySlider(e) {
  let slider = e.target;
  let createButton = document.getElementsByClassName('createButton')[0];
  createButton.textContent = 'create ' + prettyNum(slider.value) + ' new items';
}


function createMemoryButtons() {
  let slider = document.getElementsByClassName('memorySlider')[0];
  let createButton = document.getElementsByClassName('createButton')[0];
  createButton.textContent = 'create ' + prettyNum(slider.value) + ' new items';
  createButton.onclick = handleCreateMemoryButton;

  let resetButton = document.getElementsByClassName('resetButton')[0];
  resetButton.onclick = handleResetButton;
}

function handleCreateMemoryButton(e) {
  let slider = document.getElementsByClassName('memorySlider')[0];
  let value = 1 * slider.value;  // turn it into a number;
  total += value;
  let item = new Array(value).fill('a');
  itemList.push(item);
  updateMemoryResults();
}

function handleResetButton(e) {
  itemList = [];
  total = 0;
  updateMemoryResults();
}

function createMemoryResultsSection() {
  updateMemoryResults();
}

function updateMemoryResults() {
  let resultsEle = document.getElementsByClassName('memoryResults')[0];
  resultsEle.textContent = 'Total items created: ' + prettyNum(total);
}
