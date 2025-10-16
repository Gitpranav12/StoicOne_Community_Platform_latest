import React from "react";
import { Container, Row, Col, Card, ProgressBar, ListGroup } from "react-bootstrap";
import "./BadgeProgress.css";

export default function BadgeProgressPage() {
  // Badge data with steps + descriptions
  const badges = [
    {
      id: 1,
      title: "Curious",
      desc: "Begin your StoicOne journey by asking meaningful questions.",
      progress: 40,
      steps: [
        { step: "Sign up", detail: "Create your free StoicOne account." },
        { step: "Ask a question", detail: "Post your first question in the community." },
        { step: "Get an upvote", detail: "Receive feedback from members on your question." },
      ],
    },
    {
      id: 2,
      title: "Helper",
      desc: "Contribute by sharing your knowledge with others.",
      progress: 70,
      steps: [
        { step: "Find questions", detail: "Browse unanswered or new questions." },
        { step: "Post an answer", detail: "Write a clear, helpful response." },
        { step: "Get upvotes", detail: "Earn community approval with upvotes." },
      ],
    },
    {
      id: 3,
      title: "Supportive",
      desc: "Show encouragement by appreciating others’ contributions.",
      progress: 100,
      steps: [
        { step: "Read answers", detail: "Explore answers posted by the community." },
        { step: "Upvote content", detail: "Click the upvote button on helpful answers." },
      ],
    },
  ];

  return (
    <div className="badge-progress-page">
      {/* Header / Community Info */}
      <div className="tour-header text-center">
        <h1>🏛 StoicOne Community</h1>
        <p className="lead mt-3">
          StoicOne is a collaborative platform where members ask questions, share knowledge, 
          and grow together. Earn badges as you contribute and track your progress below.
        </p>
      </div>

      {/* Badge Section */}
      <Container className="py-5">
        <h2 className="text-center mb-5">🏅 Badge Progress</h2>

        <Row>
          {badges.map((badge) => (
            <Col md={4} key={badge.id} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  {/* Badge Title */}
                  <Card.Title>{badge.title}</Card.Title>
                  <Card.Subtitle className="text-muted mb-3">
                    {badge.desc}
                  </Card.Subtitle>

                  {/* Progress Bar */}
                  <ProgressBar
                    now={badge.progress}
                    label={`${badge.progress}%`}
                    className="mb-3"
                  />

                  {/* Steps */}
                  <h6>Steps to earn:</h6>
                  <ListGroup variant="flush">
                    {badge.steps.map((s, i) => (
                      <ListGroup.Item key={i}>
                        <strong>{s.step}: </strong> {s.detail}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
