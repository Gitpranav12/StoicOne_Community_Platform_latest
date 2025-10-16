import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import '../css/Profile.css';

// Reusable list component
function LoadMoreList({ items, visible, setVisible, renderItem, step = 5 }) {
  const { user } = useContext(UserContext);

  if (!user) return <p>No user data available.</p>;
  return (
    <div className="card shadow-sm border-0 rounded-4 hover-card">
      <div
        className="card-body p-2 mt-1"
        style={{ maxHeight: "300px", overflowY: "auto" }}
      >
        {items.length === 0 ? (
          <p className="text-muted small text-center">No activity yet.</p>
        ) : (
          items.slice(0, visible).map((item, i) => renderItem(item, i))
        )}
      </div>
      {visible < items.length && (
        <div className="card-footer text-center bg-white border-0">
          <button
            className="btn btn-sm btn-outline-primary px-4 rounded-pill load-more-btn"
            onClick={() => setVisible(visible + step)}
          >
            <i class="bi bi-box-arrow-in-down"></i> Load More
          </button>
        </div>
      )}
    </div>
  );
}

// prop added by raj
export default function ActivityTab({ user: propUser, loading: propLoading }) {
  const { user: contextUser, loading: contextLoading } = useContext(UserContext);
  const user = propUser || contextUser;
  const loading = propLoading ?? contextLoading;

  const navigate = useNavigate();

  const [visibleQ, setVisibleQ] = useState(5);
  const [visibleA, setVisibleA] = useState(5);

  if (loading) return <p className="text-center mt-3">Loading user activity...</p>;
  if (!user || !user.activity) return <p className="text-center mt-3">No activity found.</p>;

  return (
    <div className="container-fluid p-3">
      <div className="row g-4">
        {/* Questions */}
        <div className="col-12 col-sm-12 col-md-6 col-lg-6">
          <h5 className="fw-bold mb-1 text-gradient p-2">
            <i className="bi bi-question-diamond-fill"></i> Questions
          </h5>
          <LoadMoreList
            items={user.activity.questions || []}
            visible={visibleQ}
            setVisible={setVisibleQ}
            renderItem={(q, i) => (
              <div
                key={i}
                className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center activity-item p-3 rounded-3 mb-2"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/questions/${q.id}`)}
              >
                <h6 className="mb-2 mb-sm-0 fw-semibold">{q.title}</h6>
                <small className="text-muted">
                  <i className="bi bi-hand-thumbs-up-fill"></i> {q.votes} •{" "}
                  <i className="bi bi-chat-square-text"></i> {q.answers}
                </small>
              </div>
            )}
          />
        </div>

        {/* Answers */}
        <div className="col-12 col-sm-12 col-md-6 col-lg-6">
          <h5 className="fw-bold mb-1 text-gradient p-2">
            <i className="bi bi-lightbulb-fill"></i> Answers
          </h5>
          <LoadMoreList
            items={user.activity.answers || []}
            visible={visibleA}
            setVisible={setVisibleA}
            renderItem={(a, i) => (
              <div
                key={i}
                className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center activity-item p-3 rounded-3 mb-2"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/questions/${a.question_id}`)}
              >
                {/* Question title */}
                <p className="mb-2 mb-sm-0">
                  <span className="text-muted">Answered:</span>{" "}
                  <span className="fw-semibold">{a.questionTitle}</span>
                </p>

                {/* Votes */}
                <span className="text-muted">
                  <i className="bi bi-hand-thumbs-up-fill"></i> {a.votes}
                </span>
              </div>
            )}
          />
        </div>
        
      </div>
    </div>
  );
}
