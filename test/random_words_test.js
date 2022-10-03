const { socketIoObj } = require("../index");
const { translateMessage } = require("../helpers");
const { translations } = require("../data/translations");
const syllableLength = 200;
const maxNumWords = 5;
let connected = false;

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
    // randomWordsMessage = randomWordsMessage.trim();
    // if (randomWordsMessage.slice(-1) === ".")
    //   randomWordsMessage = randomWordsMessage.slice(-1);
    let randomWordsMessage = randomWordsArray.join(" ");

    //Trimming off the last 10 characters, which are "-"
    let martianTestString = translateMessage(randomWordsMessage).slice(0, -10);

    console.log(martianTestString);
    console.log(randomWordsMessage + "hi");

    socketIoObj.emit("L", {
      syllableLength,
      end: false,
      silenceLength: 0,
      martianTestString,
      englishTestString: randomWordsMessage,
    });

    let messageInterval = setInterval(() => {
      let symbol = martianTestString[counter];

      counter++;
      console.log(symbol);

      if (symbol != "-") {
        socketIoObj.emit(symbol, {});
      }
      if (counter >= martianTestString.length) {
        socketIoObj.emit("B", { end: true });
        clearInterval(messageInterval);
      }
    }, syllableLength);

    socket.on("disconnect", () => {
      console.log("a user disconnected");
    });
  });
}
