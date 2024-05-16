// @fileoverview slidingWindowPlot.js
import {getStyle} from '../html/html.js';
import {isNumber, normalize, prettyNum, rnd} from '../math/math.js';
import {HoverCard} from '../hoverCard/hoverCard.js';
import {Stats} from '../stats/stats.js';
import {
  createSvgContainer,
  createSvgLine,
  createSvgRect,
  getSvgAttribute,
  setSvgColor,
  setSvgRect,
} from '../svg/svg.js';


export {SlidingWindowPlot};
class SlidingWindowPlot {
  #barColor       = null; // first color in color list of constructor
  #barGap         = null; // spacing between the bars
  #barMaxWidth    = null; // optional constrain each bar's max width
  #dataList       = null; // array of dataItems which in turn are value and bar
  #dataWindowSize = null; // the max num items in dataList; slides window
  #plotOffset     = null; // uses min but this allows you to set bottom (e.g. 0)
  #showStatsFlag  = null; // show horizontal lines for min, max, avg
  #topMargin      = null; // a gap at the top so the bars dont go to the top

  #hoverCard      = null; // card shows a bar's value when hovering
  #stats          = null; // overall min,max,avg and min,max,avg for a list
  #container      = null; // holds the plot svg element


  /************************** public functions *************************/
  // ket version = SlidingWindowPlot.getVersion();  // static class function
  static getVersion() {
    return '1.0.1';
  }

  constructor(configObj) {
    return this.#init(configObj); // call init in case decide to go async
  }

