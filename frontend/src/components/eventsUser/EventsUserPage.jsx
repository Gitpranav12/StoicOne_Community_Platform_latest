import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Badge,
  ToggleButtonGroup,
  ToggleButton,
  Spinner,
} from "react-bootstrap";
import {
  Calendar,
  Clock,
  Users,
  HelpCircle,
  Play,
  MapPin,
  ExternalLink,
} from "lucide-react";
import Layout from "../../Layout/Layout";
import { useNavigate } from "react-router-dom";
import ContestsUserPage from "./contests/ContestsUserPage";

// --- Dummy data for Events ---
const dummyApiEvents = [
  {
    id: "evt-001",
    title: "Global Tech Summit 2025",
    description:
      "Join industry leaders to discuss the future of technology, AI, and cloud computing.",
    date: "November 5, 2025",
    time: "09:00 AM",
    location: "Convention Center, San Francisco",
    url: "#",
    imageUrl: "https://picsum.photos/seed/tech/400/225",
    type: "Event",
  },
  {
    id: "evt-002",
    title: "AI & Machine Learning Expo",
    description:
      "A premier event for developers and data scientists to explore the latest in ML.",
    date: "October 22, 2025",
    time: "10:00 AM",
    location: "Online / Virtual",
    url: "#",
    imageUrl: "https://picsum.photos/seed/ai/400/225",
    type: "Event",
  },
  {
    id: "evt-003",
    title: "React Forward Conference",
    description:
      "Deep dive into the React ecosystem with talks from the core team and community.",
    date: "December 1, 2025",
    time: "11:00 AM",
    location: "Austin, TX",
    url: "#",
    imageUrl: "https://picsum.photos/seed/react/400/225",
    type: "Event",
  },
  {
    id: "evt-004",
    title: "Cybersecurity World Forum",
    description:
      "Learn about the latest threats and defensive strategies from top security experts.",
    date: "November 15, 2025",
    time: "08:30 AM",
    location: "London, UK",
    url: "#",
    imageUrl: "https://picsum.photos/seed/cyber/400/225",
    type: "Event",
  },
];

// --- Card Component for Events ---
const EventCard = ({ event }) => (
  <Card className="shadow-sm h-100">
    <Card.Img
      variant="top"
      src={event.imageUrl}
      style={{ height: "180px", objectFit: "cover" }}
    />
    <Card.Body className="d-flex flex-column">
      <Card.Title>{event.title}</Card.Title>
      <Badge bg="success" className="me-2 align-self-start">
        Event
      </Badge>
      <Card.Text className="mt-2 text-muted small">
        {event.description}
      </Card.Text>
      <div className="mt-auto">
        <p className="mb-1 d-flex align-items-center">
          <Calendar size={16} className="me-2 flex-shrink-0" /> {event.date} •{" "}
          {event.time}
        </p>
        <p className="mb-2 d-flex align-items-center">
          <MapPin size={16} className="me-2 flex-shrink-0" /> {event.location}
        </p>
        <Button
          variant="success"
          className="mt-2 w-100 d-flex align-items-center justify-content-center gap-2"
          onClick={() => window.open(event.url, "_blank")}
        >
          <ExternalLink size={16} /> View Event
        </Button>
      </div>
    </Card.Body>
  </Card>
);

// --- Main Page Component ---
export default function EventsUserPage() {
  const [activeTab, setActiveTab] = useState("Ongoing");
  const [viewType, setViewType] = useState("Event");
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (viewType === "Event") {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setEvents(dummyApiEvents);
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [viewType]);



  const renderContent = () => {
    if (viewType === "Event") {
      if (isLoading) {
        return (
          <div className="text-center mt-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading events...</p>
          </div>
        );
      }
      return (
        <Row>
          {events.map((event) => (
            <Col md={4} key={event.id} className="mb-4">
              <EventCard event={event} />
            </Col>
          ))}
        </Row>
      );
    }
  };

  return (
    <Layout>
      <div className="mt-4">
        <h4>Contests & Events</h4>

        <Row className="mt-3 mb-3">
          <Col className="d-flex justify-content-start">
            {/* --- TOGGLE BUTTON ORDER FIXED HERE --- */}
            <ToggleButtonGroup
              type="radio"
              name="options"
              value={viewType}
              onChange={(val) => setViewType(val)}
              className="shadow-sm overflow-hidden"
            >
              <ToggleButton
                id="tbg-btn-2"
                value={"Event"}
                variant={viewType === "Event" ? "success" : "outline-success"}
                className="px-4 d-flex align-items-center"
              >
                <Calendar size={16} className="me-2" /> Events
              </ToggleButton>
              <ToggleButton
                id="tbg-btn-1"
                value={"Contest"}
                variant={viewType === "Contest" ? "primary" : "outline-primary"}
                className="px-4 d-flex align-items-center"
              >
                <Play size={16} className="me-2" /> Contests
              </ToggleButton>
            </ToggleButtonGroup>
          </Col>
        </Row>

        <div className="mt-4">
          {viewType === "Contest" ? <ContestsUserPage /> : renderContent()}
        </div>
      </div>
    </Layout>
  );
}
