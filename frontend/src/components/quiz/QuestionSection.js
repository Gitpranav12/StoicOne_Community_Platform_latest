import React from "react";

export default function QuestionSection({ question, idx, selected, onAnswer }) {
  if (!question) return null;

  // Custom style objects for exact match
  const fontMain = {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: "1.2rem",
    fontWeight: 600,
    color: "#18191F",
    marginBottom: 10
  };

  const outerCard = {
    background: "#fff",
    borderRadius: 18,
    boxShadow: "0 2px 8px rgb(0 0 0 / 7%)",
    padding: "22px 32px",
    marginBottom: 24
  };

  const option = (isActive) => ({
    display: "flex",
    alignItems: "center",
    background: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "16px 24px",
    marginBottom: 14,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: "1.12rem",
    fontWeight: 500,
    color: "#18191F",
    outline: isActive ? "2px solid #191A1F" : "1px solid #E8E8E8",
    boxShadow: isActive ? "0 0 0 2px #191A1F inset" : "",
    transition: "outline-color 0.2s",
    cursor: "pointer"
  });

  const radioOuter = (isActive) => ({
    width: 20,
    height: 20,
    borderRadius: "50%",
    border: "2px solid #191A1F",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    background: "#fff"
  });

  const radioDot = (isActive) => ({
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: isActive ? "#191A1F" : "transparent",
    display: "inline-block"
  });

  return (
    <div style={outerCard}>
      <div style={fontMain}>
        Q{idx + 1}: <span style={{ fontWeight: 700 }}>{question.question}</span>
      </div>
      {question.options.map((optionText, i) => {
        const isActive = selected === i;
        return (
          <div
            key={i}
            role="button"
            tabIndex={0}
            aria-pressed={isActive}
            style={option(isActive)}
            onClick={() => onAnswer(i)}
            onKeyPress={e => (e.key === "Enter" ? onAnswer(i) : null)}
          >
            <span style={radioOuter(isActive)}>
              <span style={radioDot(isActive)} />
            </span>
            <span style={{ fontWeight: isActive ? 600 : 500, letterSpacing: 0.5 }}>
              <span style={{ fontWeight: 600, marginRight: 12 }}> {String.fromCharCode(65 + i)}. </span>
              {optionText}
            </span>
          </div>
        );
      })}
    </div>
  );
}
