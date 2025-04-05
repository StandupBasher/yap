import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  autoConnect: false, // Don't connect until username is set
});

function App() {
  const [username, setUsername] = useState("");
  const [tempName, setTempName] = useState(""); // for the input form
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isConnected) return;

    socket.connect(); // connect once username is ready
    socket.emit("set_username", username);

    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [isConnected]);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (!tempName.trim()) return;
    setUsername(tempName.trim());
    setIsConnected(true);
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

  if (!isConnected) {
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
