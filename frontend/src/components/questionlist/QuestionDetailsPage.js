import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../UserProfilePage/context/UserContext";
import axios from "axios";
import { Modal } from 'react-bootstrap'; // NEW: For custom confirmation modal

export default function QuestionDetailsPage() {
  const { user, fetchUserData } = useContext(UserContext);
  const user_id = user?.id || null;
  const author =
    user?.profile?.name ||
    user?.name ||
    "Guest";

  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  const [answers, setAnswers] = useState([]);
  const [comments, setComments] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [newComment, setNewComment] = useState("");
  const [votePending, setVotePending] = useState(false);

  // New state for user's current vote type on this question
  const [userVoteType, setUserVoteType] = useState(null);

  // NEW: State for editing answers
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editAnswerContent, setEditAnswerContent] = useState("");

  // NEW: For delete confirmation modal (handles both answers and comments)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [deletingItemType, setDeletingItemType] = useState(null); // 'answer' or 'comment'

  // Ref to ensure views increment only once per page load
  const hasIncrementedViews = useRef(false);
  
  // .............Added by Pranav Jawarkar 29 sep ..........
  // Increment views only once on initial load, and only if user hasn't voted yet
  useEffect(() => {
    if (!hasIncrementedViews.current && userVoteType === null) {
      fetch(`http://localhost:8080/api/questions/${id}?incViews=true`).catch(() => {});
      hasIncrementedViews.current = true;
    }
  }, [id, userVoteType]);
  // .............Added by Pranav Jawarkar 29 sep ..........
  // Fetch all data except views increment
  const reloadAll = () => {
    setLoading(true);

    fetch(`http://localhost:8080/api/questions/${id}`) // no incViews param here
      .then((res) => res.json())
      .then((data) => setQuestion(Array.isArray(data) ? data[0] : data))
      .catch(() => setQuestion(null))
      .finally(() => setLoading(false));

    fetch(`http://localhost:8080/api/questions/${id}/answers`)
      .then((res) => res.json())
      .then((data) => setAnswers(Array.isArray(data) ? data : []))
      .catch(() => setAnswers([]));

    fetch(`http://localhost:8080/api/questions/${id}/comments`)
      .then((res) => res.json())
      .then((data) => setComments(Array.isArray(data) ? data : []))
      .catch(() => setComments([]));

    if (user_id) {
      fetch(`http://localhost:8080/api/questions/${id}/uservote?voter=${author}`)
        .then(res => res.json())
        .then(data => setUserVoteType(data.vote_type))
        .catch(() => setUserVoteType(null));
    }
  };

  useEffect(reloadAll, [id, user_id, author]);

  const handleVote = (voteType) => {
    if (votePending) return;
    if (userVoteType === voteType) return;

    setVotePending(true);
    fetch("http://localhost:8080/api/questions/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question_id: id, voter: author, vote_type: voteType }),
    })
      .then(() => {
        setUserVoteType(voteType);
        fetchUserData(); //...........
        return fetch(`http://localhost:8080/api/questions/${id}`); // no incViews param here
      })
      .then((res) => res.json())
      .then((data) => setQuestion(Array.isArray(data) ? data[0] : data))
      .finally(() => setVotePending(false));
  };

  // .............Added by Pranav Jawarkar 27 sep ..........
  // Post answer
  const handlePostAnswer = () => {
    if (!newAnswer.trim()) return;

    const userAnswersCount = answers.filter(a => a.user_id === user_id).length;
    if (userAnswersCount >= 10) {
      alert("You can only post up to 10 answers per question.");
      return;
    }

    fetch("http://localhost:8080/api/questions/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        question_id: id,
        author,
        content: newAnswer,
      }),
    }).then(() => {
      setNewAnswer("");
      fetch(`http://localhost:8080/api/questions/${id}/answers`)
        .then((res) => res.json())
        .then((data) => setAnswers(Array.isArray(data) ? data : []));

      fetchUserData();

      // ✅ update notifications
      fetch(`http://localhost:8080/api/notificationsQuestions/${user_id}`)
        .then((res) => res.json())
        .catch((err) =>
          console.error("Error fetching notifications:", err)
        );
    });
  };

  // .............Added by Pranav Jawarkar 27 sep ..........
  // Post comment
  const handlePostComment = () => {
    if (!newComment.trim()) return;
    fetch("http://localhost:8080/api/questions/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question_id: id, user_id, author, content: newComment }),
    }).then(() => {
      setNewComment("");
      fetch(`http://localhost:8080/api/questions/${id}/comments`)
        .then((res) => res.json())
        .then((data) => setComments(Array.isArray(data) ? data : []));

      fetchUserData();

      // ✅ update notifications
      fetch(`http://localhost:8080/api/notificationsQuestions/${user_id}`)
        .then((res) => res.json())
        .catch((err) =>
          console.error("Error fetching notifications:", err)
        );
    });
  };

  // .............Added by Pranav Jawarkar 27 sep ..........
  // NEW: Start editing an answer
  const startEditingAnswer = (answer) => {
    setEditingAnswerId(answer.id);
    setEditAnswerContent(answer.content);
  };

  // NEW: Cancel editing
  const cancelEditingAnswer = () => {
    setEditingAnswerId(null);
    setEditAnswerContent("");
  };
  // .............Added by Pranav Jawarkar 27 sep ..........
  // NEW: Save edited answer
  const saveEditingAnswer = async () => {
    try {
      await axios.put(`http://localhost:8080/api/questions/answers/${editingAnswerId}`, {
        content: editAnswerContent,
      });

      // Update local state to reflect saved changes
      setAnswers((prev) =>
        prev.map((a) =>
          a.id === editingAnswerId ? { ...a, content: editAnswerContent } : a
        )
      );
      cancelEditingAnswer();
      fetchUserData();
    } catch {
      alert("Update failed.");
    }
  };
  // .............Added by Pranav Jawarkar 27 sep ..........
  // UPDATED: Delete an answer (shows modal instead of window.confirm)
  const handleDeleteAnswer = (answerId) => {
    setDeletingItemId(answerId);
    setDeletingItemType('answer');
    setShowDeleteModal(true);
  };

  // NEW: Delete a comment (shows modal instead of window.confirm) .............Added by Pranav Jawarkar 2 November ..........
  const handleDeleteComment = (commentId) => {
    setDeletingItemId(commentId);
    setDeletingItemType('comment');
    setShowDeleteModal(true);
  };

  // NEW: Confirm and execute delete from modal
  const handleConfirmDelete = async () => {
    if (!deletingItemId || !deletingItemType) return;
    try {
      if (deletingItemType === 'answer') {
        await axios.delete(`http://localhost:8080/api/questions/answers/${deletingItemId}`);
        setAnswers((prev) => prev.filter((a) => a.id !== deletingItemId));
      } else if (deletingItemType === 'comment') {
        await axios.delete(`http://localhost:8080/api/questions/comments/${deletingItemId}`, {
          data: { user_id }
        });
        setComments((prev) => prev.filter((c) => c.id !== deletingItemId));
      }
      fetchUserData();
    } catch {
      alert("Delete failed.");
    }
    setShowDeleteModal(false);
    setDeletingItemId(null);
    setDeletingItemType(null);
  };

  // NEW: Cancel modal
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingItemId(null);
    setDeletingItemType(null);
  };

  if (loading) return <div>Loading...</div>;
  if (!question) return <div>Question not found.</div>;

  // Parse tags safely
  let tagsArr = [];
  try {
    tagsArr =
      typeof question.tags === "string"
        ? JSON.parse(question.tags)
        : Array.isArray(question.tags)
          ? question.tags
          : [];
    if (!Array.isArray(tagsArr)) tagsArr = [tagsArr];
  } catch {
    tagsArr =
      typeof question.tags === "string"
        ? question.tags.split(",").map((t) => t.trim())
        : [];
  }

  return (
    <div className="container my-2">
      
      <button className="btn btn-outline-primary mb-3" onClick={() => navigate(-1)}>
        &larr; Back to Questions
      </button>

      {/* Question Card */}
      <div className="card">
        <div className="card-body">
          <h2 className="mb-3 text-primary">{question.title}</h2>

          {/* Flagged Badge */}
          {question.flagged === 1 && (
            <span className="badge bg-danger mb-2">
              Flagged: {question.flag_reason || "No reason provided"}
            </span>
          )}

          <div className="mb-3" dangerouslySetInnerHTML={{ __html: question.bodyHtml }} />
          <div className="mb-3">
            {tagsArr.map((tag, idx) => (
              <span className="badge bg-secondary me-2" key={idx}>
                {tag}
              </span>
            ))}
          </div>
          <div className="small text-muted mb-3">
            By {question.author} • {question.time} • {question.views} views
          </div>

          <div className="d-flex mb-2 align-items-center gap-3">
            <button
              className={`btn btn-outline-success btn-sm ${userVoteType === 1 ? "active" : ""}`}
              disabled={votePending || userVoteType === 1}
              onClick={() => handleVote(1)}
            >
              ▲
            </button>
            <span>
              <strong>{question.votes}</strong> votes
            </span>
            <button
              className={`btn btn-outline-danger btn-sm ${userVoteType === -1 ? "active" : ""}`}
              disabled={votePending || userVoteType === -1}
              onClick={() => handleVote(-1)}
            >
              ▼
            </button>
            <span>
              <strong>{answers.length}</strong> answers
            </span>
          </div>
        </div>
      </div>

      {/* Answer Form */}
      <div className="card my-3">
        <div className="card-body mb-1 " style={{ padding: '0px' }}>
          <h5 className="card-title mb-3">Your Answer</h5>
          <textarea
            className="form-control mb-2"
            value={newAnswer}
            rows={2}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Write your answer here..."
          />
          <button className="btn btn-primary" onClick={handlePostAnswer}>
            Post Answer
          </button>
        </div>
      </div>

      {/* Answer List */}
      <div className="my-3">
        <h4>Answers</h4>
        {answers.length === 0 && <div className="text-muted">No answers yet.</div>}
        {answers.map((a) => (
          <div className="card mb-2" key={a.id} style={{ padding: '0px' }}>
            <div className="card-body">
              {editingAnswerId === a.id ? (
                <>
                  <textarea
                    className="form-control mb-2"
                    value={editAnswerContent}
                    onChange={(e) => setEditAnswerContent(e.target.value)}
                    rows={3}
                  />
                  <div className="text-end"> {/* Right-aligned Save/Cancel */}
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={saveEditingAnswer}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={cancelEditingAnswer}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>{a.content}</div>

                    {/* ✅ Approval Status Badge */}
                    {a.approved === 1 && (
                      <span className="badge bg-success text-white ms-2">
                        Approved
                      </span>
                    )}
                    {a.approved === 0 && (
                      <span className="badge bg-danger text-white ms-2">
                        Rejected
                      </span>
                    )}
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-1"> {/* Timestamp left, buttons right - no extra space */}
                    <div className="small text-muted flex-grow-1">
                      By {a.author}, posted {new Date(a.createdAt).toLocaleString()}
                    </div>
                    {(user_id === a.user_id) && (
                      <div>
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => startEditingAnswer(a)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteAnswer(a.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Comment Form */}
      <div className="card my-3">
        <div className="card-body" style={{ padding: '0px' }} >
          <h5 className="card-title mb-3">Add Comment</h5>
          <input
            className="form-control mb-2"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <button className="btn btn-primary" onClick={handlePostComment}>
            Post Comment
          </button>
        </div>
      </div>

      {/* Comment List */}
      <div className="my-3">
        <h6>Comments</h6>
        {comments.length === 0 && <div className="text-muted">No comments yet.</div>}
        {comments.map((c) => (
          <div className="mb-1" key={c.id}>
            <div>{c.author}: {c.content}</div>
            <div className="d-flex justify-content-between align-items-center mt-1"> {/* Timestamp left, Delete right - no extra space */}
              <span className="text-muted small flex-grow-1">
                ({new Date(c.createdAt).toLocaleString()})
              </span>
              {(user_id === c.user_id) && (
                <div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteComment(c.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* NEW: Custom Delete Confirmation Modal (for both answers and comments) */}
      <Modal show={showDeleteModal} onHide={handleCancelDelete} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-center mb-0">
            Are you sure you want to delete this {deletingItemType}? This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <button className="btn btn-secondary me-2" onClick={handleCancelDelete}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleConfirmDelete}>
            Delete {deletingItemType?.charAt(0).toUpperCase() + deletingItemType?.slice(1)}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
