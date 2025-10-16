import React from "react";

export default function ChatMessage({ role, text }) {
  const isUser = role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", margin: "8px 0" }}>
      <div
        style={{
          background: isUser ? "#4c6fff" : "#ffffff",
          color: isUser ? "#ffffff" : "#0f172a",
          padding: "10px 12px",
          borderRadius: isUser ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
          maxWidth: "80%",
          wordWrap: "break-word",
          border: isUser ? "none" : "1px solid #e2e8f0"
        }}
      >
        {text}
      </div>
    </div>
  );
}
