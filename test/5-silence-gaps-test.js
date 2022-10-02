const { socketIoObj, connected } = require("../index");
const { sendTestMessages } = require("../send-test-messages");
const syllableLength = 100;
const testStringLength = 20;
console.log("hi");

socketIoObj.on("connection", (socket) => {
  //Make sure the test string starts with a letter
  let testString = "L";
  while (testString.length < testStringLength) {
    testString += "-----L";
  }
  console.log({ testString });

  socketIoObj.emit("L", {
    testString,
    syllableLength,
    end: false,
    numSilences: 5,
  });

  sendTestMessages(testString, socketIoObj, syllableLength);

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});
