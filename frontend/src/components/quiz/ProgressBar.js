import React from "react";

export default function ProgressBar({ current, total }) {
  const percent = Math.round(((current + 1) / total) * 100);

  return (
    <div className="mb-4 p-3 bg-white rounded shadow-sm">
      <div className="d-flex justify-content-between mb-2 fw-medium">
        <span>Question {current + 1} of {total}</span>
        <span>{percent}% Complete</span>
      </div>
      <div className="progress" style={{ height: 7, borderRadius: 10, background: "#e6e6e6" }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{
            width: `${percent}%`,
            background: "#0b0b0b",
            borderRadius: 10
          }}
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
