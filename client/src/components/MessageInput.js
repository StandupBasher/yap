// client/src/components/MessageInput.js

import React, { useRef, useEffect } from "react";
import theme from "../styles/theme";

const MessageInput = ({ message, setMessage, onSend, onKeypress }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "36px"; // reset to base height
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [message]);

  return (
    <div style={{
      display: "flex",
      gap: "10px",
      alignItems: "flex-end",
      maxHeight: "140px",
      width: "100%",
      boxSizing: "border-box",
    }}>
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type something..."
        onKeyDown={onKeypress}
        rows={1}
        style={{
          flex: 1,
          padding: "8px",
          borderRadius: "5px",
          border: "1px solid #555",
          backgroundColor: theme.colors.input,
          color: theme.colors.text,
          resize: "none",
          overflow: "auto",
          lineHeight: "1.4",
          fontFamily: "inherit",
          fontSize: "inherit",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          overflowWrap: "break-word",
          minHeight: "36px",
          maxHeight: "120px",
        }}
      />
      <button
        onClick={onSend}
        style={{
          padding: "8px 12px",
          backgroundColor: theme.colors.button,
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          height: "fit-content",
          flexShrink: 0,
        }}
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
