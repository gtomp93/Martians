const { socketIoObj, connected } = require("../index");
const { sendTestMessages } = require("../helpers");
const syllables = ["B", "K", "L", "R", "Z", "-", "-", "-", "-"];
const syllableLength = 150;
const martianTestStringLength = 50;

console.log("ok");

socketIoObj.on("connection", (socket) => {
  let martianTestString = "B";
  console.log(Math.random(syllables.length));
  while (martianTestString.length < martianTestStringLength) {
    martianTestString +=
      syllables[Math.floor(Math.random() * syllables.length)];
  }
  martianTestString += "B";
  console.log({ martianTestString });

  socketIoObj.emit("B", { martianTestString, syllableLength, end: false });

  sendTestMessages(martianTestString, socketIoObj, syllableLength);

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});
