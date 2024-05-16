// @fileoverview linePlot.js
import {getStyle}  from '../html/html.js';
import {isNumber,
        getMin,
        getMax,
        getCount,
        getAvg,
        normalize,
        prettyNum} from '../math/math.js';
import {HoverCard} from '../hoverCard/hoverCard.js';

import {createSvgContainer,
        createSvgCircle,
        createSvgLine,
        getSvgAttribute,
        getSvgPos,
        setSvgAttribute,
        setSvgPos} from '../svg/svg.js';


export {LinePlot};
class LinePlot {
  #lineColor   = null;  // color of the line
  #pointList   = null;  // array of svg points, which have point.value
  #hoverCard   = null;  // card shows a point's value when hovering
  #container   = null;  // the svg plot container element
  #borderWidth = null; // compute this once and use when rendering on the canvas
  #line        = null;

  /************************** public functions *************************/
  // ket version = LinePlot.getVersion();  // static class function
  static getVersion() {
    return '1.0.1';
  }

  constructor(configObj) {
    return this.#init(configObj); // call init in case decide to go async
  }

  // reset linePlot to configObj settings
  reset(configObj) {
    let parent = this.#container.parentNode;
    parent.removeChild(this.#container);
    this.#init(configObj);

    return this;
  }

  setLineColor(newLineColor, updateStateFlag=true) {
    if (typeof newLineColor !== 'undefined' && newLineColor !== null) {
      if (newLineColor === this.#lineColor) { return; }
      let a = Array.isArray(newLineColor) ? newLineColor : [newLineColor];
      if (a.length > 0) {
        this.#lineColor = a[0];
        updateStateFlag ? this.#updateState() : null;
      }
    }

    return this;
  }

  /*****
  setPointSize(newPointSize, updateStateFlag=true) {
    if (typeof newLineColor !== 'undefined' && newLineColor !== null) {
      if (isNumber(newPointSize)) {
        if (newPointSize === this.#pointSize) { return; }
        this.#pointSize = newPointSize;
        updateStateFlag ? this.#updateState() : null;
      }
    }
    return this;
  }
  *****/

  getContainer() {
    return this.#container;
  }

  getParent() {
    return this.#container.parentNode;
  }

  getContainerSize() {
    let containerSize = this.#container.getBoundingClientRect();
    return {height:containerSize.height, width:containerSize.width};
  }

  /*****
  getPointSize() {
    return this.#pointSize;
  }
  *****/

  // returns a list of svg points (which also have point.value)
  getPoints() {
    return this.#pointList;
  }

  // returns just the numeric values list
  getData() {
    let dataList = [];
    for (let i = 0; i < this.#pointList.length; ++i) {
      dataList.push(this.#pointList[i].value);
    }
    return dataList;
  }

  getStats() {
    let data = this.getData();  // get a list of the numeric values

    return {
      avg:   avg(data),
      count: count(data),
      max:   max(data),
      min:   min(data),
    };
  }

  // add a point to a line
  addPoint(newValue, updateStateFlag=true) {
    if (!isNumber(newValue)) { return; }

    let newIndex = this.#pointList.length;
    this.#pointList.push(this.#createPoint(newIndex, newValue));
    updateStateFlag ? this.#updateState() : null;

    return this;
  }

  /************************** private functions *************************/
  /*async*/ #init(cfg = {
    parent:         null,  // parent html to attach the plot to; can be null
    className:      null,  // className to adjust the look of the plot
    dataList:       null,  // list of numbers, e.g. [12, 44, 65, 87....]
    lineColor:      null,  // color of the line
  }) {
    const DEFAULT_LINE_COLOR = 'black';

    this.#lineColor = cfg.lineColor ? cfg.lineColor : DEFAULT_LINE_COLOR;

    this.#pointList = [];   // array of {pointEle, value}
    this.#hoverCard = null; // card shows a point's value when hovering
    this.#container = null; // the svg plot container element

    this.#createPlot(cfg.parent, cfg.className);
    this.#createPointList(cfg.dataList);
    this.#line = createSvgLine(this.#container, 'linePlotLine',
                               [], this.#lineColor);

    setTimeout(this.#updateState.bind(this), 1); // give time to layout html
    return this;
  }

  #createPlot(parent, className) {
    this.#container = createSvgContainer(parent, className);
    this.#container.addEventListener('resize', this.#updateState);
    this.#borderWidth = parseFloat(getStyle(this.#container, 'border-width'));
    // this.#hoverCard = new HoverCard(this.#container);

    return this;
  }

  // create a pointList {point, value} from list of values
  #createPointList(valueList) {
    this.#resetPointList();  // remove old points if they exist

    if (typeof valueList === 'undefined' || valueList === null ||
        (Array.isArray(valueList) && valueList.length < 1)) {
      return this;
    }

    // make sure value list is an array
    !Array.isArray(valueList) ? valueList = [valueList] : null;

    for (let i = 0; i < valueList.length; ++i) {
      this.addPoint(valueList[i], false);
    }

    return this;
  }

