const { socketIoObj, connected } = require("../index");
const { sendTestMessages } = require("../send-test-messages");
const syllables = ["B", "K", "L", "R", "Z", "-", "-", "-", "-"];
const syllableLength = 500;
const testStringLength = 20;

console.log("ok");

socketIoObj.on("connection", (socket) => {
  let testString = "B";
  console.log(Math.random(syllables.length));
  while (testString.length < testStringLength) {
    testString += syllables[Math.floor(Math.random() * syllables.length)];
  }
  testString += "B";
  console.log({ testString });

  socketIoObj.emit("B", { testString, syllableLength, end: false });

  sendTestMessages(testString, socketIoObj, syllableLength);

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});
// if (connected) {
//   console.log("in here");
//   setInterval(() => {
//     const s = syllables[Math.floor(Math.random() * syllables.length)];
//     console.log("Emitting ", s);
//     if (s != "-") {
//       socketIoObj.emit(s, {});
//     }
//   }, 200);
// }
