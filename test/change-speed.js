const { socketIoObj } = require("../index");
const {
  translateMessage,
  generateRandomWords,
  sendTestMessages,
} = require("../helpers");
const { translations } = require("../data/translations");
const numWords = 10;
const speeds = [300, 250, 200];
let connected = false;
socketIoObj.on("connection", (socket) => {
  if (numWords - (1 % speeds.length) !== 0)
    throw new Error(
      "newWords+1 must be divisible by the length of speeds array"
    );
  //Create an array of random words (all valid words)
  if (!connected) {
    connected = true;

    let randomWordsArray = [
      ...generateRandomWords(numWords / speeds.length),
      ...generateRandomWords(numWords / speeds.length),
      ...generateRandomWords(numWords / speeds.length),
    ];

    let randomWordsMessage = randomWordsArray.join(" ");

    //Trimming off the last 10 characters, which are "-"
    let martianTestString = translateMessage(randomWordsMessage).slice(0, -10);

    console.log(martianTestString, martianTestString.length);

    socketIoObj.emit("L", {
      syllableLength: speeds[0],
      end: false,
      silenceLength: 0,
      martianTestString,
      englishTestString: randomWordsMessage,
    });

    let newWordRegex = /([BKLRZ]-{5}[BKLRZ]|[BKLRZ]-{10}[BKLRZ])/g;
    let changeSpeedIndices = [];
    let matchCounter = 0;
    console.log(numWords - 1 / speeds.length);
    while ((match = newWordRegex.exec(martianTestString)) !== null) {
      console.log(match);
      if (
        (matchCounter - 1) % ((numWords - 1) / speeds.length) === 0 &&
        matchCounter !== 1 &&
        matchCounter !== numWords
      ) {
        changeSpeedIndices.push(match.index + 1);
      }
      matchCounter++;
    }

    let counter = 0;
    let indexOfSpeedsArray = 0;

    let messageStream = (syllableLength, newSpeed) => {
      setTimeout(() => {
        if (martianTestString[counter] !== "-") {
          if (counter > martianTestString.length - 1) {
            socketIoObj.emit("B", { end: true });
            connected = false;
            return;
          }
          if (newSpeed) {
            socketIoObj.emit(martianTestString[counter], {
              newSpeed: syllableLength,
            });
          } else {
            socketIoObj.emit(martianTestString[counter], {});
          }
        }
        console.log("Emitting ", martianTestString[counter], {});
        if (
          counter === changeSpeedIndices[indexOfSpeedsArray] - 1 &&
          indexOfSpeedsArray < speeds.length
        ) {
          indexOfSpeedsArray++;
          console.log(indexOfSpeedsArray);
          messageStream(speeds[indexOfSpeedsArray], true);
          return;
        }
        messageStream(speeds[indexOfSpeedsArray], false);

        counter++;
      }, syllableLength);
    };
    messageStream(speeds[0]);

    socket.on("disconnect", () => {
      console.log("a user disconnected");
    });
  }
});
