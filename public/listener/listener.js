// const { io } = require("socket.io-client");
const socket = io("ws://localhost:3000");
const syllables = ["B", "K", "L", "R", "Z"];
const translations = { "B--BB-K---Z": "FOOD", "L-R-Z": "I", "KK-ZZ": "HATE" };

let time = 0;
let word = "";
let syllableLength = 200;
let checkForLastWord = null;
let counter = 0;
syllables.forEach((s) => {
  socket.on(s, (...args) => {
    console.log("received " + s + " at " + new Date().getTime());

    let timeDiff = new Date().getTime() - time;
    if (checkForLastWord) clearTimeout(checkForLastWord);
    // counter++;
    // console.log(counter);

    console.log("hi", timeDiff);
    let numOfSilences = 0;
    if (timeDiff > syllableLength * 5 + syllableLength && word) {
      //We finished a word
      if (translations[word]) {
        let text = document.createElement("p");
        text.innerText = translations[word];
        document.querySelector("body").appendChild(text);
      }
      console.log("ending word");
      word = "";
    } else if (time > (timeDiff + syllableLength) * 0.9 && word) {
      //add silent syllables
      numOfSilences = Math.round(timeDiff / syllableLength);
    }
    word =
      numOfSilences > 0 ? word + "-".repeat(numOfSilences - 1) + s : word + s;

    console.log(word);
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
    }, syllableLength * 10);
  });
});
