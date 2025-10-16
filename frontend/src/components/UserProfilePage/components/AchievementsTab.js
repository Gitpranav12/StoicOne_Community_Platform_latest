import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import "../css/Profile.css";
import { FaLock } from "react-icons/fa";

// prop added by raj
export default function AchievementsTab({ user: propUser, loading: propLoading }) {
  // const { user, loading } = useContext(UserContext);

  // Added by Raj.........
  const { user: contextUser, loading: contextLoading } = useContext(UserContext);
  const user = propUser || contextUser;
  const loading = propLoading ?? contextLoading;
  //...............

  if (loading) return <p>Loading achievements...</p>;
  if (!user || !user.achievements) return <p>No achievements found.</p>;

  // Achieved badges/milestones first
  const badges = (user.achievements.badges || []).sort((a, b) => b.achieved - a.achieved);
  const milestones = (user.achievements.milestones || []).sort((a, b) => b.achieved - a.achieved);

  return (
    <div className="container-fluid p-3">
      {/* Badges Grid */}
      <h5 className="mb-3 heading-text">Badges</h5>
      <div className="row">
        {badges.map((b) => (
          <div key={b.id} className="col-md-4 col-sm-6 mb-3">
            <div className="card h-100 p-3 text-center shadow-sm position-relative">
              <div className="position-relative d-flex justify-content-center">
                <img
                  src={`http://localhost:8080${b.icon}`}
                  alt={b.name}
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "contain",
                    filter: b.achieved ? "none" : "blur(2px)",
                    transition: "filter 0.3s",
                  }}
                />
                {!b.achieved && (
                  <FaLock
                    className="position-absolute"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontSize: "1.5rem",
                      color: "rgba(0,0,0,0.5)",
                    }}
                  />
                )}
              </div>

              <h6 className="mt-2 sub-heading-text">{b.name}</h6>
              {b.description && (
                <p className="small mb-1 normal-text text-grey">{b.description}</p>
              )}

              <div className="progress" style={{ height: "6px" }}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${b.progress || 0}%` }}
                />
              </div>
              <small className="text-muted">{b.progress || 0}% Completed</small>
            </div>
          </div>
        ))}
      </div>

      {/* Milestones Grid */}
      <h5 className="mt-4 mb-3 heading-text">Milestones</h5>
      <div className="row">
        {milestones.map((m) => (
          <div key={m.id} className="col-md-6 mb-3">
            <div className="card h-100 p-3 text-center shadow-sm position-relative">
              <div className="position-relative d-flex justify-content-center">
                <img
                  src={`http://localhost:8080${m.icon}`}
                  alt={m.name}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "contain",
                    filter: m.achieved ? "none" : "blur(2px)",
                    transition: "filter 0.3s",
                  }}
                />
                {!m.achieved && (
                  <FaLock
                    className="position-absolute"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontSize: "1.5rem",
                      color: "rgba(0,0,0,0.5)",
                    }}
                  />
                )}
              </div>

              <h6 className="mt-2 sub-heading-text fw-bold">{m.name}</h6>
              {m.description && (
                <p className="small mb-1 normal-text text-grey">{m.description}</p>
              )}

              <div className="progress" style={{ height: "6px" }}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${m.progress || 0}%` }}
                />
              </div>
              <small className="text-muted">{m.progress || 0}% Completed</small>
            </div>
          </div>
        ))}
      </div>

      {/* Reputation Section */}
      <h5 className="mt-4 mb-3 heading-text">Reputation</h5>
      <div className="card p-3 text-center shadow-sm">
        <span className="fs-2 mb-2 d-flex justify-content-center">
          <img
            src={user.profile.reputation.icon}
            alt={user.profile.reputation.name}
            style={{ width: "160px", height: "120px" }}
          />
        </span>
        <h6 className="sub-heading-text fw-bold">
          {user.profile.reputation.name}
          <span className="text-muted"> ({user.profile.score} pts)</span>
        </h6>

        <div className="progress mt-2" style={{ height: "8px" }}>
          <div
            className="progress-bar bg-success"
            role="progressbar"
            style={{ width: `${user.profile.reputation.progress}%` }}
          />
        </div>

        <small className="text-muted">
          {user.profile.reputation.nextLevel
            ? `Next Level: ${user.profile.reputation.nextLevel} (${user.profile.reputation.nextMin} pts)`
            : "Max Level Achieved 🎉"}
        </small>
      </div>

    </div>
  );
}
