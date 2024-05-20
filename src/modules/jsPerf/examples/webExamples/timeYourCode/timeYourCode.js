//@fileoverview: timeYourCodeAdvanced.js
import {getStyle}                       from '../../../../html/html.js';
import {prettyNum, rnd, strToNum}       from '../../../../math/math.js';
import {prettyDate, sleep, scrollToEle} from '../../../../util/util.js';
import {getTime as tycGetTime,
        startTime as tycStartTime }     from '../../../../jsPerf/jsPerf.js';

window.addEventListener('load', main);

// these are global so we don't fetch them on each key event
let advancedButton,
    codeTextBoxEleList,
    configContainer,
    loopCountEle,
    loopIncrementEle,
    planEle,
    runExperimentEle,
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

  advancedButton = document.getElementById('advancedButton');
  advancedButton.addEventListener('pointerup', handleAdvancedButton);

  configContainer = document.getElementById('configContainer');

  // all of the input values update the plan html
  warmUpCountEle = document.getElementById('warmUpCount');
  warmUpCountEle.addEventListener('keyup', updatePlan);

  loopCountEle = document.getElementById('loopCount');
  loopCountEle.addEventListener('keyup', updatePlan);
  loopCountEle.addEventListener('change', fixLoopCount);  // do not allow 0

  loopIncrementEle = document.getElementById('loopIncrement');
  loopIncrementEle.addEventListener('keyup', updatePlan);

  trialCountEle = document.getElementById('trialCount');
  trialCountEle.addEventListener('keyup', updatePlan);

  planEle = document.getElementById('plan');

  runExperimentEle = document.getElementById('runExperimentButton');
  runExperimentEle.addEventListener('pointerup', handleRunExperimentButton);

  closeConfigContainer();  // start with the advanced container closed
  updatePlan(); // make sure the plan is up-to-date with the default inputs
}


// do not allow a zero value
function fixLoopCount() {
  let loopCount = strToNum(loopCountEle.value);
  loopCount < 1 ? loopCount = 1 : null;
  loopCountEle.value = prettyNum(loopCount);
}


// toggles sliding open/closed the advanced container and
// maintains isAdvancedMode flag for the notes and experiment actions
function handleAdvancedButton() {
  let isAdvanced = advancedButton.isAdvancedMode;
  isAdvanced ? closeConfigContainer() :openConfigContainer();

  let duration = parseFloat(getStyle(configContainer, 'transition-duration'));
  let delay    = parseFloat(getStyle(configContainer, 'transition-delay'));
  let timeout  = duration + delay;
}


function openConfigContainer() {
  const CONTAINER_OPENED_SIZE = '16rem';

  advancedButton.isAdvancedMode = true;
  configContainer.style.height = CONTAINER_OPENED_SIZE;

  // ready each advanced button's display so we can fade them up
  let buttonList = document.getElementsByClassName('advancedInput');
  for (let i = 0; i < buttonList.length; ++i) {
    buttonList[i].style.display = 'table-row';
  }

  // set a timeout so that we can see the buttons fade in
  let duration = parseFloat(getStyle(configContainer, 'transition-duration'));
  let delay  = parseFloat(getStyle(configContainer, 'transition-delay'));
  let timeout = (duration/4) + delay; // part way into transition opening
  setTimeout(function() {
    let buttonList = document.getElementsByClassName('advancedInput');
    for (let i = 0; i < buttonList.length; ++i) {
      buttonList[i].style.opacity = 1.0;
    }
  }, timeout * 1000);
  advancedButton.textContent = 'close advanced mode';
  updatePlan();
}


function closeConfigContainer() {
  const CONTAINER_CLOSED_SIZE = '8rem';

  advancedButton.isAdvancedMode = false;
  configContainer.style.height = CONTAINER_CLOSED_SIZE;

  // fade down each advanced button
  let buttonList = document.getElementsByClassName('advancedInput');
  for (let i = 0; i < buttonList.length; ++i) {
    buttonList[i].style.opacity = 0;
  }

  // set a timeout to hide the advanced buttons after they have faded out
  // so that they do not interfere with the tab order
  let duration = parseFloat(getStyle(configContainer, 'transition-duration'));
  let delay  = parseFloat(getStyle(configContainer, 'transition-delay'));
  let timeout = duration + delay + 0.10; // just a skosh after the fade out
  setTimeout(function() {
    let buttonList = document.getElementsByClassName('advancedInput');
    for (let i = 0; i < buttonList.length; ++i) {
      buttonList[i].style.display = 'none';
    }
  }, timeout * 1000);
  advancedButton.textContent = 'open advanced mode';
  updatePlan();
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
    runExperimentEle.disabled = true;
    runExperimentEle.classList.add('buttonDisabled');
}


