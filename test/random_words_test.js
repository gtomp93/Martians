const { socketIoObj } = require("../index");
const {
  translateMessage,
  generateRandomWords,
  sendTestMessages,
} = require("../helpers");
const { translations } = require("../data/translations");
const syllableLength = 150;
const numWords = 12;
let connected = false;

socketIoObj.on("connection", (socket) => {
  connected = true;
  //Create an array of random words (all valid words)
  let randomWordsArray = generateRandomWords(numWords);

  let randomWordsMessage = randomWordsArray.join(" ");

  //Trimming off the last 10 characters, which are "-"
  let martianTestString = translateMessage(randomWordsMessage).slice(0, -10);

  console.log(randomWordsMessage);

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
