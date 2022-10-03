const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { translations } = require("./data/translations");
const { encodeMessage } = require("./helpers");
const io = new Server(server);
let connected = false;
const syllableLength = 200;

app.use(express.static("public"));
app.use(express.json());
console.log("up here");
app.get("/listener", (req, res) => {
  res.sendFile(__dirname + "/public/listener/index.html");
});

app.get("/sender", (req, res) => {
  res.sendFile(__dirname + "/public/speaker/index.html");
});

app.post("/sendMessage", (req, res) => {
  let message = req.body.message.toUpperCase();
  console.log(message);

  let counter = 0;
  const decodedMessage = encodeMessage(message);
  console.log(decodedMessage);

  let messageInterval = setInterval(() => {
    let symbol = decodedMessage[counter];

    counter++;
    console.log(symbol);
    if (symbol != "-") {
      io.emit(symbol, {});
    }
    if (counter >= decodedMessage.length) {
      clearInterval(messageInterval);
    }
  }, syllableLength);
});

io.on("connection", (socket) => {
  console.log("a user connected here");

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});

const socketIoObj = io;
module.exports = { socketIoObj, connected };