function enableRunExperimentButton() {
    runExperimentEle.disabled = false;
    runExperimentEle.classList.remove('buttonDisabled');
}


// get the inputs and show the plan for the experiment
function updatePlan() {
  let isAdvanced = advancedButton.isAdvancedMode;

  let warmUpCount = strToNum(warmUpCountEle.value);
  warmUpCountEle.value = prettyNum(warmUpCount);

  let loopCount = strToNum(loopCountEle.value);
  loopCountEle.value = prettyNum(loopCount);

  let loopIncrement = strToNum(loopIncrementEle.value);
  loopIncrementEle.value = prettyNum(loopIncrement);

  let trialCount = strToNum(trialCountEle.value);
  trialCountEle.value = prettyNum(trialCount);

  let loopTotal = computeLoopTotal(trialCount, loopCount, loopIncrement);

  let trials = trialCount === 1 ? 'trial' : 'trials';

  if (isAdvanced) {
    planEle.innerHTML = `
      First run ${prettyNum(warmUpCount)} warm up loops.<br>
      Then run ${prettyNum(trialCount)} ${trials} with ${prettyNum(loopCount)}
      loops for the first trial.<br>
      Increase the loop count by ${prettyNum(loopIncrement)} for each
      of the remaining trials (a total of ${prettyNum(loopTotal)} loops).
    `;
  } else {  /* simple mode */
    planEle.innerHTML = `Run ${prettyNum(loopCount)} loops.`;
  }
}


