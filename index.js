const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.use(express.static("public"));
app.use(express.json());

app.get("/listener", (req, res) => {
  res.sendFile(__dirname + "/public/listener/index.html");
});

app.get("/sender", (req, res) => {
  res.sendFile(__dirname + "/public/speaker/index.html");
});

app.post("/sendMessage", (req, res) => {
  let sentence = req.body.message.toUpperCase();
  console.log(sentence);
  const syllables = ["B", "K", "L", "R", "Z", "-"];
  const translations = { FOOD: "B--BB-K---Z", I: "L-R-Z", HATE: "KK-ZZ" };
  let counter = 0;
  const decodedSentence = sentence
    .split(" ")
    .reduce((decodeSentence, word, index) => {
      let encodedWord = translations[word];
      let space = "-----";
      return index === sentence.length - 1
        ? decodeSentence + encodedWord
        : decodeSentence + encodedWord + space;
    }, "");
  console.log(decodedSentence);

  let messageInterval = setInterval(() => {
    let symbol = decodedSentence[counter];

    counter++;
    // console.log(counter);
    console.log(symbol);
    if (symbol != "-") {
      io.emit(symbol, {});
    }
    if (counter >= decodedSentence.length) {
      clearInterval(messageInterval);
    }
  }, 200);
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
