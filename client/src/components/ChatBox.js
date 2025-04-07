import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import theme from "../styles/theme";

const ChatBox = ({ chat, username }) => {
  const boxRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    if (!boxRef.current || !endRef.current) return;

    const box = boxRef.current;

    const isNearBottom =
      box.scrollHeight - box.scrollTop - box.clientHeight < 100;

    if (isNearBottom) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);

  return (
    <div
      ref={boxRef}
      style={{
        flex: 1,
        backgroundColor: theme.colors.panel,
        border: `1px solid ${theme.colors.border}`,
        padding: "10px",
        borderRadius: "5px",
        overflowY: "auto",
        marginBottom: "10px",
        minHeight: 0,
      }}
    >
      {chat.map((msg, idx) => (
        <MessageBubble key={idx} msg={msg} isOwn={msg.sender === username} />
      ))}
      <div ref={endRef} />
    </div>
  );
};

export default ChatBox;
