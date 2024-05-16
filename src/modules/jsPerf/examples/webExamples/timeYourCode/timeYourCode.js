//@fileoverview: timeYourCode.js
import {prettyDate, sleep}          from '../../../../util/util.js';
import {prettyNum, rnd, strToNum}   from '../../../../math/math.js';
import {getTime as tycGetTime,
        startTime as tycStartTime } from '../../../../jsPerf/jsPerf.js';

window.addEventListener('load', main);

// these are global so we don't fetch them on each key event
let codeTextBoxEleList,
    loopCountEle,
    loopIncrementEle,
    planEle,
    runButtonEle,
    showJsonCsvButtonEle,
    trialCountEle,
    warmUpCountEle;

function main() {
  hookUpHtmlElements();
  // now wait for the person to enter some code and click the run button
}

function hookUpHtmlElements() {
  // load up all of the codeTextBoxes -- keep them in an array in case
  // we later decide to have a "+" button to allow them to compare even more
  codeTextBoxEleList = document.getElementsByClassName('codeTextBox');
  for (let i = 0; i < codeTextBoxEleList.length; ++i) {
    codeTextBoxEleList[i].addEventListener('keyup', handleCodeTextBoxChange);
  }

  // all of the input values update the plan html describing what will run
  // during the trials

  warmUpCountEle = document.getElementById('warmUpCount');
  warmUpCountEle.addEventListener('keyup', updatePlan);

  loopCountEle = document.getElementById('loopCount');
  loopCountEle.addEventListener('keyup', updatePlan);

  loopIncrementEle = document.getElementById('loopIncrement');
  loopIncrementEle.addEventListener('keyup', updatePlan);

  trialCountEle = document.getElementById('trialCount');
  trialCountEle.addEventListener('keyup', updatePlan);

  planEle = document.getElementById('plan');

  runButtonEle = document.getElementById('runExperimentButton');
  runButtonEle.addEventListener('pointerup', handleRunExperimentButton);

  showJsonCsvButtonEle = document.getElementById('showJsonCsvButton');
  showJsonCsvButtonEle.addEventListener('pointerup', handleShowJsonCsvButton);
  showJsonCsvButtonEle.isShowing = false;

  updatePlan(); // make sure the plan is up-to-date with the default inputs
}

function handleCodeTextBoxChange() {
  clearErrorSection();
  let allBlanks = true;  // are all of the text boxes empty?

  for (let i = 0; i < codeTextBoxEleList.length; ++i) {
    if (codeTextBoxEleList[i].value.trim().length > 0) {
      allBlanks = false;
      break;
    }
  }

  if (allBlanks) {
    disableRunExperimentButton();
    planEle.classList.add('buttonDisabled');
  } else {
    enableRunExperimentButton();
    planEle.classList.remove('buttonDisabled');
  }
}

function disableRunExperimentButton() {
    runButtonEle.disabled = true;
    runButtonEle.classList.add('buttonDisabled');
}

function enableRunExperimentButton() {
    runButtonEle.disabled = false;
    runButtonEle.classList.remove('buttonDisabled');
}

// get the inputs and show the plan for the experiment
function updatePlan() {
  let warmUpCount = strToNum(warmUpCountEle.value);
  warmUpCountEle.value = prettyNum(warmUpCount);

  let loopCount = strToNum(loopCountEle.value);
  loopCountEle.value = prettyNum(loopCount);

  let loopIncrement = strToNum(loopIncrementEle.value);
  loopIncrementEle.value = prettyNum(loopIncrement);

  let trialCount = strToNum(trialCountEle.value);
  trialCountEle.value = prettyNum(trialCount);

  let loopTotal = computeLoopTotal(trialCount, loopCount, loopIncrement);

  planEle.innerHTML = `
    Run ${prettyNum(warmUpCount)} warm ups.<br>
    Then run ${prettyNum(trialCount)} trials
    starting with ${prettyNum(loopCount)} loops for the first trial.<br>
    Increase the loop count by ${prettyNum(loopIncrement)}
    for each of the remaining trials
    (a total of ${prettyNum(loopTotal)} loops per code section).
  `;
}

async function handleRunExperimentButton() {
  // each code section generates a list of results, so we need a list of lists
  let resultListList = []; // a list of result lists [[1,2,3], [1,3,4]...]
  clearState();

  // loop through each codeTextBox, validate and convert it into a function
  let fnList = [];
  let mistakesWereMade = false;
  for (let i = 0; i < codeTextBoxEleList.length; ++i) {
    fnList[i] = null;
    let codeText = codeTextBoxEleList[i].value.trim();
    if (codeText.length > 0) {
      let {codeFn, errorMsg} = validateAndConvertCodeText(codeText);
      if (errorMsg) {
        showErrorMsg(i, errorMsg);
        mistakesWereMade = true;
      } else {
        fnList[i] = codeFn;
      }
    }
  }

  if (mistakesWereMade) {
    return;
  }

  // loop through and time each function
  disableRunExperimentButton();
  for (let i = 0; i < fnList.length; ++i) {
    let codeFn = fnList[i];
    if (codeFn) {
      await warmUp(i+1, codeFn);
      resultListList.push(await runTrials(i+1, codeFn));
    }
  }
  enableRunExperimentButton();

  showResults(resultListList);
}

