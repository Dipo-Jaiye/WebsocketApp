const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "http://127.0.0.1:5500"
    }
});

io.on("connection", (socket) => {
    io.on("message", (data) => {
        console.log("message event recieved");
    });

    io.on("typeshii", (data) => {
        console.log("ts event recieved");
    });

    io.on("mimi", (data) => {
        console.log("mimi, %s", data);
    });

    console.log("socket connection emitted and listeners registered");

    socket.emit("message", "Hello Dipo");
    socket.emit("typeshii", "wagwan");
});

httpServer.listen(3000, () => {
    console.log("Server running");
});