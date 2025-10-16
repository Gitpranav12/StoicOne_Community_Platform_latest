import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row, ProgressBar, Spinner, Toast, ToastContainer } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Layout from "../../Layout/Layout";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function ProgressPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // contest id
  const [contest, setContest] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showToast, setShowToast] = useState(false);


  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/contests/${id}`
        );
        setContest(response.data);

        // 👇 Timer
        const durationInMinutes = location.state?.duration || 0;
        const storageKey = `contest_end_time_${id}`;

        let endTime = localStorage.getItem(storageKey);

        // 👇 If first time loading this contest
        if (!endTime) {
          endTime = Date.now() + durationInMinutes * 60 * 1000; // current time + duration
          localStorage.setItem(storageKey, endTime);
        }

        updateTimeLeft(endTime, storageKey);
      } catch (error) {
        console.error("Error fetching contest:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
  }, [id, location.state]);

  // add when handle submit quiz
    //   localStorage.removeItem(`contest_end_time_${id}`);
    //   navigate("/events");

  // ---------- Countdown Timer ----------
  const updateTimeLeft = (endTime, storageKey) => {
    const timer = setInterval(() => {
      const remaining = Math.floor((endTime - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(timer);
        localStorage.removeItem(storageKey);
        setShowToast(true);
        setTimeout(() => navigate("/events"), 3000);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  };

  // ---------- Format time ----------
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

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

  if (!contest) {
    return (
      <Layout>
        <div className="text-center mt-5">
          <h5>Contest not found</h5>
        </div>
      </Layout>
    );
  }

  // Extract categories dynamically
  const categories = Array.from(
    new Set(
      contest.rounds.map((r) => (r.type === "quiz" ? "Aptitude" : "Coding"))
    )
  ).map((type) => ({
    name: type,
    icon: type === "Aptitude" ? "bi-lightbulb" : "bi-code-slash",
  }));

  // Filter rounds by category
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
      {/* ---------- Header ---------- */}
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
            <i className="bi bi-clock me-1"></i> {" "}
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
            {contest.rounds.length} Rounds
          </Button>

          <Button
            size="sm"
            style={{
              backgroundColor: "white",
              color: "black",
              border: "1px solid grey",
              fontWeight: "500",
            }}
            onClick={() => navigate("/events")}
          >
            Exit Contest
          </Button>
        </div>
      </div>

      {/* ---------- Progress Section ---------- */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="fw-semibold mb-0">Progress</h6>
          <span className="text-muted small">0% Complete</span>
        </div>
        <ProgressBar now={0} style={{ height: "8px", borderRadius: "10px" }} />
      </div>

      {/* ---------- Rounds Section ---------- */}
      <Row className="justify-content-center">
        <Col md={12}>
          <Row className="g-0">
            {/* Categories Section */}
            <Col md={3} className="border-end">
              <div className="p-3 border-bottom bg-light">
                <h6 className="fw-semibold mb-0">Categories</h6>
              </div>

              <div className="p-3">
                <div className="d-flex flex-column gap-2">
                  {/* All Option */}
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

            {/* Rounds Section */}
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
                  filteredRounds.map((round) => (
                    <Card key={round.id} className="mb-3 border-0 shadow-sm">
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
                              variant="primary"
                              size="sm"
                              onClick={() =>
                                navigate(
                                  round.type === "quiz"
                                    ? `/events/quiz/${contest.id}/${round.id}`
                                    : `/events/code/${contest.id}/${round.id}`
                                )
                              }
                            >
                              Start Round
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
    </Layout>
  );
}