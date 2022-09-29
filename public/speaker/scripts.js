let message = document.querySelector("input").value;

const sendMessage = (e) => {
  console.log("in here");
  e.preventDefault();
  fetch("/sendMessage", {
    method: "POST",
    body: JSON.stringify({ message }),
    accept: "application/json",
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
};

document.querySelector("form").addEventListener("submit", sendMessage);
