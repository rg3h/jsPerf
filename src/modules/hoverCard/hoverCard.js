// @fileoverview hoverCard.js
import {getStyle} from '../html/html.js';
import {
  createSvgRect,
  createSvgText,
  getSvgAttribute,
  setSvgAttribute,
  setSvgPos,
  setSvgRect,
  setSvgText,
} from '../svg/svg.js';


export class HoverCard {
  #parent     = null;    // parent container
  #hoverRect  = null;    // background card for the hoverCard
  #hoverText  = null;    // text on the hoverCard
  #rectHeight = null;    // how tall to make the hoverCard rectangle
  #rectWidth  = null;    // how wide to make the hoverCard rectangle
  #padding    = null;

  /************************** Class functions *************************/
  // let version = HoverCard.getVersion();  // static class function
  static getVersion() {
    return '1.0.1';
  }

  /************************** public functions *************************/
  constructor(parent, opt_eleOrList) {
    return this.#init(parent, opt_eleOrList); // call init in case go async
  }

  // can be a single ele or a list of ele
  // handleHoverFn returns text to show in the hoverCard
  addEle(eleOrList, handleHoverFn) {
    if (typeof eleOrList === 'undefined' || eleOrList === null) {
      return this;
    }

    // make sure eleList is an array
    let eleList = Array.isArray(eleOrList) ? eleOrList : [eleOrList];

    for (let i = 0; i < eleList.length; ++i) {
      let ele = eleList[i];
      // ele instanceof HTMLElement || ele instanceof SVGElement ?
      // this.#eleList.push(ele) : null;

      ele.handleHoverFn = handleHoverFn;
      // dataItem.bar.dataItem = dataItem;  // so event handlers can ref it
      ele.addEventListener('pointerenter', this.#handlePointerEnter.bind(this));
      ele.addEventListener('pointerleave', this.#handlePointerLeave.bind(this));
      ele.addEventListener('pointermove',  this.#handlePointerMove.bind(this));
    }

    return this;
  }

  removeEle(eleOrList) {
    // find eleOrList in the eleList and splice it out, remove handlers
    // make sure eleList is an array
    let eleList = Array.isArray(eleOrList) ? eleOrList : [eleOrList];

    for (let i = 0; i < eleList.length; ++i) {
      let ele = eleList[i];
      let removeEventLister = ele.removeEventListener;
      removeEventListener('pointerenter', this.#handlePointerEnter.bind(this));
      removeEventListener('pointerleave', this.#handlePointerLeave.bind(this));
      removeEventListener('pointermove',  this.#handlePointerMove.bind(this));
    }

    return this;
  }

  /************************** private functions *************************/
  /*async*/ #init(parent, opt_eleOrList) {
    this.#padding = 3;
    this.#parent = parent;
    this.#createHoverCardSvg();
    opt_eleOrList ? this.addEle(opt_eleOrList) : null;
    return this;
  }

  #createHoverCardSvg() {
    let bgColor = 'white';
    let color = 'black';
    this.#hoverRect = createSvgRect(null,'hoverCardRect',10,10,50,20,bgColor);

    this.#hoverRect.style.filter = 'drop-shadow(3px 3px 2px rgba(0,0,0,0.5))';
    setSvgAttribute(this.#hoverRect, 'stroke-width', 1);
    setSvgAttribute(this.#hoverRect, 'stroke', 'rgb(150, 150, 150)');

    this.#hoverText = createSvgText(null, 'hoverCardText', 'hc', color);
    setSvgAttribute(this.#hoverText, 'font-size', '12px');

    return this;
  }

  #handlePointerEnter(e) {
    let ele = e.target;
    let text = ele.handleHoverFn(e);

    // figure out the width for the hover background rectangle
    let tempEle = createSvgText(this.#parent, 'hoverCardText', text, 'black');
    setSvgAttribute(tempEle, 'font-size', '12px');
    let tempEleSize = tempEle.getBoundingClientRect();
    this.#rectWidth  = tempEleSize.width + (2 * this.#padding);
    this.#rectHeight = tempEleSize.height + this.#padding;
    this.#parent.removeChild(tempEle);

    setSvgRect(this.#hoverRect, 0, 0, this.#rectWidth, this.#rectHeight);
    setSvgText(this.#hoverText, text);

    this.#parent.appendChild(this.#hoverRect);
    this.#parent.appendChild(this.#hoverText);

    this.#handlePointerMove(e);  // so the hoverCard is placed correctly
  }

  #handlePointerLeave(e) {
    this.#parent.removeChild(this.#hoverRect);
    this.#parent.removeChild(this.#hoverText);
  }

  #handlePointerMove(e) {
    // short circuit if not showing hoverCard
    if (!this.#hoverRect.parentNode) {
      return;
    }

    let containerSize = this.#parent.getBoundingClientRect();
    let containerHeight = containerSize.height;
    let containerWidth = containerSize.width;

    let x = e.clientX - containerSize.x - (this.#rectWidth/2);
    let y = e.clientY - containerSize.y;

    // handle if hoverContainer gets near left or right edge
    x + this.#rectWidth + 5 > containerWidth ?
      x = containerWidth - this.#rectWidth - 5 : null;
    x < 5 ? x = 5 : null;

    let topOffset = 15;
    let textNudge = this.#rectHeight / 5;
    setSvgPos(this.#hoverRect,
              x - this.#padding, y - this.#rectHeight - topOffset);
    setSvgPos(this.#hoverText, x, y - this.#padding - topOffset);
  }

} // class HoverCard
