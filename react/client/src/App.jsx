import { useState, useEffect } from "react";
import io from "socket.io-client";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Input from "./components/Input";

function App() {
  const [count, setCount] = useState(0);
  const [score, setScores] = useState({});
  const [scores, setAllScores] = useState([]);
  const [chatbox, setChatbox] = useState([]);
  const [msg, setMsg] = useState("");

  const socket = io("http://localhost:3000", { autoConnect: false });

  const usernameAlreadySelected = false;

  socket.on("connect", (sock) => {
    console.log(sock);
  });

  const sessionID = sessionStorage.getItem("sessionID");

  if (sessionID) {
    usernameAlreadySelected = true;
    socket.auth = { sessionID };
    socket.connect();
  }

  socket.on("session", ({ sessionID, userID }) => {
    // attach the session ID to the next reconnection attempts
    socket.auth = { sessionID };
    // store it in the sessionStorage
    sessionStorage.setItem("sessionID", sessionID);
    // save the ID of the user
    socket.userID = userID;
  });

  socket.on("connect_error", (err) => {
    if (err.message === "invalid username") {
      usernameAlreadySelected = false;
    }
  });

  const handleInput = (event) => {
    let { name, value } = event.target;
    let currentObj = { [name]: value };

    setScores((prev) => ({ ...prev, ...currentObj }));
  };

  const handleMessage = (event) => {
    let { value } = event.target;

    setMsg(value);
  };

  const sendMessage = () => {
    socket.emit("msg", msg);
  };

  const sendScores = () => {
    socket.emit("scores", score);
  };

  socket.on("playerScores", (data) => {
    console.log(data);
    setAllScores(data);
  });

  socket.on("chat", (chatData) => {
    console.log(chatData);
    setChatbox(chatData);
  });

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React Multiplayer Dashboard</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <div className="card">
        <h3>ChatRoom View</h3>
        {chatbox?.length > 0 ? (
          chatbox.map((chatData) => (
            <p>
              Username {chatData?.name}: {chatData?.message}
            </p>
          ))
        ) : (
          <></>
        )}
        <Input
          name="msg"
          placeholder="Enter a message"
          handleInput={handleMessage}
        />
        <button onClick={sendMessage}>Send message</button>
      </div>
      <Input
        name="name"
        placeholder="Enter your name"
        handleInput={handleInput}
      />

      <Input
        name="score"
        placeholder="Enter your score here"
        handleInput={handleInput}
      />

      <button className="send-scores" onClick={sendScores}>
        Publish score
      </button>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      {scores?.length > 0 ? (
        <table>
          <tbody>
            <tr>
              <th>Player Name</th>
              <th>Player Score</th>
            </tr>
            {scores.map((scoreData) => (
              <tr>
                <td>{scoreData?.name}</td>
                <td>{scoreData?.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <></>
      )}
    </>
  );
}

export default App;
