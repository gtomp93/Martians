// const { io } = require("socket.io-client");
const socket = io("ws://localhost:3000");
const syllables = ["B", "K", "L", "R", "Z"];
const translations = {
  "B--BB-K---Z": "FOOD",
  "L-R-Z": "I",
  "KK-ZZ": "HATE",
  "B--K--Z": "unknown word",
};

let time = 0;
let word = "";
let syllableLength = 150;
let checkForLastWord = null;
let fullTranslatedMessage = "";
let fullMartianMessage = "";
let testString = "";
// console.log(lev()("kitten", "kippen"), "levenshtien");

syllables.forEach((s) => {
  socket.on(s, (...args) => {
    // console.log("received " + s + " at " + new Date().getTime());

    if (args[0] && args[0].end === false) {
      testString = args[0]?.test;
      fullMartianMessage = "";
      syllableLength = args[0]?.syllableLength;
      document.querySelector("ul").innerHTML = "";
      return;
    }
    if (args[0] && args[0].end === true) {
      setTimeout(() => {
        const levenshteinDistance = lev()(testString, fullMartianMessage);
        console.log([
          { passed: testString === fullMartianMessage },
          { testString },
          { fullMartianMessage },
          { levenshteinDistance },
        ]);
      }, 13 * syllableLength);
      return;
    }

    let timeDiff = new Date().getTime() - time;

    if (checkForLastWord) clearTimeout(checkForLastWord);

    // console.log("timeDiff", timeDiff);
    let numOfSilences = 0;
    if (timeDiff > syllableLength * 10 + syllableLength && word) {
      //We finished a sentence
      fullTranslatedMessage += translations[word] + ".";
      // console.log("ending Sentence");
    } else if (timeDiff > syllableLength * 4.5 + syllableLength && word) {
      //We finished a word
      if (translations[word]) {
        let text = document.createElement("li");
        text.innerText = translations[word];
        document.querySelector("ul").appendChild(text);
        fullTranslatedMessage += translations[word];
      }
      // console.log("ending word");
      word = "";
    } else if (timeDiff > syllableLength * 1.5 && word) {
      //add silent syllables
      numOfSilences = Math.round(timeDiff / syllableLength);
    }
    let newSyllables =
      numOfSilences > 0 ? "-".repeat(numOfSilences - 1) + s : s;
    word += newSyllables;
    fullMartianMessage += newSyllables;

    // console.log("word", word);

    time = new Date().getTime();

    checkForLastWord = setTimeout(() => {
      // console.log("here", word);
      if (translations[word]) {
        console.log("THERE");
        let text = document.createElement("p");
        text.innerText = translations[word];
        document.querySelector("body").appendChild(text);
      }
      word = "";
      // console.log(fullTranslatedMessage);
    }, syllableLength * 12);
  });
});
