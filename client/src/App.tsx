import { useEffect, useState } from "react";

const socket = new WebSocket("ws://localhost:8080");

socket.onerror = (error) => {
  console.error("Error: ", error);
};

socket.onopen = () => {
  console.log("Connected to server");
};

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.send(message);
    setMessage("");
  };

  useEffect(() => {
    socket.onmessage = (event) => {
      console.log("Received message: ", event.data);
      const messages = JSON.parse(event.data);
      setMessages((prevMessages) => messages);
    };
  });
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
