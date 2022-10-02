const { socketIoObj } = require("../index");
const { sendTestMessages } = require("../send-test-messages");
const syllableLength = 125;
const testStringLength = 100;

socketIoObj.on("connection", (socket) => {
  //Make sure the test string starts with a letter
  let testString = "L";
  while (testString.length < testStringLength) {
    testString += "----L";
  }
  console.log({ testString });

  socketIoObj.emit("L", {
    testString,
    syllableLength,
    end: false,
    numSilences: 4,
  });

  sendTestMessages(testString, socketIoObj, syllableLength);

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});
