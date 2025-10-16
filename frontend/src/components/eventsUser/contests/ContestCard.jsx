import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { Calendar, Clock, Users, HelpCircle, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ContestCard({ contest }) {
  const navigate = useNavigate();

  return (
    <Card className="border shadow-sm h-100"
    style={{ backgroundColor: "#f3f4f7ff" }}
    >
      <Card.Body className="d-flex flex-column">
        <div>
          {/* Title and badges */}
          <Card.Title>{contest.title}</Card.Title>
          <Badge
            bg={
              contest.status === "Ongoing"
                ? "primary"
                : contest.status === "Upcoming"
                ? "warning"
                : "secondary"
            }
            className="me-2"
          >
            {contest.status}
          </Badge>
          <Badge bg="info">{contest.type}</Badge>

          {/* Description */}
          <Card.Text className="mt-2 text-muted">{contest.description}</Card.Text>

          {/* Contest Info (Icons + Text in same row) */}
          <div className="mt-2 text-muted small">
            <div className="d-flex align-items-center mb-1">
              <Calendar size={16} className="me-2 text-secondary" />
              <span>{contest.date} • {contest.time}</span>
            </div>
            <div className="d-flex align-items-center mb-1">
              <Clock size={16} className="me-2 text-secondary" />
              <span>{contest.duration}</span>
            </div>
            <div className="d-flex align-items-center mb-1">
              <Users size={16} className="me-2 text-secondary" />
              <span>{contest.participants || 0}/{contest.maxParticipants}</span>
            </div>
            <div className="d-flex align-items-center">
              <HelpCircle size={16} className="me-2 text-secondary" />
              <span>{contest.questions} questions</span>
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="mt-auto pt-3">
          {contest.status === "Ongoing" && (
            <Button
              variant="primary"
              className="w-100 d-flex align-items-center justify-content-center gap-2"
               onClick={() => navigate(`/events/contest/${contest.id}`)} // ✅ pass contest.id in route
            >
              <Play size={16} /> Join Contest
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