  // create a point based on the index (x) and value (y)
  #createPoint(index, value) {
    const POINT_SIZE = 5;  // pixels
    if (!isNumber(value)) { return null; }

    let {x, y} = this.#computePointPosition(index, value);

    let point = createSvgCircle(this.#container, 'linePlotPoint',
                                x, y, POINT_SIZE, this.#lineColor);
    point.value = value;
    // this.#hoverCard.addEle(point, this.#handleHover.bind(this));

    return point;  // callers will attach the point to the dataList
  }


  // update all the pointList x,y positions
  #updatePointListPositions() {
    let line = [];
    for (let i = 0; i < this.#pointList.length; ++i) {
      let point = this.#pointList[i];
      let {x, y} = this.#computePointPosition(i, point.value);

      // XXX console.log(`pt[${i}, ${point.value}] = (${x}, ${y})`);

      setSvgPos(point, x, y);
      line.push(x);
      line.push(y);
    }
    let lineStr = line.join(' ');
    setSvgAttribute(this.#line, 'points', lineStr);

    /****
    for (let i = 0; i < this.#pointList.length; ++i) {
      line.push(getSvgAttribute(this.#pointList[i], 'cx'));
      line.push(getSvgAttribute(this.#pointList[i], 'cy'));
    }
    line = line.join(' ');
    console.log('newLine', line);
    setSvgAttribute(this.#line, 'points', line);
    console.log('NOW LINE IS', this.#line);
    ***/

    return this;
  }

  // based on the index in the pointList (x) and the value of the point (y),
  // return the x, y position of the point on the svg canvas
  #computePointPosition(index, value) {
    let bp2 = this.#borderWidth * 2;

    let containerSize   = this.#container.getBoundingClientRect();
    let containerWidth  = containerSize.width  - bp2;
    let containerHeight = containerSize.height - bp2;
    let containerBottom = containerSize.bottom - this.#borderWidth;
    let containerTop    = containerSize.top    + this.#borderWidth;

    let data = this.getData();  // list of numbers
    let dataCount = data.length;

    // if index outside of data array, then add 1 since new point will be added
    index < 0 || index >= data.length ? dataCount++ : null;

    let spaceBetweenPoints = containerWidth/(dataCount - 1);
    let x = index * spaceBetweenPoints;



    // include new value in min/max
    let min = getMin(data, value); //NOT min of the 2, but min of all data & val
    let max = getMax(data, value); //NOT max of the 2, but max of all data & val
    let valueNorm = normalize(value, min, max);
    let y = containerHeight - (valueNorm * containerHeight);

    // XXX console.log('data', data);
    // XXX console.log(value, min, max, valueNorm, containerBottom,containerHeight, y);

    return {x, y};
  }

  #handleHover(e) {
    return prettyNum(e.target.value);
  }

  #resetPointList() {
    for (let i = 0; i < this.#pointList.length; ++i) {
      this.#removePointAtIndex(0, false);
    }

    this.#pointList = [];

    return this;
  }

  #removePointAtIndex(index, updateStateFlag=true) {
    if (!isNumber(index) || index < 0 || index > this.#pointList.length) {
      console.error('linePlot removePointAtIndex() invalid index', index);
      return;
    }

    let point = this.#pointList[index];
    point.parentNode.removeChild(point);
    // this.#hoverCard.removeEle(dataItem.bar);

    this.#pointList.splice(index, 1);
    updateStateFlag ? this.#updateState() : null;

    return this;
  }

  // call updateState when there is a change (new data, window size, etc)
  // given min, max, compute point positions
  #updateState() {
    // console.log('*******************************************************');
    // console.log('****************** update state ***********************');
    // console.log('*******************************************************');
    if (this.#pointList.length < 1) { return this; } // no points to plot
    this.#updatePointListPositions();

    // if min === max, then straight line so plot half way up
    return this;
  }

} // class LinePlot
