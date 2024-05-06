import ws from "ws";
import http from "http";

const server = http
  .createServer((req, res) => {
    const route = req.url;

    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "GET");

    switch (route) {
      case "/room":
        res.writeHead(200, { "Content-Type": "application/json" });
        const roomId = Math.random().toString(36).substring(7);
        res.end(JSON.stringify({ roomId: roomId }));
        break;
      default:
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not found");
    }
  })
  .listen(8080);

const websocketServer = new ws.WebSocketServer({ server });
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
