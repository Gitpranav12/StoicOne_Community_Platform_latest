// src/components/Contests/ContestCard.js

import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { Calendar, Clock, Users, HelpCircle, Play, BarChart2, } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ContestCard({ contest }) {
  const navigate = useNavigate();

  const handleViewResults = () => {
    let typeParam = contest.type.toLowerCase();

    // ✅ Map "quiz + coding" → "both"
    if (typeParam.includes("quiz") && typeParam.includes("coding")) {
      typeParam = "both";
    }

    navigate(`/events/result?contest=${contest.id}&type=${typeParam}`);
  };

  const getStatusBadge = () => {
    switch (contest.status) {
      case "Ongoing":
        return "primary";
      case "Upcoming":
        return "warning";
      case "Past":
        return "secondary";
      default:
        return "info";
    }
  };

  return (
    // h-100 makes the card fill the height of the column, ensuring alignment
    <Card className="shadow-sm h-100">
      {/* d-flex and flex-column allow us to push the button to the bottom */}
      <Card.Body className="d-flex flex-column">
        {/* Main content section */}
        <div>
          <Card.Title>{contest.title}</Card.Title>
          <div className="mb-2">
            <Badge bg={getStatusBadge()} className="me-2">
              {contest.status}
            </Badge>
            <Badge bg="info">{contest.type}</Badge>
          </div>
          <Card.Text className="text-muted small mt-2">{contest.description}</Card.Text>

          <p className="mb-1 d-flex align-items-center">
            <Calendar size={16} className="me-2 flex-shrink-0" /> {contest.date} • {contest.time}
          </p>
          <p className="mb-1 d-flex align-items-center">
            <Clock size={16} className="me-2 flex-shrink-0" /> {contest.duration}
          </p>
          <p className="mb-1 d-flex align-items-center">
            <Users size={16} className="me-2 flex-shrink-0" /> {contest.participants}/{contest.maxParticipants}
          </p>
          <p className="mb-1 d-flex align-items-center">
            <HelpCircle size={16} className="me-2 flex-shrink-0" /> {contest.questions} questions
          </p>
        </div>

        {/* Button section - mt-auto pushes this to the bottom */}
        <div className="mt-auto pt-3">
          {contest.status === "Ongoing" && (
            <Button
              variant="primary"
              className="w-100 d-flex align-items-center justify-content-center gap-2"
              onClick={() => navigate(`/events/contest/${contest.id}`)} // Example dynamic navigation
            >
              <Play size={16} /> Join Contest
            </Button>
          )}
          {contest.status === "Upcoming" && (
            <Button variant="outline-secondary" className="w-100" disabled>
              Starts Soon
            </Button>
          )}
          {(contest.status === "Past" || contest.status === "Completed") && (
            <Button variant="outline-success"
              className="w-100 d-flex align-items-center justify-content-center gap-2"
              onClick={handleViewResults} >
              View Results
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}