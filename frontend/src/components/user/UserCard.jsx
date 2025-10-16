import { Card, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function UserCard({ user }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/users/${user.id}`); // 👈 go to new profile page
  };

  return (
    <Card
      onClick={handleClick}
      className="d-flex flex-row align-items-center p-3 mb-3 user-card-hover"
      style={{ borderRadius: "12px" }}
    >
      {/* profile photo */}
      {/* <img
        src={user.avatar}
        alt={user.name}
        className="rounded-circle me-3"
        style={{ width: "60px", height: "60px", objectFit: "cover" }}
      /> */}

      <img
        src={user.avatar || "/images/default-avatar.png"}
        alt={user.name}
        className="rounded-circle me-3"
        style={{ width: "60px", height: "60px", objectFit: "cover" }}
        onError={(e) => {
          // 👇 If the image fails to load, use fallback too
          e.target.src = "/images/default-avatar.png";
        }}
      />

      {/* name, designation, score, department */}
      <div className="flex-grow-1">
        <h6 className="mb-1 fw-semibold">{user.name}</h6>
        <small className="text-muted d-block mb-1">
          {" "}
          {user.designation ? user.designation : "--"}
        </small>
        <span className="fw-bold text-primary me-2">Score: {user.score}</span>

        <div className="mt-2">
          {user.department ? (
            <Badge
              bg="secondary"
              className="me-1 mb-1"
              style={{ fontSize: "0.75rem", padding: "0.25em 0.5em" }}
            >
              {user.department}
            </Badge>
          ) : (
            <small className="text-muted">--</small>
          )}
        </div>
      </div>
    </Card>
  );
}
