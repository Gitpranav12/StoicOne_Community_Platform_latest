// src/components/CollectiveHeader.js
import React from "react";
import { Button, Badge } from "react-bootstrap";
import "./CollectiveHeader.css";
import { useCollectives } from "../collectives/CollectivesContext"; // ✅ import context

const CollectiveHeader = ({ collective, questions }) => {

  // ✅ Access global joinedCollectives + setter
  const { joinedCollectives, setJoinedCollectives } = useCollectives();
  if (!collective) return null;

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser.id; // 🔹 replace with logged-in user id


  const handleJoin = async () => {
    const updated = { ...collective, joined: !collective.joined };

    try {
      const res = await fetch(
        `http://localhost:8080/api/collectives/${collective.id}/toggle-member`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userId, // 🔹 replace with logged-in user id
            action: updated.joined ? "join" : "unjoin",
          }),
        }
      );
      const data = await res.json();
      updated.members = data.members;
    } catch (err) {
      console.error("Error updating members:", err);
    }

    if (updated.joined) {
      setJoinedCollectives((prev) =>
        prev.some((j) => j.id === updated.id) ? prev : [...prev, updated]
      );
    } else {
      setJoinedCollectives((prev) => prev.filter((j) => j.id !== updated.id));
    }
  };






  return (
    <div className="collective-header card p-4 mb-4">
      {/* Banner */}
      <div className="banner rounded mb-3">
        <img
          src={
            collective.banner ||
            "https://cdn.sstatic.net/Sites/stackoverflow/Img/subcommunities/aws-header.png"
          }
          alt={`${collective.name} Header`}
          className="img-fluid rounded"
          style={{ width: "100%", height: "150px", objectFit: "cover" }}
        />
      </div>

      {/* Main Info */}
      <div className="d-flex align-items-center">
        <img
          src={collective.icon}
          alt={collective.name}
          style={{ width: "80px", marginRight: "20px" }}
        />
        <div className="flex-grow-1">
          <h3>{collective.name}</h3>
          <p>{collective.description}</p>

          {/* Tags */}
          <div className="mb-2">
            {collective.tags?.slice(0, 4).map((tag, idx) => (
              <Badge key={idx} bg="secondary" className="me-2">
                {tag}
              </Badge>
            ))}
            {collective.tags?.length > 4 && (
              <a href="/" className="ms-2">
                see all {collective.tags.length} associated tags
              </a>
            )}
          </div>

          {/* Stats */}
          <div className="text-muted">
            <span className="me-3">{questions?.length || 0} Questions</span>
            <span className="me-3">{collective.members} Members</span>
          </div>
        </div>

        <Button variant={collective.joined ? "primary" : "outline-primary"}

          onClick={handleJoin} // 🔹 toggle when clicked
        >
          {collective.joined ? "Joined" : "Join collective"}
        </Button>
      </div>
    </div>
  );
};

export default CollectiveHeader;
