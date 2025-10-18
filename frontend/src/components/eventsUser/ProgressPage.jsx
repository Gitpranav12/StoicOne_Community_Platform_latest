import React, { useEffect, useState, useContext } from "react";
import {
  Button,
  Card,
  Col,
  Row,
  ProgressBar,
  Spinner,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Layout from "../../Layout/Layout";
import { UserContext } from "../UserProfilePage/context/UserContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function ProgressPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // contest id

  // States for contest data and UI behavior
  const [contest, setContest] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const { user: contextUser } = useContext(UserContext);
  const currentUserId = contextUser?.profile?.id;

  // State to track completed rounds
  const [roundStatus, setRoundStatus] = useState([]);

  // Utility to check if a round is completed
  const isRoundCompleted = (index) => roundStatus && roundStatus[index];

  // ===== Progress bar aur Rounds completed calculation (NEW - yaha add kiya) =====
  const totalRounds = contest?.rounds?.length || 0; // कुल rounds
  const completedRounds = roundStatus.filter(Boolean).length; // पूरे हो चुके rounds
  const progressPercent =
    totalRounds === 0 ? 0 : Math.round((completedRounds / totalRounds) * 100); // Progress %

  // Fetch contest details from API
  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/contests/${id}`
        );
        setContest(response.data); // Persistent round completion via localStorage

        let key = `contest_${id}_rounds_complete`;
        let completed = JSON.parse(localStorage.getItem(key) || "[]");
        setRoundStatus(
          response.data.rounds.map((_, idx) => completed.includes(idx))
        ); // ...rest unchanged...

        const durationInMinutes = location.state?.duration || 0;
        const storageKey = `contest_end_time_${id}_${currentUserId}`;

        let endTime = localStorage.getItem(storageKey);

        if (!endTime) {
          endTime = Date.now() + durationInMinutes * 60 * 1000;
          localStorage.setItem(storageKey, endTime);
        }
        startTimer(endTime, storageKey);
      } catch (error) {
        console.error("Error fetching contest:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContest();
  }, [id, location.state, navigate]);

  // Timer management
  const startTimer = (endTime, storageKey) => {
    const timerId = setInterval(() => {
      const remainingSeconds = Math.floor((endTime - Date.now()) / 1000);
      if (remainingSeconds <= 0) {
        clearInterval(timerId);
        localStorage.removeItem(storageKey);
        setShowToast(true);
        setTimeout(() => navigate("/events"), 3000);
      } else {
        setTimeLeft(remainingSeconds);
      }
    }, 1000);

    // Clear interval on unmount or id change
    return () => clearInterval(timerId);
  };

  // Function to mark a round as complete externally if desired
  const setComplete = (index) => {
    setRoundStatus((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  // Format remaining time for display
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };


const handleSubmitAndExit = async () => {
  // Check if all rounds are completed
  const allRoundsCompleted = roundStatus.every(Boolean);

  if (allRoundsCompleted) {
    try {
      await axios.post('http://localhost:8080/api/contests/participants/complete', {
        contestId: contest.id,
        userId: currentUserId,
      });
      console.log("Contest marked as completed!");
    } catch (error) {
      console.error("Error marking contest completed:", error);
    }
  }

  // Clear any contest-specific localStorage if needed
  localStorage.removeItem(`contest_${id}_rounds_complete`);
  localStorage.removeItem(`contest_end_time_${id}_${currentUserId}`);

  // Navigate to events page
  navigate("/events");
};



  // Loading state view
  if (loading) {
    return (
      <Layout>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "60vh" }}
        >
          <Spinner animation="border" variant="primary" />
        </div>
      </Layout>
    );
  }

  // Error state view
  if (!contest) {
    return (
      <Layout>
        <div className="text-center mt-5">
          <h5>Contest not found</h5>
        </div>
      </Layout>
    );
  }

  // Dynamically determine categories from rounds
  const categories = Array.from(
    new Set(
      contest.rounds.map((r) => (r.type === "quiz" ? "Aptitude" : "Coding"))
    )
  ).map((type) => ({
    name: type,
    icon: type === "Aptitude" ? "bi-lightbulb" : "bi-code-slash",
  }));

  // Filter rounds based on active category
  const filteredRounds =
    activeCategory === "All"
      ? contest.rounds
      : contest.rounds.filter((r) =>
          activeCategory === "Aptitude"
            ? r.type === "quiz"
            : r.type === "coding"
        );

  return (
    <Layout>
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <div>
          <div className="d-flex align-items-center mb-1">
            <div
              className="d-flex align-items-center justify-content-center rounded-3 me-2"
              style={{
                width: "35px",
                height: "35px",
                background: "linear-gradient(135deg, #007bff, #28a745)",
              }}
            >
              <i
                className="bi bi-trophy-fill text-white"
                style={{ fontSize: "16px" }}
              ></i>
            </div>
            <h5 className="fw-semibold mb-0">{contest.title}</h5>
          </div>
          <p className="text-muted small mb-0">{contest.description}</p>
        </div>
        <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
          <Button
            size="sm"
            style={{
              backgroundColor: "#efcbb2ff",
              color: "#775757ff",
              border: "none",
              fontWeight: "500",
            }}
          >
            <i className="bi bi-clock me-1"></i>{" "}
            {timeLeft !== null ? formatTime(timeLeft) : "Loading..."}
          </Button>
          <Button ////// Round Completion Button (NEW - yaha add kiya)
            size="sm"
            style={{
              backgroundColor: "white",
              color: "black",
              border: "1px solid grey",
              fontWeight: "500",
            }}
          >
            {completedRounds} / {totalRounds} Rounds Complete
          </Button>
          <Button
            size="sm"
            style={{
              backgroundColor: "white",
              color: "black",
              border: "1px solid grey",
              fontWeight: "500",
            }}
           onClick={handleSubmitAndExit}
          >
            Submit & Exit Contest
          </Button>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="fw-semibold mb-0">Progress</h6>
          {/* ==== Progress % above bar (UPDATED) ==== */}
          <span className="text-muted small">{progressPercent}% Complete</span>
        </div>
        {/* ==== Real progress bar ==== */}
        <ProgressBar
          now={progressPercent}
          style={{ height: "8px", borderRadius: "10px" }}
        />
      </div>

      {/* Categories and Rounds Section */}
      <Row className="justify-content-center">
        <Col md={12}>
          <Row className="g-0">
            {/* Categories List */}
            <Col md={3} className="border-end">
              <div className="p-3 border-bottom bg-light">
                <h6 className="fw-semibold mb-0">Categories</h6>
              </div>
              <div className="p-3">
                <div className="d-flex flex-column gap-2">
                  <div
                    className="category-btn d-flex align-items-center justify-content-center py-2 px-3"
                    style={{
                      cursor: "pointer",
                      borderRadius: "8px",
                      border:
                        activeCategory === "All"
                          ? "2px solid #007bff"
                          : "2px solid #e9ecef",
                      backgroundColor:
                        activeCategory === "All" ? "#007bff" : "transparent",
                      color: activeCategory === "All" ? "white" : "#495057",
                      fontWeight: "500",
                    }}
                    onClick={() => setActiveCategory("All")}
                  >
                    <i
                      className="bi bi-ui-checks-grid me-2"
                      style={{
                        color: activeCategory === "All" ? "white" : "#6c757d",
                      }}
                    ></i>
                    All Rounds
                  </div>
                  {categories.map((category, index) => (
                    <div
                      key={index}
                      className="category-btn d-flex align-items-center justify-content-center py-2 px-3"
                      style={{
                        cursor: "pointer",
                        borderRadius: "8px",
                        border:
                          activeCategory === category.name
                            ? "2px solid #007bff"
                            : "2px solid #e9ecef",
                        backgroundColor:
                          activeCategory === category.name
                            ? "#007bff"
                            : "transparent",
                        color:
                          activeCategory === category.name
                            ? "white"
                            : "#495057",
                        fontWeight: "500",
                      }}
                      onClick={() => setActiveCategory(category.name)}
                    >
                      <i
                        className={`${category.icon} me-2`}
                        style={{
                          color:
                            activeCategory === category.name
                              ? "white"
                              : "#6c757d",
                          fontSize: "14px",
                        }}
                      ></i>
                      {category.name}
                    </div>
                  ))}
                </div>
              </div>
            </Col>
            {/* Rounds List */}
            <Col md={9}>
              <div className="p-3 border-bottom bg-light">
                <h6 className="fw-semibold mb-0">
                  {activeCategory === "All"
                    ? "All Rounds"
                    : `${activeCategory} Rounds`}
                </h6>
              </div>
              <div className="p-3">
                {filteredRounds.length === 0 ? (
                  <p className="text-muted">No rounds found.</p>
                ) : (
                  filteredRounds.map((round, index) => (
                    <Card
                      key={round.id || round._id}
                      className="mb-3 border-0 shadow-sm"
                    >
                      <Card.Body>
                        <Row className="align-items-center">
                          <Col md={8}>
                            <h6 className="fw-semibold mb-1">
                              {round.round_name || "Untitled Round"}
                            </h6>
                            <div className="text-muted small">
                              Type:{" "}
                              {round.type === "quiz" ? "Aptitude" : "Coding"} •{" "}
                              {round.questions?.length || 0} Questions
                            </div>
                          </Col>
                          <Col md={4} className="text-end">
                            <Button
                              variant={
                                isRoundCompleted(index) ? "success" : "primary"
                              }
                              size="sm"
                              disabled={
                                (index > 0 && !isRoundCompleted(index - 1)) ||
                                isRoundCompleted(index)
                              }
                              onClick={() => {
                                if (!isRoundCompleted(index)) {
                                  navigate(
                                    round.type === "quiz"
                                      ? `/events/quiz/${contest.id}/${round.id}`
                                      : `/events/code/${contest.id}/${round.id}`
                                  );
                                }
                              }}
                            >
                              {isRoundCompleted(index)
                                ? "Complete"
                                : "Start Round"}
                            </Button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))
                )}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Toast Notification */}
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
    </Layout>
  );
}
