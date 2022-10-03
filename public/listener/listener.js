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

    if (args[0].syllableLength && args[0].end === false) {
      ({ martianTestString, syllableLength, silenceLength, englishTestString } =
        args[0]);
      fullMartianMessage = "";
      fullEnglishMessage = "";

      document.querySelector("ul").innerHTML = "";
      testMode = true;
      return;
    }
    if (args[0]?.end === true) {
      setTimeout(() => {
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
      }, 13 * syllableLength);
      return;
    }
    let currentTime = new Date().getTime();

    let timeDiff = currentTime - previousTime - TIME_DELAY;

    if (testMode) {
      if (fullMartianMessage && silenceLength) {
        let delay =
          currentTime - previousTime - syllableLength * (silenceLength + 1);
        totalDelay += delay;
        maxDelay = delay > maxDelay ? delay : maxDelay;
      }
    }

    if (checkForLastWord) clearTimeout(checkForLastWord);

    console.log("timeDiff", timeDiff);
    let numOfSilences = 0;
    if (timeDiff > syllableLength * 10 + syllableLength && word) {
      //We finished a sentence
      if (translations[word]) {
        postMessage(translations[word]);
        fullEnglishMessage += translations[word] + ". ";
      }
      postMessage("End sentence");
      fullMartianMessage += "----------";
      word = "";
    } else if (timeDiff > syllableLength * 5 + syllableLength && word) {
      //We finished a word
      console.log({ word, translated: translations[word] });
      if (translations[word]) {
        console.log("yaaaa");
        postMessage(translations[word]);
        fullEnglishMessage += `${translations[word]} `;
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
      console.log(fullEnglishMessage, "lol");
    }, syllableLength * 13);
  });
});
