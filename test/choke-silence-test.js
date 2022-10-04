const { socketIoObj } = require("../index");
const {
  translateMessage,
  generateRandomWord,
  generateRandomWords,
  sendTestMessages,
} = require("../helpers");
const { translations } = require("../data/translations");
const syllableLength = 150;
const SILENCE_LENGTH = 20;
const syllables = ["B", "K", "L", "R", "Z", "-", "-", "-", "-"];
const maxNumWords = 5;

socketIoObj.on("connection", (socket) => {
  connected = true;

  //Create an array of random words (all valid words)
  let englishTestString = generateRandomWords(Math.floor(maxNumWords / 2)).join(
    " "
  );
  let martianTestString = translateMessage(englishTestString).slice(0, -5);
  console.log(englishTestString, translateMessage(englishTestString), {
    martianTestString,
  });
  //Take the first 2 syllables of a word to represent getting cut off
  //mid-sentence, then generate a period of silence based on the
  //silence_length variable, then add the ending of a random word to
  //represent starting up again in the middle of a word
  martianTestString +=
    translations[generateRandomWord()].slice(0, 3) +
    "-".repeat(SILENCE_LENGTH - 1) +
    translations[generateRandomWord()].slice(-3) +
    "-----";
  console.log({ martianTestString });

  //Add random words after the period of silence
  let secondHalfOfRandomWords =
    " " + generateRandomWords(Math.ceil(maxNumWords / 2)).join(" ");

  englishTestString += secondHalfOfRandomWords;

  martianTestString += translateMessage(secondHalfOfRandomWords).slice(0, -10);

  console.log(martianTestString);
  console.log(englishTestString);

  socketIoObj.emit("L", {
    syllableLength,
    end: false,
    silenceLength: 0,
    martianTestString,
    englishTestString,
  });

  sendTestMessages(martianTestString, socketIoObj, syllableLength);

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});
