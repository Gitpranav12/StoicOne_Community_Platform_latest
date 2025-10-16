import React from "react";
import { useNavigate } from "react-router-dom";


export default function ExitPopup({ show, onCancel, onConfirm }) {
  const navigate = useNavigate();

  // Wrapped onConfirm to add redirection
  const handleConfirm = () => {
    if(onConfirm) onConfirm(); // call original callback if any
    navigate(-1); // redirect to Events page
  };
  if (!show) return null;
  return (
    <div
      style={{
        position: "fixed",
        zIndex: 2000,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          maxWidth: 600,
          minWidth: 400,
          width: "96%",
          boxShadow: "0 6px 32px rgba(0,0,0,0.19)",
          padding: "38px 38px 28px 38px",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Exit Quiz?</div>
        <div
          style={{
            color: "#76777a",
            fontSize: 15,
            marginBottom: 32,
            marginTop: 2
          }}
        >
          Are you sure you want to exit? Your progress will be lost.
        </div>
        <div style={{ display: "flex", gap: 18, justifyContent: "flex-end" }}>
          <button
            style={{
              border: "1.5px solid #e2e6ee",
              background: "#fff",
              color: "#18181f",
              fontWeight: 500,
              fontSize: 16,
              borderRadius: 9,
              padding: "10px 24px",
              minWidth: 140,
              cursor: "pointer"
            }}
            onClick={onCancel}
          >
            Continue Quiz
          </button>
          <button
            style={{
              background: "#0a0a13",
              color: "#fff",
              fontWeight: 600,
              fontSize: 16,
              border: "none",
              borderRadius: 9,
              padding: "10px 28px",
              minWidth: 90,
              cursor: "pointer"
            }}
            onClick={handleConfirm}
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}
