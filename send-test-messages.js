const sendTestMessages = (testString, socketIoObj, syllableLength) => {
  counter = 0;
  console.log("ksjdkj");
  let messageInterval = setInterval(() => {
    socketIoObj.emit(testString[counter], {});
    console.log("Emitting ", testString[counter], {});
    if (counter >= testString.length - 1) {
      socketIoObj.emit("B", { end: true });
      clearInterval(messageInterval);
    } else counter++;
  }, syllableLength);
};

module.exports = { sendTestMessages };
