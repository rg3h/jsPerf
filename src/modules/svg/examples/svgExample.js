// @fileoverview svgExample.js
import {createDiv} from '../../html/html.js';
import {sleep} from '../../util/util.js';
import {
  getSvgNS,
  getSvgVersion,
  getSvgAttribute,
  setSvgAttribute,
  setSvgPos,
  setSvgColor,
  setSvgSize,
  createSvgElement,
  createSvgContainer,
  createSvgCircle,
  createSvgEllipse,
  createSvgLine,
  createSvgPolygon,
  createSvgPath,
  createSvgRect,
  setSvgRect,
  createSvgText,
  setSvgText,
} from '../../svg/svg.js';

let msgEle;

window.addEventListener('load', main);

async function main() {
  let parent = createDiv(document.body, 'middle');
  createTitle(parent);

  createDiv(parent, 'svgNS',  getSvgNS());

  let svgContainer = createSvgContainer(parent, 'svgContainer');
  msgEle = createDiv(parent, 'msg');

  let circle = createSvgCircle(svgContainer, 'svgCircle');
  msg('circle created at ' +
      getSvgAttribute(circle, 'cx') + ' ' + getSvgAttribute(circle, 'cy') +
      ' (shows null since cx, cy were set with css style)');

  let ellipse1 = createSvgEllipse(svgContainer, 'svgEllipse');
  setSvgAttribute(ellipse1, 'fill', 'grey');
  msg('ellipse1 fill: ' + getSvgAttribute(ellipse1, 'fill'));

  let ellipse2 = createSvgEllipse(svgContainer, null, 230, 80, 20, 10, 'olive');
  setSvgAttribute(ellipse2, 'fill', 'rgb(180, 0, 0)');
  msg('ellipse2 fill: ' + getSvgAttribute(ellipse2, 'fill'));
  msg('ellipse2 created at ' +
      getSvgAttribute(ellipse2, 'cx') + ' ' + getSvgAttribute(ellipse2, 'cy'));

  let ptList = [[300, 20], [320, 50], [320, 100], [250, 100]];
  createSvgPolygon(svgContainer, null, ptList, 'rgb(100, 100, 250)');

  // M = moveto (move from one point to another point)
  // L = lineto (create a line)
  // H = horizontal lineto (create a horizontal line)
  // V = vertical lineto (create a vertical line)
  // C = curveto (create a curve)
  // S = smooth curveto (create a smooth curve)
  // Q = quadratic Bézier curve (create a quadratic Bézier curve)
  // T = smooth quadratic Bézier curveto
  // A = elliptical Arc (create a elliptical arc)
  // Z = closepath (close the path)
  let pathStr = 'M400 40 L475 200 L375 200 Z';
  let path = createSvgPath(svgContainer, null, pathStr, 'blue');
  //setSvgAttribute(path, 'fill', 'none');
  setSvgAttribute(path, 'stroke', 'magenta');
  setSvgAttribute(path, 'stroke-width', '4px');

  let rect = createSvgRect(svgContainer, 'svgRect', 200, 100, 20, 100, 'blue');
  msg('rect attribute is blue, but css style (orange) takes precedent');

  createSvgLine(svgContainer, null, [[0,0], [20,40]]);
  let line = createSvgLine(svgContainer, null, [[20,50], [190, 100]], 'green');
  setSvgAttribute(line, 'stroke-width', '5px');

  let text = createSvgText(svgContainer, 'svgText', 'hello');
  setSvgPos(text, 30, 50);

  // setSvgText(line, 'I am not text'); // reports error setting non svgText ele

  // let text2 = createSvgText(svgContainer, 'svgText2', 'text2', 'grey');
  let text2 = createSvgText(svgContainer, null, 'some text', 'grey');
  setSvgPos(text2, 50, 220);
  setSvgSize(text2, '2rem');

  await sleep(2);
  setSvgText(text, 'howdy');
  setSvgSize(text2, '4rem');
  setSvgColor(text2, 'red');
  setSvgRect(rect, 220, 120, 50, 50, 'blue'); // not turn blue; css precedence
}

function createTitle(parent) {
  let container = createDiv(parent, 'top');
  let middle = createDiv(container, 'topMiddle');
  let title = createDiv(middle, 'title', 'svg.js Example ');
  createDiv(middle, 'version', 'v' + getSvgVersion());

  return container;
}

function msg(newMsg) {
  msgEle.innerHTML += '<br>' + newMsg;
}
