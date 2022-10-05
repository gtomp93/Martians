const { translations } = require("./data/translations");
const newSentenceFrequency = 1 / 8;
const translateMessage = (message) => {
  let wordsArray = message.trim().split(" ");
  return wordsArray.reduce((fullMessage, word, index) => {
    //Words at the end of a sentence will have a period, exclamation
    //point, or question mark at the end. I remove those from the word
    //before finding the martian translation
    wordWithoutPunctuation = word.replace(/[.?!]/, "");
    //Throw an error if there is no martian translation
    if (!(wordWithoutPunctuation in translations)) {
      throw new Error(`Invalid Word`);
    }

    let translatedWord = translations[wordWithoutPunctuation];

    //If word has a period, exclamation mark, or question mark at the end,
    //add 10 silences. Otherwise add only 5.
    return word.slice(-1).match(/[.?!]/) || index === wordsArray.length - 1
      ? fullMessage + translatedWord + "----------"
      : fullMessage + translatedWord + "-----";
  }, "");
};

//Function for transmitting messages from the speaker to the listener which
//returns a promise
const transmitMessage = (martianMessage, syllableLength, connected, io) => {
  let counter = 0;

  return new Promise((resolve, reject) => {
    let messageInterval = setInterval(() => {
      let symbol = martianMessage[counter];

      counter++;
      console.log({ symbol });

      //Emit the syllable if it is not "-"
      if (symbol !== "-") {
        io.emit(symbol, {});
      }
      //If the end of the message is reached, clear the
      //interval, resolve the promise, reset counter
      if (counter >= martianMessage.length) {
        clearInterval(messageInterval);
        counter = 0;
        connected = false;
        resolve(true);
      }
    }, syllableLength);
  });
};

const sendTestMessages = (martianTestString, socketIoObj, syllableLength) => {
  counter = 0;
  let messageInterval = setInterval(() => {
    if (martianTestString[counter] !== "-") {
      socketIoObj.emit(martianTestString[counter], {});
    }
    console.log("Emitting ", martianTestString[counter], {});
    if (counter >= martianTestString.length - 1) {
      socketIoObj.emit("B", { end: true });
      clearInterval(messageInterval);
    } else counter++;
  }, syllableLength);
};

const generateRandomWord = () => {
  let validWords = Object.keys(translations);
  return validWords[Math.floor(Math.random() * validWords.length)];
};

const generateRandomWords = (maxNumWords) => {
  let randomWordsArray = [];
  //Create an array of random words (all valid words)
  while (randomWordsArray.length <= maxNumWords) {
    //randomly pick a word from the list of valid words
    word = generateRandomWord();
    //randomly make about 1 in 8 words the end of a sentence.
    //This value can be varied to represent shorter/longer avg sentences
    if (Math.random() < 0.125 && randomWordsArray.length < maxNumWords)
      word += ".";
    randomWordsArray.push(word);
  }
  return randomWordsArray;
};

module.exports = {
  translateMessage,
  sendTestMessages,
  generateRandomWords,
  generateRandomWord,
  transmitMessage,
};
