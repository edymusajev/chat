// when opening the app the user has 2 options: join a room or create a new room
// if the user joins a room, the user will be prompted to enter the room id
// if the user creates a new room, the user will be assigned a room id
// the user will be able to set how long a room will persist
// the user will be able to send messages to the room and share the room id with others to join
// the user will be able to see all the messages sent to the room

const createRoomForm = document.forms[1];

createRoomForm?.addEventListener("click", async (event) => {
  event.preventDefault();

  const res = await fetch("http://localhost:8080/api/room");
  const data = await res.json();
  const roomId = data.roomId;

  const url = new URL(`${window.location.origin}/room?id=${roomId}`);
  window.location.href = url.href;
});
