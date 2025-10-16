import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Badge } from "react-bootstrap";
import {
  Users,
  HelpCircle,
  MessageSquare,
  ThumbsUp,
  MessageSquareText,
  RefreshCw,
} from "lucide-react";

export default function CommunityActivity() {
  const [stats, setStats] = useState([]);
  const [tags, setTags] = useState([]);
  const [unanswered, setUnanswered] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  // Map keys to icons for rendering
  const iconsMap = {
    users: <Users size={16} />,
    questions: <HelpCircle size={16} />,
    answers: <MessageSquare size={16} />,
    comments: <MessageSquareText size={16} />,
    upvotes: <ThumbsUp size={16} />,
  };

  // Fetch data from API and update state + localStorage
  const fetchData = async () => {
    try {
      const statsRes = await axios.get("http://localhost:8080/api/admin/stats");
      const tagsRes = await axios.get("http://localhost:8080/api/admin/trending-tags");
      const unansweredRes = await axios.get("http://localhost:8080/api/admin/popular-unanswered");

      // Only store plain data, not JSX
      const statsData = [
        { key: "users", label: "users online", value: statsRes.data.totalUsers, color: "success" },
        { key: "questions", label: "questions", value: statsRes.data.totalQuestions, color: "dark" },
        { key: "answers", label: "answers", value: statsRes.data.totalAnswers, color: "primary" },
        { key: "comments", label: "comments", value: statsRes.data.totalComments, color: "secondary" },
        { key: "upvotes", label: "upvotes", value: statsRes.data.totalVotes, color: "warning" },
      ];

      const tagsData = tagsRes.data.map(t => t.name);
      const unansweredData = unansweredRes.data;
      const fetchedTime = new Date().toISOString();

      setStats(statsData);
      setTags(tagsData);
      setUnanswered(unansweredData);
      setLastFetched(new Date());

      localStorage.setItem("communityStats", JSON.stringify(statsData));
      localStorage.setItem("communityTags", JSON.stringify(tagsData));
      localStorage.setItem("communityUnanswered", JSON.stringify(unansweredData));
      localStorage.setItem("communityLastFetched", fetchedTime);
    } catch (err) {
      console.error("Error fetching community activity:", err);
    }
  };

  // Load from localStorage on mount
  useEffect(() => {
    const statsData = JSON.parse(localStorage.getItem("communityStats"));
    const tagsData = JSON.parse(localStorage.getItem("communityTags"));
    const unansweredData = JSON.parse(localStorage.getItem("communityUnanswered"));
    const fetchedTime = localStorage.getItem("communityLastFetched");

    if (statsData && tagsData && fetchedTime) {
      setStats(statsData);
      setTags(tagsData);
      setUnanswered(unansweredData);
      setLastFetched(new Date(fetchedTime));
    } else {
      fetchData();
    }
  }, []);

  // Auto-update the last updated text every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setLastFetched(prev => (prev ? new Date(prev) : prev));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const getLastUpdatedText = () => {
    if (!lastFetched) return "Never updated";
    const diffMs = new Date() - lastFetched;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins === 0) return `Last updated just now`;
    if (diffMins < 60) return `Last updated ${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `Last updated ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  };

  const getDaysAgo = (dateString) => {
    const created = new Date(dateString);
    const now = new Date();
    const diffMs = now - created;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return `${diffDays} days ago`;
  };

  return (
    <Card className="border">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="heading-text mb-0">Community activity</h6>
          <small className="text-danger d-flex align-items-center">
            {getLastUpdatedText()}
            <RefreshCw
              size={16}
              className="ms-2 cursor-pointer"
              onClick={fetchData}
              title="Refresh"
            />
          </small>
        </div>

        {/* Stats */}
        <div className="pb-3 border-bottom">
          <ul className="list-unstyled mb-0">
            {stats.map((s, idx) => (
              <li key={idx} className="d-flex align-items-center mb-2">
                <span className={`me-2 text-${s.color}`}>{iconsMap[s.key]}</span>
                <span className="normal-text me-1">{s.value}</span>
                <span className="normal-text small">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tags */}
        <div className="py-3 border-bottom">
          <div className="mb-2 text-danger sub-heading-text fw-bold">🔥 Popular tags</div>
          {tags.map((tag, i) => (
            <Badge bg="light" text="dark" pill key={i} className="me-1 mb-1">{tag}</Badge>
          ))}
        </div>

        {/* Unanswered */}
        {unanswered && (
          <div className="pt-3">
            <div className="mb-2 text-danger sub-heading-text fw-bold">🔥 Popular unanswered question</div>
            <a
              href={`/questions/${unanswered.id}`}
              className="d-block text-primary normal-text mb-2 text-decoration-none"
            >
              {unanswered.title}
            </a>
            <div className="mb-2">
              {unanswered.tags.map((tag, i) => (
                <Badge bg="light" text="dark" pill key={i} className="me-1 mb-1">{tag}</Badge>
              ))}
            </div>
            <div className="normal-text text-muted">
              {unanswered.author} • {getDaysAgo(unanswered.createdAt)}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
