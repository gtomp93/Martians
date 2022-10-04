const { socketIoObj } = require("../index");
const { sendTestMessages } = require("../helpers");
const syllableLength = 50;
const martianTestStringLength = 100;

socketIoObj.on("connection", (socket) => {
  //Make sure the test string starts with a letter
  let martianTestString = "L";
  while (martianTestString.length < martianTestStringLength) {
    martianTestString += "L";
  }
  martianTestString += "L";
  console.log({ martianTestString });

  socketIoObj.emit("L", {
    syllableLength,
    end: false,
    silenceLength: 1,
    martianTestString,
    englishTestString: "",
  });

  sendTestMessages(martianTestString, socketIoObj, syllableLength);

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});
