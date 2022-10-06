const { socketIoObj } = require("../index");
const { translateMessage, sendTestMessages } = require("../helpers");
const { translations } = require("../data/translations");
const syllableLength = 150;
const syllables = ["B", "K", "L", "R", "Z", "-", "-", "-", "-"];
const maxNumWords = 10;
let connected = false;
let randomNoiseLength = 24;
let randomNoise = "";
if (!connected) {
  socketIoObj.on("connection", (socket) => {
    connected = true;
    let randomWordsArray = [];
    let counter = 0;
    let validWords = Object.keys(translations);
    //Create an array of random words (all valid words)
    while (randomWordsArray.length <= maxNumWords) {
      //randomly pick a word from the list of valid words
      word = validWords[Math.floor(Math.random() * validWords.length)];
      //randomly make about 1 in 8 words the end of a sentence.
      //This value can be varied to represent shorter/longer avg sentences
      if (Math.random() < 0.125 && randomWordsArray.length < maxNumWords)
        word += ".";
      randomWordsArray.push(word);
    }

    let randomWordsMessage = randomWordsArray.join(" ");

    //Trimming off the last 10 characters, which are "-"
    let martianTestString = translateMessage(randomWordsMessage).slice(0, -10);

    //Generate random noise. You can play around with what exactly you want the
    //random noise to look like.
    while (randomNoise.length < randomNoiseLength) {
      randomNoise += syllables[Math.floor(Math.random() * syllables.length)];
    }

    //Add random noise to the middle of the test string. The regex ensures
    //the noise is inserted after the pause following the word at the half-way mark.
    //Should work even if this word is at the end of a sentence.
    let matchCount = 0;
    martianTestString = martianTestString.replace(
      /([BKLRZ]-{5}[BKLRZ]|[BKLRZ]-{10}[BKLRZ])/g,
      (match) => {
        return ++matchCount === Math.round(maxNumWords / 2)
          ? match[0] + randomNoise + match.slice(-1)
          : match;
      }
    );

    socketIoObj.emit("L", {
      syllableLength,
      end: false,
      silenceLength: 0,
      martianTestString,
      englishTestString: randomWordsMessage,
    });

    sendTestMessages(martianTestString, socketIoObj, syllableLength);

    socket.on("disconnect", () => {
      console.log("a user disconnected");
    });
  });
}
