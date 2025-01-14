const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

let playerScores = [];
let chatData = [];

io.on("connection", (socket) => {
  socket.on("disconnect", (r) => {
    console.log("disconencted because: %s %s", r, socket.id);
  });

  socket.on("message", (data) => {
    console.log("message event recieved, %s", data);
  });

  socket.on("scores", (data) => {
    playerScores.push({ ...data, key: socket.id });
    io.emit("playerScores", playerScores);
  });

  socket.on("msg", (data) => {
    console.log(data);
    chatData.push({ message: data, name: socket.id });

    io.emit("chat", chatData);
  });
});

httpServer.listen(3000, () => {
  console.log("Server running");
});
