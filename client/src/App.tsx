// when opening the app the user has 2 options: join a room or create a new room
// if the user joins a room, the user will be prompted to enter the room id
// if the user creates a new room, the user will be assigned a room id
// the user will be able to set how long a room will persist
// the user will be able to send messages to the room and share the room id with others to join
// the user will be able to see all the messages sent to the room

import { Chat } from "./Chat";

function App() {
  const handleCreateNewRoom = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    // we probably want to send a request to the backend to return us a room id and then navigate to it

    // get roomId
    const res = await fetch("http://localhost:8080/room");
    const data = await res.json();
    const roomId = data.roomId;

    const url = new URL(`${window.location.origin}/room?id=${roomId}`);
    window.location.href = url.href;
  };

  return (
    <div>
      {window.location.pathname === "/" && (
        <>
          <form>
            <label>Join a room</label>
            <input placeholder="Room ID" />
            <button>Join</button>
          </form>

          <form onSubmit={handleCreateNewRoom}>
            <label>Create new room</label>
            <button>Create</button>
          </form>
        </>
      )}
      {window.location.pathname.startsWith("/room") && <Chat />}
    </div>
  );
}

export default App;
