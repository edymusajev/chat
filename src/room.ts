const socket = new WebSocket("ws://localhost:8080");

let messages = [];

const messagesElement = document.getElementById("messages");

socket.onerror = (error) => {
  console.error("Error: ", error);
};
socket.onopen = () => {
  console.log("Connected to server");
};
socket.onmessage = (event) => {
  console.log("Received message: ", event.data);
  messages = JSON.parse(event.data);

  if (messagesElement) {
    messagesElement.innerHTML = "";

    messages.forEach((message: string) => {
      const messageElement = document.createElement("div");
      messageElement.innerText = message;
      messagesElement.appendChild(messageElement);
    });
  }
};

const roomTitleElement = document.getElementById("room-title");
const url = new URL(window.location.href);

if (roomTitleElement) {
  roomTitleElement.innerText = `Room ID: ${url.searchParams.get("id")}`;
}

const messageForm = document.forms[0];
messageForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const messageInput = messageForm.elements.namedItem(
    "message"
  ) as HTMLInputElement;

  socket.send(messageInput.value);

  messageInput.value = "";
});
