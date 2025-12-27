import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import NoteBubble from "./NoteBubble";

const ChatFeed = ({ messages }) => {
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="flex-1 overflow-y-auto p-4 space-y-2 rounded-2xl custom-scrollbar"
      style={{
        scrollbarWidth: "thin", // Firefox
        scrollbarColor: "#cbd5e0 #f7fafc",
      }}
    >
      {messages.map((item, index) =>
        item.type === "note" ? (
          <NoteBubble key={index} note={item} />
        ) : (
          <MessageBubble key={index} message={item} />
        )
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatFeed;
