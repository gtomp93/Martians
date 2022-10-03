const { socketIoObj } = require("../index");
const { sendTestMessages } = require("../helpers");
const syllableLength = 50;
const martianTestStringLength = 25;
// let connected = false;
// if (connected) {
socketIoObj.on("connection", (socket) => {
  //Make sure the test string starts with a letter
  connected = true;
  let martianTestString = "L";
  while (martianTestString.length < martianTestStringLength) {
    martianTestString += "--L";
  }
  console.log({ martianTestString });

  socketIoObj.emit("L", {
    syllableLength,
    end: false,
    silenceLength: 2,
    martianTestString,
    englishTestString: "",
  });

  sendTestMessages(martianTestString, socketIoObj, syllableLength);

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});
// }
