// @fileoverview math.js

export {
  avg,
  flatten,
  getCount,
  getVersion,
  isNumber,
  max,
  min,
  normalize,
  prettyNum,
  rnd,
  strToNum,
  sum,
}


/*export*/ function getVersion() {
  return '1.1.0';
}


// takes an array, a sequence, or a mix, adds up numerical and gets avg
// if there are no values, returns 0
// avg([1,2,-3,[42, 'frog']], [6,7], 100) -> 22.142857142857142
/* export */ function avg(/*arguments*/) {
  let a = flatten(...arguments);
  let sum = 0;
  let count = 0;
  for (let i = 0; i < a.length; ++i) {
    if (isNumber(a[i])) {
      sum += a[i];
      count++;
    }
  }

  return count < 1 ? 0 : sum/count;
}


// returns a flattened array of passed in arguments, including nested arrays
// flatten([1,2,-3,[42,5]], [6,7], 42) -> [1,2,-3,4,5,6,7,42]
/*export*/ function flatten(/*arguments*/) {
  return [...arguments].flat(Infinity);
}


// flattens all args and counts them: getCount([1,2,-3,[42,5]], [6,7], 100) -> 8
/*export*/ function getCount(/*arguments*/) {
  return flatten(...arguments).length;
}


/*export*/ function isNumber(val) {
  // return Number(val)=== val;
  return typeof val === 'number' && isFinite(val);
}


// flattens all args and gets the max getMax([1,2,-3,[42,5]], [6,7], 100) -> 100
/*export*/ function max(/*arguments*/) {
  return Math.max(...flatten(...arguments));
}


// flattens all args and gets the min getMin([1,2,-3,[42,5]], [6,7], 100) -> -3
/*export*/ function min(/*arguments*/) {
  return Math.min(...flatten(...arguments));
}


// returns a number between 0 (val===min) and 1 (val===max)
/*export*/ function normalize(value, min, max) {
  return (value - min) / (max - min);
}


// set opt_fixed for the fixed number of decimal places
/*export*/ function prettyNum (num, opt_fixed=-1) {
  if (typeof opt_fixed === 'number' && opt_fixed > -1 && opt_fixed < 21) {
    return new Intl.NumberFormat(
      undefined,
      {maximumFractionDigits: opt_fixed,
       minimumFractionDigits: opt_fixed}).format(num);
  } else {
    return new Intl.NumberFormat(
      undefined, {maximumFractionDigits: 20}).format(num);
  }
}


/*export*/ function rnd(low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low);
}


// strip the string of all non-numerics except '.' and convert it to a number
function strToNum(numAsStr) {
  //  return 1 * numAsStr.replace(/[A-Za-z!@#$%^&*(),]/g, '');
  return 1 * numAsStr.replace(/[^0-9.]/g, "");
}


// flattens all args and gets sum getSum([1,2,-3,[42,'frog']],[6,7],100) -> 155
/*export*/ function sum(/*arguments*/) {
  let a = flatten(...arguments);
  let sum = 0;
  for (let i = 0; i < a.length; ++i) {
    isNumber(a[i]) ? sum += a[i] : null;
  }
  return sum;
}
