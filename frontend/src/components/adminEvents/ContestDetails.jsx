import {
  ArrowLeft,
  Edit,
  Trash2,
  Users,
  Calendar,
  Clock,
  BarChart3,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../../Layout/Layout";
import axios from "axios"; // ✅ Make sure axios is imported
import { useCustomAlert } from "../customAlert/useCustomAlert";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

export default function ContestDetails() {
  const navigate = useNavigate(); // ✅ Use navigation hook
  const location = useLocation();
  const contest = location.state?.contest;
  // Inside your component
  const [showAlert, AlertComponent] = useCustomAlert();

  const [participants, setParticipants] = useState([]);

  // ✅ Fetch participants when page loads
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/contests/${contest.id}/participants`
        );
        setParticipants(res.data || []);
      } catch (err) {
        console.error("Error fetching participants:", err);
      }
    };
    if (contest?.id) fetchParticipants();
  }, [contest?.id]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { class: "bg-success", text: "Active" },
      upcoming: { class: "bg-warning", text: "Upcoming" },
      completed: { class: "bg-secondary", text: "Completed" },
      draft: { class: "bg-info", text: "Draft" },
    };
    const config = statusConfig[status] || statusConfig.draft;
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  // Delete handler
  const handleDeleteContest = () => {
    showAlert({
      title: "Delete Contest",
      message: "Are you sure you want to delete this contest?",
      onConfirm: async () => {
        try {
          const response = await axios.delete(
            `http://localhost:8080/api/contests/${contest.id}`
          );

          if (response.data.success) {
            // ✅ Show success toast
            toast.success("Contest deleted successfully!");
            // Navigate back to contests page
            navigate("/admin/events");
          }
        } catch (err) {
          console.error("Error deleting contest:", err);
          // Optional: show error alert
          toast.error("Failed to delete contest.");
        }
      },
    });
  };

  return (
    <Layout>
      <div className="contest-details">
        <div className="container-fluid py-4">
          {/* Header */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
            <div className="mb-3 mb-md-0">
              <div className="d-flex align-items-center gap-3 mb-2 flex-wrap">
                <h2 className="mb-0">{contest.title}</h2>
                {(() => {
                  const start = new Date(
                    contest.startDate || contest.start_date
                  );
                  const end = new Date(contest.endDate || contest.end_date);
                  const now = new Date();

                  let dynamicStatus = "upcoming";
                  if (now < start) dynamicStatus = "upcoming";
                  else if (now >= start && now <= end) dynamicStatus = "active";
                  else dynamicStatus = "completed";

                  // Use DB status as fallback if needed (like "draft" or "archived")
                  const finalStatus =
                    contest.status === "draft" ? "draft" : dynamicStatus;

                  return <span>{getStatusBadge(finalStatus)}</span>;
                })()}
                <span
                  className={`badge ${
                    contest.rounds?.every((r) => r.type === "quiz")
                      ? "bg-info"
                      : contest.rounds?.every((r) => r.type === "coding")
                      ? "bg-primary"
                      : "bg-secondary"
                  }`}
                >
                  {contest.rounds?.every((r) => r.type === "quiz")
                    ? "Quiz"
                    : contest.rounds?.every((r) => r.type === "coding")
                    ? "Coding"
                    : "Quiz + Coding"}
                </span>
              </div>
              <p className="text-muted mb-0">Contest Details & Management</p>
            </div>

            {(() => {
              const start = new Date(contest.startDate || contest.start_date);
              const end = new Date(contest.endDate || contest.end_date);
              const now = new Date();

              let dynamicStatus = "upcoming";
              if (now < start) dynamicStatus = "upcoming";
              else if (now >= start && now <= end) dynamicStatus = "active";
              else dynamicStatus = "completed";

              const finalStatus =
                contest.status === "draft" ? "draft" : dynamicStatus;
              const isEditable =
                finalStatus === "upcoming" || finalStatus === "draft";

              return (
                <div className="d-flex gap-2 flex-wrap flex-md-nowrap">
                  {/* Back button (always visible) */}
                  <button
                    className="btn btn-outline-secondary d-flex align-items-center flex-grow-1 flex-md-grow-0 justify-content-center"
                    style={{ minWidth: 0 }}
                    onClick={() => navigate(-1)}
                  >
                    <ArrowLeft size={16} className="me-1" />
                    <span className="d-none d-sm-inline">Back</span>
                  </button>

                  {/* Edit & Delete (only visible for upcoming/draft) */}
                  {isEditable && (
                    <>
                      <button
                        className="btn btn-outline-primary d-flex align-items-center flex-grow-1 flex-md-grow-0 justify-content-center"
                        style={{ minWidth: 0 }}
                        onClick={() =>
                          navigate("/admin/events/createContest", {
                            state: { contest },
                          })
                        }
                      >
                        <Edit size={16} className="me-1" />
                        <span className="d-none d-sm-inline">Edit</span>
                      </button>
                    </>
                  )}

                  <button
                    className="btn btn-outline-danger d-flex align-items-center flex-grow-1 flex-md-grow-0 justify-content-center"
                    style={{ minWidth: 0 }}
                    onClick={handleDeleteContest}
                  >
                    <Trash2 size={16} className="me-1" />
                    <span className="d-none d-sm-inline">Delete</span>
                  </button>
                </div>
              );
            })()}
          </div>

          <div className="row g-4">
            {/* Main Content */}
            <div className="col-lg-8">
              {/* Contest Overview */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white">
                  <h5 className="card-title mb-0">Contest Overview</h5>
                </div>
                <div className="card-body">
                  <p className="mb-4">{contest.description}</p>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <Calendar className="text-muted me-3" size={20} />
                        <div>
                          <div className="small text-muted">Start Date</div>
                          <div className="fw-semibold">
                            {" "}
                            {formatDate(contest.startDate)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <Calendar className="text-muted me-3" size={20} />
                        <div>
                          <div className="small text-muted">End Date</div>
                          <div className="fw-semibold">
                            {" "}
                            {formatDate(contest.endDate)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <Clock className="text-muted me-3" size={20} />
                        <div>
                          <div className="small text-muted">Total Duration</div>
                          <div className="fw-semibold">
                            {contest.rounds?.reduce(
                              (sum, r) => sum + r.duration,
                              0
                            ) || 0}{" "}
                            minutes
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <Users className="text-muted me-3" size={20} />
                        <div>
                          <div className="small text-muted">Participants</div>
                          <div className="fw-semibold">
                            {contest.participants}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Render all rounds (quiz + coding) */}
              {contest.rounds?.length > 0 &&
                contest.rounds.map((round, index) => (
                  <div key={index} className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-white">
                      <h5 className="card-title mb-0">
                        {round.type === "quiz"
                          ? `${round.round_name} (Aptitude Questions: ${
                              round.questions?.length || 0
                            })`
                          : `${round.round_name} (Coding Problem)`}
                      </h5>
                    </div>
                    <div className="card-body">
                      {/* Quiz */}
                      {round.type === "quiz" &&
                        round.questions?.map((q, qIndex) => (
                          <div
                            key={q.id || qIndex}
                            className="border rounded-3 p-3 mb-3"
                          >
                            <h6 className="mb-3">
                              Q{qIndex + 1}: {q.text}
                            </h6>
                            <div className="row g-2">
                              {q.options?.map((option, optIndex) => (
                                <div key={optIndex} className="col-md-6">
                                  <div
                                    className={`p-2 rounded ${
                                      optIndex === q.correct_index
                                        ? "bg-success bg-opacity-10 border border-success"
                                        : "bg-light"
                                    }`}
                                  >
                                    <span className="me-2 fw-bold">
                                      {String.fromCharCode(65 + optIndex)}.
                                    </span>
                                    {option}
                                    {optIndex === q.correct_index && (
                                      <span className="badge bg-success ms-2">
                                        Correct
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}

                      {/* Coding */}
                      {/* Coding */}
                      {round.type === "coding" &&
                        round.questions?.map((q, qIndex) => (
                          <div
                            key={q.id || qIndex}
                            className="border rounded-3 p-3 mb-3"
                          >
                            <h6 className="mb-3">
                              Q{qIndex + 1}: {q.title}
                            </h6>
                            <p>{q.description}</p>
                            <div className="mb-2">
                              <strong>Input Format:</strong> {q.input_format}
                            </div>
                            <div className="mb-2">
                              <strong>Output Format:</strong> {q.output_format}
                            </div>
                            <div className="mb-2">
                              <strong>Sample Input:</strong>
                              <pre className="bg-light p-2 rounded">
                                {q.sample_input}
                              </pre>
                            </div>
                            <div className="mb-2">
                              <strong>Sample Output:</strong>
                              <pre className="bg-light p-2 rounded">
                                {q.sample_output}
                              </pre>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>

            {/* Sidebar Stats */}
            <div className="col-lg-4">
              {/* Contest Statistics */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white">
                  <h5 className="card-title mb-0">Contest Statistics</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="stats-icon bg-primary bg-opacity-10 text-primary rounded-3 me-3">
                      <Users size={24} />
                    </div>
                    <div>
                      <div className="fw-bold">{contest.participants}</div>
                      <div className="small text-muted">Total Participants</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-3">
                    <div className="stats-icon bg-success bg-opacity-10 text-success rounded-3 me-3">
                      <BarChart3 size={24} />
                    </div>
                    <div>
                      <div className="fw-bold">
                        {Math.floor(contest.participants * 0.7)}
                      </div>
                      <div className="small text-muted">Completed</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-3">
                    <div className="stats-icon bg-warning bg-opacity-10 text-warning rounded-3 me-3">
                      <Clock size={24} />
                    </div>
                    <div>
                      <div className="fw-bold">
                        {contest.rounds?.reduce(
                          (sum, r) => sum + r.duration,
                          0
                        ) || 0}{" "}
                        minutes
                      </div>
                      <div className="small text-muted">Duration</div>
                    </div>
                  </div>

                  <hr />

                  <div className="small text-muted mb-2">Completion Rate</div>
                  <div className="progress mb-3" style={{ height: "8px" }}>
                    <div
                      className="progress-bar bg-success"
                      style={{ width: "70%" }}
                    ></div>
                  </div>

                  <div className="small text-muted mb-2">Average Score</div>
                  <div className="progress mb-3" style={{ height: "8px" }}>
                    <div
                      className="progress-bar bg-primary"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Participants List */}
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Participants</h5>
                  <span className="badge bg-primary">
                    {participants.length}
                  </span>
                </div>
                <div
                  className="card-body"
                  style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    padding: "0.75rem 1rem",
                  }}
                >
                  {participants.length > 0 ? (
                    participants.map((p, idx) => (
                      <div
                        key={idx}
                        className="d-flex align-items-center justify-content-between border-bottom py-2"
                      >
                        <div className="d-flex align-items-center">
                          {p.avatar ? (
                            <img
                              src={p.avatar}
                              alt={p.name || "User"}
                              className="rounded-circle me-2 border"
                              style={{
                                width: 32,
                                height: 32,
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <div
                              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                              style={{
                                width: 32,
                                height: 32,
                                fontSize: "0.9rem",
                              }}
                            >
                              {p.name ? p.name[0].toUpperCase() : "U"}
                            </div>
                          )}
                          <div>
                            <div className="fw-semibold">
                              {p.name || "Unknown User"}
                            </div>
                            <div className="text-muted small">
                              {p.email || p.user_id}
                            </div>
                          </div>
                        </div>

                        <div className="text-muted small">
                          {p.joined_at
                            ? `joined ${new Date(p.joined_at)
                                .toLocaleString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "2-digit",
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })
                                .replace(",", ", at")}`
                            : ""}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted small mb-0">
                      No participants yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add this at the bottom of your JSX */}
        {AlertComponent}
      </div>
    </Layout>
  );
}
