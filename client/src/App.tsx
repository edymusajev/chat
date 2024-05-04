import { useEffect, useState } from "react";

const socket = new WebSocket("ws://localhost:8080");

// when opening the app the user has 2 options: join a room or create a new room
// if the user joins a room, the user will be prompted to enter the room id
// if the user creates a new room, the user will be assigned a room id
// the user will be able to set how long a room will persist
// the user will be able to send messages to the room and share the room id with others to join
// the user will be able to see all the messages sent to the room

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.send(message);
    setMessage("");
  };

  useEffect(() => {
    socket.onerror = (error) => {
      console.error("Error: ", error);
    };
    socket.onopen = () => {
      console.log("Connected to server");
    };
    socket.onmessage = (event) => {
      console.log("Received message: ", event.data);
      const messages = JSON.parse(event.data);
      setMessages((prevMessages) => messages);
    };
  }, []);
  return (
    <div>
      {messages.map((message) => (
        <div>{message}</div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
