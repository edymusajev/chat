import fs from "node:fs/promises";
import ws from "ws";
import http from "http";
import url from "node:url";

const server = http
  .createServer(async (req, res) => {
    if (!req.url) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
      return;
    }
    const parsedUrl = url.parse(req.url, true);

    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "GET");

    switch (parsedUrl.pathname) {
      case "/":
        res.writeHead(200, { "Content-Type": "text/html" });
        const indexHtmlFile = await fs.readFile("index.html", "utf-8");
        res.end(indexHtmlFile);
        break;
      case "/room":
        res.writeHead(200, { "Content-Type": "text/html" });
        const roomHtmlFile = await fs.readFile("room.html", "utf-8");
        res.end(roomHtmlFile);
        break;
      case "/index.ts":
        res.writeHead(200, { "Content-Type": "text/javascript" });
        const indexJsFile = await fs.readFile("index.ts", "utf-8");
        res.end(indexJsFile);
        break;
      case "/room.ts":
        res.writeHead(200, { "Content-Type": "text/javascript" });
        const roomJsFile = await fs.readFile("room.ts", "utf-8");
        res.end(roomJsFile);
        break;
      case "/api/room":
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
