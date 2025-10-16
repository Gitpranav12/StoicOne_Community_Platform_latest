import React, { useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import logo from "../../assets/logo.png"; // adjust path based on your folder structure


export default function ChatWindow({
    messages,
    loading,
    input,
    setInput,
    onSend,
    onClose
}) {
    const scrollRef = useRef(null);

    useEffect(() => {
        const el = scrollRef.current;
        if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, [messages, loading]);

    return (
        <div
            className="chat-window"
            style={{
                position: "fixed",
                bottom: 110,
                right: 24,
                width: 380,
                maxWidth: "92vw",
                maxHeight: 550,
                background: "rgba(248, 250, 252, 0.9)",
                backdropFilter: "saturate(140%) blur(6px)",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(2,6,23,0.18)",
                border: "1px solid #e2e8f0",
                display: "flex",
                flexDirection: "column",
                zIndex: 40
            }}
        >
          {/* Header */}
<div
  style={{
    padding: "12px 14px",
    background: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  }}
>
  {/* Left section: Logo + Text */}
  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <img
      src={logo}
      alt="Logo"
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        objectFit: "cover",
        border: "1px solid #e2e8f0"
      }}
    />
    <div>
      <div style={{ fontWeight: 700, fontSize: 14 }}>Stoic & Salamander Assistant</div>
      <div style={{ color: "#64748b", fontSize: 12 }}>Online</div>
    </div>
  </div>

  {/* Close Button */}
  <button
    onClick={onClose}
    aria-label="Close chat"
    style={{
      border: "none",
      background: "transparent",
      fontSize: 18,
      cursor: "pointer",
      color: "#334155"
    }}
  >
    ✕
  </button>
</div>


            {/* Messages */}
            <div
                ref={scrollRef}
                className="chat-scroll"
                style={{ flex: 1, overflowY: "auto", padding: "12px" }}
            >
                {messages.map((m, i) => (
                    <ChatMessage key={i} role={m.role} text={m.text} />
                ))}
                {loading && (
                    <div style={{ display: "flex", gap: 6, padding: "6px 2px", color: "#475569" }}>
                        <span style={{ animation: "blink 1s infinite" }}>●</span>
                        <span style={{ animation: "blink 1s infinite 0.15s" }}>●</span>
                        <span style={{ animation: "blink 1s infinite 0.3s" }}>●</span>
                    </div>
                )}
            </div>

            {/* Input */}
            <ChatInput input={input} setInput={setInput} onSend={onSend} />
        </div>
    );
}
