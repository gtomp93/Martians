const { socketIoObj } = require("../index");
const {
  translateMessage,
  generateRandomWords,
  sendTestMessages,
} = require("../helpers");
const { translations } = require("../data/translations");

//numWords and speeds can be anything as long as numWords - 1 is
//divisible by the length of the speeds array. This is because the
//test is designed to have the same number of words at each interval
const numWords = 13;
const speeds = [200, 150, 120];
let connected = false;
socketIoObj.on("connection", (socket) => {
  if ((numWords - 1) % speeds.length !== 0)
    throw new Error(
      "newWords+1 must be divisible by the length of speeds array"
    );
  //Create an array of random words (all valid words)
  if (!connected) {
    connected = true;

    //This next line looks weird because I want to call the generateRandomWords
    //function without it adding a period to the words where the speed changes.
    //The last item returned by the function can never be a period so thats
    //why i call it this way
    let randomWordsArray = [];
    for (let i = 0; i < speeds.length; i++) {
      randomWordsArray.push(...generateRandomWords(numWords / speeds.length));
    }

    let randomWordsMessage = randomWordsArray.join(" ");

    //Trimming off the last 10 characters, which are "-"
    let martianTestString = translateMessage(randomWordsMessage).slice(0, -10);

    socketIoObj.emit("L", {
      syllableLength: speeds[0],
      end: false,
      silenceLength: 0,
      martianTestString,
      englishTestString: randomWordsMessage,
    });

    //The following code is used to find the indices of the message
    //string where the speed/syllable length changes. I probably
    //could have found a simpler way to accomplish this but oh well.
    let newWordRegex = /([BKLRZ]-{5}[BKLRZ]|[BKLRZ]-{10}[BKLRZ])/g;
    let changeSpeedIndices = [];
    let matchCounter = 0;
    while ((match = newWordRegex.exec(martianTestString)) !== null) {
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
    //Nested setTimeout that sends the messages while changing the syllableLength
    //at intervals. Each speed interval has the same number of words.
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
            console.log("Emitting ", martianTestString[counter], {
              newSpeed: syllableLength,
            });
          } else {
            socketIoObj.emit(martianTestString[counter], {});
            console.log("Emitting ", martianTestString[counter], {});
          }
        }
        //At certain indexes, the syllableLength gets changed
        if (
          counter === changeSpeedIndices[indexOfSpeedsArray] - 1 &&
          indexOfSpeedsArray < speeds.length
        ) {
          //Move to next speed
          indexOfSpeedsArray++;
          console.log(indexOfSpeedsArray);
          //Change the speed (syllable length) on next loop
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
