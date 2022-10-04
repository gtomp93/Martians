const { socketIoObj } = require("../index");
const { sendTestMessages } = require("../helpers");
const syllableLength = 150;
const martianTestStringLength = 25;

socketIoObj.on("connection", (socket) => {
  //Make sure the test string starts with a letter
  let martianTestString = "L";
  while (martianTestString.length < martianTestStringLength) {
    martianTestString += "--L";
  }

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
