const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173"
    }
});

io.on("connection", (socket) => {
    socket.on("message", (data) => {
        console.log("message event recieved, %s", data);
    });

    console.log("socket connection emitted and listeners registered");

    socket.emit("message", "Hello Dipo");
});

httpServer.listen(3000, () => {
    console.log("Server running");
});