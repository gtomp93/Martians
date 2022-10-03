const { socketIoObj } = require("../index");
const { sendTestMessages } = require("../send-test-messages");
const syllableLength = 50;
const martianTestStringLength = 100;

console.log("ok");
socketIoObj.on("connection", (socket) => {
  //Make sure the test string starts with a letter
  let martianTestString = "L";
  while (martianTestString.length < martianTestStringLength) {
    martianTestString += "L";
  }
  martianTestString += "L";
  console.log({ martianTestString });

  socketIoObj.emit("L", {
    martianTestString,
    syllableLength,
    end: false,
    silenceLength: 1,
  });

  sendTestMessages(martianmartianTestString, socketIoObj, syllableLength);

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});
