//Code that runs when a test finishes

const endTest = (
  martianTestString,
  fullMartianMessage,
  englishTestString,
  fullEnglishMessage,
  silenceLength,
  totalDelay,
  maxDelay
) => {
  //calculate the "Levenshtein Distance", a measure of the difference between
  //2 strings. It compares the martian language expected and actual strings.
  //I use the code from the module https://github.com/gustf/js-levenshtein
  const levenshteinDistance = lev()(martianTestString, fullMartianMessage);

  //This is the extra delay error associated with the sockets round trip
  //that is in excess of what was expected for the silence length
  const averageDelayPerSilence = silenceLength
    ? totalDelay / (martianTestString.match(/L/g).length - 1)
    : "N/A";
  const delayPerSilentSyllable = silenceLength
    ? averageDelayPerSilence / silenceLength
    : "N/A";

  //See whether the test is passed by comparing the expected and actual output
  //strings. If the test is one that involves actual English words, the English
  //strings are used to determine pass/fail. If the test is random syllables,
  //the martian strings are used for comparison.
  let passed = englishTestString
    ? englishTestString === fullEnglishMessage
    : martianTestString === fullMartianMessage;
  console.log([
    { passed },
    { martianTestString },
    { fullMartianMessage },
    { fullEnglishMessage },
    { englishTestString },
    { levenshteinDistance },
    { averageDelayPerSilence },
    { delayPerSilentSyllable },
    { maxDelay: maxDelay !== -Infinity ? maxDelay : "N/A" },
  ]);

  //Call this function to post the message to HTML/DOM
  addTestMessage(
    martianTestString,
    fullMartianMessage,
    englishTestString,
    fullEnglishMessage,
    passed,
    levenshteinDistance,
    delayPerSilentSyllable
  );
};
