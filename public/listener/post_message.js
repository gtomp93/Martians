const postMessage = (message) => {
  console.log({ thing: document.querySelector("ul") });
  let text = document.createElement("li");
  text.innerText = message;
  document.querySelector("ul").appendChild(text);
};
