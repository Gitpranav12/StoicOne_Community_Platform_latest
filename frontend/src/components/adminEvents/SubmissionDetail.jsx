import { useState } from "react";
import {
  ArrowLeft,
  User,
  Calendar,
  Clock,
  Code,
  CheckCircle,
  XCircle,
  Save,
  MessageSquare,
} from "lucide-react";
import Layout from "../../Layout/Layout";
import { useNavigate } from "react-router-dom";

export default function SubmissionDetail({ submission, contest }) {
  // ✅ Dummy fallback data
  submission = submission || {
    id: "sub_001",
    contestId: "contest_001",
    username: "John Doe",
    score: 85,
    feedback: "Good work!",
    timeSpent: 45,
    submittedAt: new Date().toISOString(),
    status: "completed",
    code: `function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
}`,
    answers: [1, 0, 2],
  };

  contest = contest || {
    id: "contest_001",
    title: "JavaScript Coding Challenge",
    description: "Test your problem-solving and JS fundamentals.",
    type: "coding", // try 'quiz' also
    duration: 60,
    problemStatement: `Given an array of integers, return indices of the two numbers such that they add up to a specific target.`,
    questions: [
      {
        id: 1,
        question: "Which keyword is used to declare a constant in JavaScript?",
        options: ["var", "let", "const", "define"],
        correctAnswer: 2,
      },
      {
        id: 2,
        question: "What is the output of typeof null?",
        options: ["object", "null", "undefined", "number"],
        correctAnswer: 0,
      },
      {
        id: 3,
        question: "Which of these is NOT a JavaScript framework?",
        options: ["React", "Vue", "Django", "Angular"],
        correctAnswer: 2,
      },
    ],
  };

  const [manualScore, setManualScore] = useState(submission?.score ?? 0);
  const [feedback, setFeedback] = useState(submission?.feedback ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();

  if (!submission || !contest) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 text-muted">Loading submission details...</p>
      </div>
    );
  }

  const handleBack = () => navigate(-1);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate save delay
    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-danger";
  };

  return (
    <Layout>
      <div className="submission-detail">
        <div
          className="px-3 mx-auto"
          style={{
            maxWidth: "100%", // default full width for web
          }}
        >
          {/* Use a media query to limit width only on small screens */}
        <style>
  {`
    @media (max-width: 768px) {
      .submission-detail {
        padding-left: 0;
        padding-right: 0;
        display: flex;
        justify-content: center;  /* centers horizontally */
      }

      .submission-detail .mobile-narrow {
        max-width: 285px;         /* narrow width */
        width: 100%;              /* allows full stretch within parent */
        margin: 0 auto;           /* centers element */
      }

      .submission-detail .card {
        margin-left: 0 !important;
        margin-right: 0 !important;
        width: 100%;              /* makes cards stretch within 285px container */
      }
    }
  `}
</style>


          <div className="mobile-narrow">
            {/* Header */}
            <div className="mb-4">
              {/* Buttons row */}
              <div className="d-flex flex-column flex-md-row justify-content-between gap-2 mb-2">
                <button
                  className="btn btn-outline-secondary d-flex align-items-center"
                  type="button"
                  onClick={handleBack}
                >
                  <ArrowLeft size={18} className="me-2" />
                  Back
                </button>

                <button
                  className="btn btn-primary d-flex align-items-center"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  <Save size={18} className="me-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>

              {/* Title and description below buttons */}
              <div>
                <h2 className="mb-1">Submission Review</h2>
                <p className="text-muted mb-0">
                  Review and score participant submission
                </p>
              </div>
            </div>

            <div className="row g-4">
              {/* Main Content */}
              <div className="col-12 col-lg-8">
                {/* Participant & Contest Info */}
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body">
                    <div className="row g-4">
                      <div className="col-md-6">
                        <div className="d-flex align-items-center">
                          <div
                            className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{
                              width: "60px",
                              height: "60px",
                              fontSize: "24px",
                            }}
                          >
                            {submission.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="small text-muted">Participant</div>
                            <div className="h5 mb-0">{submission.username}</div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="d-flex align-items-start">
                          <Calendar
                            className="text-muted me-3 mt-1"
                            size={20}
                          />
                          <div>
                            <div className="small text-muted">Submitted</div>
                            <div className="fw-semibold">
                              {formatDate(submission.submittedAt)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="d-flex align-items-start">
                          <Clock className="text-muted me-3 mt-1" size={20} />
                          <div>
                            <div className="small text-muted">Time Spent</div>
                            <div className="fw-semibold">
                              {submission.timeSpent} minutes
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="d-flex align-items-start">
                          {submission.status === "completed" ? (
                            <CheckCircle
                              className="text-success me-3 mt-1"
                              size={20}
                            />
                          ) : (
                            <Clock
                              className="text-warning me-3 mt-1"
                              size={20}
                            />
                          )}
                          <div>
                            <div className="small text-muted">Status</div>
                            <div className="fw-semibold text-capitalize">
                              {submission.status}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contest Information */}
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-header bg-white">
                    <h5 className="card-title mb-0">Contest Information</h5>
                  </div>
                  <div className="card-body">
                    <h6 className="mb-3">{contest.title}</h6>
                    <p className="text-muted mb-3">{contest.description}</p>
                    <div className="d-flex gap-3">
                      <span
                        className={`badge ${
                          contest.type === "quiz" ? "bg-info" : "bg-primary"
                        }`}
                      >
                        {contest.type === "quiz"
                          ? "Quiz Contest"
                          : "Coding Contest"}
                      </span>
                      <span className="badge bg-secondary">
                        Duration: {contest.duration} min
                      </span>
                    </div>
                  </div>
                </div>

                {/* Coding Submission */}
                {contest.type === "coding" && submission.code && (
                  <>
                    <div className="card border-0 shadow-sm mb-4">
                      <div className="card-header bg-white">
                        <h5 className="card-title mb-0">Problem Statement</h5>
                      </div>
                      <div className="card-body">
                        <pre
                          className="mb-0"
                          style={{
                            whiteSpace: "pre-wrap",
                            fontFamily: "monospace",
                          }}
                        >
                          {contest.problemStatement}
                        </pre>
                      </div>
                    </div>

                    <div className="card border-0 shadow-sm mb-4">
                      <div className="card-header bg-white d-flex align-items-center">
                        <Code size={20} className="me-2" />
                        <h5 className="card-title mb-0">Submitted Code</h5>
                      </div>
                      <div className="card-body p-0">
                        <div className="position-relative">
                          <pre
                            className="bg-dark text-light p-4 mb-0 rounded-bottom"
                            style={{ maxHeight: "500px", overflow: "auto" }}
                          >
                            <code>{submission.code}</code>
                          </pre>
                        </div>
                      </div>
                    </div>

                    {/* Test Cases Results */}
                    <div className="card border-0 shadow-sm mb-4">
                      <div className="card-header bg-white">
                        <h5 className="card-title mb-0">Test Cases</h5>
                      </div>
                      <div className="card-body">
                        <div className="list-group list-group-flush">
                          <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                            <div>
                              <div className="fw-semibold">
                                Test Case 1: Basic Input
                              </div>
                              <div className="small text-muted">
                                Input: [2, 7, 11, 15], target = 9
                              </div>
                              <div className="small text-muted">
                                Expected: [0, 1]
                              </div>
                            </div>
                            <CheckCircle className="text-success" size={24} />
                          </div>

                          <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                            <div>
                              <div className="fw-semibold">
                                Test Case 2: Negative Numbers
                              </div>
                              <div className="small text-muted">
                                Input: [-1, -2, -3, -4], target = -6
                              </div>
                              <div className="small text-muted">
                                Expected: [1, 3]
                              </div>
                            </div>
                            <CheckCircle className="text-success" size={24} />
                          </div>

                          <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                            <div>
                              <div className="fw-semibold">
                                Test Case 3: Large Numbers
                              </div>
                              <div className="small text-muted">
                                Input: [1000, 2000, 3000], target = 4000
                              </div>
                              <div className="small text-muted">
                                Expected: [0, 2]
                              </div>
                            </div>
                            <XCircle className="text-danger" size={24} />
                          </div>
                        </div>

                        <div className="mt-3 p-3 bg-light rounded">
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-semibold">
                              Test Cases Passed:
                            </span>
                            <span className="badge bg-success">2 / 3</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Quiz Submission */}
                {contest.type === "quiz" &&
                  submission.answers &&
                  contest.questions && (
                    <div className="card border-0 shadow-sm mb-4">
                      <div className="card-header bg-white">
                        <h5 className="card-title mb-0">Quiz Answers Review</h5>
                      </div>
                      <div className="card-body">
                        {contest.questions.map((question, index) => {
                          const userAnswer = submission.answers[index];
                          const isCorrect =
                            userAnswer === question.correctAnswer;

                          return (
                            <div
                              key={question.id}
                              className={`border rounded-3 p-4 mb-3 ${
                                isCorrect
                                  ? "border-success bg-success bg-opacity-10"
                                  : "border-danger bg-danger bg-opacity-10"
                              }`}
                            >
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <h6 className="mb-0">
                                  Q{index + 1}: {question.question}
                                </h6>
                                {isCorrect ? (
                                  <CheckCircle
                                    className="text-success"
                                    size={20}
                                  />
                                ) : (
                                  <XCircle className="text-danger" size={20} />
                                )}
                              </div>

                              <div className="row g-2">
                                {question.options.map((option, optIndex) => {
                                  const isUserAnswer = optIndex === userAnswer;
                                  const isCorrectAnswer =
                                    optIndex === question.correctAnswer;

                                  let badgeClass = "bg-light text-dark";
                                  let badges = [];

                                  if (isCorrectAnswer) {
                                    badgeClass = "bg-success text-white";
                                    badges.push(
                                      <span
                                        key="correct"
                                        className="badge bg-white text-success ms-2"
                                      >
                                        Correct Answer
                                      </span>
                                    );
                                  }

                                  if (isUserAnswer && !isCorrectAnswer) {
                                    badgeClass =
                                      "bg-danger bg-opacity-25 border border-danger";
                                    badges.push(
                                      <span
                                        key="user"
                                        className="badge bg-danger ms-2"
                                      >
                                        User's Answer
                                      </span>
                                    );
                                  } else if (isUserAnswer && isCorrectAnswer) {
                                    badges.push(
                                      <span
                                        key="user-correct"
                                        className="badge bg-white text-success ms-2"
                                      >
                                        User's Answer ✓
                                      </span>
                                    );
                                  }

                                  return (
                                    <div key={optIndex} className="col-12">
                                      <div
                                        className={`p-3 rounded d-flex align-items-center justify-content-between ${badgeClass}`}
                                      >
                                        <div>
                                          <span className="me-2 fw-bold">
                                            {String.fromCharCode(65 + optIndex)}
                                            .
                                          </span>
                                          {option}
                                        </div>
                                        <div>{badges}</div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}

                        <div className="mt-4 p-3 bg-light rounded">
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-semibold">
                              Questions Answered Correctly:
                            </span>
                            <span className="badge bg-primary">
                              {
                                submission.answers.filter(
                                  (ans, idx) =>
                                    ans === contest.questions[idx].correctAnswer
                                ).length
                              }{" "}
                              / {contest.questions.length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                {/* Admin Feedback */}
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-header bg-white d-flex align-items-center">
                    <MessageSquare size={20} className="me-2" />
                    <h5 className="card-title mb-0">Admin Feedback</h5>
                  </div>
                  <div className="card-body">
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Add feedback or comments for the participant..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    />
                    <div className="small text-muted mt-2">
                      This feedback will be visible to the participant
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="col-12 col-lg-4">
                {/* Score Card */}
                <div
                  className="card border-0 shadow-sm mb-4 sticky-top"
                  style={{ top: "20px" }}
                >
                  <div className="card-header bg-white">
                    <h5 className="card-title mb-0">Score Management</h5>
                  </div>
                  <div className="card-body">
                    {/* Current Score */}
                    <div className="text-center mb-4">
                      <div className="small text-muted mb-2">Current Score</div>
                      <div
                        className={`display-4 ${getScoreColor(
                          submission.score
                        )}`}
                      >
                        {submission.score}%
                      </div>
                    </div>

                    <hr />

                    {/* Manual Score Override */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        Manual Score Override
                      </label>
                      <div className="input-group">
                        <input
                          type="number"
                          className="form-control"
                          min="0"
                          max="100"
                          value={manualScore}
                          onChange={(e) =>
                            setManualScore(Number(e.target.value))
                          }
                        />
                        <span className="input-group-text">%</span>
                      </div>
                      <div className="small text-muted mt-2">
                        Adjust the score manually if needed
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          setManualScore(100);
                        }}
                      >
                        Mark as Perfect
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          setManualScore(submission.score);
                          setFeedback("");
                        }}
                      >
                        Reset Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