// Ror a given string of code, convert it to a function.
// Return an error message if the code is invalid
function validateAndConvertCodeText(codeText) {
  let returnObj = {
    codeFn: null,
    errorMsg: null,
  };

  // make sure there is code
  if (!codeText || codeText.length < 1) {
    returnObj.errorMsg = 'no code in the textbox';
    return returnObj;
  }

  // see if the code is valid javascript, else show the parse error
  try {
    eval(codeText);
  } catch (error) {
    returnObj.errorMsg = error.message;
    return returnObj;
  }

  // create the timing function with the user's code
  // put "tyc" in front of the names to avoid variable collisions with user code
  try {
    let expression = `(
      async function(tycLoopCount) {
        let tycStart = tycStartTime();
        for (let tycI = 0; tycI < tycLoopCount; ++tycI) {
          ${codeText};
        }
        let tycResultTime = tycGetTime(tycStart);
        return tycResultTime;
      }
    )`;
    returnObj.codeFn = eval(expression);
  } catch (error) {
    returnObj.errorMsg = 'creating timeYourCode function: ' + error.message;
    return returnObj;
  }

  return returnObj;
}

function clearErrorSection() {
  let errorEle = document.getElementById('errorContainer');
  errorEle.style.display = 'none';
  errorEle.innerHTML = '';
}

function showErrorMsg(codeId, errorMsg) {
  let errorEle = document.getElementById('errorContainer');
  errorEle.innerHTML += codeId < 0 ?
    `error: ${errorMsg}<br>` :
    `error in code section ${codeId + 1}: ${errorMsg}<br>`;
  errorEle.style.display = 'block';
}

async function warmUp(codeId, codeFn) {
  let warmUpCount = strToNum(warmUpCountEle.value);

  if (warmUpCount < 1) {
    return;
  }

  showProgress (`code section ${codeId} warming up ` +
                `(running ${prettyNum(warmUpCount)} loops)...`);
  await sleep(1); // time to display the message and read it
  await codeFn(warmUpCount);
  showProgress(`code section ${codeId} warm up complete`);
  await sleep(1); // time to display the message and read it
}

async function runTrials(codeId, codeFn) {
  let trialResultsList = [];
  let trialCount       = strToNum(trialCountEle.value);
  let loopCount        = strToNum(loopCountEle.value);
  let loopIncrement    = strToNum(loopIncrementEle.value);

  if (trialCount < 1) {
    showErrorMsg(-1, 'no trials');
    return;
  }

  if (loopCount + loopIncrement < 1) {
    showErrorMsg('no loops');
    return;
  }

  showProgress(`Running trials for code section ${codeId}...`);
  await sleep(1); // time to display the message and read it

  for (let trialIndex = 0; trialIndex < trialCount; ++trialIndex) {
    let loopCountSum = loopCount + (loopIncrement * trialIndex);
    showProgress(`running trial ` +
                 `${prettyNum(trialIndex+1).padStart(3, ' ')} ` +
                 `( ${prettyNum(loopCountSum)} loops)`);
    await sleep(0); // momentarily return control to renderer to show the msg
    let results = await codeFn(loopCountSum);
    // showProgress(` took ${results.toFixed(3)} seconds`, true);
    // await sleep(1);
    trialResultsList.push(results);
  }

  let loopTotal = computeLoopTotal(trialCount, loopCount, loopIncrement);

  showProgress(`${trialCount} trials complete ` +
               `(${prettyNum(loopTotal)} total loops)`);
  return trialResultsList;
}

function clearProgress() {
  let progressContainer = document.getElementById('progressContainer');
  progressContainer.style.visibility = 'hidden';
  document.getElementById('progressDetails').innerHTML = '';
}

function showProgress(msg, addToLast=false) {

  let progressEle = document.getElementById('progressDetails');
  addToLast ? msg = progressEle.innerHTML + msg : null;

  let progressContainer = document.getElementById('progressContainer');
  progressEle.innerHTML = msg;
  progressContainer.style.visibility = 'visible';

  scroll({top: progressContainer.offsetTop});
}

// they may have entered new data and hit the runButton again
function clearResults() {
  let resultsContainer = document.getElementById('resultsContainer');
  resultsContainer.style.display = 'none';
}

