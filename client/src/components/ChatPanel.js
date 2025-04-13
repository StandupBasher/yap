// client/src/components/ChatPanel.js
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import UsernameBar from "./UsernameBar";
import ChatBox from "./ChatBox";
import MessageInput from "./MessageInput";
import theme from "../styles/theme";

const socket = io("http://localhost:3001", { autoConnect: false });

const ChatPanel = () => {
  const [username, setUsername] = useState(() => localStorage.getItem("yap-username") || "");
  const [tempName, setTempName] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [hasSentUsername, setHasSentUsername] = useState(false);

  useEffect(() => {
    socket.connect();

    const handleChatHistory = (history) => setChat(history);
    const handleReceiveMessage = (data) => setChat((prev) => [...prev, data]);

    socket.on("chat_history", handleChatHistory);
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.disconnect();
      socket.off("chat_history", handleChatHistory);
      socket.off("receive_message", handleReceiveMessage);
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
    const cleaned = tempName.trim();
    if (!cleaned) return;
    localStorage.setItem("yap-username", cleaned);
    setUsername(cleaned);
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
    const trimmed = message.trim();
    if (!trimmed) return;
    socket.emit("send_message", trimmed);
    setMessage("");
  };

  const handleKeypress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!username) {
    return (
      <div style={styles.authPanel}>
        <h2 style={styles.title}>Welcome to Yap</h2>
        <form onSubmit={handleUsernameSubmit} style={styles.loginForm}>
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            placeholder="Enter your username"
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Join</button>
        </form>
      </div>
    );
  }

  return (
    <div style={styles.panelWrapper}>
      <div style={styles.header}>
        <h2 style={styles.channel}># general</h2>
        <UsernameBar
          username={username}
          editingName={editingName}
          newName={newName}
          setNewName={setNewName}
          onChange={handleNameChange}
          onSave={saveNewUsername}
        />
      </div>
      <div style={styles.chatBox}>
        <ChatBox chat={chat} username={username} />
      </div>
      <div style={styles.inputContainer}>
        <MessageInput
          message={message}
          setMessage={setMessage}
          onSend={sendMessage}
          onKeypress={handleKeypress}
        />
      </div>
    </div>
  );
};

const styles = {
  panelWrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    position: "relative",
    overflow: "hidden",
  },
  header: {
    padding: "12px 20px",
    borderBottom: `1px solid ${theme.colors.border}`,
    flexShrink: 0,
  },
  channel: {
    margin: 0,
    fontSize: "1.1rem",
  },
  chatBox: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
  },
  inputContainer: {
    padding: "12px 20px",
    borderTop: `1px solid ${theme.colors.border}`,
    flexShrink: 0,
    backgroundColor: theme.colors.background,
  },
  authPanel: {
    padding: "40px",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
  },
  loginForm: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
  },
  input: {
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

export default ChatPanel;
