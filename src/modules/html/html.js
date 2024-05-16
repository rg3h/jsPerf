// @fileoverview html.js
export {
  createBr,
  createButton,
  createDiv,
  createEle,
  getEleByClass,
  getStyle,
  getRgbStr,
  getVersion,
  removeEle,
}

/*export*/ function getVersion() {
  return '1.0.1';
}

/*export*/ function createBr(parent, className) {
  return createEle(parent, 'br', className);
}

/*export*/ function createButton(parent, className, opt_text, opt_fn) {
  let ele = createEle(parent, 'button', className, opt_text);
  ele.addEventListener('pointerup', opt_fn);
  return ele;
}

/*export*/ function createDiv(parent, className, opt_text) {
  return createEle(parent, 'div', className, opt_text);
}

/*export*/ function createEle(parent, eleName, className, opt_text) {
  let ele = document.createElement(eleName);
  className && className.length > 0 ? ele.classList.add(className):null;
//  typeof opt_text !== 'undefined' ? ele.innerText = opt_text : null;
  typeof opt_text !== 'undefined' ? ele.textContent = opt_text : null;
  parent ? parent.appendChild(ele) : null;
  return ele;
}

// returns the first element by classname or null
// let ele = getEleByClass('middleContainer');
/*export*/ function getEleByClass(className) {
  let list = document.getElementsByClassName(className);
  if (list.length < 1) {
    return null;
  }
  return list[0];
}


// let border = getStyle(ele, 'border');
/*export*/ function getStyle(ele, styleStr) {
  return window.getComputedStyle(ele, null).getPropertyValue(styleStr);
}

/*export*/ function getRgbStr(r, g, b) {
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}

/*export*/ function removeEle(ele) {
  if (typeof ele === 'undefined' || ele === null || !ele.parentNode) {
    return null;
  }

  ele.parentNode.removeChild(ele);
  return ele;
}
