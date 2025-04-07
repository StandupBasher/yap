import React from "react";
import theme from "../styles/theme";

const MessageInput = ({ message, setMessage, onSend, onKeypress }) => (
  <div style={{ display: "flex", gap: "10px" }}>
    <input
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Type something..."
      onKeyDown={onKeypress}
      style={{
        flex: 1,
        padding: "8px",
        borderRadius: "5px",
        border: "1px solid #555",
        backgroundColor: theme.colors.input,
        color: theme.colors.text,
      }}
    />
    <button onClick={onSend} style={{
      padding: "8px 12px",
      backgroundColor: theme.colors.button,
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    }}>
      Send
    </button>
  </div>
);

export default MessageInput;
