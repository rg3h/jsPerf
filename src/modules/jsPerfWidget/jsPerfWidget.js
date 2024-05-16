// @fileoverview jsPerfWidget
import {createDiv, createButton}                  from '../html/html.js';
import {avg, prettyNum, max, min, rnd}            from '../math/math.js';
import {prettyDate, saveFile, sleep}              from '../util/util.js';
import {getMemory, supportsMemory as supportsMem} from '../jsPerf/jsPerf.js';
import {SlidingWindowPlot} from '../slidingWindowPlot/slidingWindowPlot.js';

export {JsPerfWidget};

class JsPerfWidget {
  #configObj = null;
  #dataObj   = null;
  #htmlObj   = null;
  #pauseFlag = false;
  #firstMemoryReadFlag = true;

  /*********************** static class functions *************************/
  static #NEUTRAL_COLOR  = 'rgb(180, 180, 180)';
  static #GOOD_COLOR     = 'rgb(  0, 128,   0)';
  static #BAD_COLOR      = 'rgb(240,   0,   0)';

  static getName() {
    return 'jsPerf Memory';
  }

  static getVersion() {
    return '1.1.0';
  }

  /************************ public functions *****************************/
  // constructor is called: let jsPerfWidget = new JsPerfWidget(paramsIn);
  constructor(configInObj) {
    return this.#init(configInObj);
  }

  getContainer() {
    return this.#htmlObj.container;
  }

  supportsMemory() {
    return supportsMem();
  }


  /*********************** private functions ****************************/
  #init(configInObj) {
    this.#pauseFlag = false;

