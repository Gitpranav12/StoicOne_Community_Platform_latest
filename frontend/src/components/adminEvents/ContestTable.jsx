import { useState } from "react";
import {
  Edit,
  Trash2,
  Eye,
  Users,
  Calendar,
  Clock,
  Trophy,
  BarChart2,
  Search,
} from "lucide-react";
import { useCustomAlert } from "../customAlert/useCustomAlert";
import { useNavigate } from "react-router-dom";

export default function ContestTable({
  contests,
  onSelectContest,
  onDeleteContest,
  onEditContest,
}) {
  const [sortField, setSortField] = useState("startDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showAlert, AlertComponent] = useCustomAlert();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("active");
  const [filterType, setFilterType] = useState("all");

  const navigate = useNavigate();

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedContests = [...contests].sort((a, b) => {
    let aValue, bValue;

    if (sortField === "duration") {
      // Compute total duration
      aValue = a.rounds?.reduce((sum, r) => sum + r.duration, 0) || 0;
      bValue = b.rounds?.reduce((sum, r) => sum + r.duration, 0) || 0;
    } else if (sortField === "participants") {
      aValue = a.participants || 0;
      bValue = b.participants || 0;
    } else {
      aValue = a[sortField];
      bValue = b[sortField];
    }

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { class: "bg-success", text: "Ongoing" },
      upcoming: { class: "bg-warning", text: "Upcoming" },
      completed: { class: "bg-secondary", text: "Completed" },
      draft: { class: "bg-info", text: "Draft" },
    };

    const config = statusConfig[status] || statusConfig.draft;
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewResults = (contest) => {
    const derivedType = contest.rounds?.every((r) => r.type === "quiz")
      ? "quiz"
      : contest.rounds?.every((r) => r.type === "coding")
      ? "coding"
      : "both";

    let typeParam = derivedType.toLowerCase();

    if (typeParam.includes("quiz") && typeParam.includes("coding")) {
      typeParam = "both";
    }

    navigate(`/events/result?contest=${contest.id}&type=${typeParam}`);
  };

  // -------------------------------
  // 🔹 Filter + Search Logic
  // -------------------------------
  const filteredContests = sortedContests.filter((contest) => {
    // Compute derived status
    const start = new Date(contest.startDate || contest.start_date);
    const end = new Date(contest.endDate || contest.end_date);
    const now = new Date();

    let dynamicStatus = "upcoming";
    if (now < start) dynamicStatus = "upcoming";
    else if (now >= start && now <= end) dynamicStatus = "active";
    else dynamicStatus = "completed";

    const finalStatus = contest.status === "draft" ? "draft" : dynamicStatus;

    // Compute contest type
    const type = contest.rounds?.every((r) => r.type === "quiz")
      ? "quiz"
      : contest.rounds?.every((r) => r.type === "coding")
      ? "coding"
      : "mixed";

    // ✅ Apply filters
    const matchesSearch = contest.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || finalStatus === filterStatus;

    const matchesType = filterType === "all" || type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-bottom">
        <h5 className="card-title mb-0">Contest Management</h5>
      </div>

      {/* 🔍 Search + Filters */}
      <div className="card-body border-bottom">
        <div className="row g-3 align-items-center">
          {/* Search by Contest Title */}
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text">
                <Search size={18} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by contest title"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filter by Status */}
          <div className="col-md-4">
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="active">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Filter by Type */}
          <div className="col-md-4">
            <select
              className="form-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="quiz">Quiz</option>
              <option value="coding">Coding</option>
              <option value="mixed">Quiz + Coding</option>
            </select>
          </div>
        </div>
      </div>

      {/* 🧾 Table Section */}
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
                  <th
                    scope="col"
                    className="cursor-pointer user-select-none whitespace-nowrap"
                    onClick={() => handleSort("title")}
                  >
                    Contest Title
                    {sortField === "title" && (
                      <span className="ms-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer user-select-none"
                    onClick={() => handleSort("type")}
                  >
                    Type
                    {sortField === "type" && (
                      <span className="ms-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer user-select-none"
                    onClick={() => handleSort("status")}
                  >
                    Status
                    {sortField === "status" && (
                      <span className="ms-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer user-select-none whitespace-nowrap"
                    onClick={() => handleSort("startDate")}
                  >
                    Start Date
                    {sortField === "startDate" && (
                      <span className="ms-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer user-select-none"
                    onClick={() => handleSort("duration")}
                  >
                    Duration
                    {sortField === "duration" && (
                      <span className="ms-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer user-select-none"
                    onClick={() => handleSort("participants")}
                  >
                    Participants
                    {sortField === "participants" && (
                      <span className="ms-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th scope="col" className="text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredContests.map((contest) => {
                  const totalDuration =
                    contest.rounds?.reduce((sum, r) => sum + r.duration, 0) ||
                    0;
                  // Determine contest type
                  const type = contest.rounds?.every((r) => r.type === "quiz")
                    ? "quiz"
                    : contest.rounds?.every((r) => r.type === "coding")
                    ? "coding"
                    : "mixed";

                  return (
                    <tr key={contest.id}>
                      <td>
                        <div>
                          <div
                            className="fw-semibold"
                            onClick={() => onSelectContest(contest)}
                          >
                            {contest.title}
                          </div>
                          <div
                            className="text-muted small text-truncate"
                            style={{ maxWidth: "200px" }}
                          >
                            {contest.description}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            type === "quiz"
                              ? "bg-info"
                              : type === "coding"
                              ? "bg-primary"
                              : "bg-secondary"
                          }`}
                        >
                          {type === "quiz"
                            ? "Quiz"
                            : type === "coding"
                            ? "Coding"
                            : "Quiz + Coding"}
                        </span>
                      </td>

                      {(() => {
                        const start = new Date(
                          contest.startDate || contest.start_date
                        );
                        const end = new Date(
                          contest.endDate || contest.end_date
                        );
                        const now = new Date();

                        let dynamicStatus = "upcoming";
                        if (now < start) dynamicStatus = "upcoming";
                        else if (now >= start && now <= end)
                          dynamicStatus = "active";
                        else dynamicStatus = "completed";

                        // Use DB status as fallback if needed (like "draft" or "archived")
                        const finalStatus =
                          contest.status === "draft" ? "draft" : dynamicStatus;

                        return <td>{getStatusBadge(finalStatus)}</td>;
                      })()}

                      <td>
                        <div className="d-flex align-items-center">
                          <Calendar size={16} className="text-muted me-2" />
                          <span className="small">
                            {formatDate(contest.startDate)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Clock size={16} className="text-muted me-2" />
                          <span className="small">{totalDuration} min</span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Users size={16} className="text-muted me-2" />
                          <span className="small">
                            {contest.participants}/{contest.max_participants}
                          </span>
                        </div>
                      </td>
                      <td>
                        {(() => {
                          const start = new Date(
                            contest.startDate || contest.start_date
                          );
                          const end = new Date(
                            contest.endDate || contest.end_date
                          );
                          const now = new Date();

                          let dynamicStatus = "upcoming";
                          if (now < start) dynamicStatus = "upcoming";
                          else if (now >= start && now <= end)
                            dynamicStatus = "active";
                          else dynamicStatus = "completed";

                          const finalStatus =
                            contest.status === "draft"
                              ? "draft"
                              : dynamicStatus;

                          const isEditable =
                            finalStatus === "upcoming" ||
                            finalStatus === "draft";

                          return (
                            <div className="d-flex gap-2 justify-content-center">
                              {/* View Button (always visible) */}
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => onSelectContest(contest)}
                                title="View Details"
                              >
                                <Eye size={16} />
                              </button>

                              {/* ✅ View Results Button (visible only when contest has ended) */}
                              {end < now && (contest.participants || 0) > 0 && (
                                <button
                                  className="btn btn-outline-success btn-sm"
                                  onClick={() => handleViewResults(contest)}
                                  title="View Results"
                                >
                                  <BarChart2 size={16} />
                                </button>
                              )}

                              {/* Edit & Delete (hidden when Active or Completed) */}
                              {isEditable && (
                                <>
                                  <button
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => onEditContest(contest)}
                                    title="Edit Contest"
                                  >
                                    <Edit size={16} />
                                  </button>
                                </>
                              )}
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => {
                                  showAlert({
                                    title: "Delete Contest",
                                    message:
                                      "Are you sure you want to delete this contest?",
                                    onConfirm: () =>
                                      onDeleteContest(contest.id),
                                  });
                                }}
                                title="Delete Contest"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          );
                        })()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {filteredContests.length === 0 && (
          <div className="text-center py-5">
            <div className="text-muted">
              <Trophy size={48} className="mb-3 opacity-50 mx-auto" />
              <h5>No contests found</h5>
              <p>Create your first contest to get started.</p>
            </div>
          </div>
        )}
      </div>

      {AlertComponent}
    </div>
  );
}
