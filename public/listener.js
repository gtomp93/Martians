// const { io } = require("socket.io-client");
const socket = io("ws://localhost:3000");
const syllables = ["B", "K", "L", "R", "Z"];

console.log("huh");

syllables.forEach((s) => {
  socket.on(s, (...args) => {
    console.log("received " + s + " at " + new Date().getTime());
    let text = document.createElement("p");
    text.innerText = s;
    document.querySelector("body").appendChild(text);
  });
});