    this.#configObj = {
      parent:      configInObj.parent      ? configInObj.parent      : null,
      updateFreq:  configInObj.updateFreq  ? configInObj.updateFreq  : 1,
      maxBarWidth: configInObj.maxBarWidth ? configInObj.maxBarWidth : 20,
      sampleSize:  configInObj.sampleSize  ? configInObj.sampleSize  : 50,
    };

    // if the browser does not support memory monitoring, return null
    if (supportsMem()) {
      this.#initDataObj();
      this.#initHtmlObj();
      this.#updatePeriodically();
    }

    return this;
  }

  #initDataObj() {
    if (!this.#dataObj) {
      this.#dataObj = {
        memoryList:  [],           // list of memory values
        memory:      0,            // current memory usage value
        memoryDiff:  0,            // difference in memory from last update
        startTime:   0,            // when the first memory read happens
      };
    } else {
      this.#dataObj.memoryList  = [];
      this.#dataObj.memoryDiff  = 0;
      this.#dataObj.startTime   = 0;
    }

    this.#firstMemoryReadFlag = true;

    return this;
  }

  #initHtmlObj() {
    let config = this.#configObj;  // alias for readability
    if (!this.#htmlObj) {
      this.#htmlObj = {
        container:      null,
        dateEle:        null,
        updateCountEle: null,
        updateFreqEle:  null,
        memoryEle:      null,
        memoryDiffEle:  null,
        minEle:         null,
        maxEle:         null,
        avgEle:         null,
        pauseButtonEle: null,
        resetButtonEle: null,
        saveButtonEle:  null,
      };
      this.#htmlObj.container=createDiv(config.parent,'jsPerfWidgetContainer');
      this.#createTopRow();
      this.#createMiddleRow();
      this.#createBottomRow();
    } else {
      this.#htmlObj.memoryEle.innerHTML       = 'data reset';
      this.#htmlObj.memoryEle.classList.add('jsPerfWidgetMemorySmallerFont');
      this.#htmlObj.memoryDiffEle.innerHTML   = '';
      this.#htmlObj.memoryDiffEle.style.color = JsPerfWidget.#NEUTRAL_COLOR;
      this.#htmlObj.minEle.innerHTML          = '';
      this.#htmlObj.maxEle.innerHTML          = '';
      this.#htmlObj.avgEle.innerHTML          = '';
      this.#htmlObj.updateCountEle.innerHTML  = '';
      this.#htmlObj.updateFreqEle.innerHTML   = '';
      this.#htmlObj.dateEle.innerHTML         = '';

      this.#initPlot();
    }

    // hide the labels until there is data
    let labelList =
        document.getElementsByClassName('jsPerfWidgetMemoryStatLabel');
    for (let i = 0, count = labelList.length; i < count; ++i) {
      labelList[i].style.visibility = 'hidden';
    }

    return this;
  }

  #createTopRow() {
    let html = this.#htmlObj;  // alias for readability

    let row = createDiv(html.container, 'jsPerfWidgetTop');

    let left = createDiv(row, 'jsPerfWidgetTopLeft');
    createDiv(left, 'jsPerfWidgetTitle', JsPerfWidget.getName());
    createDiv(left, 'jsPerfWidgetVersion', 'v'+JsPerfWidget.getVersion());

    let right = createDiv(row, 'jsPerfWidgetTopRight');
    html.memoryEle = createDiv(right, 'jsPerfWidgetMemory');
    html.memoryEle.textContent = 'warming up...';
    html.memoryEle.classList.add('jsPerfWidgetMemoryTextFont');

    let closeButton = createDiv(right, 'jsPerfWidgetCloseButton', 'X');
    closeButton.addEventListener('pointerup',
                                 this.#handleCloseButton.bind(this));

    return this;
  }

  #createMiddleRow() {
    let html = this.#htmlObj;  // alias for readability

    let row = createDiv(html.container, 'jsPerfWidgetMiddle');

    let left = createDiv(row, 'jsPerfWidgetMiddleLeft');
    this.#initPlot(left);

    let right = createDiv(row, 'jsPerfWidgetMiddleRight');
    this.#createStatsHtml(right);

    return this;
  }

  #initPlot(parentWhenCreating) {
    const slidingWindowPlotConfig = {
      parent: parentWhenCreating || this.#htmlObj.plot.getParent(),
      className: 'jsPerfWidgetPlot',
      dataWindowSize: this.#configObj.sampleSize,
      plotMin: 0,
      barMaxWidth: this.#configObj.maxBarWidth,
      barGap: 2,
      colorList: JsPerfWidget.#NEUTRAL_COLOR,
      showMinMaxAvgFlag: false,
    };

    if (!this.#htmlObj.plot) {
      this.#htmlObj.plot = new SlidingWindowPlot(slidingWindowPlotConfig);
    } else {
      this.#htmlObj.plot.reset(slidingWindowPlotConfig);
    }
    // this.#htmlObj.plot.setTopMargin(0);

    return this;
  }

  #createStatsHtml(parent) {
    let html = this.#htmlObj;  // alias for readability
    let ele;

    html.memoryDiffEle = createDiv(parent, 'jsPerfWidgetMemoryDiff');

    ele = createDiv(parent, 'jsPerfWidgetMemoryStat');
    createDiv(ele, 'jsPerfWidgetMemoryStatLabel', 'max:');
    html.maxEle = createDiv(ele, 'jsPerfWidgetMemoryMax');

    ele = createDiv(parent, 'jsPerfWidgetMemoryStat');
    createDiv(ele, 'jsPerfWidgetMemoryStatLabel', 'min:');
    html.minEle = createDiv(ele, 'jsPerfWidgetMemoryMin');

    ele = createDiv(parent, 'jsPerfWidgetMemoryStat');
    createDiv(ele, 'jsPerfWidgetMemoryStatLabel', 'avg:');
    html.avgEle = createDiv(ele, 'jsPerfWidgetMemoryAvg');

    html.updateCountEle = createDiv(parent, 'jsPerfWidgetUpdateCount');
    html.updateFreqEle =createDiv(parent, 'jsPerfWidgetUpdateFreq');
    html.dateEle = createDiv(parent, 'jsPerfWidgetDate');

    return this;
  }

  #createBottomRow() {
    let html = this.#htmlObj;  // alias for readability

    let row = createDiv(html.container, 'jsPerfWidgetButtonTray');
    let left = createDiv(row, 'jsPerfWidgetPlayPauseTray');
    html.pauseButtonEle = createButton(left, 'button', 'pause');
    html.pauseButtonEle.classList.add('jsPerfWidgetPauseButton');
    html.pauseButtonEle.addEventListener('pointerup',
                                         this.#handlePauseButton.bind(this));

    html.resetButtonEle = createButton(left, 'button', 'reset');
    html.resetButtonEle.classList.add('jsPerfWidgetResetButton');
    html.resetButtonEle.addEventListener('pointerup',
                                         this.#handleResetButton.bind(this));

    let right = createDiv(row, 'jsPerfWidgetSaveTray');
    html.saveButtonEle = createButton(right, 'button', 'save');
    html.saveButtonEle.classList.add('jsPerfWidgetSaveButton');
    html.saveButtonEle.addEventListener('pointerup',
                                         this.#handleSaveButton.bind(this));

    return this;
  }


  async #updatePeriodically() {
    if (this.#pauseFlag === true) {  // paused so don't update
      return this;
    }

    // throw away the first read
    if (this.#firstMemoryReadFlag) {
      this.#firstMemoryReadFlag = false;
      await getMemory();
    } else {
      await this.#updateDataObj();
      this.#updateHtmlObj();
    }

    let updateTimeInMs = this.#configObj.updateFreq * 1000;
    setTimeout(() => {this.#updatePeriodically()}, updateTimeInMs);
  }

  async #updateDataObj() {
    let currentMemory = await getMemory();

    let memoryListLength = this.#dataObj.memoryList.length;

    // if at the beginning of the list, just use currentMemory as lastMemory
    let lastMemory = memoryListLength < 1 ? currentMemory :
        this.#dataObj.memoryList[memoryListLength - 1];

    this.#dataObj.memoryList.push(currentMemory);
    this.#dataObj.memoryDiff = currentMemory - lastMemory;

    if (this.#dataObj.startTime < 1) {
      this.#dataObj.startTime = new Date();
    }

    return this;
  }

  #updateHtmlObj() {
    //aliases to make it more readable
    let data = this.#dataObj;
    let html = this.#htmlObj;

    let lastIndex = data.memoryList.length - 1;
    if (lastIndex < 1) {
      return;
    }

    let currentMemory = data.memoryList[lastIndex];

    // show the labels now that there is data
    let labelList =
        document.getElementsByClassName('jsPerfWidgetMemoryStatLabel');
    for (let i = 0, count = labelList.length; i < count; ++i) {
      labelList[i].style.visibility = 'visible';
    }

    let color = data.memoryDiff < 0 ? JsPerfWidget.#GOOD_COLOR :
        data.memoryDiff === 0 ? JsPerfWidget.#NEUTRAL_COLOR :
        JsPerfWidget.#BAD_COLOR;

    let plusSym = data.memoryDiff <= 0 ? '' : '+';
    this.#htmlObj.plot.addValue(currentMemory, color);

    html.memoryEle.classList.remove('jsPerfWidgetMemoryTextFont');

    html.memoryEle.textContent = prettyNum(currentMemory, 0);

    currentMemory > 99_999_999 ?
      html.memoryEle.classList.add('jsPerfWidgetMemorySmallerFont') :
      html.memoryEle.classList.remove('jsPerfWidgetMemorySmallerFont');

    html.memoryDiffEle.textContent = plusSym + prettyNum(data.memoryDiff, 0);
    html.memoryDiffEle.style.color = color;

    html.minEle.textContent = prettyNum(min(this.#dataObj.memoryList), 0);
    html.maxEle.textContent = prettyNum(max(this.#dataObj.memoryList), 0);
    html.avgEle.textContent = prettyNum(avg(this.#dataObj.memoryList), 0);

    let updateCount = data.memoryList.length;
    html.updateCountEle.textContent = 'updates: ' + prettyNum(updateCount);
    this.#htmlObj.updateFreqEle.textContent =
      '(one every ' + this.#configObj.updateFreq + 's)';
    html.dateEle.textContent = prettyDate(null, false, false, true);

    return this;
  }

  #handleCloseButton(e) {
    // stop computations
    this.#pauseFlag = true;

    // remove the HTML from the DOM
    let container = this.#htmlObj.container;
    let parentNode = container.parentNode;
    parentNode.removeChild(container);

    return this;
  }

  #handlePauseButton(e) {
    this.#pauseFlag = !this.#pauseFlag;

    if (this.#pauseFlag) {
      this.#htmlObj.pauseButtonEle.textContent = 'play';
    } else {
      this.#htmlObj.pauseButtonEle.textContent = 'pause';

      this.#updatePeriodically();
    }
  }

  #handleResetButton(e) {
    this.#initDataObj();
    this.#initHtmlObj();

    // don't update dataObj since might be paused
    // this.#updateDataObj();
    // this.#updateHtmlObj();

    return this;
  }

  #handleSaveButton(e) {
    let now = new Date();
    let YYYY = now.getFullYear();

    let MM = now.getMonth() + 1;
    MM < 10 ? MM = '0' + MM : null;

    let DD = now.getDate();
    DD < 10 ? DD = '0' + DD : null;

    let HH = now.getHours();
    HH < 10 ? HH = '0' + HH : null;

    let NN = now.getMinutes();
    NN < 10 ? NN = '0' + NN : null;

    let SS = now.getSeconds();
    SS < 10 ? SS = '0' + SS : null;

    let fileName = 'jsPerfResults.' +
        YYYY + '.' + MM + '.' + DD +  '.' + HH + '.' + NN + '.' + SS +
        '.json';

    let data = {
      title: JsPerfWidget.getName() + ' Widget',
      version: JsPerfWidget.getVersion(),
      url: window.location.href,
      date: now.toString(),
      data: this.#dataObj.memoryList,
    };
    let dataStr = JSON.stringify(data); // , null, ' ');

    alert('saving data into your Downloads folder as ' + fileName);
    saveFile(fileName, dataStr);

    return this;
  }

} // class JsPerfWidget
