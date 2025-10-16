import React, { useState, useEffect, useMemo, useContext } from "react";
import QuizHeader from "./QuizHeader";
import ProgressBar from "./ProgressBar";
import QuestionSection from "./QuestionSection";
import Pagination from "./Pagination";
import ExitPopup from "./ExitPopup";
import SubmitPopup from "./SubmitPopup";
import TopHeader from "./TopHeader";
import OverallScorePopup from "./OverallScorePopup";
import { UserContext } from "../UserProfilePage/context/UserContext";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Toast, ToastContainer } from "react-bootstrap";



export default function Quiz() {
  const { user: contextUser } = useContext(UserContext);
  const { contestId, roundId } = useParams();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  const currentUserName = contextUser?.profile?.name || "Candidate";
  const currentUserId = contextUser?.profile?.id;
  const currentUserPhotoUrl = currentUserId
    ? `http://localhost:8080/api/user/${currentUserId}/profile-photo`
    : "https://via.placeholder.com/80/fc5f7c/ffffff?text=U";

  // --- STATE FOR QUIZ DATA ---
  const [quizSections, setQuizSections] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STATE FOR MULTI-SECTION LOGIC ---
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [sectionScores, setSectionScores] = useState([]);
  const [showSectionComplete, setShowSectionComplete] = useState(false);
  const [showOverallScore, setShowOverallScore] = useState(false);

  // --- QUESTION TRACKING ---
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showExit, setShowExit] = useState(false);

  // --- TIMER STATE ---
  const [timer, setTimer] = useState(0);
  const storageKey = `contest_end_time_${contestId}`;

  // --- FETCH QUIZ QUESTIONS ---
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/contests/${contestId}/round/${roundId}/quiz`
        );

        const section = {
          title: response.data.title || "Quiz Section",
          questions: response.data.questions || [],
        };

        setQuizSections([section]);
        setSectionScores([{ score: 0, total: section.questions.length, completed: false }]);

      } catch (err) {
        console.error("Error fetching quiz:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [contestId, roundId]);

  // --- TIMER LOGIC (persistent across pages) ---
  useEffect(() => {
    if (!quizSections.length) return;

    const durationInMinutes = quizSections[0].duration || 30;
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
  }, [quizSections, storageKey]);

  // --- DERIVED VARIABLES ---
  const totalSections = quizSections.length;
  const currentSection = quizSections[currentSectionIndex] || { title: "", questions: [] };
  const totalQuestions = currentSection.questions.length;
  const isLastSection = currentSectionIndex === totalSections - 1;

  const overallScoreTotal = useMemo(
    () => sectionScores.reduce((acc, s) => acc + s.score, 0),
    [sectionScores]
  );

  const overallTotalQuestions = useMemo(
    () => sectionScores.reduce((acc, s) => acc + s.total, 0),
    [sectionScores]
  );

  // --- FORMAT TIMER ---
  const formatTime = (sec) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // --- HANDLERS ---
  const handleAnswer = (optionIdx) => setAnswers({ ...answers, [current]: optionIdx });
  const handleNext = () => current < totalQuestions - 1 && setCurrent(current + 1);
  const handlePrev = () => current > 0 && setCurrent(current - 1);
  const handlePaginate = (idx) => setCurrent(idx);
  const handleExit = () => setShowExit(true);

  const calculateSectionScore = () => {
    let score = 0;
    currentSection.questions.forEach((q, qIndex) => {
      if (answers[qIndex] === q.correctAnswerIndex) score += 1;
    });
    return score;
  };

  const handleSubmitSection = () => {
    const score = calculateSectionScore();
    setSectionScores(prevScores => {
      const newScores = [...prevScores];
      newScores[currentSectionIndex] = { score, total: totalQuestions, completed: true };
      return newScores;
    });

    if (isLastSection) setShowOverallScore(true);
    else setShowSectionComplete(true);
  };

  const handleNextSection = () => {
    setShowSectionComplete(false);
    setCurrentSectionIndex(prev => prev + 1);
    setCurrent(0);
    setAnswers({});
  };

  const handleFinalSubmit = () => {
    console.log("Final Scores:", sectionScores);
    setShowOverallScore(false);
    navigate("/events"); // navigate after final submit
  };

  const handleReview = () => setShowSectionComplete(false);

  // --- RENDER ---
  if (loading) return <div className="text-center my-5">Loading quiz...</div>;
  if (totalQuestions === 0) return <div className="text-center my-5">No quiz questions found.</div>;

  return (
    <>
      <TopHeader />
      <div className="container my-4 px-2" style={{ maxWidth: "900px", fontFamily: "Arial, sans-serif" }}>
        <QuizHeader
          title={`${currentSection.title} (Section ${currentSectionIndex + 1} of ${totalSections})`}
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
          answeredArr={Object.keys(answers).map(n => Number(n))}
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
        />
      </div>

      {/* ---------- Toast ---------- */}
      <ToastContainer position="top-center" className="mt-4">
        <Toast
          bg="warning"
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={2000}
          autohide
        >
          <Toast.Body className="text-dark fw-semibold">
            <i class="bi bi-alarm-fill"></i> Contest time is over!
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}
