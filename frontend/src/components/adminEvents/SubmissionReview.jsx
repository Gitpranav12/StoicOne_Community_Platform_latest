import { useState, useEffect } from "react";
import {
  Eye,
  Download,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SubmissionReview({ contests }) {
  const [selectedContest, setSelectedContest] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // ✅ Use navigation hook

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/contests/coding_submissions/all"
        );
        setSubmissions(res.data);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  // ✅ All submissions for stats
  const statsSubmissions = submissions;

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesContest =
      selectedContest === "all" ||
      submission.contest_id.toString() === selectedContest;
    // const matchesStatus =
    //   filterStatus === "all" || submission.status === filterStatus;
    const matchesSearch =
      submission.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.contestTitle?.toLowerCase().includes(searchTerm.toLowerCase());

    // // ✅ Hide if participant is completed AND already reviewed
    // const isVisible = !(
    //   submission.participantStatus === "completed" &&
    //   submission.reviewStatus === "reviewed"
    // );

    // return matchesContest && matchesStatus && matchesSearch && isVisible;

    let matchesStatus = true;

    // ✅ Map filter status dropdown values to actual data fields
    if (filterStatus === "completed") {
      matchesStatus = submission.latestStatus === "reviewed";
    } else if (filterStatus === "pending") {
      matchesStatus = submission.latestStatus === "pending";
    }

    // ✅ Don't hide reviewed submissions anymore
    return matchesContest && matchesStatus && matchesSearch;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="text-success" size={18} />;
      case "pending":
        return <Clock className="text-warning" size={18} />;
      case "failed":
        return <XCircle className="text-danger" size={18} />;
      default:
        return <Clock className="text-muted" size={18} />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-danger";
  };

  return (
    <div className="submission-review">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">Submission Review</h3>
          <p className="text-muted mb-0">
            Review and evaluate participant submissions
          </p>
        </div>
        {/* <button className="btn btn-outline-primary">
          <Download size={18} className="me-2" />
          Export Results
        </button> */}
      </div>

      {/* Summary Stats */}
      <div className="row g-4 mt-4">
        <div className="col-md-3">
          <div className="card border shadow-sm text-center">
            <div className="card-body">
              <div className="fw-bold h4 text-primary">
                {statsSubmissions.length}
              </div>
              <div className="small text-muted">Total Submissions</div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border shadow-sm text-center">
            <div className="card-body">
              <div className="fw-bold h4 text-success">
                {
                  statsSubmissions.filter((s) => s.latestStatus === "reviewed")
                    .length
                }
              </div>
              <div className="small text-muted">Completed</div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border shadow-sm text-center">
            <div className="card-body">
              <div className="fw-bold h4 text-warning">
                {
                  statsSubmissions.filter((s) => s.latestStatus === "pending")
                    .length
                }
              </div>
              <div className="small text-muted">Pending Review</div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border shadow-sm text-center">
            <div className="card-body">
              <div className="fw-bold h4 text-info">
                {Math.round(
                  statsSubmissions.reduce(
                    (sum, s) => sum + s.avgManualScore,
                    0
                  ) / statsSubmissions.length
                ) || 0}
                %
              </div>
              <div className="small text-muted">Average Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by username or contest"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={selectedContest}
                onChange={(e) => setSelectedContest(e.target.value)}
              >
                <option value="all">All Contests</option>
                {contests.map((contest) => (
                  <option key={contest.id} value={contest.id}>
                    {contest.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending Review</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div
            className="overflow-x-auto sm:overflow-x-visible"
            style={{ width: "100%" }}
          >
            <div
              style={{ minWidth: "100%", maxWidth: "31ch" }}
              className="sm:max-w-full"
            >
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Participant</th>
                    <th scope="col">Contest</th>
                    <th
                      scope="col"
                      className="text-center"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Coding Score
                    </th>
                    <th
                      scope="col"
                      className="text-center"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Quiz Score
                    </th>
                    <th scope="col" className="text-center">
                      Status
                    </th>
                    <th scope="col">Submitted</th>
                    <th
                      scope="col"
                      className="text-center"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Time Spent
                    </th>
                    <th scope="col" className="text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div
                            className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{ width: "40px", height: "40px" }}
                          >
                            {submission.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="fw-semibold">
                              {submission.username}
                            </div>
                            <div className="small text-muted">Participant</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="fw-semibold">
                            {submission.contestTitle}
                          </div>
                          <div className="small text-muted">
                            Contest ID: {submission.contest_id}
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        {(() => {
                          const manualScore =
                            parseFloat(submission.avgManualScore) || 0;
                          const autoScore =
                            parseFloat(submission.avgAutoScore) || 0;

                          const displayScore =
                            manualScore === 0 ? autoScore : manualScore;

                          return (
                            <div
                              className={`fw-bold ${getScoreColor(
                                displayScore
                              )}`}
                            >
                              {displayScore}%
                            </div>
                          );
                        })()}
                      </td>
                      <td className="text-center">
                        <div
                          className={`fw-bold ${getScoreColor(
                            submission.quiz_score
                          )}`}
                        >
                          {submission.quiz_score}%
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="d-flex align-items-center justify-content-center">
                          {getStatusIcon(submission.latestStatus)}
                          <span className="ms-2 small text-capitalize">
                            {submission.latestStatus}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="small">
                          {formatDate(submission.latestSubmission)}
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="small">{submission.timeSpent} min</div>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          title="View Submission Details"
                          onClick={() => {
                            navigate("/admin/events/submissionDetails", {
                              state: {
                                contestId: submission.contest_id,
                                userId: submission.user_id,
                              },
                            });
                          }}
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredSubmissions.length === 0 && (
            <div className="text-center py-5">
              <div className="text-muted">
                <Filter size={48} className="mb-3 opacity-50 d-block mx-auto" />
                <h5>No submissions found</h5>
                <p>Try adjusting your search criteria or filters.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
