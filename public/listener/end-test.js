const endTest = (
  martianTestString,
  fullMartianMessage,
  silenceLength,
  totalDelay,
  maxDelay
) => {
  const levenshteinDistance = lev()(martianTestString, fullMartianMessage);
  const averageDelayPerSilence = silenceLength
    ? totalDelay / (martianTestString.match(/L/g).length - 1)
    : "N/A";
  const delayPerSilentSyllable = silenceLength
    ? averageDelayPerSilence / silenceLength
    : "N/A";
  let passed = martianTestString === fullMartianMessage;
  console.log([
    { passed },
    { martianTestString },
    { fullMartianMessage },
    { levenshteinDistance },
    { averageDelayPerSilence },
    { delayPerSilentSyllable },
    { maxDelay: maxDelay !== -Infinity ? maxDelay : "N/A" },
  ]);

  addTestMessage(
    martianTestString,
    fullMartianMessage,
    passed,
    levenshteinDistance,
    delayPerSilentSyllable
  );
};
