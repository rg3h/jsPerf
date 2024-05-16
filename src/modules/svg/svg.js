// @fileoverview svg js
// import {isNumber} from '../math/math.js';

export {
  getSvgNS,
  getSvgVersion,

  getSvgAttribute,
  setSvgAttribute,

  setSvgPos,
  getSvgPos,
  setSvgColor,
  setSvgSize,

  createSvgElement,
  createSvgContainer,
  createSvgCircle,
  createSvgEllipse,
  createSvgGroup,
  createSvgLine,    /* a polyLine */
  createSvgPolygon,
  createSvgPath,
  createSvgRect,
  createSvgText,
  setSvgCircle,
  setSvgRect,
  setSvgText,
};

/*private*/ const SVG_NS = 'http://www.w3.org/2000/svg';

// could get from math.js but declaring one funtion removes a dependency
/*private*/ function isNumber(val) {
  return typeof val === 'number' && isFinite(val);
}


/*export*/ function getSvgVersion() {
  return '1.0.1';
}

/*export */ function getSvgNS() {
  return SVG_NS;
}

/*export*/ function setSvgAttribute(svgEle, attName, attVal) {
  svgEle.setAttributeNS(null, attName, attVal);
  return svgEle;
}

/*export*/ function getSvgAttribute(svgEle, attName) {
  return svgEle.getAttributeNS(null, attName);
}

/*export*/ function setSvgPos(svgEle, x, y) {
  switch(svgEle.nodeName) {
  case 'circle':
  case 'ellipse':
    isNumber(x)? setSvgAttribute(svgEle, 'cx', x) : null;
    isNumber(y) ? setSvgAttribute(svgEle, 'cy', y) : null;
    // isNumber(x) ? svgEle.style.cx = x : null;
    // isNumber(y) ? svgEle.style.cy = y : null;
    break;

  default:
    isNumber(x) ? setSvgAttribute(svgEle, 'x', x) : null;
    isNumber(y) ? setSvgAttribute(svgEle, 'y', y) : null;
    break;
  }

  return svgEle;
}

/*export*/ function getSvgPos(svgEle) {
  let x = null, y = null;

  switch(svgEle.nodeName) {
  case 'circle':
  case 'ellipse':
    x = getSvgAttribute(svgEle, 'cx');
    y = getSvgAttribute(svgEle, 'cy');
    break;

  default:
    x = getSvgAttribute(svgEle, 'x');
    y = getSvgAttribute(svgEle, 'y');
    console.log('DEFAULT', svgEle.value, x, y);
    break;
  }

  return {x, y};
}

/*export*/ function setSvgColor(svgEle, color) {
  let colorType = typeof color;

  if (colorType === 'undefined' || color === null) {
    return svgEle;
  }

  if (colorType !== 'string') {
    console.error('error: called setSvgColor() with invalid color', color);
    return svgEle;
  }

  switch(svgEle.nodeName) {
  case 'polyline':
    setSvgAttribute(svgEle, 'stroke', color);
    break;

  default:
    setSvgAttribute(svgEle, 'fill', color);
    break;
  }

  return svgEle;
}

/*export*/ function setSvgSize(svgEle, w, h) {
  switch(svgEle.nodeName) {
  case 'ellipse':
    isNumber(w) ? setSvgAttribute(svgEle, 'rx', w) : null;
    isNumber(h) ? setSvgAttribute(svgEle, 'ry', h) : null;
    break;

  case 'circle':
    isNumber(w) ? setSvgAttribute(svgEle, 'r', w) : null;
    break;

  case 'text':
    w = isNumber(w) ? w + 'px' : w;
    typeof w === 'string' ? setSvgAttribute(svgEle, 'font-size', w) : null;
    break;

  default:
    isNumber(w) ? setSvgAttribute(svgEle, 'width', w) : null;
    isNumber(h) ? setSvgAttribute(svgEle, 'height', h) : null;
    break;
  }

  return svgEle;
}

/*export*/ function createSvgElement(eleName) {
  return document.createElementNS(SVG_NS, eleName);
}

/*export*/ function createSvgContainer(parent, className) {
  let svgEle = createSvgElement('svg');
  svgEle.setAttribute('xmlns', SVG_NS);
  setSvgSize(svgEle, '100%', '100%');
  className ? svgEle.classList.add(className) : null;
  parent ? parent.appendChild(svgEle) : null;

  return svgEle;
}

/*export*/ function createSvgCircle(parentSvg, className, x, y, r, color) {
  let svgEle = createSvgElement('circle');
  isNumber(x) && isNumber(y) ? setSvgPos(svgEle, x, y) : null;
  isNumber(r) ? setSvgSize(svgEle, r) : null;
  typeof color === 'string' ? setSvgColor(svgEle, color) : null;
  className ? svgEle.classList.add(className) : null;
  parentSvg ? parentSvg.appendChild(svgEle) : null;

  return svgEle;
}


