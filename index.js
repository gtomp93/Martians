const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { translations } = require("./data/translations");
const { translateMessage, transmitMessage } = require("./helpers");
const io = new Server(server);

let connected = false;
const syllableLength = 150;

let messageQueue = [];

app.use(express.static("public"));
app.use(express.json());

app.get("/listener", (req, res) => {
  res.sendFile(__dirname + "/public/listener/index.html");
});

app.get("/sender", (req, res) => {
  res.sendFile(__dirname + "/public/speaker/index.html");
});

//The speaker endpoint, which transmits the messages to the listener.
app.post("/api/speaker", async (req, res) => {
  //take the message and make it upperCase
  let message = req.body.message.toUpperCase();
  //Translate the message from English to Martian
  const martianMessage = translateMessage(message);

  //"connected" is a flag that represents when a message is already in the process
  //of being transmitted. When another message is still being transmitted,
  //the current message gets added to a message queue. It will get sent after all other
  //messages before it in the queue have been sent.
  if (connected) {
    messageQueue.push(translateMessage(req.body.message.toUpperCase()));
  } else {
    //The message can be transmitted and connected flag set to true to
    //represent that transmission has started.
    connected = true;
    //Transmit the message using the transmitMessage function, which returns
    //a promise. This function is defined in the helpers file.
    await transmitMessage(martianMessage, syllableLength, connected, io);
    //Clear out the message queue, if there is anything in it.
    while (messageQueue.length > 0) {
      await transmitMessage(messageQueue[0], syllableLength, connected, io);
      messageQueue.shift();
      if (messageQueue.length === 0) connected = false;
    }
    connected = false;

    return res.status(200).json({ status: 200, message: "message added" });
  }
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
