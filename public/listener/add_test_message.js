const addTestMessage = (
  testString,
  fullMartianMessage,
  passed,
  levenshteinDistance,
  averageDelayPerSilence
) => {
  let testMessageDiv = document.getElementById("test")
    ? document.getElementById("test")
    : document.createElement("div");
  testMessageDiv.innerHTML = "";
  testMessageDiv.classList.add("Test");
  testMessageDiv.setAttribute("id", "test");
  let main = document.querySelector("main");
  main.appendChild(testMessageDiv);
  let passedMessage = document.createElement("div");
  let testStringDisplay = document.createElement("div");
  let fullMartianMessageDisplay = document.createElement("p");
  let levenshteinDisplay = document.createElement("p");
  let averageDelayDisplay = document.createElement("div");
  let closeButton = document.createElement("button");

  passedMessage.innerHTML = `<h2>Passed: ${passed}</h2>`;
  testStringDisplay.innerHTML = `<h2>Test Input</h2><p>${testString}</p>`;
  fullMartianMessageDisplay.innerHTML = `<h2>Test Result</h2><p>${fullMartianMessage}</p>`;
  levenshteinDisplay.innerHTML = `<h2>Levenshtein Distance</h2><p>${levenshteinDistance}</p>`;
  averageDelayDisplay.innerHTML = `<h2>Socket Delay Error per Silent Syllable</h2><p>${averageDelayPerSilence}ms</p>`;
  closeButton.innerText = "Close Test Window";
  closeButton.addEventListener("click", () => {
    main.removeChild(testMessageDiv);
  });
  testMessageDiv.append(
    passedMessage,
    testStringDisplay,
    fullMartianMessageDisplay,
    levenshteinDisplay,
    averageDelayDisplay,
    closeButton
  );
};
