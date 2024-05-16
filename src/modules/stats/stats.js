// @fileoverview stats.js

export class Stats {
  #overallMin      = null;
  #overallMax      = null;
  #overallAvg      = null;
  #overallCount    = null;


  /************************** Class functions *************************/
  // let version = Stats.getVersion();  // static class function
  static getVersion() {
    return '1.0.1';
  }

  // return min, max, avg, count for the list
  static getListStats(list) {
    let max = Number.NEGATIVE_INFINITY;
    let min = Number.POSITIVE_INFINITY;
    let avg = null;
    let count = 0;

    let total = 0;
    if (Array.isArray(list)) {
      for (let i = 0; i < list.length; ++i) {
        if (Stats.isNumber(list[i])) {
          count++;
          list[i] > max ? max = list[i] : null;
          list[i] < min ? min = list[i] : null;
          total += list[i];
        }
      }
      avg = count > 0 ? total / count : null;
    }

    return {
      avg: avg,
      count: count,
      max: max,
      min: min,
    }
  }

  static getMax(list){
    let max = Number.NEGATIVE_INFINITY;

    if (Array.isArray(list)) {
      for (let i = 0; i < list.length; ++i) {
        if (Stats.isNumber(list[i])) {
          list[i] > max ? max = list[i] : null;
        }
      }
    }
    return max;
  }

  static getMin(list){
    let min = Number.POSITIVE_INFINITY;

    if (Array.isArray(list)) {
      for (let i = 0; i < list.length; ++i) {
        if (Stats.isNumber(list[i])) {
          list[i] < min ? min = list[i] : null;
        }
      }
    }
    return min;
  }

  static getAvg(list){
    let avg = null;
    if (Array.isArray(list)) {
      avg = null;
      let total = 0;
      let count = 0;
      for (let i = 0; i < list.length; ++i) {
        if (Stats.isNumber(list[i])) {
          total += list[i];
          count++;
        }
      }
      avg = count > 0 ? total / count : null;
    }
    return avg;
  }

  // returns count of numbers in the list
  static getCount(list) {
    let count = 0;
    if (Array.isArray(list)) {
      for (let i = 0; i < list.length; ++i) {
        if (Stats.isNumber(list[i])) {
          count++;
        }
      }
    }
    return count;
  }

  static /*private*/ isNumber(val) {
    return typeof val === 'number' && isFinite(val);
  }

  /************************** public functions *************************/
  constructor(opt_listOfValues) {
    return this.#init(opt_listOfValues); // call init in case go async
  }

  getOverallStats() {
    return {
      avg:   this.#overallAvg,
      count: this.#overallCount,
      max:   this.#overallMax,
      min:   this.#overallMin,
    }
  }

  getOverallAvg() {
    return this.#overallAvg;
  }

  getOverallCount() {
    return this.#overallCount;
  }

  getOverallMax() {
    return this.#overallMax;
  }

  getOverallMin() {
    return this.#overallMin;
  }

  resetOverallStats() {
    this.#overallAvg     = null;
    this.#overallCount   = 0;
    this.#overallMax     = Number.NEGATIVE_INFINITY;
    this.#overallMin     = Number.POSITIVE_INFINITY;
  }

  addToOverallStats(listOrValue) {  // can be a single value or a list
    if (!listOrValue) { // undefined or null
      return this;
    }

    // turn it into a list
    let list = Array.isArray(listOrValue) ? listOrValue : [listOrValue];

    for (let i = 0; i < list.length; ++i) {
      let value = list[i];
      if (Stats.isNumber(value)) {
        let oldSum = this.#overallAvg * this.#overallCount;

        this.#overallCount++;
        value < this.#overallMin ? this.#overallMin = value : null;
        value > this.#overallMax ? this.#overallMax = value : null;
        this.#overallAvg = (oldSum + value) / this.#overallCount;
      }
    }
    return this;
  }


  /************************** private functions *************************/
  /*async*/ #init(opt_listOfValues) {
    this.resetOverallStats();
    opt_listOfValues ? this.addToOverallStats(opt_listOfValues) : null;
    return this;
  }

} // class Stats
