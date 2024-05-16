// @fileoverview hoverCardExample.js -- demos hoverCard.js

import {HoverCard}                         from '../HoverCard.js';
import {prettyNum, rnd}                    from '../../math/math.js';
import {createDiv, getRgbStr}              from '../../html/html.js';
import {createSvgContainer, createSvgRect} from '../../svg/svg.js';
import {sleep}                             from '../../util/util.js';

window.addEventListener('load', main);

// main entry point for the app
async function main() {
  let parent = createDiv(document.body, 'middle');
  createTitle(parent);

  /*await*/ createPlot01(parent);
  /*await*/ createPlot02(parent);
}

function createTitle(parent) {
  let container = createDiv(parent, 'top');
  let middle = createDiv(container, 'topMiddle');
  createDiv(middle, 'title', 'hoverCard.js Example');
  createDiv(middle, 'version', 'version ' + HoverCard.getVersion());

  return container;
}

async function createPlot01(parent) {
  let dataList = [30, 0, 200, 80, 10, 180, 100, 50, 75, 90, 75, 80,
                  150, 175, 12, 1, 77];
  let colorList = ['red','orange','gold','green','blue','magenta','purple'];

  let container = createDiv(parent, 'plotContainer');
  let plotContainer = createSvgContainer(container, 'hoverCardExamplePlot01');
  let hoverCard = new HoverCard(plotContainer);

  // give renderer a chance to render the plot
  setTimeout(() => createAllBars(plotContainer,hoverCard,dataList,colorList),1);

  createDiv(container, 'plotMsg', 'Example 1:  wide plot');

  return container;
}


async function createPlot02(parent) {
  let dataList = [];
  let colorList = ['red','orange','gold','green','blue','magenta','purple'];

  for (let i = 0; i < 10; ++i) {
    dataList.push(rnd(1,100));
  }

  let container = createDiv(parent, 'plotContainer');
  let plotContainer = createSvgContainer(container, 'hoverCardExamplePlot02');
  let hoverCard = new HoverCard(plotContainer);

  // give renderer a chance to render the plot
  setTimeout(() => createAllBars(plotContainer,hoverCard,dataList,colorList),1);

  createDiv(container, 'plotMsg', 'Example 2: random tall plot ');

  return container;
}

function createAllBars(parent, hoverCard, dataList, colorList) {
  const TOP_GAP = 20;
  const BAR_GAP = 2;  // gap between bars
  const BAR_WIDTH = 20;  // (containerSize.width/(dataList.length)) - BAR_GAP;
  let min = 0;   // let min = Math.min(...dataList);
  let max = Math.max(...dataList);
  let containerSize = parent.getBoundingClientRect();


  for (let i = 0, count=dataList.length; i < count; ++i) {
    let value = dataList[i];
    let color = colorList[i % colorList.length];
    let w = BAR_WIDTH;
    let h = norm(value, max, min) * (containerSize.height - TOP_GAP);
    if (h <= 3) {
      h = 3;
      color = 'black';
    }
    let x = i * (w + BAR_GAP);
    let y = containerSize.height - h;   // flip coordinates

    let bar = createSvgRect(parent, 'hoverCardExampleBar', x, y, w, h, color);
    bar.value = value;
    hoverCard.addEle(bar, handleHover.bind(this));
  }

}

function handleHover(e) {
  return prettyNum(e.target.value);
}

function norm(value, max, min) {
  return (value - min) / (max - min);
}
