// const { io } = require("socket.io-client");
const socket = io("ws://localhost:3000");
const syllables = ["B", "K", "L", "R", "Z"];

//TIME_DELAY is a constant representing the added delay
// error associated with the sockets round trip/travel time. After some
// experimentation and testing I decided 10ms seemed like a good amount of time.
const TIME_DELAY = 2;

//Time previous message was received
let previousTime = 0;
//current word
let word = "";
//current syllable length in miliseconds
let syllableLength = 140;
let checkForLastWord = null;

//Flag representing whether app is currently in a test mode
let testMode = false;

//The saved message history in English
let fullEnglishMessage = "";
//The saved message history in martian language
let fullMartianMessage = "";
//Expected martian output for a test
let martianTestString = "";
//Expected English output for a test
let englishTestString = "";
let silenceLength = 0;

//totalDelay isused in some tests for calculating the error introduced
//by the socket travel time/limitations
let totalDelay = 0;
let maxDelay = -Infinity;

syllables.forEach((s) => {
  socket.on(s, (...args) => {
    //CLear the test window from the page when starting again after a test
    if (document.getElementById("test")) {
      document
        .querySelector("main")
        .removeChild(document.getElementById("test"));
    }

    //This code only runs when the speaker tells the listener to change its
    //syllable length because the speed of the transmission is changing
    if (args[0].newSpeed) syllableLength = args[0].newSpeed;

    // This code only runs at the start of a test. It tells the listener
    // that the test is starting. It also tells the listener what message
    // is about to be received, in both martian and English, so that the
    // listener can compare its actual output to these expected outputs
    //when the test ends
    if (args[0].syllableLength && args[0].end === false) {
      ({ martianTestString, syllableLength, silenceLength, englishTestString } =
        args[0]);
      fullMartianMessage = "";
      fullEnglishMessage = "";
      document.querySelector("ul").innerHTML = "";
      testMode = true;
      return;
    }

    //This code only runs at the end of a test. It will process the test
    //results and post them to the browser and console.
    if (args[0]?.end === true) {
      setTimeout(() => {
        //See end-test file for this function
        endTest(
          martianTestString,
          fullMartianMessage,
          englishTestString,
          fullEnglishMessage,
          silenceLength,
          totalDelay,
          maxDelay
        );
        testMode = false;
        totalDelay = 0;
        maxDelay = -Infinity;
        silenceLength = 0;
        fullEnglishMessage = "";
      }, 15 * syllableLength);
      return;
    }
    let currentTime = new Date().getTime();
    // Find the interval of time that has passed since the last message
    // was received. TIME_DELAY is a variable representing the added delay
    // error associated with the sockets. After some experimentation and
    // testing I decided 10ms seemed like a good amount of time.
    let timeDiff = currentTime - previousTime - TIME_DELAY;

    // This code only runs during syllable tests. It is used for calculating
    // the timing error associated with the sockets, i.e. the difference between
    // the actual and expected time interval
    if (testMode) {
      if (fullMartianMessage && silenceLength !== 0) {
        let delay =
          currentTime - previousTime - syllableLength * (silenceLength + 1);
        totalDelay += delay;
        maxDelay = delay > maxDelay ? delay : maxDelay;
      }
    }

    //clear the timer that got set after the previous message.
    if (checkForLastWord) clearTimeout(checkForLastWord);

    //This variable will count how many silent syllables occurred since the
    //last letter was receieved
    let numOfSilences = 0;

    // This if condition only runs after more than 10 extra syllables of
    // silence, i.e. at the end of a sentence
    if (timeDiff > syllableLength * 10 + syllableLength && word) {
      //We finished a sentence. Check if last word is valid
      if (word in translations) {
        //If word is valid martian, post word to screen and add to message
        postMessage(translations[word]);
        fullEnglishMessage += translations[word] + ". ";
      } else {
        //If word was not found, check preceding signals to see
        //if there were any words in the data since the last word was posted.
        //This process could result in false positives, i.e. finding words that
        //aren't there. The posted message will specify that these words may not
        //be 100% accurate.
        let missedWords = findMissedWords(word);
        if (missedWords) {
          fullEnglishMessage += missedWords.join(" ") + ". ";
          postMessage(missedWords.join(" ") + " " + "(possible translation)");
        }
      }
      postMessage("End sentence");
      fullMartianMessage += "----------";

      //Since a sentence completed, we are at a new word
      word = "";

      //This next condition means a period of more than 5 extra syllables passed
      //since the last message was received, so it's time to add a word
    } else if (timeDiff > syllableLength * 5 + syllableLength && word) {
      //Check if word has a valid English translation and add it if so.
      if (translations[word]) {
        postMessage(translations[word]);
        fullEnglishMessage += `${translations[word]} `;

        //If not a valid word, check all preeceding signals since last word to
        //see if there are any words in the signal. Post the words if any are found.
      } else {
        let missedWords = findMissedWords(word);
        if (missedWords) {
          console.log({ missedWords });
          fullEnglishMessage += missedWords.join(" ") + " ";
          postMessage(missedWords.join(" ") + " " + "(possible translation)");
        }
      }
      fullMartianMessage += "-----";
      word = "";
    } else if (timeDiff > syllableLength * 1.5 && word) {
      //We are still in the same word but More than a syllable of silence has
      //passed since the last letter.
      //calculate number of silent syllables to add to current word.
      numOfSilences = Math.round(timeDiff / syllableLength);
    }
    //Add silences to the current word, if there are any
    let newSyllables =
      numOfSilences > 0 ? "-".repeat(numOfSilences - 1) + s : s;
    word += newSyllables;
    fullMartianMessage += newSyllables;
    console.log(word);
    previousTime = currentTime;

    //I set this timer to post the last word of the complete message. It will
    //wait for 13 syllables to be sure it waits long enough to distinguish
    //from a sentence end. This timer gets cancelled if any new letters arrive,
    //since this triggers function to run again and post the word.
    checkForLastWord = setTimeout(() => {
      if (translations[word]) {
        postMessage(translations[word]);
        fullEnglishMessage += translations[word];
      }
      word = "";
      postMessage(fullEnglishMessage, true);
      // fullEnglishMessage = "";
      console.log(fullEnglishMessage);
    }, syllableLength * 13);
  });
});
