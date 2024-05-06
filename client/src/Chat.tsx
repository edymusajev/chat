import { useEffect, useState } from "react";
const socket = new WebSocket("ws://localhost:8080");

export const Chat = () => {
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
    <>
      {messages.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
};
