const { socketIoObj } = require("../index");
const { sendTestMessages } = require("../send-test-messages");
const syllableLength = 50;
const testStringLength = 100;

console.log("ok");

socketIoObj.on("connection", (socket) => {
  //Make sure the test string starts with a letter
  let testString = "L";
  while (testString.length < testStringLength) {
    testString += "-L";
  }
  testString += "L";
  console.log({ testString });

  socketIoObj.emit("L", { testString, syllableLength, end: false });

  sendTestMessages(testString, socketIoObj, syllableLength);

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});
