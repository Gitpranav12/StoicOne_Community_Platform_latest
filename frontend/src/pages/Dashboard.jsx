import { Link } from "react-router-dom";

function Dashboard() {
  const role = localStorage.getItem("role");

  return (
    <div className="container mt-5">
      <h2>Welcome to Dashboard</h2>
      <p>Your Role: <b>{role}</b></p>

      {role === "Admin" && <Link to="/admin">Go to Admin Page</Link>}
      {role === "Moderator" && <Link to="/moderator">Go to Moderator Page</Link>}
      {role === "Member" && <Link to="/member">Go to Member Page</Link>}
    </div>
  );
}

export default Dashboard;