async function handleRunExperimentButton() {
  // each code block gens a trial list of results, so we need a list of lists
  // kind of like [/* codeblock1 */ [0.01, 0.01...],
  //               /* codeBlock2 */: [0.20, 0.20..]]

  let resultListList = []; // a list of result lists [[1,2,3], [1,3,4]...]
  clearState();

  // validate the code blocks and convert them into functions stored in fnList
  let fnList = [];
  let allCodeIsValid = true;
  for (let i = 0; i < codeTextBoxEleList.length; ++i) {
    fnList[i] = null;
    let codeText = codeTextBoxEleList[i].value.trim();
    if (codeText.length > 0) {
      let {codeFn, errorMsg} = validateAndConvertCodeText(codeText);
      if (errorMsg) {
        showErrorMsg(i, errorMsg);
        allCodeIsValid = false;
      } else {
        fnList[i] = codeFn;
      }
    }
  }

  if (!allCodeIsValid) {
    return;
  }

  // loop through and time each function in the fnList
  disableRunExperimentButton();
  await sleep(0.1);
  for (let i = 0; i < fnList.length; ++i) {
    let codeFn = fnList[i];
    if (codeFn) {
      await runWarmUp(i+1, codeFn);
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
  scrollToEle(errorEle);
}


async function runWarmUp(codeId, codeFn) {
  // don't run warmups if not in advanced mode,
  let isAdvanced = advancedButton.isAdvancedMode;
  if (!isAdvanced) {
    return;
  }

  let warmUpCount = strToNum(warmUpCountEle.value);

  if (warmUpCount < 1) {
    return;
  }

  showProgress (`code section ${codeId} warming up ` +
                `(running ${prettyNum(warmUpCount)} loops)...`);
//  await sleep(1); // time to display the message and read it
  await codeFn(warmUpCount);
  showProgress(`code section ${codeId} warm up complete`);
//  await sleep(1); // time to display the message and read it
}


async function runTrials(codeId, codeFn) {
  let trialResultsList = [];

  // get config values based on whether advancedMode is on
  let isAdvanced = advancedButton.isAdvancedMode;
  let trialCount     = isAdvanced ? strToNum(trialCountEle.value) : 1;
  let loopCount     = strToNum(loopCountEle.value);
  let loopIncrement = isAdvanced ? strToNum(loopIncrementEle.value) : 0;
  let warmUpCount = isAdvanced ? strToNum(warmUpCountEle.value) : 0;

  if (trialCount < 1) {
    showErrorMsg(-1, 'no trials');
    return;
  }

  if (loopCount + loopIncrement < 1) {
    showErrorMsg('no loops');
    return;
  }

  for (let trialIndex = 0; trialIndex < trialCount; ++trialIndex) {
    let loopCountSum = loopCount + (loopIncrement * trialIndex);
    showProgress(`running code block ${codeId} trial ` +
                 `${prettyNum(trialIndex+1).padStart(3, ' ')} ` +
                 `( ${prettyNum(loopCountSum)} loops)`);
    await sleep(0.1); // momentarily return control to renderer to show the msg
    let results = await codeFn(loopCountSum);
    trialResultsList.push(results);
  }

  let loopTotal = computeLoopTotal(trialCount, loopCount, loopIncrement);

  let trials = trialCount === 1 ? 'trial' : 'trials';

  showProgress(`${trialCount} ${trials} complete ` +
               `(${prettyNum(loopTotal)} total loops)`);
  return trialResultsList;
}


function clearProgress() {
  let progressContainer = document.getElementById('progressContainer');
  progressContainer.style.display = 'none';
  document.getElementById('progressDetails').innerHTML = '';
}


function showProgress(msg, addToLast=false) {
  let progressEle = document.getElementById('progressDetails');
  addToLast ? msg = progressEle.innerHTML + msg : null;

  let progressContainer = document.getElementById('progressContainer');

  progressEle.innerHTML = msg;
  scrollToEle(progressContainer, true, 'block');  //false
}


// they may have entered new data and hit the runButton again
function clearResults() {
  let resultsContainer = document.getElementById('resultsContainer');
  resultsContainer.style.display = 'none';
}


function showResults(resultListList) {
  let isAdvanced = advancedButton.isAdvancedMode;

  let dataObj = {
    loopCount:     strToNum(loopCountEle.value),
    loopIncrement: isAdvanced ? strToNum(loopIncrementEle.value) : 0,
    loopTotal:     0,
    resultList:    resultListList,
    trialCount:    isAdvanced ? strToNum(trialCountEle.value) : 1,
    warmUpCount:   isAdvanced ? strToNum(warmUpCountEle.value) : 0,
  };

  dataObj.loopTotal = computeLoopTotal(dataObj.trialCount,
                                       dataObj.loopCount,
                                       dataObj.loopIncrement);

  document.getElementById('resultsItem').innerHTML =
    getDate() +
    getTrialSummaries(resultListList, dataObj.loopTotal) +
    getJsonHtml(dataObj) +
    getCsvHtml(dataObj);

  // show the results and scroll to them
  // clearProgress();
  let resultsContainer = document.getElementById('resultsContainer');
  scrollToEle(resultsContainer, true, 'block');
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
  return `<div id="resultsDate">${prettyDate()}</div>`;
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

  let trials = resultListCount === 1 ? 'trial' : 'trials';

  return `<div id="resultSummaryLine">` +
      `<b>code in textbox ${textBoxIndex + 1}:</b> ` +
    `${resultListCount} ${trials} ` +
      `(${prettyNum(loopTotal)} loops) ` +
      `took ${prettyNum(totalTime, 3)} seconds` +
    `</div>`;
}


// create json string from the data, but format the resultList as a horizontal
function getJsonHtml(dataObj) {
  let workingObj = Object.assign({}, dataObj); // make a copy so we can edit it

  // calculate the loop time for each result
  let resultListList = workingObj.resultList;
  let newListList = [];
  for (let i = 0; i < resultListList.length; ++i) {
    let resultList = resultListList[i];
    let newList = [];
    for (let j = 0; j < resultList.length; ++j) {
      let result = resultList[j];
      let loopCount = workingObj.loopCount + (workingObj.loopIncrement * j);
      let item = [loopCount, result];
      newList.push(item);
    }
    newListList.push(newList);
  }
  workingObj.resultList = newListList;
  let jsonStr = JSON.stringify(workingObj);
  return `<div class="jsonAndCsvContainer">JSON:<br>${jsonStr}</div>`;
}


function getCsvHtml(dataObj) {
  let workingObj = Object.assign({}, dataObj); // make a copy so we can edit it

  // calculate the loop time for each result
  let resultListList = workingObj.resultList;
  let newListList = [];
  for (let i = 0; i < resultListList.length; ++i) {
    let resultList = resultListList[i];
    let newList = [];
    for (let j = 0; j < resultList.length; ++j) {
      let result = resultList[j];
      let loopCount = workingObj.loopCount + (workingObj.loopIncrement * j);
      let item = [loopCount, result];
      newList.push(`[ ${item.toString()} ]`);
    }
    newListList.push(newList);
  }
  workingObj.resultList = `"[ ${newListList.toString()} ]"`;

  let keys = Object.keys(workingObj);
  let values = Object.values(workingObj);
  let csvStr = keys.join(',') + '<br>';
  csvStr += values.join(',');

  return `<div class="jsonAndCsvContainer">CSV:<br>${csvStr}</div>`;
}


function clearState() {
  clearErrorSection();
  clearProgress();
  clearResults();
}
