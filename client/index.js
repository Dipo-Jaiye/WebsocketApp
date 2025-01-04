const wsio = io("http://localhost:3000");

wsio.on("connect", (response) => {
    console.log("tried to connect");
});

wsio.on("disconnect", (response) => {
    console.log("socket disconnected");
});

wsio.on("message", (data) => {
    console.log(data);

    wsio.emit("mimi");
    wsio.emit("message", "ahhhh");
    wsio.emit("typeshii", "shukeshukee");

    console.log("should have emitted");
});

wsio.on("typeshii", (data) => {
    console.log("typeshii data received, %s", data);
    wsio.emit("typeshii", "type back back");
});