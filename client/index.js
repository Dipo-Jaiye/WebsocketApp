const wsio = io("http://localhost:3000");

wsio.on("connect", (response) => {
    console.log("tried to connect");
});

wsio.on("disconnect", (response) => {
    console.log("socket disconnected");
});

wsio.on("message", (data) => {
    console.log(data);

    wsio.emit("message", "Hi Stranger, how's it goin");
});