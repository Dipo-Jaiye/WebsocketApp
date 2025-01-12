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

io.disconnectSockets(true);

let count = 0;

io.on("connection", (socket) => {
  console.log("count is %d", count++);
  console.log("connected, %s", socket.id);
  socket.on("disconnect", (r) => {
    console.log("disconencted because: %s %s", r, socket.id);
  });
  // socket.join("ourroom");

  // io.to("ourroom").emit("chat", chatData);

  // socket.on("message", (data) => {
  //   console.log("message event recieved, %s", data);
  // });

  // socket.on("scores", (data) => {
  //   playerScores.push({ ...data, key: socket.id });
  //   io.emit("playerScores", playerScores);
  // });

  // socket.on("msg", (data) => {
  //   console.log(data);
  //   chatData.push({ message: data, name: socket.id });

  //   io.emit("chat", chatData);
  // });

  // socket.leave("ourroom");
});

io.disconnectSockets(true);

httpServer.listen(3000, () => {
  console.log("Server running");
});
