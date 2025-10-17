import React, { useEffect, useState, useContext } from "react";
import { Card, Button, Row, Col, Spinner } from "react-bootstrap";
import Layout from "../../Layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserProfilePage/context/UserContext";

export default function ContestPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user: contextUser } = useContext(UserContext);
  const currentUserId = contextUser?.profile?.id;

  const handleStartContest = async () => {
    try {
      await axios.post(
        `http://localhost:8080/api/contests/${contest.id}/join`,
        { userId: currentUserId }
      );
      const totalDuration = contest.rounds.reduce(
        (sum, r) => sum + parseInt(r.duration || 0),
        0
      );
      navigate(`/events/progress/${contest.id}`, {
        state: { duration: totalDuration },
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/contests/${id}`);
        const data = await res.json();
        setContest(data);
      } catch (err) {
        console.error("Error fetching contest:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContest();
  }, [id]);

  if (loading)
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center vh-100">
          <Spinner animation="border" variant="primary" />
        </div>
      </Layout>
    );
  if (!contest)
    return (
      <Layout>
        <p className="text-center mt-5 text-danger">Contest not found.</p>
      </Layout>
    );

  return (
    <Layout>
      <div className="px-4 py-4">
        {/* Contest Header */}
        <div className="text-center mb-4">
          <div
            className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-4"
            style={{
              width: "50px",
              height: "50px",
              background: "linear-gradient(135deg, #007bff, #28a745)",
            }}
          >
            <i
              className="bi bi-trophy-fill text-white"
              style={{ fontSize: "20px" }}
            ></i>
          </div>
          <h4 className="fw-semibold" style={{ fontSize: "24px" }}>
            {contest.title}
          </h4>
          <p className="text-muted" style={{ fontSize: "16px" }}>
            {contest.description}
          </p>
        </div>

        {/* Rounds Section */}
        <Row className="g-3 justify-content-center">
          {/* Section 1: Quiz */}
          {contest.rounds.some((r) => r.type === "quiz") && (
            <Col md={5} key="quiz-section">
              <Card className="border border-primary h-100">
                <Card.Body>
                  <div className="d-flex align-items-start">
                    <div
                      className="d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "25px",
                        height: "25px",
                        borderRadius: "12px",
                        background: "rgba(192, 228, 248, 1)",
                      }}
                    >
                      <i
                        className="bi bi-book text-primary"
                        style={{ fontSize: "15px" }}
                      ></i>
                    </div>

                    <div className="flex-grow-1">
                      <h6 className="mb-1" style={{ fontSize: "16px" }}>
                        Aptitude Questions
                      </h6>
                      <p
                        className="text-muted mb-2"
                        style={{ fontSize: "13px" }}
                      >
                        Test your logical and analytical skills
                      </p>

                      <table className="w-100" style={{ fontSize: "14px" }}>
                        <tbody>
                          <tr>
                            <td
                              className="text-muted pb-1"
                              style={{ width: "45%" }}
                            >
                              Questions:
                            </td>
                            <td className="pb-1">
                              {contest.rounds
                                .filter((r) => r.type === "quiz")
                                .reduce(
                                  (sum, r) => sum + (r.questions?.length || 0),
                                  0
                                )}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-muted pb-1">Total Points:</td>
                            <td>
                              {contest.rounds
                                .filter((r) => r.type === "quiz")
                                .reduce(
                                  (sum, r) =>
                                    sum + (r.questions?.length || 0) * 10,
                                  0
                                )}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-muted">Duration:</td>
                            <td>
                              {contest.rounds
                                .filter((r) => r.type === "quiz")
                                .reduce(
                                  (sum, r) => sum + parseInt(r.duration || 0),
                                  0
                                )}{" "}
                              minutes
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          )}

          {/* Section 2: Coding */}
          {contest.rounds.some((r) => r.type === "coding") && (
            <Col md={5} key="coding-section">
              <Card className="border border-success h-100">
                <Card.Body>
                  <div className="d-flex align-items-start">
                    <div
                      className="d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "25px",
                        height: "25px",
                        borderRadius: "12px",
                        background: "#c4f5deff",
                      }}
                    >
                      <i
                        className="bi bi-code text-success"
                        style={{ fontSize: "15px" }}
                      ></i>
                    </div>

                    <div className="flex-grow-1">
                      <h6 className="mb-1" style={{ fontSize: "16px" }}>
                        Coding Problems
                      </h6>
                      <p
                        className="text-muted mb-2"
                        style={{ fontSize: "13px" }}
                      >
                        Solve programming challenges
                      </p>

                      <table className="w-100" style={{ fontSize: "14px" }}>
                        <tbody>
                          <tr>
                            <td
                              className="text-muted pb-1"
                              style={{ width: "45%" }}
                            >
                              Problems:
                            </td>
                            <td className="pb-1">
                              {contest.rounds
                                .filter((r) => r.type === "coding")
                                .reduce(
                                  (sum, r) => sum + (r.questions?.length || 0),
                                  0
                                )}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-muted pb-1">Languages:</td>
                            <td>Multi-language</td>
                          </tr>
                          <tr>
                            <td className="text-muted">Duration:</td>
                            <td>
                              {contest.rounds
                                .filter((r) => r.type === "coding")
                                .reduce(
                                  (sum, r) => sum + parseInt(r.duration || 0),
                                  0
                                )}{" "}
                              minutes
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>

        {/* Contest Instructions */}
        <div className="mt-5 border rounded-3 p-4 bg-light">
          <h6 className="fw-semibold mb-3" style={{ fontSize: "16px" }}>
            <i className="bi bi-info-circle me-2 text-primary"></i> Contest
            Instructions
          </h6>

          <Row>
            <Col md={6}>
              <h6 className="fw-semibold mb-2" style={{ fontSize: "14px" }}>
                Contest Features:
              </h6>
              <ul
                className="list-unstyled small text-secondary"
                style={{ fontSize: "13px" }}
              >
                <li>
                  <i className="bi bi-check-circle text-success me-2"></i> View
                  all problems at once
                </li>
                <li>
                  <i className="bi bi-check-circle text-success me-2"></i> Solve
                  in any order
                </li>
                <li>
                  <i className="bi bi-check-circle text-success me-2"></i>{" "}
                  Real-time tracking
                </li>
                <li>
                  <i className="bi bi-check-circle text-success me-2"></i> No
                  time limit per problem
                </li>
              </ul>
            </Col>
            <Col md={6}>
              <h6 className="fw-semibold mb-2" style={{ fontSize: "14px" }}>
                Problem Types:
              </h6>
              <ul
                className="list-unstyled small text-secondary"
                style={{ fontSize: "13px" }}
              >
                {contest.rounds.some((r) => r.type === "quiz") && (
                  <li>
                    <i className="bi bi-terminal text-primary me-2"></i>{" "}
                    Aptitude and reasoning
                  </li>
                )}
                {contest.rounds.some((r) => r.type === "coding") && (
                  <li>
                    <i className="bi bi-braces text-primary me-2"></i> Coding
                    challenges
                  </li>
                )}
                <li>
                  <i className="bi bi-lightbulb text-primary me-2"></i> Instant
                  feedback
                </li>
              </ul>
            </Col>
          </Row>
        </div>

        {/* Duration Box */}
        <div
          className="mt-4 p-3 rounded-3 text-center"
          style={{
            backgroundColor: "#f8e5d7ff",
            border: "1px solid #e8680cff",
          }}
        >
          <div className="d-flex align-items-center justify-content-center">
            <div className="me-3">
              <i
                className="bi bi-clock"
                style={{ fontSize: "14px", color: "#c55f10ff" }}
              ></i>
            </div>
            <div>
              <div
                className="fw-semibold"
                style={{ fontSize: "14px", color: "rgba(36, 35, 35, 1)" }}
              >
                Total Contest Duration
              </div>
              <div
                className="fw-bold"
                style={{ fontSize: "14px", color: "#8e8f92ff" }}
              >
                {contest.rounds.reduce(
                  (sum, r) => sum + parseInt(r.duration || 0),
                  0
                )}{" "}
                minutes
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 d-flex justify-content-center align-items-center gap-3">
          <Button
            variant="outline-secondary"
            className="fw-semibold px-4 py-2"
            size="lg"
            style={{ fontSize: "14px" }}
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>

          
          <Button
            onClick={handleStartContest}
            className="fw-semibold px-4 py-2 text-white border-0 d-flex align-items-center justify-content-center gap-2"
            size="lg"
            style={{
              background: "linear-gradient(135deg, #007BFF, #28A745)",
              fontSize: "14px",
            }}
          >
            <i className="bi bi-play" style={{ fontSize: "14px" }}></i>
            Start Contest
          </Button>
        </div>
      </div>
    </Layout>
  );
}
