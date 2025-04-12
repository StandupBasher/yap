// client/src/components/ChatBox.js

import React, { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import theme from "../styles/theme";

const ChatBox = ({ chat, username }) => {
  const scrollRef = useRef(null);
  const [showJump, setShowJump] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
    setShowJump(false);
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    setShowJump(!isNearBottom);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;

    if (!hasInitialized) {
      el.scrollTop = el.scrollHeight;
      setHasInitialized(true);
      return;
    }

    if (isNearBottom) el.scrollTop = el.scrollHeight;
    setShowJump(!isNearBottom);
  }, [chat, hasInitialized]);

  return (
    <div style={outerContainer}>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={scrollContainer}
      >
        {chat.map((msg, idx) => (
          <MessageBubble key={idx} msg={msg} isOwn={msg.sender === username} />
        ))}
        <div style={{ height: 32 }} />
      </div>

      {showJump && (
        <button onClick={scrollToBottom} style={jumpButton}>
          Jump to Present
        </button>
      )}
    </div>
  );
};

const outerContainer = {
  flex: 1,
  minHeight: 0,
  position: "relative",
  display: "flex",
  flexDirection: "column",
};

const scrollContainer = {
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
  padding: "10px",
  backgroundColor: theme.colors.panel,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: "5px",
};

const jumpButton = {
  position: "absolute",
  bottom: "10px",
  right: "10px",
  padding: "6px 12px",
  borderRadius: "5px",
  backgroundColor: theme.colors.button,
  color: "#fff",
  border: "none",
  cursor: "pointer",
  zIndex: 1,
};

export default ChatBox;
