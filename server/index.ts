import ws from "ws";

const websocketServer = new ws.WebSocketServer({ port: 8080 });

const messages: string[] = [];

websocketServer.on("connection", (websocket) => {
  websocket.send(JSON.stringify(messages));
  websocket.on("message", (message) => {
    messages.push(message.toString());

    websocketServer.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(JSON.stringify(messages));
      }
    });
  });

  websocket.on("error", (error) => {
    console.error("Error: ", error);
  });
});
