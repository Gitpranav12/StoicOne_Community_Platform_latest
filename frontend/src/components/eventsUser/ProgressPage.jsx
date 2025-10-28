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
// import Layout from "../../Layout/Layout"; // Layout ko yahan se remove kar sakte hain, kyunki ab yeh conditionally render hoga
import { UserContext } from "../UserProfilePage/context/UserContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useLayout } from "../../context/LayoutContext"; // <<<<<< 1. CONTEXT IMPORT KAREIN

export default function ProgressPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // contest id
  const { setIsLayoutVisible } = useLayout(); // <<<<<< 2. CONTEXT SE FUNCTION LEIN

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

  // <<<<<< 3. FULLSCREEN AUR LAYOUT HIDE KARNE WALA useEffect >>>>>>
  useEffect(() => {
    // Layout ko hide karein
    setIsLayoutVisible(false);

    // Fullscreen Mode Logic
    const enterFullScreen = () => {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen().catch((err) => {
          console.warn(`Fullscreen request failed: ${err.message}`);
        });
      } else if (element.mozRequestFullScreen) { /* Firefox */
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) { /* IE/Edge */
        element.msRequestFullscreen();
      }
    };

    // Disable Browser Back Button Logic
    const preventBackNavigation = () => {
      window.history.pushState(null, null, window.location.href);
      window.onpopstate = () => {
        window.history.pushState(null, null, window.location.href);
      };
    };

    enterFullScreen();
    preventBackNavigation();

    // Cleanup Logic
    return () => {
      // Layout ko wapas show karein
      setIsLayoutVisible(true);

      // Back button ko re-enable karein
      window.onpopstate = null;

      // Fullscreen se exit karein
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, [setIsLayoutVisible]); // Dependency array mein setIsLayoutVisible add karein


  // Utility to check if a round is completed
  const isRoundCompleted = (roundId) =>
    roundStatus && roundStatus.includes(roundId);

  // ===== Progress bar aur Rounds completed calculation =====
  const totalRounds = contest?.rounds?.length || 0;
  const completedRounds = roundStatus.length;
  const progressPercent =
    totalRounds === 0 ? 0 : Math.round((completedRounds / totalRounds) * 100);

  // Fetch contest details from API
  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/contests/${id}`
        );
        setContest(response.data);

        let key = `contest_${id}_rounds_complete`;
        let completed = JSON.parse(localStorage.getItem(key) || "[]");
        setRoundStatus(completed);

        const durationInMinutes = location.state?.duration || 0;
        const storageKey = `contest_end_time_${id}_${currentUserId}`;
        let endTime = localStorage.getItem(storageKey);

        if (!endTime && durationInMinutes > 0) { // Ensure duration is positive before setting
          endTime = Date.now() + durationInMinutes * 60 * 1000;
          localStorage.setItem(storageKey, endTime);
        }

        if (endTime) {
            startTimer(parseInt(endTime, 10), storageKey);
        }
        
      } catch (error) {
        console.error("Error fetching contest:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContest();
    // Eslint warning ko aaram se handle karne ke liye, startTimer ko useEffect ke andar move kar sakte hain
    // ya useCallback use kar sakte hain, but for now this is fine.
  }, [id, location.state, currentUserId]);


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

    return () => clearInterval(timerId);
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
    const allRoundsCompleted = roundStatus.length === totalRounds;

    if (allRoundsCompleted) {
      try {
        await axios.post(
          "http://localhost:8080/api/contests/participants/complete",
          {
            contestId: contest.id,
            userId: currentUserId,
          }
        );
        toast.success("Contest marked as completed!");
      } catch (error) {
        console.error("Error marking contest completed:", error);
      }
    }

    localStorage.removeItem(`contest_${id}_rounds_complete`);
    localStorage.removeItem(`contest_end_time_${id}_${currentUserId}`);

    navigate("/events");
  };

  // <<<<<< 4. LOADING AUR ERROR STATES SE LAYOUT HATAYEIN >>>>>>
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }} // Use 100vh for full-page centering
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="text-center mt-5">
        <h5>Contest not found</h5>
      </div>
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

  // <<<<<< 5. RETURN SE LAYOUT WRAPPER HATAYEIN >>>>>>
  return (
    <div className="container-fluid vh-100 d-flex flex-column p-4 bg-white">
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
          <Button
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
            title={
              roundStatus.length === totalRounds
                ? "Submit your contest"
                : "Complete all rounds to submit"
            }
            style={{
              backgroundColor: "white",
              color: "black",
              border: "1px solid grey",
              fontWeight: "500",
              opacity: roundStatus.length === totalRounds ? 1 : 0.6,
              cursor:
                roundStatus.length === totalRounds ? "pointer" : "not-allowed",
            }}
            onClick={handleSubmitAndExit}
            disabled={roundStatus.length !== totalRounds}
          >
            Submit & Exit Contest
          </Button>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="fw-semibold mb-0">Progress</h6>
          <span className="text-muted small">{progressPercent}% Complete</span>
        </div>
        <ProgressBar
          now={progressPercent}
          style={{ height: "8px", borderRadius: "10px" }}
        />
      </div>

      {/* Categories and Rounds Section */}
      <Row className="justify-content-center flex-grow-1">
        <Col md={12}>
          <Row className="g-0 h-100">
            {/* Categories List */}
            <Col md={3} className="border-end d-flex flex-column">
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
            <Col md={9} className="d-flex flex-column">
              <div className="p-3 border-bottom bg-light">
                <h6 className="fw-semibold mb-0">
                  {activeCategory === "All"
                    ? "All Rounds"
                    : `${activeCategory} Rounds`}
                </h6>
              </div>
              <div className="p-3 flex-grow-1" style={{ overflowY: "auto" }}>
                {filteredRounds.length === 0 ? (
                  <p className="text-muted">No rounds found.</p>
                ) : (
                  filteredRounds.map((round, index) => (
                    <Card
                      key={round.id || index}
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
                                isRoundCompleted(round.id)
                                  ? "success"
                                  : "primary"
                              }
                              size="sm"
                              disabled={isRoundCompleted(round.id)}
                              onClick={() => {
                                if (!isRoundCompleted(round.id)) {
                                  navigate(
                                    round.type === "quiz"
                                      ? `/events/quiz/${contest.id}/${round.id}`
                                      : `/events/code/${contest.id}/${round.id}`
                                  );
                                }
                              }}
                            >
                              {isRoundCompleted(round.id)
                                ? "Completed"
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
    </div>
  );
}