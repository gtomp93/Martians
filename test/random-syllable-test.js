const { socketIoObj, connected } = require("../index");
const { sendTestMessages } = require("../helpers");
const syllables = ["B", "K", "L", "R", "Z", "-", "-", "-", "-"];
const syllableLength = 150;
const martianTestStringLength = 50;

socketIoObj.on("connection", (socket) => {
  let martianTestString = "B";
  while (martianTestString.length < martianTestStringLength) {
    martianTestString +=
      syllables[Math.floor(Math.random() * syllables.length)];
  }
  martianTestString += "B";

  socketIoObj.emit("B", { martianTestString, syllableLength, end: false });

  sendTestMessages(martianTestString, socketIoObj, syllableLength);

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});
