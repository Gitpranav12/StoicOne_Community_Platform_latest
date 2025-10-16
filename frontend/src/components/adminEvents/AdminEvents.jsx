import { useState } from "react";
import { Plus, BarChart3, Users, Trophy, Clock } from "lucide-react";
import ContestTable from "./ContestTable";
import CreateContestForm from "./CreateContestForm";
import ContestDetails from "./ContestDetails";
import SubmissionReview from "./SubmissionReview";
import { useNavigate } from "react-router-dom";

export default function AdminEvents({
  contests,
  onCreateContest,
  onUpdateContest,
  onDeleteContest,
}) {
  const [activeTab, setActiveTab] = useState("contests");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedContest, setSelectedContest] = useState(null);
  const navigate = useNavigate(); // ✅ Use navigation hook

  const stats = {
    totalContests: contests.length,
    activeContests: contests.filter((c) => c.status === "active").length,
    totalParticipants: contests.reduce((sum, c) => sum + c.participants, 0),
    completedContests: contests.filter((c) => c.status === "completed").length,
  };

  const handleCreateSuccess = (contest) => {
    onCreateContest(contest);
    // setShowCreateForm(false);
    navigate("/admin/events"); // ✅ Redirect back to dashboard after creation
  };

  const handleEditContest = (contest) => {
    navigate("/admin/events/createContest", { state: { contest } });
  };

  // if (selectedContest) {
  //   return (
  //     <ContestDetails
  //       contest={selectedContest}
  //       onBack={() => setSelectedContest(null)}
  //       onUpdate={(updates) => onUpdateContest(selectedContest.id, updates)}
  //       onDelete={() => {
  //         onDeleteContest(selectedContest.id);
  //         setSelectedContest(null);
  //       }}
  //     />
  //   );
  // }
  const handleSelectContest = (contest) => {
    navigate("/admin/events/contestDetails", { state: { contest } });
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-md-between align-items-center text-center text-md-start mb-4">
        <div className="mb-3 mb-md-0">
          <h1 className="display-6 fw-bold text-primary mb-1">
            Events Dashboard
          </h1>
          <p className="text-muted mb-0">
            Manage contests and monitor platform activity
          </p>
        </div>

        <button
          className="btn btn-primary btn-lg d-flex align-items-center justify-content-center"
          // onClick={() => setShowCreateForm(true)}
          onClick={() => navigate("/admin/events/createContest")} // ✅ Navigate to route
        >
          <Plus size={20} className="me-2" />
          Create Contest
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border shadow-sm h-100 stats-card">
            <div className="card-body d-flex align-items-center">
              <div className="stats-icon bg-primary bg-opacity-10 text-primary rounded-3 me-3">
                <BarChart3 size={24} />
              </div>
              <div>
                <h5 className="card-title mb-1">{stats.totalContests}</h5>
                <p className="card-text text-muted small mb-0">
                  Total Contests
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border shadow-sm h-100 stats-card">
            <div className="card-body d-flex align-items-center">
              <div className="stats-icon bg-success bg-opacity-10 text-success rounded-3 me-3">
                <Clock size={24} />
              </div>
              <div>
                <h5 className="card-title mb-1">{stats.activeContests}</h5>
                <p className="card-text text-muted small mb-0">
                  Active Contests
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border shadow-sm h-100 stats-card">
            <div className="card-body d-flex align-items-center">
              <div className="stats-icon bg-info bg-opacity-10 text-info rounded-3 me-3">
                <Users size={24} />
              </div>
              <div>
                <h5 className="card-title mb-1">{stats.totalParticipants}</h5>
                <p className="card-text text-muted small mb-0">
                  Total Participants
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border shadow-sm h-100 stats-card">
            <div className="card-body d-flex align-items-center">
              <div className="stats-icon bg-warning bg-opacity-10 text-warning rounded-3 me-3">
                <Trophy size={24} />
              </div>
              <div>
                <h5 className="card-title mb-1">{stats.completedContests}</h5>
                <p className="card-text text-muted small mb-0">Completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "contests" ? "active" : ""}`}
            onClick={() => setActiveTab("contests")}
            type="button"
          >
            Contest Management
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${
              activeTab === "submissions" ? "active" : ""
            }`}
            onClick={() => setActiveTab("submissions")}
            type="button"
          >
            Submission Review
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "contests" && (
          <div className="tab-pane fade show active">
            <ContestTable
              contests={contests}
              onSelectContest={handleSelectContest}
              onDeleteContest={onDeleteContest}
              onEditContest={handleEditContest}
            />
          </div>
        )}

        {activeTab === "submissions" && (
          <div className="tab-pane fade show active">
            <SubmissionReview contests={contests} />
          </div>
        )}
      </div>
    </div>
  );
}
