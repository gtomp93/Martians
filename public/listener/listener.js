// const { io } = require("socket.io-client");
const socket = io("ws://localhost:3000");
const syllables = ["B", "K", "L", "R", "Z"];

const TIME_DELAY = 10;
let previousTime = 0;
let word = "";
let syllableLength = 200;
let checkForLastWord = null;
let fullEnglishMessage = "";
let testMode = false;
let fullMartianMessage = "";
let martianTestString = "";
let englishTestString = "";
let silenceLength = 0;
let totalDelay = 0;
let maxDelay = -Infinity;

syllables.forEach((s) => {
  socket.on(s, (...args) => {
    // console.log("received " + s + " at " + new Date().getTime());
    if (document.getElementById("test")) {
      document
        .querySelector("main")
        .removeChild(document.getElementById("test"));
    }
    if (args[0].newSpeed) syllableLength = args[0].newSpeed;
    console.log(syllableLength);
    // This code only runs at the start of a test. It tells the listener
    // that the test is starting. It also tells the listener what message
    // is about to be received, in both martian and English, so that the
    // listener can compare its actual output to these expected outputs
    //when the test ends
    if (args[0].syllableLength && args[0].end === false) {
      ({ martianTestString, syllableLength, silenceLength, englishTestString } =
        args[0]);
      fullMartianMessage = "";
      fullEnglishMessage = "";
      document.querySelector("ul").innerHTML = "";
      testMode = true;
      return;
    }

    //This code only runs at the end of a test. It will process the test
    //results and post them to the browser and console.
    if (args[0]?.end === true) {
      setTimeout(() => {
        //See end-test file for this function
        endTest(
          martianTestString,
          fullMartianMessage,
          englishTestString,
          fullEnglishMessage,
          silenceLength,
          totalDelay,
          maxDelay
        );
        testMode = false;
        totalDelay = 0;
        maxDelay = -Infinity;
        silenceLength = 0;
        fullEnglishMessage = "";
      }, 13 * syllableLength);
      return;
    }
    let currentTime = new Date().getTime();

    // Find the interval of time that has passed since the last message
    // was received. TIME_DELAY is a variable representing the added delay
    // error associated with the sockets, calculated to be an average of
    // about 30ms per syllable.

    let timeDiff = currentTime - previousTime - TIME_DELAY;

    // This code only runs during syllable tests. It is used for calculating
    // the timing error associated with the sockets, i.e. the difference between
    // the actual and expected time interval
    if (testMode) {
      if (fullMartianMessage && silenceLength !== 0) {
        let delay =
          currentTime - previousTime - syllableLength * (silenceLength + 1);
        totalDelay += delay;
        maxDelay = delay > maxDelay ? delay : maxDelay;
      }
    }

    if (checkForLastWord) clearTimeout(checkForLastWord);

    console.log("timeDiff", timeDiff);
    let numOfSilences = 0;
    // This if statement only runs after more than 10 syllables of
    // silence, i.e. at the end of a sentence
    if (timeDiff > syllableLength * 10 + syllableLength && word) {
      //We finished a sentence. Check if last word is valid
      if (word in translations) {
        //If word is valid martian, post word to screen and add to message
        postMessage(translations[word]);
        fullEnglishMessage += translations[word] + ". ";
      } else {
        //If word was not found, check preceding signals to see
        //if there were any words in the data since the last word was posted.
        //This process could result in false positives, i.e. finding words that
        //aren't there, but this has never happend in testing. The posted message
        //will specify that these words may not be 100% accurate.
        let missedWords = findMissedWords(word);
        console.log({ missedWords });
        if (missedWords) {
          fullEnglishMessage += missedWords.join(" ") + ". ";
          postMessage(missedWords.join(" ") + " " + "(possible translation)");
        }
      }
      postMessage("End sentence");
      fullMartianMessage += "----------";
      word = "";
    } else if (timeDiff > syllableLength * 5 + syllableLength && word) {
      //We finished a word
      console.log({ word, translated: translations[word] });
      if (translations[word]) {
        postMessage(translations[word]);
        fullEnglishMessage += `${translations[word]} `;
      } else {
        let missedWords = findMissedWords(word);
        console.log({ missedWords });
        if (missedWords) {
          fullEnglishMessage += missedWords.join(" ") + " ";
          postMessage(missedWords.join(" ") + " " + "(possible translation)");
        }
      }
      fullMartianMessage += "-----";
      word = "";
    } else if (timeDiff > syllableLength * 1.5 && word) {
      //add silent syllables
      numOfSilences = Math.round(timeDiff / syllableLength);
    }
    let newSyllables =
      numOfSilences > 0 ? "-".repeat(numOfSilences - 1) + s : s;
    word += newSyllables;
    fullMartianMessage += newSyllables;

    previousTime = currentTime;

    console.log({ word });

    checkForLastWord = setTimeout(() => {
      if (translations[word]) {
        postMessage(translations[word]);
        fullEnglishMessage += translations[word];
      }
      word = "";
      postMessage(fullEnglishMessage, true);
      // fullEnglishMessage = "";
      console.log(fullEnglishMessage, "lol");
    }, syllableLength * 12);
  });
});
