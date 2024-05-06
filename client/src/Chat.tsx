import { useEffect, useState } from "react";
const socket = new WebSocket("ws://localhost:8080");

// what we want is to first fetch from the server the chat history with the room id
const fetchChatHistory = async (roomId: string) => {
  const res = await fetch(`http://localhost:8080/room/${roomId}`);
  const data = await res.json();
  return data.messages;
};
// and then we use websockets to send and receive messages in real-time

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

  useEffect(() => {
    const url = new URL(window.location.href);
    const roomId = url.searchParams.get("id");
    if (!roomId) return;
    fetchChatHistory(roomId).then((messages) => {
      setMessages(messages);
    });
  });
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
