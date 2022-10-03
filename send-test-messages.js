const sendTestMessages = (martianTestString, socketIoObj, syllableLength) => {
  counter = 0;
  console.log("ksjdkj");
  let messageInterval = setInterval(() => {
    socketIoObj.emit(martianTestString[counter], {});
    console.log("Emitting ", martianTestString[counter], {});
    if (counter >= martianTestString.length - 1) {
      socketIoObj.emit("B", { end: true });
      clearInterval(messageInterval);
    } else counter++;
  }, syllableLength);
};

module.exports = { sendTestMessages };