  // reset slidingWindowPlot to configObj settings
  reset(configObj) {
    let parent = this.#container.parentNode;
    parent.removeChild(this.#container);
    // config.parent = parent;
    this.#init(configObj);

    return this;
  }

  setBarColor(newBarColor) {
    const DEFAULT_BAR_COLOR = 'black';

    if (!newBarColor) {
      this.#barColor = DEFAULT_BAR_COLOR;
    } else if (Array.isArray(newBarColor)) {
      this.#barColor=newBarColor.length>0 ? newBarColor[0] : DEFAULT_BAR_COLOR;
    } else {
      this.#barColor = newBarColor;
    }

    return this;
  }

  setBarGap(newBarGap, updateStateFlag=true) {
    const DEFAULT_BAR_GAP = 2;
    this.#barGap = isNumber(newBarGap) ? newBarGap : DEFAULT_BAR_GAP;
    updateStateFlag ? this.#updateState() : null;
    return this;
  }

  setBarMaxWidth(newBarMaxWidth, updateStateFlag=true) {
    isNumber(newBarMaxWidth) ? this.#barMaxWidth = newBarMaxWidth : null;
    updateStateFlag ? this.#updateState() : null;
    return this;
  }

  setPlotOffset(newPlotOffset, updateStateFlag=true) {
    // null newPlotOffset unsets this.#plotOffset
    if (typeof newPlotOffset !== 'undefined' && newPlotOffset === null) {
      this.#plotOffset = null;
    } else {
      isNumber(newPlotOffset) ? this.#plotOffset = newPlotOffset : null;
    }

    updateStateFlag ? this.#updateState() : null;
    return this;
  }

  setShowStatsFlag(statsFlag, updateStateFlag=true) {
    this.#showStatsFlag = !!statsFlag;
    updateStateFlag ? this.#updateState() : null;
    return this;
  }

  setTopMargin(newTopMargin, updateStateFlag=true) {
    const DEFAULT_TOP_MARGIN = 15;
    this.#topMargin=isNumber(newTopMargin) ? newTopMargin : DEFAULT_TOP_MARGIN;
    updateStateFlag ? this.#updateState() : null;
    return this;
  }

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

  // this is the actual width which may be less than this.#barMaxWidth
  getBarWidth() {
    if (!this.#dataList || this.#dataList.length < 1) {
      return 0;
    } else {
      let dataItem = this.#dataList[0];
      return getSvgAttribute(dataItem.bar, 'width') * 1;
    }
  }

  getDataWindowSize() {
    return this.#dataWindowSize;
  }

  getDataWindow() {
    let data = [];
    for (let i = 0, count = this.#dataList.length; i < count; ++i) {
      data[i] = this.#dataList[i].value;
    }
    return data;
  }

  getStats() {
    let data = this.getDataWindow();
    let listStats = Stats.getListStats(data);
    let overallStats = this.#stats.getOverallStats();

    return {
      dataList:       data,
      windowMin:      listStats.min,
      windowMax:      listStats.max,
      windowAvg:      listStats.avg,
      windowCount:    listStats.count,
      overallMin:     overallStats.min,
      overallMax:     overallStats.max,
      overallAvg:     overallStats.avg,
      overallCount:   overallStats.count,
    };
  }

  // adds a new value the right and removes the one on the left
  addValue(newValue, newColor, updateStateFlag=true) {
    if (!isNumber(newValue)) {
      console.warn('slidingWindowPlot warning:',
                   'addValue() ignoring bad value', newValue);
      updateStateFlag ? this.#updateState() : null;
      return this;
    }

    // if newColor not defined, set it to this.#barColor
    newColor = typeof newColor === 'undefined' || newColor === null ?
      newColor = this.#barColor : newColor;

    let dataItem = this.#createDataItem(newValue, newColor);

    if (dataItem) {
      this.#dataList.push(dataItem);
      this.#stats.addToOverallStats(dataItem.value);
    }

    this.#dataList.length > this.#dataWindowSize ?
      this.#removeDataItemAtIndex(0, false) : null;

    updateStateFlag ? this.#updateState() : null;

    return this;
  }

  /************************** private functions *************************/
  /*async*/ #init(cfg = {
    parent:         null,  // parent html to attach the plot to; can be null
    className:      null,  // className to adjust the look of the plot
    dataList:       null,  // list of numbers, e.g. [12, 44, 65, 87....]
    dataWindowSize: null,  // dataList len or dataWindowSize
    plotOffset:     null,  // opt bottom value for y axis; else uses min
    barMaxWidth:    null,  // optionl how wide a bar can get
    barGap:         null,  // optional space between bars, default is 2px
    colorList:      null,  // list of bar colors or single color value
    showStatsFlag:  false, // show horizontal lines for min, msx, avg
  }) {
    this.#stats = new Stats();
    this.#resetAllData();  // resets all of the internal vars

    this.setBarColor(cfg.colorList);
    this.setBarGap(cfg.barGap, false);
    this.setBarMaxWidth(cfg.barMaxWidth, false);
    this.setPlotOffset(cfg.plotOffset, false);
    this.setShowStatsFlag(cfg.showStatsFlag, false);
    this.setTopMargin(null, false);  // use the default

    // set dataWindowSize cfg.dataWindowSize, cfg.dataLen, or DEFAULT_DATA_SIZE
    const DEFAULT_DATA_SIZE = 20;
    this.#dataWindowSize = isNumber(cfg.dataWindowSize) ? cfg.dataWindowSize :
        Array.isArray(cfg.dataList) && cfg.dataList.length > 0 ?
      cfg.dataList.length : DEFAULT_DATA_SIZE;

    this.#createPlot(cfg.parent, cfg.className);

    // create the dataList from cfg.dataList -- if too long, cut off beginning
    this.#createDataList(cfg.dataList, cfg.colorList);

    setTimeout(this.#updateState.bind(this), 1); // give renderer time to layout

    // console.log(this.#getState());
    return this;
  }

  #resetAllData() {
    // config
    this.#barColor      = null;
    this.#barGap        = null;
    this.#barMaxWidth   = null;
    this.#resetDataList();
    this.#dataWindowSize = null;
    this.#plotOffset    = null;
    this.#showStatsFlag = false;
    this.#topMargin     = null;

    // reset html and svg nodes
    this.#resetAllHtmlSvg();
    return this;
  }

  #resetDataList() {
    if (this.#dataList) {
      let dataItemCount = this.#dataList.length;
      for (let i = 0; i < dataItemCount; ++i) {
        this.#removeDataItemAtIndex(0, false);
      }
    }
    this.#dataList = [];
    this.#stats ? this.#stats.resetOverallStats() : this.#stats = new Stats();
    return this;
  }

  #resetAllHtmlSvg() {
    if (this.#container && this.#container.children) {
      for (let i = 0, count = this.#container.children.length; i < count; ++i) {
        this.#container.removeChild(this.#container.children[0]);
      }
    }
    this.#container = null;
  }

  #getState() {
    let data = this.getDataWindow();
    let listStats = Stats.getListStats(data);
    let overallStats = this.#stats.getOverallStats();

    return {
      barColor:       this.#barColor,
      barGap:         this.#barGap,
      barMaxWidth:    this.#barMaxWidth,
      dataList:       this.#dataList,
      dataWindowSize: this.#dataWindowSize,
      plotOffset:     this.#plotOffset,
      showStatsFlag:  this.#showStatsFlag,
      topMargin:      this.#topMargin,
      windowMin:      listStats.min,
      windowMax:      listStats.max,
      windowAvg:      listStats.avg,
      windowCount:    listStats.count,
      overallMin:     overallStats.min,
      overallMax:     overallStats.max,
      overallAvg:     overallStats.avg,
      overallCount:   overallStats.count,
      container:      this.#container,
    };
  }

  // create a data list {value, bar} from input dataList and color
  // if longer than this.#dataWindowSize, cut off the front of the newDataList
  #createDataList(newDataList, newColorList) {
    !Array.isArray(this.#dataList) ? this.#dataList = [] : null;
    this.#dataList.length > 0 ? this.#resetDataList() : null;

    // make sure newDataList is an array; if a number put it in an array
    isNumber(newDataList) ? newDataList = [newDataList] : null;
    if (!Array.isArray(newDataList) || newDataList.length < 1) {
      return this;
    }


    // make sure newColorList is an array; if a number put it in an array
    if (!newColorList) {
      newColorList = [this.#barColor];
    } else if (Array.isArray(newColorList)) {
      if (newColorList.length < 1) {
        newColorList = [this.#barColor];
      }
    } else {
      newColorList = [newColorList];
    }

    // if the newDataList is longer than dataWindowSize, only take the end
    let diff = newDataList.length - this.#dataWindowSize;
    diff < 0 ? diff = 0 : null;

    for (let i = diff; i < newDataList.length; ++i) {
      let color = i < newColorList.length ? newColorList[i] : this.#barColor;
      this.addValue(newDataList[i], color, false);
    }

    return this;
  }

  #createDataItem(value, color) {
    if (!isNumber(value)) {
      return null;
    }

    let dataItem = Object.create(null);  // no prototype, essentially a struct
    value = isNumber(value) ? value : 0;

    dataItem.value = value;

    // figure out the initial position of the bar
    let dataCount = this.#dataList.length;
    let rightMargin = this.#showStatsFlag ? 100 : 0;
    let containerSize = this.#container.getBoundingClientRect();
    let borderPad2 = parseFloat(getStyle(this.#container, 'border-width')) * 2;
    let containerWidth = containerSize.width - borderPad2 - rightMargin;
    let rectWidth = (containerWidth / dataCount) - this.#barGap;
    if (isNumber(this.#barMaxWidth) && rectWidth > this.#barMaxWidth) {
      rectWidth = this.#barMaxWidth;
    }
    rectWidth < 1 ? rectWidth = 1 : null;

    isNumber(this.#barMaxWidth) && rectWidth > this.#barMaxWidth ?
      rectWidth = this.#barMaxWidth : null;

    let x = (dataCount*(rectWidth + this.#barGap)) + Math.round(borderPad2/2);
    let y = containerSize.bottom;
    let bar = createSvgRect(this.#container, 'slidingWindowPlotBar',
                              x, y, 1, 1, color);
    bar.value = value;  // get rid of dataItem and just use bar

    this.#hoverCard.addEle(bar, this.#handleHover.bind(this));

    dataItem.bar = bar;

    return dataItem;
  }

  #handleHover(e) {
    return prettyNum(e.target.value);
  }


  #removeDataItemAtIndex(index, updateStateFlag=true) {
    if (isNumber(index) && index > -1 && index < this.#dataList.length) {
      // this.#container.removeChild(this.#dataList[index].bar);
      let dataItem = this.#dataList[index];
      dataItem.bar.parentNode.removeChild(dataItem.bar);
      this.#hoverCard.removeEle(dataItem.bar);
      dataItem.bar = null;

      this.#dataList.splice(index, 1);
      updateStateFlag ? this.#updateState() : null;
    } else {
      console.error('slidingWindowPlot removeDataItem() invalid index', index);
    }

    return this;
  }

  #createPlot(parent, className) {
    this.#container = createSvgContainer(parent, className);
    this.#hoverCard = new HoverCard(this.#container);
    this.#container.addEventListener('resize', this.#updateState);

    return this;
  }

  // call updateState when there is a change (new data, window size, etc)
  #updateState() {
    this.#updateBars();  // given plotOffset, min, max, avg, compute bars
    this.#showStatsFlag ? this.#drawLabelLines() : null;
    return this;
  }

  // given plotOffset, min, max, avg, compute bars
  #updateBars() {
    let data = this.getDataWindow();
    let listStats = Stats.getListStats(data);

    // no values to plot
    if (listStats.count < 1) {
      return this;
    }

    // all values are zero
    if (listStats.max === 0 && listStats.min === 0) {
      return this;
    }

    let rightMargin = this.#showStatsFlag ? 100 : 0;
    let dataCount = this.#dataList.length;
    let containerSize = this.#container.getBoundingClientRect();
    let borderPad2 = parseFloat(getStyle(this.#container, 'border-width')) * 2;

    let containerHeight = containerSize.height - borderPad2 - this.#topMargin;
    let containerWidth = containerSize.width - borderPad2 - rightMargin;

    let rectWidth = (containerWidth / dataCount) - this.#barGap;
    if (isNumber(this.#barMaxWidth) && rectWidth > this.#barMaxWidth) {
      rectWidth = this.#barMaxWidth;
    }
    rectWidth < 1 ? rectWidth = 1 : null;

    let max = listStats.max;

    let tenth = (listStats.max - listStats.min) / 10;
    let min = listStats.min - tenth;
    min < 0 ? min = 0 : null;
    min = isNumber(this.#plotOffset) ? this.#plotOffset : min;

    // all values are the same and we can adjust because plotOffset not set
    if (!isNumber(this.#plotOffset) && min === max) {
      let half = max / 2;
      max += half;        // so render the top halfway up
      min -= half;
    }

    for (let i = 0; i < dataCount; ++i) {
      let value = this.#dataList[i].value;
      value = value > max ? max : value < min ? min : value; // cap value
      let rect = this.#dataList[i].bar;
      let rectLeft = (rectWidth + this.#barGap) * i;
      let rectHeight = normalize(value, min, max) * containerHeight;
      let color = null;
      if (rectHeight < 1) {  // make sure the rectangle is visible
        rectHeight = 1;
        color = 'black';
      }

      let x = rectLeft + Math.round(borderPad2 / 2);
      let y = containerHeight + this.#topMargin - rectHeight; // flip coords
      let w = rectWidth;
      let h = rectHeight;
      setSvgRect(rect, x, y, w, h, color);
    }

    return this;
  }


  #drawLabelLines() {
    console.log('#drawLabelLines() not implemented yet');
    return this;
  }

} // class SlidingWindowPlot
