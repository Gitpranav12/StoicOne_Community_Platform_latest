import React from "react";

export default function Pagination({
  current,
  total,
  answeredArr,
  onPaginate,
  onNext,
  onPrev,
}) {
  return (
    <div className="d-flex justify-content-between align-items-center p-2 bg-white rounded shadow-sm">
      <button
        className="btn btn-light border text-muted"
        disabled={current === 0}
        onClick={onPrev}
      >
        Previous
      </button>
      <div>
        {[...Array(total)].map((_, idx) => {
          const isActive = current === idx;
          const isAnswered = answeredArr.includes(idx);
          return (
            <button
              key={idx}
              className={`btn btn-sm mx-1  ${
                isActive
                  ? "btn-success text-black"
                  : isAnswered
                  ? "btn-outline-success"
                  : "btn-outline-dark"
              }`}
              style={{
                width: 30,
                height: 30,
                fontWeight: "bold",
                fontSize: 12,
              }}
              onClick={() => onPaginate(idx)}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
      <button
        className="btn btn-dark"
        disabled={current === total - 1}
        onClick={onNext}
      >
        Next
      </button>
    </div>
  );
}
