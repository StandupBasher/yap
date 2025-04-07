import React from "react";
import theme from "../styles/theme";

const MessageBubble = ({ msg, isOwn }) => {
  const isSystem = msg.sender === "system";
  const style = isSystem
    ? {
        color: theme.colors.system,
        fontStyle: "italic",
        margin: "6px 0",
      }
    : {
        backgroundColor: isOwn ? "#2a2a2a" : "#242424",
        padding: "8px",
        margin: "4px 0",
        borderRadius: "5px",
      };

  return (
    <div style={style}>
      <strong>{msg.sender}:</strong> {msg.message}
      {msg.createdAt && !isSystem && (
        <div style={{ fontSize: "0.7em", color: theme.colors.system, marginTop: "4px" }}>
          {new Date(msg.createdAt).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
