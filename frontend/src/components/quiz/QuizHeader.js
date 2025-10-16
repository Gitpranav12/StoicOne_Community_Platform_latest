import React from "react";
import { Button } from "react-bootstrap";

export default function QuizHeader({ title, timer, answered, total, onExit }) {
  return (
    <div className="d-flex align-items-center justify-content-between p-2 mb-2 bg-white rounded shadow-sm">
      <div>
        <Button variant="light" onClick={onExit} className="me-2 border fw-semibold">
          &larr; Exit Quiz
        </Button>
        <span className="fs-5 fw-semibold">{title}</span>
      </div>
      <div className="d-flex align-items-center gap-3">
        <span style={{ color: "#cf2a17", fontWeight: 400 }}>
          <span style={{ fontSize: 18 }}>&#128337;</span> {timer}
        </span>
        <span className="badge rounded-pill bg-white border text-dark" style={{ fontSize: 14, padding: "6px 12px" }}>
          {answered}/{total} Answered
        </span>
      </div>
    </div>
  );
}
