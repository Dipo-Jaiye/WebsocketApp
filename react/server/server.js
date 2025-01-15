const { createServer } = require("http");
const { Server } = require("socket.io");
const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");

/* abstract */ class SessionStore {
  findSession(id) {}
  saveSession(id, session) {}
  findAllSessions() {}
}

class InMemorySessionStore extends SessionStore {
  constructor() {
    super();
    this.sessions = new Map();
  }

  findSession(id) {
    return this.sessions.get(id);
  }

  saveSession(id, session) {
    this.sessions.set(id, session);
  }

  findAllSessions() {
    return [...this.sessions.values()];
  }
}

const sessionStore = new InMemorySessionStore();

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

let playerScores = [];
let chatData = [];

io.use(async (socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    const session = await sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;
      return next();
    }
  }
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.sessionID = randomId();
  socket.userID = randomId();
  socket.username = username;
  next();
});

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
