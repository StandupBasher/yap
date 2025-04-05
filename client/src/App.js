import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001", { autoConnect: false });

function App() {
  const [username, setUsername] = useState(() => localStorage.getItem("yap-username") || "");
  const [tempName, setTempName] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    if (!username) return;

    socket.connect();
    socket.emit("set_username", username);

    socket.on("chat_history", (history) => {
      setChat(history);
    });

    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.off("chat_history");
      socket.off("receive_message");
    };
  }, [username]);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (!tempName.trim()) return;

    const cleanedName = tempName.trim();
    localStorage.setItem("yap-username", cleanedName);
    setUsername(cleanedName);
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit("send_message", message);
    setMessage("");
  };

  const handleKeypress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!username) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Welcome to Yap</h2>
        <form onSubmit={handleUsernameSubmit}>
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            placeholder="Enter your username"
          />
          <button type="submit">Join Chat</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Yap Chat</h2>
      <div style={{ marginBottom: "10px" }}>
        {chat.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.sender}:</strong> {msg.message}
            {msg.createdAt && (
              <span style={{ marginLeft: "10px", fontSize: "0.8em", color: "gray" }}>
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
            )}
          </div>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type something..."
        onKeyDown={handleKeypress}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
