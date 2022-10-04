const findMissedWords = (string) => {
  let validWordsRegex = new RegExp(Object.keys(translations).join("|"), "g");
  console.log({
    string,
    validWordsRegex,
    missedWords: string.match(validWordsRegex),
  });
  return string.match(validWordsRegex)?.map((word) => translations[word]);
};
