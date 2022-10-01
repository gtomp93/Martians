const { socketIoObj, connected } = require("./index");
const syllables = ["B", "K", "L", "R", "Z", "-", "-", "-"];
const syllableLength = 150;

socketIoObj.on("connection", (socket) => {
  let testString = "B";
  console.log(Math.random(syllables.length));
  while (testString.length < 10) {
    testString += syllables[Math.floor(Math.random() * syllables.length)];
  }
  testString += "B";
  console.log({ testString });

  socketIoObj.emit("B", { test: testString, syllableLength, end: false });

  let counter = 0;
  let messageInterval = setInterval(() => {
    socketIoObj.emit(testString[counter], {});
    console.log("Emitting ", testString[counter], {});
    if (counter >= testString.length - 1) {
      socketIoObj.emit("B", { end: true });
      clearInterval(messageInterval);
    } else counter++;
  }, syllableLength);

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
