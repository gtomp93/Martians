// const { io } = require("socket.io-client");
const socket = io("ws://localhost:3000");
const syllables = ["B", "K", "L", "R", "Z"];
const translations = {
  "B--BB-K---Z": "FOOD",
  "L-R-Z": "I",
  "KK-ZZ": "HATE",
  "B--K--Z": "unknown word",
};
const TIME_DELAY = 10;
let time = 0;
let word = "";
let syllableLength = 150;
let checkForLastWord = null;
let fullTranslatedMessage = "";
let testMode = false;
let fullMartianMessage = "";
let testString = "";
let numSilences = 0;
let totalDelay = 0;
let maxDelay = -Infinity;
// console.log(lev()("kitten", "kippen"), "levenshtien");

syllables.forEach((s) => {
  socket.on(s, (...args) => {
    // console.log("received " + s + " at " + new Date().getTime());
    if (document.getElementById("test")) {
      document.getElementById("test").innerHTML = "";
    }
    if (args[0] && args[0].end === false) {
      ({ testString, syllableLength, numSilences } = args[0]);
      fullMartianMessage = "";
      document.querySelector("ul").innerHTML = "";
      testMode = true;
      return;
    }
    if (args[0]?.end === true) {
      setTimeout(() => {
        testMode = false;
        const levenshteinDistance = lev()(testString, fullMartianMessage);
        const averageDelayPerSilence =
          totalDelay / (testString.match(/L/g).length - 1);
        const delayPerSilentSyllable = averageDelayPerSilence / numSilences;
        let passed = testString === fullMartianMessage;
        console.log([
          { passed },
          { testString },
          { fullMartianMessage },
          { levenshteinDistance },
          { averageDelayPerSilence },
          { delayPerSilentSyllable },
          { maxDelay },
        ]);

        addTestMessage(
          testString,
          fullMartianMessage,
          passed,
          levenshteinDistance,
          averageDelayPerSilence
        );

        totalDelay = 0;
        maxDelay = -Infinity;
      }, 13 * syllableLength);
      return;
    }

    let timeDiff = new Date().getTime() - time - TIME_DELAY;

    if (testMode && fullMartianMessage && numSilences) {
      delay = new Date().getTime() - time - syllableLength * (numSilences + 1);
      totalDelay += delay;
      maxDelay = delay > maxDelay ? delay : maxDelay;
      console.log(delay);
    }

    if (checkForLastWord) clearTimeout(checkForLastWord);

    console.log("timeDiff", timeDiff);
    let numOfSilences = 0;
    if (timeDiff > syllableLength * 10 + syllableLength && word) {
      //We finished a sentence
      fullTranslatedMessage += translations[word] + ".";
      // console.log("ending Sentence");
    } else if (timeDiff > syllableLength * 4.96 + syllableLength && word) {
      //We finished a word
      if (translations[word]) {
        let text = document.createElement("li");
        text.innerText = translations[word];
        document.querySelector("ul").appendChild(text);
        fullTranslatedMessage += translations[word];
      }
      // console.log("ending word");
      fullMartianMessage += "-----";

      word = "";
    } else if (timeDiff > syllableLength * 1.5 && word) {
      //add silent syllables
      numOfSilences = Math.floor(timeDiff / syllableLength);
    }
    let newSyllables =
      numOfSilences > 0 ? "-".repeat(numOfSilences - 1) + s : s;
    word += newSyllables;
    fullMartianMessage += newSyllables;

    console.log("word", word);

    time = new Date().getTime();

    checkForLastWord = setTimeout(() => {
      console.log("here", word);
      if (translations[word]) {
        console.log("THERE");
        let text = document.createElement("p");
        text.innerText = translations[word];
        document.querySelector("body").appendChild(text);
      }
      word = "";
      console.log(fullTranslatedMessage);
    }, syllableLength * 12);
  });
});
