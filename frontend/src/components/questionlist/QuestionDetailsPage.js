import React, { useEffect, useState, useContext, useRef  } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../UserProfilePage/context/UserContext";
import axios from "axios";

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
  // NEW: Delete an answer
  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm("Are you sure you want to delete this answer?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/questions/answers/${answerId}`);
      setAnswers((prev) => prev.filter((a) => a.id !== answerId));
      fetchUserData();
    } catch {
      alert("Delete failed.");
    }
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
                  {/* <div>{a.content}</div> */}
                  <div className="small text-muted mt-1">
                    By {a.author}, posted {new Date(a.createdAt).toLocaleString()}
                  </div>
                  {(user_id === a.user_id) && (
                    <div className="mt-2">
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
          <button className="btn btn-secondary" onClick={handlePostComment}>
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
            <b>{c.author}</b>: {c.content}{" "}
            <span className="text-muted small">
              ({new Date(c.createdAt).toLocaleString()})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
