const postMessage = (message, fullMessage) => {
  let text = document.createElement("li");
  if (fullMessage) text.classList.add("full");
  text.innerText = message;
  document.querySelector("ul").appendChild(text);
};
