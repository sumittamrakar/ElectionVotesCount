//Assignment 3   Functioning Form
//Name           Sumit Tamrakar
//File name      tamrakar_Sumit_Assignment7a.js

"use strict";
// Function to get element by Id
function gid(id) {
  "use strict";
  return document.getElementById(id);
}

// Get array from classname and tagname from HTML elements
// Source: ICT 4570 Week 3: Assignment 3A: Sample Solution
function getInputArray(className, tagName) {
  "use strict";
  var i, j = 0,
    result = [],
    inputs;
  inputs = document.getElementsByTagName(tagName);
  for (i = 0; i < inputs.length; i += 1) {
    if (!className || inputs[i].className.match(className)) {
      result[j] = inputs[i].value;
      j += 1;
    }
  }
  return result;
}

// Function that returns the sum of an array
function sum(arr) {
  "use strict";
  var total = 0;
  for (var i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total;
}

// Function that takes a number and converts into percentage
function formatPct(num) {
  "use strict";
  var formatNum = (num * 100).toFixed(1) + "%";
  return formatNum;
}

// Function that takes an array of numbers and returns an array of percentages
function pct(arr) {
  "use strict";
  for (var i = 0; i < arr.length; i++) {
    arr[i] = formatPct(arr[i]);
  }
  return arr;
}

// Function that returns array of percentages
function percentArray(arr) {
  "use strict";
  var total = sum(arr);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i] / total;
  }
  return arr;
}

function toISODate(date) { // yyyy-mm-dd
  "use strict";
  var yyyy, mm, dd;
  // JavaScript provides no simple way to format a date-only
  yyyy = "" + date.getFullYear();
  mm = date.getMonth() + 1; // Months go from 0 .. 11
  dd = date.getDate();
  // Need leading zeroes to form the yyyy-mm-dd pattern.
  if (mm < 10) {
    mm = "0" + mm; // This converts it to a string
  }
  if (dd < 10) {
    dd = "0" + dd; // This converts it to a string
  }
  return "" + yyyy + "-" + mm + "-" + dd;
}

// Function to convert an array of inputs to integers
function getInputNumbers(arr) {
  "use strict";
  for (var i = 0; i < arr.length; i++) {
    arr[i] = parseInt(arr[i]);
  }
  return arr;
}

// Error Checking for vote entry
// If the input is blank
// If the input for a number is not a number
// If the input for a number is negative or zero
function validate(arr) {
  "use strict";
  var arr = getInputArray('count','input');
  var idPrefix = "errorVote";
  var proceed = true;

  // Check for invalid vote entry
  for (var i = 0; i < arr.length; i++) {
    // Clear error messages on start
    gid(idPrefix + i).innerHTML = "";

    if (arr[i] === "") {
      gid(idPrefix + i).innerHTML = " Vote entry cannot be empty";
      proceed = false;
    }
    if (isNaN(arr[i])) {
      gid(idPrefix + i).innerHTML = " Vote entry has to be a number";
      proceed = false;
    }
    if (parseInt(arr[i]) <= 0) {
      gid(idPrefix + i).innerHTML = " Vote entry cannot be negative or zero";
      proceed = false;
    }
  }
  return proceed;
}

// Error check if the date cannot be parsed (should never happen)
// For browser that might treat date type input as text field input and allow users to enter unparseable date
function validateDate() {
  "use strict";
  if (isNaN(Date.parse(gid("date").value))) {
    gid("dateError").innerHTML = " Please enter the date in correct format";
  }
}

// Function to calculate sum and percentage for votes for each candidate
function calculateOutput() {
  "use strict";
  var rawVotesArray =getInputArray('count','input');
  // Convert votes into numbers/integers for calculation
  var votesArray = getInputNumbers(rawVotesArray);
  var votesTotal = sum(votesArray);
  var votePercentArray = percentArray(votesArray);
  var votePercents = pct(votePercentArray);

  gid("totalVotes").innerHTML = votesTotal;
  gid("candidate1Percent").innerHTML = votePercents[0];
  gid("candidate2Percent").innerHTML = votePercents[1];
  gid("candidate3Percent").innerHTML = votePercents[2];
}

// Function to change the generic candidate name to user input names
function candidateName(arr) {
  "use strict";
  var percentIdPrefix = "cand";
  var nameIdPrefix = "candidate";
  for (var i = 1; i <= arr.length; i++) {
    gid(percentIdPrefix + i).innerHTML = gid(nameIdPrefix + i).value + " Percentage";
  }
}

//Function to clear results section to empty on start
function clearResults() {
  "use strict";
  //Clear results section to empty on start
  gid("totalVotes").innerHTML = "";
  gid("candidate1Percent").innerHTML = "";
  gid("candidate2Percent").innerHTML = "";
  gid("candidate3Percent").innerHTML = "";
}

// Function for local storage
var storeLocally = function (arr, storageVar) {
  "use strict";
  if (typeof (Storage) !== "undefined") {
    try {
      for (var i = 1; i <= arr.length; i++) {
        localStorage.setItem(storageVar, JSON.stringify(arr));
      }
    } catch (e) {
      console.log('localStorage quota exceeded!');
    }
  }
};

// Function to retieve the locally stored value from previous session and display
var initForm = function (storageVar, IdPrefix) {
  "use strict";
  if (typeof (Storage) !== "undefined") {
    var stored = localStorage.getItem(storageVar);
    if (stored && stored.length > 0) {
      var storedArray = JSON.parse(stored);
      for (var i = 0; i < storedArray.length; i++) {
        gid(IdPrefix + Number(i + 1)).value = storedArray[i];
      }
    } else console.log("Cannot use " + stored + " " + storageVar + " values.");
  }
};

// Function to validate input and perform calculations
function update() {
  "use strict";
  clearResults();

  var rawVotesArray = getInputArray('count','input');
  var isValidated = validate(rawVotesArray);
  var candidates = getInputArray('candidate', 'input');
  var party = getInputArray('party', 'select');

  validateDate();

  if (isValidated) {
    calculateOutput();
    candidateName(rawVotesArray);
    storeLocally(rawVotesArray, 'votes');
    storeLocally(candidates, 'candidates');
    storeLocally(party, 'parties');
  }
}

function init() {
  "use strict";
  initForm('votes', 'votesCandidate');
  initForm('candidates', 'candidate');
  initForm('parties', 'party');

  // Setting the date to the current date 
  var today = new Date();
  var isodate = toISODate(today);
  gid("date").value = isodate;

  // Attaching the Calculate button to the "update" function
  var button = gid("calculate");
  button.onclick = update;
}

window.onload = init;