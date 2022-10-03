const { socketIoObj } = require("../index");
const { sendTestMessages } = require("../send-test-messages");
const syllableLength = 50;
const martianTestStringLength = 25;

socketIoObj.on("connection", (socket) => {
  //Make sure the test string starts with a letter
  let martianTestString = "L";
  let counter = 0;
  while (martianTestString.length < martianTestStringLength) {
    martianTestString += "--L";
  }
  console.log({ martianTestString });

  socketIoObj.emit("L", {
    martianTestString,
    syllableLength,
    end: false,
    silenceLength: 2,
  });

  sendTestMessages(martianTestString, socketIoObj, syllableLength);

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});
