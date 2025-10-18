import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Code,
  CheckCircle,
  XCircle,
  Save,
  MessageSquare,
} from "lucide-react";
import Layout from "../../Layout/Layout";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Badge, Button, Card, Spinner } from "react-bootstrap";

export default function SubmissionDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  const { contestId, userId } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [contest, setContest] = useState(null);
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [manualScore, setManualScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // 🧩 Fetch data
  useEffect(() => {
    if (!contestId || !userId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:8080/api/contests/coding_submissions/byUserAndContest?contestId=${contestId}&userId=${userId}`
        );
        const data = res.data;
        setContest(data.contest);
        setUser(data.user);
        setSubmissions(data.submissions || []);
        if (data.submissions?.length > 0) {
          const first = data.submissions[0];
          setManualScore(first.manual_score || 0);
          setFeedback(first.feedback || "");
        }
      } catch (err) {
        console.error("Error loading submission:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [contestId, userId]);

  // 🧮 Helpers
  const currentSub = submissions[currentIndex];

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getScoreColor = (score) => {
    const num = parseFloat(score);
    if (num >= 80) return "text-success";
    if (num >= 60) return "text-warning";
    return "text-danger";
  };

  // 💾 Save feedback + score and go to next
  const handleSave = async () => {
    if (!currentSub) return;

    try {
      setIsSaving(true);
      await axios.put(
        `http://localhost:8080/api/contests/coding_submissions/${currentSub.id}`,
        {
          manual_score: Number(manualScore), // ✅ convert to number
          feedback,
        }
      );

      // ✅ Update local array
      const updated = [...submissions];
      updated[currentIndex].manual_score = manualScore;
      updated[currentIndex].feedback = feedback;
      setSubmissions(updated);

      // 🧭 Move to next question automatically
      if (currentIndex + 1 < submissions.length) {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setManualScore(updated[nextIndex].manual_score || 0);
        setFeedback(updated[nextIndex].feedback || "");
      } else {
        alert("✅ All submissions reviewed!");
      }
    } catch (err) {
      console.error("Save failed:", err);
      alert("❌ Failed to save feedback.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3 text-muted">Loading submission details...</p>
        </div>
      </Layout>
    );
  }

  if (!currentSub) {
    return (
      <Layout>
        <div className="text-center py-5 text-muted">
          No submissions found for this user.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-3 mx-auto" style={{ maxWidth: "100%" }}>
        {/* Mobile responsiveness */}
        <style>{`
          @media (max-width: 768px) {
            .mobile-narrow {
              max-width: 285px;
              margin: 0 auto;
            }
          }
        `}</style>

        <div className="mobile-narrow">
          {/* Header */}
          <div className="d-flex justify-content-between mb-4 flex-wrap gap-2">
            <button
              className="btn btn-outline-secondary d-flex align-items-center"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={18} className="me-2" /> Back
            </button>

            <button
              className="btn btn-primary d-flex align-items-center"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save size={18} className="me-2" />
              {isSaving ? "Saving..." : "Save & Next"}
            </button>
          </div>

          {/* User & Contest Info */}
          <Card className="mb-4 shadow-sm">
            <Card.Body className="d-flex flex-column flex-md-row align-items-center gap-3">
              {/* 👤 Profile photo */}
              <img
                src={user?.avatar || "/images/default-avatar.png"} // fallback if no image
                alt={user?.name || "Participant"}
                className="rounded-circle"
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  border: "2px solid #ddd",
                }}
                onError={(e) => {
                  // fallback if image URL fails
                  e.target.src = "/images/default-avatar.png";
                }}
              />

              <div>
                <h5 className="mb-2 d-flex align-items-center">
                  <CheckCircle className="me-2 text-success" /> Participant
                </h5>
                <p className="mb-1 fw-semibold">User ID : {user?.id}</p>
                <p className="mb-1 fw-semibold">Name : {user?.name}</p>
                <p className="text-muted mb-0">Email : {user?.email}</p>
              </div>
            </Card.Body>

            <hr />

            <Card.Body>
              <h5 className="mb-3 d-flex align-items-center">
                <Calendar className="me-2 text-primary" /> Contest -{" "}
                {contest?.id}
              </h5>
              <p className="fw-semibold mb-1">{contest?.title}</p>
              <p className="text-muted">{contest?.description}</p>
              <small className="text-secondary d-flex align-items-center gap-1">
                <Clock className="me-1" />
                <span>{formatDate(contest.start_time)}</span>
                <span>–</span>
                <span>{formatDate(contest.end_time)}</span>
              </small>
            </Card.Body>
          </Card>

          {/* Coding Submission */}
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-white d-flex align-items-center">
              <Code className="me-2" />
              <h5 className="mb-0">
                Q{currentIndex + 1} : {currentSub.question_title}
              </h5>
              <Badge
                bg={getScoreColor(currentSub.manual_score || 0)}
                className="ms-auto"
              >
                Score: {currentSub.manual_score || 0}
              </Badge>
            </Card.Header>
            <Card.Body>
              <p className="text-muted mb-2">
                <strong>Problem :</strong> {currentSub.problem_statement}
              </p>
              <p>
                <strong>Sample Input :</strong>{" "}
                <Badge bg="secondary">{currentSub.sample_input}</Badge>
              </p>
              <p>
                <strong>Sample Output :</strong>{" "}
                <Badge bg="secondary">{currentSub.sample_output}</Badge>
              </p>

              <hr />
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6>Submitted Code:</h6>
                <h6>Language Used: {currentSub.language}</h6>
              </div>

              <pre
                className="bg-dark text-light p-3 rounded"
                style={{ maxHeight: 400, overflowY: "auto" }}
              >
                <code>{currentSub.code}</code>
              </pre>
            </Card.Body>
          </Card>

          {/* Feedback + Score */}
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-white d-flex align-items-center">
              <MessageSquare size={20} className="me-2" />
              <h5 className="mb-0">Admin Feedback</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Manual Score (0–100)
                </label>
                <input
                  type="number"
                  className="form-control"
                  min="0"
                  max="100"
                  value={manualScore}
                  onChange={(e) => {
                    const val = e.target.value;
                    // ✅ Only allow numbers between 0 and 100
                    if (val === "") {
                      setManualScore("");
                    } else if (!isNaN(val) && val >= 0 && val <= 100) {
                      setManualScore(val);
                    }
                  }}
                  onBlur={() => {
                    // ✅ Clamp value if user types outside range and leaves field
                    if (manualScore === "") return;
                    let num = Number(manualScore);
                    if (num < 0) num = 0;
                    if (num > 100) num = 100;
                    setManualScore(num);
                  }}
                />
                <small className="text-muted">
                  Enter a score between 0 and 100.
                </small>
              </div>
              <textarea
                className="form-control mb-2"
                rows="4"
                placeholder="Write feedback for this submission..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <small className="text-muted">
                Feedback will be visible to the participant.
              </small>
            </Card.Body>
          </Card>

          {/* Progress footer */}
          <div className="text-center text-muted mb-4">
            {currentIndex + 1} / {submissions.length} submissions reviewed
          </div>
        </div>
      </div>
    </Layout>
  );
}
