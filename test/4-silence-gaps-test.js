const { socketIoObj } = require("../index");
const { sendTestMessages } = require("../helpers");
const syllableLength = 200;
const martianTestStringLength = 50;
socketIoObj.on("connection", (socket) => {
  //Make sure the test string starts with a letter
  let martianTestString = "L";
  while (martianTestString.length < martianTestStringLength) {
    martianTestString += "----L";
  }
  console.log({ martianTestString });

  socketIoObj.emit("L", {
    syllableLength,
    end: false,
    silenceLength: 4,
    martianTestString,
    englishTestString: "",
  });

  sendTestMessages(martianTestString, socketIoObj, syllableLength);
  connected = true;

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});
