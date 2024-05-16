// @fileoverview util.js

export {
  getVersion, // the version of util.js
  isBrowser,  // true if running in a browser
  isNode,     // true if running as a node script
  prettyDate, // formats the date to be more readable
  saveFile,   // saves text to a file
  sleep,      // async sleep in seconds: await sleep(3.5) sleeps 3.5 seconds
  updateOnTheMinute, // call a function at the top of the minute
}


/*private*/ const longMonthNameList = [
  'January','February','March','April','May','June','July',
  'August','September','October','November','December'
];

/*private*/ const shortMonthNameList = [
  'Jan','Feb','Mar','Apr','May','Jun','Jul', 'Aug','Sep','Oct','Nov','Dec'
];


/*private*/ const dayNameList = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];


/*export*/ function getVersion() {
  return '2.0.1';
}

/*export*/ function isBrowser() {
  return typeof window === 'object'
}


/*export*/ function isNode() {
  return typeof process === 'object';
}

/*export*/ function prettyDate(date,
                               showDayName = true,
                               showLongMonth = true,
                               showSeconds = false) {
  let now = (typeof date === 'undefined') || date===null ? new Date() : date;

  (typeof date === 'string') ? now = new Date(date) : null;

  const DDDD = showDayName ? dayNameList[now.getDay()] + ',' : '';
  const DD = now.getDate();
  const MMMM = showLongMonth ?
        longMonthNameList[now.getMonth()] : shortMonthNameList[now.getMonth()];
  const YYYY = now.getFullYear();

  let HH = now.getHours();

  const AMPM = HH > 11 ? 'pm' : 'am';
  HH = HH > 12 ? HH - 12 : HH;
  let NN = now.getMinutes();
  NN = NN < 10 ? '0' + NN : NN;

  let SS ='';
  if (showSeconds) {
    SS = now.getSeconds();
    SS = SS < 10 ? '0' + SS : SS;
    SS = ':' + SS;
  }

  return [DDDD, DD, MMMM, YYYY, HH + ':' + NN + SS, AMPM].join(' ');
}

/*export*/ function saveFile(fileName, text) {
  const blob = new Blob([text], {type:"text/plain;charset=utf-8"});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(link.href);
  document.body.removeChild(link);
}

// can be fractions of a second: await sleep(3.5);  // sleep for 3.5 seconds
/*export*/ function sleep(seconds) {
  let ms = seconds * 1000;
  return new Promise((r) => setTimeout(r,ms));
}


// updateOnTheMinute(showPrettyDate);
/*export*/ function updateOnTheMinute(updateFn) {
  updateFn();

  // compute the time until the next update
  let theDate = new Date();
  let secondsLeft = 60 - theDate.getSeconds(); // secs until minute mark
  let ms = secondsLeft < 0 ? 0 : secondsLeft * 1000;
  setTimeout(() => {updateOnTheMinute(updateFn)}, ms);
}


// returns a flattened array of passed in arguments, including nested arrays
/*export*/ function flatten(/*arguments*/) {
//  const args = [...arguments];
//  return args.flat(Infinity);
  return [...arguments].flat(Infinity);
}