function showResults(resultListList) {
  let dataObj = {
    loopCount:     strToNum(loopCountEle.value),
    loopIncrement: strToNum(loopIncrementEle.value),
    loopTotal:     0,
    resultList:    resultListList,
    trialCount:    strToNum(trialCountEle.value),
    warmUpCount:   strToNum(warmUpCountEle.value),
  };

  dataObj.loopTotal = computeLoopTotal(dataObj.trialCount,
                                       dataObj.loopCount,
                                       dataObj.loopIncrement);

  document.getElementById('results').innerHTML =
    getDate() +
    '<br>' +
    getTrialSummaries(resultListList, dataObj.loopTotal) +
    getJsonSection(dataObj) +
    '<br>' +
    getCsvSection(dataObj);

  // show the results and scroll to them
  clearProgress();
  let resultsContainer = document.getElementById('resultsContainer');
  resultsContainer.style.display = 'block';
  scroll({top: resultsContainer.offsetTop, behavior: 'smooth'});
}


// how many loops were run across all trials for an individual textbox
function computeLoopTotal(trialCount, loopCount, loopIncrement) {
  let loopTotal = 0;
  for (let i = 0; i < trialCount; ++i) {
    let loopCountSum = loopCount + (loopIncrement * i);
    loopTotal += loopCountSum;
  }
  return loopTotal;
}


function getDate() {
  return `<div class="smallFont">${prettyDate()}</div>`;
}


// for each textBox produce a one line summary of the trial results
function getTrialSummaries(resultListList, loopTotal) {
  let msg = '';
  for (let i = 0; i < resultListList.length; ++i) {
    let resultList = resultListList[i];
    msg += getTrialSummaryString(resultList, i, loopTotal);
  }
  return msg;
}


function getTrialSummaryString(resultList, textBoxIndex, loopTotal) {
  let totalTime = 0;
  let resultListCount = resultList.length;
  for (let i = 0; i < resultListCount; ++i) {
    totalTime += resultList[i];
  }

  return `<div id="resultLine">` +
      `<b>code in textbox ${textBoxIndex + 1}:</b> ` +
      `${resultListCount} trials ` +
      `(${prettyNum(loopTotal)} loops) ` +
      `took ${prettyNum(totalTime, 3)} seconds` +
    `<\div>`;
}

function handleShowJsonCsvButton() {
  showJsonCsvButtonEle.isShowing ? hideJsonCsv() : showJsonCsv();
  scroll({top: showJsonCsvButtonEle.offsetTop, behavior: 'smooth'});
}

function hideJsonCsv() {
  let sectionsList = document.getElementsByClassName('jsonAndCsvSections');
  showJsonCsvButtonEle.innerHTML = 'show json & csv';

  for (let i = 0; i < sectionsList.length; ++i) {
    sectionsList[i].style.display = 'none';
  }

  showJsonCsvButtonEle.isShowing = false;
}

function showJsonCsv() {
  let sectionsList = document.getElementsByClassName('jsonAndCsvSections');
  showJsonCsvButtonEle.innerHTML = 'hide json & csv';

  for (let i = 0; i < sectionsList.length; ++i) {
    sectionsList[i].style.display = 'block';
  }

  showJsonCsvButtonEle.isShowing = true;
}

// create json string from the data, but format the resultList as a horizontal
function getJsonSection(dataObj) {
  let workingObj = Object.assign({}, dataObj); // make a copy so we can edit it

  // change resultList into a flat list
  let resultListList = workingObj.resultList;
  let newList = [];
  for (let i = 0; i < resultListList.length; ++i) {
    let resultList = resultListList[i];
    let resultListStr = resultList.toString();
    newList.push(resultListStr);
  }
  workingObj.resultList = newList;
  let jsonStr = JSON.stringify(workingObj, null, '  ');

  // now remove the quotes around the resultList
  jsonStr = removeResultsListQuotes(jsonStr);

  return `<div class="jsonAndCsvSections">JSON:<br>${jsonStr}</div>`;
}

// split the string up into three parts:
// before the resultList, resultList, after the resultList
// then replace the double quotes with [, ]
// contact them back together and return the results
function removeResultsListQuotes(jsonStr) {
  let findString = '"resultList": [';
  let startIndex = jsonStr.indexOf(findString) + findString.length;
  let endIndex = jsonStr.indexOf(']', startIndex);

  let preStr = jsonStr.substring(0, startIndex);
  let resultListStr = jsonStr.substring(startIndex, endIndex);
  let postStr = jsonStr.substring(endIndex);

  resultListStr = resultListStr.replaceAll('    "', '     [');
  resultListStr = resultListStr.replaceAll('"', ']');

  return preStr + resultListStr + postStr;
}

function getCsvSection(dataObj) {
  let workingObj = Object.assign({}, dataObj); // make a copy so we can edit it
  let newResultsList = [];
  for (let i = 0; i < workingObj.resultList.length; ++i) {
    newResultsList.push('[' + workingObj.resultList[i].toString() + ']');
  }
  workingObj.resultList = '"[' + newResultsList + ']"';

  let keys = Object.keys(workingObj);
  let values = Object.values(workingObj);
  let csvStr = keys.join(',') + '<br>';
  csvStr += values.join(',');

  return `<div class="jsonAndCsvSections">CSV:<br>${csvStr}</div>`;
}

function clearState() {
  clearErrorSection();
  clearProgress();
  clearResults();
  hideJsonCsv();
}
