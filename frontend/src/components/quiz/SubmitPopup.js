import React from "react";
import { useNavigate } from "react-router-dom";

// Added 'isSectionComplete' prop
export default function SubmitPopup({ show, total, answered, onReview, onSubmit, answers, isSectionComplete }) {
  const navigate = useNavigate();

  if (!show) return null;

  // --- ORIGINAL BUSINESS LOGIC FOR FINAL SUBMIT ---
  const handleFinalQuizSubmit = () => {
    if (onSubmit) onSubmit(); // Call external onSubmit (handleFinalSubmit from QuizPage if NOT isSectionComplete)
    // This is the original navigation logic for the FINAL quiz submit
    navigate("/scorecard", { state: { answers } });
  };
  // ------------------------------------------------

  // Function for the 'Submit' button click
  const handlePrimaryButtonClick = () => {
    if (isSectionComplete) {
      // 1. If it's a section complete, just call the prop function (handleNextSection)
      if (onSubmit) onSubmit();
    } else {
      // 2. If it's the final quiz submit, execute the original business logic
      handleFinalQuizSubmit();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 2000,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.14)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          minWidth: 400,
          maxWidth: 540,
          width: "98%",
          boxShadow: "0 6px 32px rgba(0,0,0,0.17)",
          padding: "30px 30px 30px 30px",
        }}
      >
        {/* --- DYNAMIC TITLE AND BODY TEXT --- */}
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 12 }}>
          {isSectionComplete ? 'Section Complete!' : 'Submit Quiz?'}
        </div>
        <div style={{ color: "#76777A", fontSize: 17, marginBottom: 12 }}>
          {isSectionComplete ? (
            <>
              You have completed this section, answering <b>{answered}</b> out of <b>{total}</b> questions. Click **Go To Next Section** to continue.
            </>
          ) : (
            <>
              You have answered <b>{answered}</b> out of <b>{total}</b> questions. Are you sure you want to submit your quiz?<br />
              <span style={{ fontSize: 14, color: "#999" }}>This action cannot be undone.</span>
            </>
          )}
        </div>
        {/* ------------------------------------- */}
        
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
            onClick={onReview} // onReview always closes the popup and goes back to the quiz
          >
            {isSectionComplete ? 'Review Section' : 'Review Answers'}
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
              minWidth: 130,
              cursor: "pointer"
            }}
            // Use the new handler to determine action based on 'isSectionComplete'
            onClick={handlePrimaryButtonClick}
          >
            {isSectionComplete ? 'Go To Next Section' : 'Submit Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
}