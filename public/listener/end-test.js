const endTest = (
  martianTestString,
  fullMartianMessage,
  englishTestString,
  fullEnglishMessage,
  silenceLength,
  totalDelay,
  maxDelay
) => {
  console.log({
    martianTestString,
    fullMartianMessage,
    englishTestString,
    fullEnglishMessage,
    silenceLength,
    totalDelay,
    maxDelay,
  });
  const levenshteinDistance = lev()(martianTestString, fullMartianMessage);
  const averageDelayPerSilence = silenceLength
    ? totalDelay / (martianTestString.match(/L/g).length - 1)
    : "N/A";
  const delayPerSilentSyllable = silenceLength
    ? averageDelayPerSilence / silenceLength
    : "N/A";
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
  console.log("oko", {
    martianTestString,
    fullMartianMessage,
    passed,
    levenshteinDistance,
    delayPerSilentSyllable,
  });

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
