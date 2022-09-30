const express = require("express");
const app = express();
const http = require("http");
const { emit } = require("process");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
let connected = false;
app.use(express.static("public"));
app.use(express.json());

app.get("/listener", (req, res) => {
  res.sendFile(__dirname + "/public/listener/index.html");
});

app.get("/sender", (req, res) => {
  res.sendFile(__dirname + "/public/speaker/index.html");
});

app.post("/sendMessage", (req, res) => {
  let message = req.body.message.toUpperCase();
  console.log(message);
  const translations = {
    FOOD: "B--BB-K---Z",
    I: "L-R-Z",
    HATE: "KK-ZZ",
  };
  let counter = 0;
  const decodedMessage = message.split(" ").reduce((fullMessage, word) => {
    let encodedWord = translations[word.replace(/[.?!]/, "")]
      ? translations[word.replace(/[.?!]/, "")]
      : "B--K--Z";
    let space = "-----";
    let endSentence = "----------";
    return word.slice(-1).match(/[.?!]/)
      ? fullMessage + encodedWord + endSentence
      : fullMessage + encodedWord + space;
  }, "");
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
  }, 200);
});

io.on("connection", (socket) => {
  connected = true;
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});

const socketIoObj = io;
module.exports = { socketIoObj, connected };
