const { socketIoObj } = require("../index");
const { sendTestMessages } = require("../send-test-messages");
const syllableLength = 50;
const testStringLength = 25;

console.log("ok");

socketIoObj.on("connection", (socket) => {
  //Make sure the test string starts with a letter
  let testString = "L";
  let counter = 0;
  while (testString.length < testStringLength) {
    testString += "--L";
  }
  console.log({ testString });

  socketIoObj.emit("L", { testString, syllableLength, end: false });

  sendTestMessages(testString, socketIoObj, syllableLength, numGaps);

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});
