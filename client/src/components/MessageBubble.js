import React from "react";
import theme from "../styles/theme";

const MessageBubble = ({ msg, isOwn }) => {
  const isSystem = msg.sender === "system";

  return (
    <div
      style={{
        textAlign: isSystem ? "center" : isOwn ? "right" : "left",
        marginBottom: "8px",
      }}
    >
      {!isSystem && (
        <div style={{ fontSize: "0.85em", color: "#999" }}>{msg.sender}</div>
      )}
      <div
        style={{
          display: "inline-block",
          padding: "8px 12px",
          borderRadius: "12px",
          backgroundColor: isSystem
            ? "transparent"
            : isOwn
            ? theme.colors.accent
            : theme.colors.panel,
          color: isSystem ? "#888" : theme.colors.text,
          whiteSpace: "pre-wrap",
          maxWidth: "80%",
          wordBreak: "break-word",
        }}
      >
        {msg.message}
      </div>
      {msg.createdAt && (
        <div style={{ fontSize: "0.75em", color: "#666", marginTop: "2px" }}>
          {new Date(msg.createdAt).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
