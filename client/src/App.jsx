import { useState, useEffect } from "react";
import io from "socket.io-client";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Input from "./components/Input";

function App() {
  const [count, setCount] = useState(0);
  const [score, setScores] = useState({});

  const socket = io("http://localhost:3000");

  const connectSocket = () => {
    socket.on("connection", (sock) => {
      console.log(sock);
    });
  };

  const handleInput = (event) => {
    let { name, value } = event.target;
    let currentObj = { [name]: value };

    setScores((prev) => ({ ...prev, ...currentObj }));
  };

  const sendScores = () => {
    console.log(score);
    socket.emit("scores", score);
  };

  useEffect(() => {
    connectSocket();
  }, []);

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
      <Input
        name="name"
        placeholder="Enter your name"
        handleInput={handleInput}
      />

      <Input
        name="score"
        placeholder="Enter your score"
        handleInput={handleInput}
      />

      <button className="send-scores" onClick={sendScores}>
        Publish score
      </button>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
