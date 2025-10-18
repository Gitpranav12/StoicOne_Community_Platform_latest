// src/components/Contests/ContestsUserPage.js

import React, { useEffect, useState, useContext } from "react";
import { Row, Col, Card, Button, Spinner } from "react-bootstrap";
import ContestCard from "./ContestCard";
import { UserContext } from "../../UserProfilePage/context/UserContext";

export default function ContestsUserPage() {
  const [activeTab, setActiveTab] = useState("Ongoing");
  const [contests, setContests] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  // User/context info
  const { user: contextUser } = useContext(UserContext);

  const currentUserId = contextUser?.profile?.id;

  const transformContests = (apiContests) => {
    // ... (your transformContests function remains unchanged)
    return apiContests.map((contest) => {
      const start = new Date(contest.start_date);
      const end = new Date(contest.end_date);

      const date = start.toLocaleDateString("en-IN");
      const time = start.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const now = new Date();
      let durationText = "";
      if (now >= start && now <= end) {
        const diffMs = end - now;
        const hours = Math.floor(diffMs / 3600000);
        const minutes = Math.floor((diffMs % 3600000) / 60000);
        durationText = `Ends in ${hours}h ${minutes}m`;
      } else if (now < start) {
        durationText = `Starts in ${Math.ceil((start - now) / 86400000)} days`;
      } else {
        durationText = "Completed";
      }

      const type = contest.rounds?.every((r) => r.type === "quiz")
        ? "quiz"
        : contest.rounds?.every((r) => r.type === "coding")
        ? "coding"
        : "Quiz + Coding";
      const questions = contest.rounds?.reduce(
        (sum, r) => sum + (r.questions?.length || 0),
        0
      );

      let status = "Upcoming";
      if (now < start) status = "Upcoming";
      else if (now >= start && now <= end) status = "Ongoing";
      else status = "Past"; // always keep time-based status

      // user_status comes from API (from participants table)
      const user_status = contest.user_status || null;

      return {
        id: contest.id,
        title: contest.title,
        description: contest.description,
        date,
        time,
        duration: durationText,
        participants: contest.participants || 0,
        maxParticipants: contest.max_participants || 100,
        questions,
        status,
        type: type.charAt(0).toUpperCase() + type.slice(1),
        user_status: contest.user_status, // keep for filtering
      };
    });
  };

  const fetchContests = async () => {
    try {
      // const res = await fetch("http://localhost:8080/api/contests");
      // ✅ Pass userId to backend to get participation info
      const res = await fetch(
        `http://localhost:8080/api/contests?userId=${currentUserId}`
      );
      const data = await res.json();
      const visibleContests = data.filter(
        (contest) => contest.status?.toLowerCase() !== "draft"
      );
      setContests(transformContests(visibleContests));
    } catch (err) {
      console.error("Error fetching contests:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
    const interval = setInterval(fetchContests, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  // const filteredContests = contests.filter((c) => c.status === activeTab);

const filteredContests = contests.filter((c) => {
  if (activeTab === "Ongoing") {
    // show ongoing contests where user has NOT completed
    return c.status === "Ongoing" && c.user_status !== "completed";
  }
  if (activeTab === "Upcoming") {
    return c.status === "Upcoming";
  }
  if (activeTab === "Past" || activeTab === "Completed") {
    // show either time-based completed or user-based completed
    return c.status === "Past" || c.user_status === "completed";
  }
  return false;
});



const stats = {
  total: contests.length,
  Ongoing: contests.filter(
    (c) => c.status === "Ongoing" && c.user_status !== "completed"
  ).length,
  upcoming: contests.filter((c) => c.status === "Upcoming").length,
  completed: contests.filter(
    (c) => c.status === "Past" || c.user_status === "completed"
  ).length,
};


  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div>
      {/* ✅ RESPONSIVE Contest Stats */}
      <Row>
        {/* On large screens (lg), each card takes 3/12 cols. On medium (md), 6/12. Below that, they stack. */}
        <Col lg={3} md={6} className="mb-4">
          <Card className="p-3 bg-light h-100">
            <h5>{stats.total}</h5>
            <p className="mb-0">Total</p>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-4">
          <Card className="p-3 bg-success bg-opacity-10 h-100">
            <h5>{stats.Ongoing}</h5>
            <p className="mb-0">Ongoing</p>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-4">
          <Card className="p-3 bg-warning bg-opacity-10 h-100">
            <h5>{stats.upcoming}</h5>
            <p className="mb-0">Upcoming</p>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-4">
          <Card className="p-3 bg-info bg-opacity-10 h-100">
            <h5>{stats.completed}</h5>
            <p className="mb-0">Completed</p>
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <Row className="mb-3 mt-2">
        <Col xs={12} md={4} className="mb-2 mb-md-0">
          <Button
            variant={activeTab === "Ongoing" ? "primary" : "outline-primary"}
            onClick={() => setActiveTab("Ongoing")}
            className="w-100"
          >
            Ongoing ({stats.Ongoing})
          </Button>
        </Col>
        <Col xs={12} md={4} className="mb-2 mb-md-0">
          <Button
            variant={activeTab === "Upcoming" ? "warning" : "outline-warning"}
            onClick={() => setActiveTab("Upcoming")}
            className="w-100"
          >
            Upcoming ({stats.upcoming})
          </Button>
        </Col>
        <Col xs={12} md={4} className="mb-2 mb-md-0">
          <Button
            variant={activeTab === "Past" ? "secondary" : "outline-secondary"}
            onClick={() => setActiveTab("Past")}
            className="w-100"
          >
            Completed ({stats.completed})
          </Button>
        </Col>
      </Row>

      {/* ✅ RESPONSIVE Contest Cards Grid */}
      {/* 
        xs={1}: 1 card per row on extra-small screens (phones)
        md={2}: 2 cards per row on medium screens (tablets)
        lg={3}: 3 cards per row on large screens (desktops)
        g-4:  Adds a responsive gutter (spacing) between cards
      */}
      <Row xs={1} md={2} lg={3} className="g-4 mt-2">
        {filteredContests.length > 0 ? (
          filteredContests.map((contest) => (
            // The Col no longer needs specific sizes; the Row controls it
            <Col key={contest.id}>
              <ContestCard contest={contest} />
            </Col>
          ))
        ) : (
          // Place the message inside a Col to align it within the grid
          <Col xs={12}>
            <p className="text-center mt-4">No contests in this section.</p>
          </Col>
        )}
      </Row>
    </div>
  );
}
