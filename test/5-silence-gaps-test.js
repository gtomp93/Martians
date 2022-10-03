const { socketIoObj } = require("../index");
const { sendTestMessages } = require("../send-test-messages");
const syllableLength = 100;
const martianTestStringLength = 20;
console.log("hi");
socketIoObj.on("connection", (socket) => {
  //Make sure the test string starts with a letter
  let martianTestString = "L";
  while (martianTestString.length < martianTestStringLength) {
    martianTestString += "-----L";
  }
  console.log({ martianTestString });

  socketIoObj.emit("L", {
    martianTestString,
    syllableLength,
    end: false,
    silenceLength: 5,
  });

  sendTestMessages(martianTestString, socketIoObj, syllableLength);

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});
