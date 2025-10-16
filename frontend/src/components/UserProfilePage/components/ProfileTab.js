import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axios from "axios";

function ProfileTab({ user: propUser, loading: propLoading }) {
  const { user: contextUser, loading: contextLoading } = useContext(UserContext);
  const user = propUser || contextUser;
  const loading = propLoading ?? contextLoading;
  const navigate = useNavigate();

  const [questions, setQuestions] = useState(user?.activity?.questions || []);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/questions/${id}`);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch {
      alert("Delete failed.");
    }
  };

  const startEditing = (q) => {
    setEditingId(q.id);
    setEditTitle(q.title);
    setEditBody(q.bodyText || "");
  };
  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle("");
    setEditBody("");
  };

  const saveEditing = async () => {
    try {
      await axios.put(`http://localhost:8080/api/questions/${editingId}`, {
        title: editTitle,
        bodyText: editBody,
      });
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === editingId ? { ...q, title: editTitle, bodyText: editBody } : q
        )
      );
      cancelEditing();
    } catch {
      alert("Update failed.");
    }
  };

  useEffect(() => {
    if (user?.activity?.questions) {
      setQuestions(user.activity.questions);
    }
  }, [user]);

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (!user) return <p className="text-center mt-5">No user data available</p>;

  return (
    <div className="container-fluid p-4">

      {/* Stats Section */}
      <div className="stats-section mb-5">
        <h4 className="fw-bold mb-4 text-gradient">
          <i className="bi bi-bar-chart-fill"></i> Stats
        </h4>
        <div className="row g-4 justify-content-center">
          {user?.stats &&
            Object.entries(user.stats).map(([key, value], index) => (
              <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={index}>
                <div className="card border rounded-4 stat-card h-100 d-flex flex-column align-items-center justify-content-center text-center p-3 hover-zoom">
                  <h5 className="fw-bold text-primary mb-2">{value}</h5>
                  <span className="badge bg-light text-dark">{key}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Bio Section */}
      <div className="bio-section mb-5">
        <h4 className="fw-bold mb-3 text-gradient"><i class="bi bi-person-fill"></i> Bio</h4>
        <div className="card shadow-sm border-0 rounded-4 p-3 bg-light">
          <p className="mb-0">{user?.profile?.bio || "No bio available yet."}</p>
        </div>
      </div>

      {/* Questions Section */}
      <div className="questions-section">
        <h4 className="fw-bold mb-4 text-gradient"><i class="bi bi-question-diamond-fill"></i> Questions</h4>
        {questions.length > 0 ? (
          questions.map((post) => (
            <div
              className="card mb-4 shadow-sm border-0 rounded-4 hover-card"
              key={post.id}
            >
              <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
                {/* Left side - Question info */}
                <div className="flex-grow-1">
                  {editingId === post.id ? (
                    <>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="form-control mb-2"
                      />
                      <textarea
                        value={editBody}
                        onChange={(e) => setEditBody(e.target.value)}
                        className="form-control"
                        rows="3"
                      />
                    </>
                  ) : (
                    <>
                      <h5
                        className="text-dark question-title heading-text"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/questions/${post.id}`)}
                      >
                        {post.title}
                      </h5>
                      <small className="text-muted">
                        Posted{" "}
                        {new Date(post.createdAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: "Asia/Kolkata",
                        })}
                      </small>
                    </>
                  )}
                </div>

                {/* Right side - Buttons */}
                <div className="d-flex gap-2">
                  {(!propUser || propUser.id === contextUser?.id) &&
                    (editingId === post.id ? (
                      <>
                        <button
                          className="btn btn-success btn-sm px-3"
                          onClick={saveEditing}
                        >
                          <i class="bi bi-floppy-fill"></i> Save
                        </button>
                        <button
                          className="btn btn-secondary btn-sm px-3"
                          onClick={cancelEditing}
                        >
                          <i class="bi bi-x-circle-fill"></i> Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-outline-primary btn-sm px-3"
                          onClick={() => startEditing(post)}
                        >
                          <i class="bi bi-pencil-fill"></i> Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm px-3"
                          onClick={() => handleDelete(post.id)}
                        >
                          <i class="bi bi-trash3-fill"></i> Delete
                        </button>
                      </>
                    ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">No Questions available yet.</p>
        )}
      </div>
    </div>
  );
}

export default ProfileTab;
