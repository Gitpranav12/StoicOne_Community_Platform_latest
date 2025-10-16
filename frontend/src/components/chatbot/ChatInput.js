import React from "react";

export default function ChatInput({ input, setInput, onSend }) {
  return (
    <form
      onSubmit={onSend}
      style={{ display: "flex", borderTop: "1px solid #e2e8f0" }}
    >
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your question..."
        aria-label="Message"
        style={{
          flex: 1,
          border: "none",
          padding: "12px",
          outline: "none",
          background: "white",
          fontSize: 15
        }}
      />
      <button
        type="submit"
        style={{
          background: "#4c6fff",
          color: "white",
          border: "none",
          padding: "12px 16px",
          cursor: "pointer",
          fontWeight: 600
        }}
      >
        Send
      </button>
    </form>
  );
}
