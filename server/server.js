const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

let playerScores = [];

io.on("connection", (socket) => {
  socket.on("message", (data) => {
    console.log("message event recieved, %s", data);
  });

  socket.on("scores", (data) => {
    playerScores.push({ ...data, key: socket.id });
  });

  setInterval(() => {
    socket.emit("playerScores", playerScores);
  }, 5000);
});

httpServer.listen(3000, () => {
  console.log("Server running");
});
