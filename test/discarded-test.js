// I abandoned this test

// const { socketIoObj } = require("../index");
// const { translateMessage } = require("../helpers");
// const { translations } = require("../data/translations");
// const syllableLength = 150;
// const syllables = ["B", "K", "L", "R", "Z", "-", "-", "-", "-"];
// const maxNumWords = 10;
// let connected = false;
// let randomNoiseLength = 20;
// let randomNoise = "";
// if (!connected) {
//   socketIoObj.on("connection", (socket) => {
//     connected = true;
//     let randomWordsArray = [];
//     let counter = 0;
//     let validWords = Object.keys(translations);
//     let randomWord = validWords[Math.floor(Math.random() * validWords.length)];
//     let martianTestString = "";
//     //Create an array of random words (all valid words)
//     while (randomWordsArray.length <= Math.floor(maxNumWords / 2)) {
//       //randomly pick a word from the list of valid words
//       word = validWords[Math.floor(Math.random() * validWords.length)];
//       martianTestString += translations[word] + "-----";
//       //randomly make about 1 in 8 words the end of a sentence.
//       //This value can be varied to represent shorter/longer avg sentences
//       if (Math.random() < 0.125) {
//         word += ".";
//         martianTestString += "-----";
//       }
//       randomWordsArray.push(word);
//     }
//     console.log(randomWordsArray);
//     //Generate random noise. In this case, we are adding valid words to the
//     //random noise to see if the listener can detect them
//     while (randomNoise.length < randomNoiseLength) {
//       if (Math.random() < 0.2) {
//         let randomWord =
//           validWords[Math.floor(Math.random() * validWords.length)];
//         randomNoise += translations[randomWord];
//         randomWordsArray.push(randomWord);
//         martianTestString += translations[randomWord];
//       } else {
//         // randomNoise += syllables[Math.floor(Math.random() * syllables.length)];
//         martianTestString +=
//           syllables[Math.floor(Math.random() * syllables.length)];
//       }
//     }
//     console.log(randomWordsArray);

//     while (randomWordsArray.length < maxNumWords) {
//       //randomly pick a word from the list of valid words
//       word = validWords[Math.floor(Math.random() * validWords.length)];
//       martianTestString += translations[word] + "-----";
//       //randomly make about 1 in 8 words the end of a sentence.
//       //This value can be varied to represent shorter/longer avg sentences
//       if (Math.random() < 0.125 && maxNumWords < randomWordsArray.length - 1) {
//         word += ".";
//         martianTestString += "-----";
//       }
//       randomWordsArray.push(word);
//     }
//     console.log(randomWordsArray);

//     let randomWordsMessage = randomWordsArray.join(" ");

//     //Trimming off the last 10 characters, which are "-"
//     martianTestString = martianTestString.slice(0, -5);

//     //Add the random noise to the middle of the test string. The regex ensures
//     //the noise is inserted after the pause following the word at the half-way mark.
//     //Should work even if this word is at the end of a sentence.
//     // let matchCount = 0;
//     // martianTestString = martianTestString.replace(
//     //   /([BKLRZ]-{5}[BKLRZ]|[BKLRZ]-{10}[BKLRZ])/g,
//     //   (match) => {
//     //     console.log({ match, matchCount, index: Math.round(maxNumWords / 2) });
//     //     return ++matchCount === Math.round(maxNumWords / 2)
//     //       ? match[0] + randomNoise + match.slice(-1)
//     //       : match;
//     //   }
//     // );
//     console.log(martianTestString);
//     console.log(randomWordsMessage + "hi");
//     console.log(randomNoise);

//     socketIoObj.emit("L", {
//       syllableLength,
//       end: false,
//       silenceLength: 0,
//       martianTestString,
//       englishTestString: randomWordsMessage,
//     });

//     let messageInterval = setInterval(() => {
//       let symbol = martianTestString[counter];

//       counter++;
//       console.log(symbol);

//       if (symbol != "-") {
//         socketIoObj.emit(symbol, {});
//       }
//       if (counter >= martianTestString.length) {
//         socketIoObj.emit("B", { end: true });
//         clearInterval(messageInterval);
//       }
//     }, syllableLength);

//     socket.on("disconnect", () => {
//       console.log("a person disconnected");
//       clearInterval(messageInterval);
//     });
//   });
// }
