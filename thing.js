const { socketIoObj, connected } = require("./index");
// const socket = io("ws://localhost:3000");

// socket.on("S", {});
const syllables = ["B", "K", "L", "R", "Z", "-"];

// socketIoObj.on("connection", (socket) => {
//   console.log("a newuser connected");
//   let testConnection = true;
//   if (connected) socketIoObj.emit("R", {});
//   socket.on("disconnect", () => {
//     console.log("a user disconnected");
//   });
// });
if (connected) {
  setInterval(() => {
    const s = syllables[Math.floor(Math.random() * syllables.length)];
    console.log("Emitting ", s);
    if (s != "-") {
      socketIoObj.emit(s, {});
    }
  }, 200);
}
