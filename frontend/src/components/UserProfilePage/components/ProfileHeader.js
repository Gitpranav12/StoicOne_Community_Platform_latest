import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function ProfileHeader({ user: propUser, loading: propLoading }) {
  const { user: contextUser, loading: contextLoading } = useContext(UserContext);
  const user = propUser || contextUser;
  const loading = propLoading ?? contextLoading;
  const navigate = useNavigate();

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (!user || !user.profile) {
    return (
      <div className="text-center p-4 border rounded bg-light shadow-sm">
        <p className="mb-0 text-muted">No profile data available.</p>
      </div>
    );
  }

  const { id, name, designation, score } = user.profile;

  const profilePhotoUrl = id
    ? `http://localhost:8080/api/user/${id}/profile-photo`
    : "https://i.pravatar.cc/112?img=1";

  return (
    <div className="container-fluid mb-4">
      <div className="card shadow border-0 rounded-4 p-4 profile-header-card">
        <div className="row align-items-center">
          {/* Avatar + Info */}
          <div className="col-12 col-md-8 d-flex align-items-center mb-3 mb-md-0">
            <div className="profile-avatar-wrapper">
              <img
                src={profilePhotoUrl}
                alt={name || "User"}
                className="rounded-circle profile-avatar"
                style={{ width: "112px", height: "112px", objectFit: "cover" }}
                onError={(e) => {
                  e.target.src = "https://i.pravatar.cc/112?img=1";
                }}
              />
            </div>
            <div className="ms-3">
              <h4 className="mb-0"> {name || "Unnamed User"}
                <span className="badge bg-secondary ms-2">
                   {user.profile.reputation.name}
                </span>
              </h4>
              <p className="mb-1 text-muted">{designation || "No designation"}</p>
              <h6 className="mb-0 text-primary fw-semibold">
                Score: {score ?? 0}
              </h6>
            </div>
          </div>

          {/* Edit Profile Button */}
          {(!propUser || propUser.id === contextUser?.id) && (
            <div className="col-12 col-md-4 text-md-end text-center">
              <button
                className="btn btn-outline-primary"
                onClick={() => navigate("/profile/settings")}
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
