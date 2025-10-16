import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Row, Col, Button } from "react-bootstrap";
import "../../App.css";
import "./Dashboardhome.css";
import QuestionsList from "../questionlist/QuestionList";
import CommunityActivity from "../CommunityActivity";
import Chatbot from "../chatbot/Chatbot";
import Layout from "../../Layout/Layout";
import { UserContext } from "../UserProfilePage/context/UserContext";
import CustomizeFeedModal from "../Customizepopup";

export default function DashboardHome() {
  const navigate = useNavigate();
  const { user, loading } = useContext(UserContext);
  const [show, setShow] = useState(false);

  const [imgError, setImgError] = useState(false);
  const icon = user?.profile?.reputation?.icon;
  const name = user?.profile?.reputation?.name;

  const handleBadge = () => {
    navigate("/profile/achievements");
  };

  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const [recentQuestions, setRecentQuestions] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8080/api/questions/recent")
      .then((res) => res.json())
      .then((data) => setRecentQuestions(data));
  }, [refreshKey]);

  // New state: track interested/not interested tags loaded from localStorage on modal close
  const [customTags, setCustomTags] = useState({ interested: [], notinterested: [] });

  useEffect(() => {
    if (!show) { // trigger only when modal closes
      const savedTags = localStorage.getItem("customFeedTags");
      if (savedTags) {
        setCustomTags(JSON.parse(savedTags));
      } else {
        setCustomTags({ interested: [], notinterested: [] });
      }
    }
  }, [show]);

  const userName =
    user?.profile?.name ||
    user?.name ||
    "Guest";

  return (
    <Layout>
      <>
        <div key={refreshKey}>
          <div className="p-4">
            {/* Welcome Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="headline-text">
                Welcome to{" "}
                <span className="text-primary fw-bold">StoicOne Community</span>,{" "}
                {loading ? "Loading..." : userName}!
              </h2>
              <Link to="/askquestion">
                <Button variant="outline-primary">Ask Question</Button>
              </Link>
            </div>

            {/* Stats Row */}
            {/* <Row className="mb-4">
              <Col md={4}>
                <Card className="h-100 flex-fill border">
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div>
                      <h6 className="d-sub-heading-text text-grey mb-3">Reputation</h6>
                      <div className="d-flex justify-content-around align-items-center gap-3">
                        <span className="fs-4 text-dark flex-shrink-1" data-testid="reputation-value">1</span>
                        <div className="rep-graph flex-item" style={{ width: "150px" }}>
                          <svg width="100%" height="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 30">
                            <rect width="100%" height="33%" fill="var(--bs-primary-bg-subtle)" />
                            <rect width="100%" height="33%" fill="var(--bs-primary-bg-subtle)" y="20" />
                            <path stroke="var(--bs-primary)" strokeDasharray="6, 6" fill="none" strokeWidth="3" d="M0 27 L90 9.85 L108 13.28 L126 9.85 L144 13.28 L180 3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <span className="text-muted small mt-2 d-block">
                      Earn reputation by <a href="/help/how-to-ask">Asking</a>, <a href="/help/how-to-answer">Answering</a> & <a href="/help/editing">Editing</a>.
                    </span>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="h-100 border">
                  <Card.Body>
                    <h6 className="d-sub-heading-text text-grey">Badge progress</h6>
                    <div className="normal-text text-muted pb-2">Take the tour to earn your first badge!</div>
                    <Button size="sm" variant="primary" onClick={handleBadge}>
                      Get started here
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="h-100 border">
                  <Card.Body>
                    <h6 className="d-sub-heading-text text-grey">Watched tags</h6>
                    <div className="normal-text text-muted pb-2">You're not watching any tags yet!</div>
                    <Button size="sm" variant="outline-primary">
                      Customize your feed
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row> */}

            <Row className="g-3 mb-4">
              <Col xs={12} sm={6} md={4}>
                <Card className="h-100 border">
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div>
                      <h6 className="d-sub-heading-text text-grey mb-3">Reputation</h6>
                      <div className="d-flex justify-content-around align-items-center gap-3">

                        <span className="fs-2 mb-2 d-flex justify-content-center">
                          {icon && !imgError ? (
                            <img
                              src={icon}
                              alt={name || "icon"}
                              style={{ width: "90px", height: "65px" }}
                              onError={() => setImgError(true)}
                            />
                          ) : (
                            <span style={{ fontSize: "14px", color: "gray" }}>Loading...</span>
                          )}
                        </span>
                        
                        <div className="rep-graph flex-item" style={{ width: "150px" }}>
                          <svg width="100%" height="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 30">
                            <rect width="100%" height="33%" fill="var(--bs-primary-bg-subtle)" />
                            <rect width="100%" height="33%" fill="var(--bs-primary-bg-subtle)" y="20" />
                            <path stroke="var(--bs-primary)" strokeDasharray="6, 6" fill="none" strokeWidth="3" d="M0 27 L90 9.85 L108 13.28 L126 9.85 L144 13.28 L180 3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <span className="text-muted small mt-2 d-block">
                      Earn reputation by <a href="/help/how-to-ask">Asking</a>, <a href="/help/how-to-answer">Answering</a> & <a href="/help/editing">Editing</a>.
                    </span>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <Card className="h-100 border">
                  <Card.Body>
                    <h6 className="d-sub-heading-text text-grey">Badge progress</h6>
                    <div className="normal-text text-muted pb-2">Take the tour to earn your first badge!</div>
                    <Button size="sm" variant="primary" onClick={handleBadge}>
                      Get started here
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <Card className="h-100 border">
                  <Card.Body>
                    <h6 className="d-sub-heading-text text-grey">Watched tags</h6>
                    <div className="normal-text text-muted pb-2">You're not watching any tags yet!</div>
                    <Button size="sm" variant="outline-primary" onClick={() => setShow(true)}>
                      Customize your feed
                    </Button>

                    {/* Popup Component */}
                    <CustomizeFeedModal show={show} handleClose={() => setShow(false)} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <h5 className="fw-bold mb-3">Interesting posts for you</h5>
            <div className="fs-body1 fc-black-400 ">Based on your viewing history and watched tags.</div>
            <Row>
              <Col md={8}>
                <QuestionsList
                  questions={recentQuestions}
                  interestedTags={customTags.interested}
                  notInterestedTags={customTags.notinterested}
                />
              </Col>
              <Col md={4}>
                <div className="d-flex flex-column gap-3">
                  <CommunityActivity />
                </div>
              </Col>
            </Row>
            <Chatbot />
          </div>
        </div>
      </>
    </Layout>
  );
}
