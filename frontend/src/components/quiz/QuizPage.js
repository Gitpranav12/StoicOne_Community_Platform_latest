import React, { useState, useEffect, useMemo, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Toast, ToastContainer } from "react-bootstrap";
import QuizHeader from "./QuizHeader";
import ProgressBar from "./ProgressBar";
import QuestionSection from "./QuestionSection";
import Pagination from "./Pagination";
import ExitPopup from "./ExitPopup";
import SubmitPopup from "./SubmitPopup";
import TopHeader from "./TopHeader";
import OverallScorePopup from "./OverallScorePopup";
import { UserContext } from "../UserProfilePage/context/UserContext";

export default function Quiz() {
  // User/context info
  const { user: contextUser } = useContext(UserContext);
  const { contestId } = useParams();
  const navigate = useNavigate();

  // General UI states
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [showSectionComplete, setShowSectionComplete] = useState(false);
  const [showOverallScore, setShowOverallScore] = useState(false);
  const [showExit, setShowExit] = useState(false);

  // Quiz/sectioning states
  const [quizSections, setQuizSections] = useState([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [sectionScores, setSectionScores] = useState([]);
  const [roundStatus, setRoundStatus] = useState([]);

  // Per-question UI states
  const [current, setCurrent] = useState(0); // currently displayed question
  const [answers, setAnswers] = useState({}); // user answers

  // User info for display/avatar
  const currentUserName = contextUser?.profile?.name || "Candidate";
  const currentUserId = contextUser?.profile?.id;
  const currentUserPhotoUrl = currentUserId
    ? `http://localhost:8080/api/user/${currentUserId}/profile-photo`
    : "https://via.placeholder.com/80/fc5f7c/ffffff?text=U";

  const [timer, setTimer] = useState(0); // contest timer
  const storageKey = `contest_end_time_${contestId}_${currentUserId}`;

  // Fetch contest/quiz data
  useEffect(() => {
    async function fetchQuiz() {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/contests/${contestId}`
        );
        const allQuizSections = (response.data.rounds || []).filter(
          (r) => r.type === "quiz"
        );
        setQuizSections(allQuizSections);

let key = `contest_${contestId}_rounds_complete`;
let completedArr = JSON.parse(localStorage.getItem(key) || "[]");

// sectionScores reflects completed status from storage
let scoresFromStorage = allQuizSections.map((section, idx) => ({
  score: 0,
  total: section.questions.length,
  completed: completedArr.includes(idx),
}));

setSectionScores(scoresFromStorage);
setRoundStatus(allQuizSections.map((_, idx) => completedArr.includes(idx)));

// find the first incomplete section, or zero if all are complete
const firstIncomplete = scoresFromStorage.findIndex(s => !s.completed);
setCurrentSectionIndex(firstIncomplete === -1 ? 0 : firstIncomplete);

      } catch (err) {
        console.error("Error fetching quiz:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
  }, [contestId]);

  // Timer logic (per section; persistent)
  useEffect(() => {
    if (!quizSections.length) return;
    const durationInMinutes = quizSections[currentSectionIndex]?.duration || 30;
    let endTime = localStorage.getItem(storageKey);
    if (!endTime) {
      endTime = Date.now() + durationInMinutes * 60 * 1000;
      localStorage.setItem(storageKey, endTime);
    } else {
      endTime = parseInt(endTime, 10);
    }
    const interval = setInterval(() => {
      const remaining = Math.floor((endTime - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(interval);
        localStorage.removeItem(storageKey);
        setShowToast(true);
        setTimeout(() => navigate("/events"), 3000);
      } else {
        setTimer(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [quizSections, storageKey, currentSectionIndex, navigate]);

  // Derived/semantic helpers
  const totalSections = quizSections.length;
  const currentSection = quizSections[currentSectionIndex] || {
    title: "",
    questions: [],
  };
  const totalQuestions = currentSection.questions.length;
  const isLastSection = currentSectionIndex === totalSections - 1;

  // Score helpers
  const overallScoreTotal = useMemo(
    () => sectionScores.reduce((acc, s) => acc + s.score, 0),
    [sectionScores]
  );
  const overallTotalQuestions = useMemo(
    () => sectionScores.reduce((acc, s) => acc + s.total, 0),
    [sectionScores]
  );

  // Time formatting
  const formatTime = (sec) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // Per-question selection controls
  const handleAnswer = (optionIdx) =>
    setAnswers({ ...answers, [current]: optionIdx });
  const handleNext = () =>
    current < totalQuestions - 1 && setCurrent(current + 1);
  const handlePrev = () => current > 0 && setCurrent(current - 1);
  const handlePaginate = (idx) => setCurrent(idx);
  const handleExit = () => setShowExit(true);

  // Section scoring
  const calculateSectionScore = () => {
    let score = 0;
    currentSection.questions.forEach((q, qIndex) => {
      if (Number(answers[qIndex]) === Number(q.correctIndex)) score += 1;
    });
    return score;
  };

  // Section/state progression logic
  // const handleSubmitSection = () => {
  //   const score = calculateSectionScore();
  //   setSectionScores((prevScores) => {
  //     const newScores = [...prevScores];
  //     newScores[currentSectionIndex] = {
  //       score,
  //       total: totalQuestions,
  //       completed: true,
  //     };
  //     return newScores;
  //   });
  //   setRoundStatus((prev) => {
  //     const arr = [...prev];
  //     arr[currentSectionIndex] = true;
  //     return arr;
  //   });
  //   // ----- ADD THIS BLOCK -----
  // // Mark this section as completed in localStorage for ProgressPage
  // let key = `contest_${contestId}_rounds_complete`;
  // let completed = JSON.parse(localStorage.getItem(key) || "[]");
  // if (!completed.includes(currentSectionIndex)) {
  //   completed.push(currentSectionIndex);
  //   localStorage.setItem(key, JSON.stringify(completed));
  // }
  // // ----- END BLOCK -----
  //   if (!isLastSection) {
  //     setShowSectionComplete(false);
  //     setCurrentSectionIndex((prev) => prev + 1);
  //     setCurrent(0);
  //     setAnswers({});
  //   } else {
  //     setShowSectionComplete(false);
  //     setShowOverallScore(true);
  //   }
  // };

const handleSubmitSection = async () => {
  const score = calculateSectionScore();
  const roundId = currentSection.id; // assuming each section has its round_id
  const userId = currentUserId;

  // Save local progress
  setSectionScores((prevScores) => {
    const newScores = [...prevScores];
    newScores[currentSectionIndex] = {
      score,
      total: totalQuestions,
      completed: true,
    };
    return newScores;
  });

  setRoundStatus((prev) => {
    const arr = [...prev];
    arr[currentSectionIndex] = true;
    return arr;
  });

  // ✅ Save to backend
  try {
    await axios.post("http://localhost:8080/api/contests/quiz_submissions", {
      contest_id: contestId,
      round_id: roundId,
      user_id: userId,
      answers,
      score,
    });
    console.log("✅ Quiz section saved to DB successfully");
  } catch (err) {
    console.error("❌ Error saving quiz submission:", err);
  }

  // ✅ Mark section complete in localStorage for ProgressPage
  let key = `contest_${contestId}_rounds_complete`;
  let completed = JSON.parse(localStorage.getItem(key) || "[]");
  if (!completed.includes(currentSectionIndex)) {
    completed.push(currentSectionIndex);
    localStorage.setItem(key, JSON.stringify(completed));
  }

  // ✅ Move to next section or show final score
  if (!isLastSection) {
    setShowSectionComplete(false);
    setCurrentSectionIndex((prev) => prev + 1);
    setCurrent(0);
    setAnswers({});
  } else {
    setShowSectionComplete(false);
    setShowOverallScore(true);
  }
};


  const handleNextSection = () => {
    setShowSectionComplete(false);
    setCurrentSectionIndex((prev) => prev + 1);
    setCurrent(0);
    setAnswers({});
  };

  // Completion/finalization handlers
  const handleFinalSubmit = () => {
    setShowOverallScore(false);
    navigate("/events");
  };

  const handleReview = () => setShowSectionComplete(false);

  // Render logic
  if (loading) return <div className="text-center my-5">Loading quiz...</div>;
  if (totalQuestions === 0)
    return <div className="text-center my-5">No quiz questions found.</div>;

  return (
    <>
      <TopHeader />
      <div
        className="container my-4 px-2"
        style={{ maxWidth: "900px", fontFamily: "Arial, sans-serif" }}
      >
        <QuizHeader
          title={`${
            currentSection.round_name || currentSection.title || "Quiz Section"
          } (Section ${currentSectionIndex + 1} of ${totalSections})`}
          timer={formatTime(timer)}
          answered={Object.keys(answers).length}
          total={totalQuestions}
          onExit={handleExit}
        />
        <ProgressBar current={current} total={totalQuestions} />
        <QuestionSection
          question={currentSection.questions[current]}
          idx={current}
          selected={answers[current]}
          onAnswer={handleAnswer}
        />
        <Pagination
          current={current}
          total={totalQuestions}
          answeredArr={Object.keys(answers).map((n) => Number(n))}
          onPaginate={handlePaginate}
          onNext={handleNext}
          onPrev={handlePrev}
        />
        {current === totalQuestions - 1 && (
          <div className="d-flex justify-content-end mt-3">
            <button
              className="btn btn-success"
              style={{ fontWeight: 600, minWidth: 150 }}
              onClick={handleSubmitSection}
            >
              Submit Section {currentSectionIndex + 1}
            </button>
          </div>
        )}
        <ExitPopup show={showExit} onCancel={() => setShowExit(false)} />
        <SubmitPopup
          show={showSectionComplete}
          total={totalQuestions}
          answered={Object.keys(answers).length}
          isSectionComplete={true}
          onReview={handleReview}
          onSubmit={handleNextSection}
        />
        <OverallScorePopup
          show={showOverallScore}
          sectionScores={sectionScores}
          overallScore={overallScoreTotal}
          overallTotal={overallTotalQuestions}
          onSubmit={handleFinalSubmit}
          userName={currentUserName}
          userPhotoUrl={currentUserPhotoUrl}
          contestId={contestId}
          quizSections={quizSections}
        />
      </div>
      <ToastContainer position="top-center" className="mt-4">
        <Toast
          bg="warning"
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={2000}
          autohide
        >
          <Toast.Body className="text-dark fw-semibold">
            <i className="bi bi-alarm-fill"></i> Contest time is over!
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}
