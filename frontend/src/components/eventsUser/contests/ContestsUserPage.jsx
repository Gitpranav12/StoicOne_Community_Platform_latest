import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import ContestCard from "./ContestCard"; // ✅ Import the component

export default function ContestsUserPage() {
  const [activeTab, setActiveTab] = useState("Ongoing");
  const [contests, setContests] = useState([]);

  // ✅ Transform API data to match ContestCard props
  const transformContests = (apiContests) => {
    return apiContests.map((contest) => {
      const start = new Date(contest.start_date);
      const end = new Date(contest.end_date);

      const date = start.toLocaleDateString("en-IN");
      const time = start.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Calculate duration
      const durationHours = Math.floor((end - start) / (1000 * 60 * 60));
      const durationMinutes = Math.floor(((end - start) / (1000 * 60)) % 60);
      const duration = `Ends in ${durationHours}h ${durationMinutes}m`;

      // Round info
      // Determine contest type
      const type = contest.rounds?.every((r) => r.type === "quiz")
        ? "quiz"
        : contest.rounds?.every((r) => r.type === "coding")
        ? "coding"
        : "Quiz + Coding";
      const questions = contest.rounds?.reduce(
        (sum, r) => sum + (r.questions?.length || 0),
        0
      );

      // Status mapping
      let status = "Upcoming";
      const now = new Date();
      if (now < start) status = "Upcoming";
      else if (now >= start && now <= end) status = "Ongoing";
      else status = "Past";

      return {
        id: contest.id,
        title: contest.title,
        description: contest.description,
        date,
        time,
        duration,
        participants: contest.participants || 0, // default until added in API
        maxParticipants: contest.max_participants || 100,
        questions,
        status,
        type: type.charAt(0).toUpperCase() + type.slice(1),
      };
    });
  };

  // ✅ Fetch contests from backend
  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/contests");
        const data = await res.json();

        // ✅ Filter out contests with status = "draft"
        const visibleContests = data.filter(
          (contest) => contest.status?.toLowerCase() !== "draft"
        );

        setContests(transformContests(visibleContests));
      } catch (err) {
        console.error("Error fetching contests:", err);
      }
    };
    fetchContests();
  }, []);

  // auto-refresh contest list when time occurs
  useEffect(() => {
  const interval = setInterval(() => {
    fetch("http://localhost:8080/api/contests")
      .then((res) => res.json())
      .then((data) => {
        const visibleContests = data.filter(
          (contest) => contest.status?.toLowerCase() !== "draft"
        );
        setContests(transformContests(visibleContests));
      })
      .catch((err) => console.error("Auto-refresh error:", err));
  }, 60000); // 1 min

  return () => clearInterval(interval);
}, []);


  const filteredContests = contests.filter((c) => c.status === activeTab);

  const stats = {
    total: contests.length,
    live: contests.filter((c) => c.status === "Ongoing").length,
    upcoming: contests.filter((c) => c.status === "Upcoming").length,
    completed: contests.filter((c) => c.status === "Past").length,
  };

  return (
    <div>
      {/* Contest Stats */}
      <Row className="mt-4 text-center">
        <Col>
          <Card className="p-3 bg-light">
            <h5>{stats.total}</h5>
            <p className="mb-0">Total</p>
          </Card>
        </Col>
        <Col>
          <Card className="p-3 bg-success bg-opacity-10">
            <h5>{stats.live}</h5>
            <p className="mb-0">Live Now</p>
          </Card>
        </Col>
        <Col>
          <Card className="p-3 bg-warning bg-opacity-10">
            <h5>{stats.upcoming}</h5>
            <p className="mb-0">Upcoming</p>
          </Card>
        </Col>
        <Col>
          <Card className="p-3 bg-info bg-opacity-10">
            <h5>{stats.completed}</h5>
            <p className="mb-0">Completed</p>
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <Row className="mb-3 mt-4">
        <Col>
          <Button
            variant={activeTab === "Ongoing" ? "primary" : "outline-primary"}
            onClick={() => setActiveTab("Ongoing")}
            className="w-100"
          >
            Live Now ({stats.live})
          </Button>
        </Col>
        <Col>
          <Button
            variant={activeTab === "Upcoming" ? "warning" : "outline-warning"}
            onClick={() => setActiveTab("Upcoming")}
            className="w-100"
          >
            Upcoming ({stats.upcoming})
          </Button>
        </Col>
        <Col>
          <Button
            variant={activeTab === "Past" ? "secondary" : "outline-secondary"}
            onClick={() => setActiveTab("Past")}
            className="w-100"
          >
            Completed ({stats.completed})
          </Button>
        </Col>
      </Row>

      {/* Contest Cards */}
      <Row>
        {filteredContests.length > 0 ? (
          filteredContests.map((contest) => (
            <Col md={4} key={contest.id} className="mb-4">
              <ContestCard contest={contest} /> {/* ✅ Reusable component */}
            </Col>
          ))
        ) : (
          <p className="text-center mt-4">No contests in this section.</p>
        )}
      </Row>
    </div>
  );
}
