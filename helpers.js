const { translations } = require("./data/translations");

const encodeMessage = (message) => {
  return message.split(" ").reduce((fullMessage, word) => {
    word = word.replace(/[.?!]/, "");
    if (!(word in translations)) {
      throw new Error(`Invalid Word ${word}`);
    }
    let space = "-----";
    let endSentence = "----------";
    return word.slice(-1).match(/[.?!]/)
      ? fullMessage + encodedWord + endSentence
      : fullMessage + encodedWord + space;
  }, "");
};
module.exports = { encodeMessage };