/*export*/ function setSvgCircle(svgEle, x, y, r, color) {
  setSvgPos(svgEle, x, y);
  setSvgSize(svgEle, r);
  setSvgColor(svgEle, color);

  return svgEle;
}


/*export*/ function createSvgEllipse(parentSvg, className, x, y, rx, ry, color){
  let svgEle = createSvgElement('ellipse');
  isNumber(x) && isNumber(y) ? setSvgPos(svgEle, x, y) : null;
  isNumber(rx) && isNumber(ry) ? setSvgSize(svgEle, rx, ry) : null;
  typeof color === 'string' ? setSvgColor(svgEle, color) : null;
  className ? svgEle.classList.add(className) : null;
  parentSvg ? parentSvg.appendChild(svgEle) : null;

  return svgEle;
}

/*export*/ function createSvgGroup(parentSvg) {
  let svgEle = createSvgElement('g');
  return svgEle;
}

// consider using a path Mx0 y0 Lx1 y1 Lx2 y2 ...
// [[20,20],[40,25], [60,40], [80,120] [120,140] [200,180]];
/*export*/ function createSvgLine(parentSvg, className, pointList, color) {
  let svgEle = createSvgElement('polyline');
  setSvgAttribute(svgEle, 'stroke-width', '1px');
  setSvgAttribute(svgEle, 'fill', 'none');
  // typeof color === 'string' ? setSvgColor(svgEle, color) : null;
  setSvgColor(svgEle, typeof color === 'string' ? color : 'black');

  if (pointList) {
    for (let i = 0, count = pointList.length; i < count; ++i) {
      let point = parentSvg.createSVGPoint();
      point.x = pointList[i][0];
      point.y = pointList[i][1];
      svgEle.points.appendItem(point);
    }
  }

  className ? svgEle.classList.add(className) : null;
  parentSvg ? parentSvg.appendChild(svgEle) : null;

  return svgEle;
}

// consider using a path Mx0 y0 Lx1 y1 Lx2 y2 ...
// [[20,20],[40,25], [60,40], [80,120] [120,140] [200,180]];
/*export*/ function createSvgPolygon(parentSvg, className, pointList, color) {
  let svgEle = createSvgElement('polygon');
  typeof color === 'string' ? setSvgColor(svgEle, color) : null;

  if (pointList) {
    for (let i = 0, count = pointList.length; i < count; ++i) {
      let point = parentSvg.createSVGPoint();
      point.x = pointList[i][0];
      point.y = pointList[i][1];
      svgEle.points.appendItem(point);
    }
  }

  className ? svgEle.classList.add(className) : null;
  parentSvg ? parentSvg.appendChild(svgEle) : null;

  return svgEle;
}

/*export*/ function createSvgPath(parentSvg, className, pathStr, color) {
  let svgEle = createSvgElement('path');
  setSvgAttribute(svgEle, 'stroke-width', '1px');
  typeof pathStr === 'string' ? setSvgAttribute(svgEle, 'd', pathStr) : null;
  typeof color === 'string' ? setSvgColor(svgEle, color) : null;
  className ? svgEle.classList.add(className) : null;
  parentSvg ? parentSvg.appendChild(svgEle) : null;

  return svgEle;
}

// rx, ry for radius rounding the corners
/*export*/ function createSvgRect(parentSvg, className, x, y, w, h, color) {
  let svgEle = createSvgElement('rect');
  isNumber(x) && isNumber(y) ? setSvgPos(svgEle, x, y) : null;
  isNumber(h) ? setSvgAttribute(svgEle, 'height', h) : null;
  isNumber(w) ? setSvgAttribute(svgEle, 'width', w) : null;

  className ? svgEle.classList.add(className) : null;
  setSvgColor(svgEle, color);
  parentSvg ? parentSvg.appendChild(svgEle) : null;

  return svgEle;
}

/*export*/ function setSvgRect(svgEle, x, y, w, h, color) {
  setSvgPos(svgEle, x, y);
  setSvgSize(svgEle, w, h);
  setSvgColor(svgEle, color);

  return svgEle;
}


// note: you can set text-anchor="middle"
/*export*/ function createSvgText(parentSvg, className, text, color) {
  let svgEle = createSvgElement('text');
  typeof color === 'string' ? setSvgColor(svgEle, color) : null;
  className ? svgEle.classList.add(className) : null;
  svgEle.textContent = text;
  parentSvg ? parentSvg.appendChild(svgEle) : null;

  return svgEle;
}

/*export*/function setSvgText(svgEle, text, color) {
  if (!svgEle || svgEle.nodeName != 'text') {
    console.error('error: called setSvgText() on invalid element',
                  svgEle || svgEle.NodName);
    return svgEle;
  }

  typeof text === 'string' ? svgEle.textContent = text: null;
  typeof color === 'string' ? setSvgColor(svgEle, color) : null;

  return svgEle;
}
