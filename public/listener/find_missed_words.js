//Looks through the noise to see if there are any words in there

const findMissedWords = (string) => {
  let validWordsRegex = new RegExp(Object.keys(translations).join("|"), "g");
  return string.match(validWordsRegex)?.map((word) => translations[word]);
};
