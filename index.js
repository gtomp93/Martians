const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});

const syllables = ["B", "K", "L", "R", "Z", "-"];

setInterval(() => {
  const s = syllables[Math.floor(Math.random() * syllables.length)];
  console.log("Emitting ", s);
  if (s != "-") {
    io.emit(s, {});
  }
}, 800);
