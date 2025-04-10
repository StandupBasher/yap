// client/src/App.js

import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import ChatBox from "./components/ChatBox";
import MessageInput from "./components/MessageInput";
import UsernameBar from "./components/UsernameBar";
import theme from "./styles/theme";

const socket = io("http://localhost:3001", { autoConnect: false });

function App() {
  const [username, setUsername] = useState(() => localStorage.getItem("yap-username") || "");
  const [tempName, setTempName] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [hasSentUsername, setHasSentUsername] = useState(false);

  useEffect(() => {
    socket.connect();

    socket.on("chat_history", (history) => {
      setChat(history);
    });

    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.disconnect();
      socket.off("chat_history");
      socket.off("receive_message");
    };
  }, []);

  useEffect(() => {
    if (username && !hasSentUsername) {
      socket.emit("set_username", username);
      setHasSentUsername(true);
    }
  }, [username, hasSentUsername]);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (!tempName.trim()) return;

    const cleanedName = tempName.trim();
    localStorage.setItem("yap-username", cleanedName);
    setUsername(cleanedName);
  };

  const handleNameChange = () => {
    setEditingName(true);
    setNewName(username);
  };

  const saveNewUsername = () => {
    const cleaned = newName.trim();
    if (!cleaned || cleaned === username) {
      setEditingName(false);
      return;
    }

    localStorage.setItem("yap-username", cleaned);
    setUsername(cleaned);
    socket.emit("change_username", cleaned);
    setEditingName(false);
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
      <div style={styles.wrapper}>
        <h2 style={styles.title}>Welcome to Yap</h2>
        <form onSubmit={handleUsernameSubmit} style={styles.loginForm}>
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            placeholder="Enter your username"
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Join Chat</button>
        </form>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <h2 style={styles.title}># general</h2>
        <UsernameBar
          username={username}
          editingName={editingName}
          newName={newName}
          setNewName={setNewName}
          onChange={handleNameChange}
          onSave={saveNewUsername}
        />
      </header>

      <main style={styles.chatContainer}>
        <ChatBox chat={chat} username={username} />
      </main>

      <footer style={styles.inputContainer}>
        <MessageInput
          message={message}
          setMessage={setMessage}
          onSend={sendMessage}
          onKeypress={handleKeypress}
        />
      </footer>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    fontFamily: theme.font,
    boxSizing: "border-box",
    overflow: "hidden",
  },
  header: {
    padding: "16px 20px",
    borderBottom: `1px solid ${theme.colors.border}`,
    flexShrink: 0,
  },
  title: {
    margin: 0,
    fontSize: "1.2rem",
  },
  chatContainer: {
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
    padding: "0 20px",
  },
  inputContainer: {
    padding: "16px 20px",
    borderTop: `1px solid ${theme.colors.border}`,
    flexShrink: 0,
  },
  loginForm: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #555",
    backgroundColor: theme.colors.input,
    color: theme.colors.text,
  },
  button: {
    padding: "8px 12px",
    backgroundColor: theme.colors.button,
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default App;
