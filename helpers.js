const { translations } = require("./data/translations");

const translateMessage = (message) => {
  let wordsArray = message.trim().split(" ");
  return wordsArray.reduce((fullMessage, word, index) => {
    //Words at the end of a sentence will have a period, exclamation
    //point, or question mark at the end. I remove those from the word
    //before finding the martian translation
    console.log(word, 1);
    wordWithoutPunctuation = word.replace(/[.?!]/, "");
    //Throw an error if there is no martian translation
    if (!(wordWithoutPunctuation in translations)) {
      throw new Error(`Invalid Word`);
    }

    let translatedWord = translations[wordWithoutPunctuation];
    // if (index === message.length - 1) {
    //   return fullMessage + word + "----------";
    // }
    return word.slice(-1).match(/[.?!]/) || index === wordsArray.length - 1
      ? fullMessage + translatedWord + "----------"
      : fullMessage + translatedWord + "-----";
  }, "");
};

const sendTestMessages = (martianTestString, socketIoObj, syllableLength) => {
  counter = 0;
  console.log("ksjdkj");
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

module.exports = { translateMessage, sendTestMessages };
