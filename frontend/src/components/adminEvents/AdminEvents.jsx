import { useState } from "react";
import { Plus, BarChart3, Users, Trophy, Clock } from "lucide-react";
import ContestTable from "./ContestTable";
import SubmissionReview from "./SubmissionReview";
import { useNavigate } from "react-router-dom";

export default function AdminEvents({
  contests,
  onDeleteContest,
}) {
  const [activeTab, setActiveTab] = useState("contests");
  const navigate = useNavigate();

  const stats = {
    totalContests: contests.length,
    activeContests: contests.filter((c) => c.status === "active").length,
    totalParticipants: contests.reduce((sum, c) => sum + c.participants, 0),
    completedContests: contests.filter((c) => c.status === "completed").length,
  };

  const handleEditContest = (contest) => {
    navigate("/admin/events/createContest", { state: { contest } });
  };

  const handleSelectContest = (contest) => {
    //navigate("/admin/events/contestDetails", { state: { contest } });
    navigate(`/admin/events/contestDetails/${contest.id}`);

  };

  return (
    // We add padding for small screens using Bootstrap's responsive padding classes
    <div className="admin-dashboard p-2 p-md-0">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-md-between align-items-center text-center text-md-start mb-4">
        <div className="mb-3 mb-md-0">
          <h1 className="display-6 fw-bold text-primary mb-1">
            Contests Dashboard
          </h1>
          <p className="text-muted mb-0">
            Manage contests and monitor platform activity
          </p>
        </div>

        <div className="d-flex justify-content-md-end">
          <button
            className="btn btn-primary btn-lg d-flex align-items-center justify-content-center w-100 w-md-auto"
            onClick={() => navigate("/admin/events/createContest")}
          >
            <Plus size={20} className="me-2" />
            Create Contest
          </button>
        </div>

      </div>

      {/* ✅ RESPONSIVE Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border shadow-sm h-100 stats-card">
            <div className="card-body d-flex align-items-center">
              <div className="stats-icon bg-primary bg-opacity-10 text-primary rounded-3 me-3">
                <BarChart3 size={24} />
              </div>
              <div>
                <h5 className="card-title mb-1">{stats.totalContests}</h5>
                <p className="card-text text-muted small mb-0">Total Contests</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border shadow-sm h-100 stats-card">
            <div className="card-body d-flex align-items-center">
              <div className="stats-icon bg-success bg-opacity-10 text-success rounded-3 me-3">
                <Clock size={24} />
              </div>
              <div>
                <h5 className="card-title mb-1">{stats.activeContests}</h5>
                <p className="card-text text-muted small mb-0">Active Contests</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border shadow-sm h-100 stats-card">
            <div className="card-body d-flex align-items-center">
              <div className="stats-icon bg-info bg-opacity-10 text-info rounded-3 me-3">
                <Users size={24} />
              </div>
              <div>
                <h5 className="card-title mb-1">{stats.totalParticipants}</h5>
                <p className="card-text text-muted small mb-0">Total Participants</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
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
            className={`nav-link ${activeTab === "submissions" ? "active" : ""}`}
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
            {/* ✅ RESPONSIVE TABLE WRAPPER */}
            <div className="table-responsive">
              <ContestTable
                contests={contests}
                onSelectContest={handleSelectContest}
                onDeleteContest={onDeleteContest}
                onEditContest={handleEditContest}
              />
            </div>
          </div>
        )}

        {activeTab === "submissions" && (
          <div className="tab-pane fade show active">
            {/* ✅ Also wrap submission review in case it has wide content */}
            <div className="table-responsive">
              <SubmissionReview contests={contests} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}