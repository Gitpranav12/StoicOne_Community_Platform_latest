import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import axios from "axios";

export default function AchievementsDropdown({ userId }) {
  const [achievements, setAchievements] = useState([]);

  // 🔹 Fetch unread notifications from backend
  const fetchAchievements = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`http://localhost:8080/api/notifications/${userId}`);
      setAchievements(res.data); // only unread notifications
    } catch (err) {
      console.error("Error fetching achievements:", err);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, [userId]);

  // 🔹 Mark all as read
  const markAllAsRead = async () => {
    if (!userId) return;
    try {
      await axios.put(`http://localhost:8080/api/notifications/mark-read/${userId}`);
      setAchievements([]); // clear unread notifications after marking read
    } catch (err) {
      console.error("Error marking achievements as read:", err);
    }
  };

  // 🔹 Format date labels
  const formatDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-CA");
  };

  // 🔹 Group achievements by day
  const grouped = achievements.reduce((acc, ach) => {
    const day = new Date(ach.createdAt).toDateString(); // always use createdAt
    acc[day] = acc[day] || [];
    acc[day].push(ach);
    return acc;
  }, {});


  const unreadCount = achievements.length;

  return (
    <Dropdown align="end">
      {/* Trophy Icon */}
      <Dropdown.Toggle
        as="div"
        id="dropdown-achievements"
        className="border-0 bg-transparent position-relative dropdown-toggle"
        style={{ cursor: "pointer" }}
      >
        <i className="bi bi-trophy fs-5"></i>
        {unreadCount > 0 && (
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary"
            style={{ fontSize: "12px", minWidth: "20px", height: "20px", lineHeight: "14px", textAlign: "center" }}
          >
            {unreadCount}
          </span>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu
        style={{ width: "420px", borderRadius: "8px", boxShadow: "0px 4px 12px rgba(0,0,0,0.15)", border: "none", padding: 0 }}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-light small">
          <span className="fw-bold">ACHIEVEMENTS</span>
          <div className="d-flex align-items-center gap-3">
            <a href="/profile/achievements" className="text-primary">badges</a>
            {unreadCount > 0 && (
              <button
                className="btn btn-sm btn-outline-primary"
                style={{ fontSize: "12px", padding: "2px 8px" }}
                onClick={markAllAsRead}
              >
                Mark as Read
              </button>
            )}
          </div>
        </div>

        {/* Achievements List */}
        <div style={{ maxHeight: "320px", overflowY: "auto" }}>
          {Object.keys(grouped).length > 0 ? (
            Object.keys(grouped).map((day) => (
              <div key={day}>
                <div className="px-3 py-2 fw-bold small bg-white">
                  {formatDateLabel(day)}
                  {grouped[day].some((a) => a.points) && (
                    <span className="text-success ms-2">
                      +
                      {grouped[day].reduce((sum, a) => sum + (parseInt(a.points) || 0), 0)}
                    </span>
                  )}
                </div>

                {grouped[day].map((a) => (
                  <div key={a.id} className="px-3 py-2 d-flex align-items-start" style={{ fontSize: "14px" }}>
                    <i className="bi bi-award text-warning me-2" style={{ fontSize: "16px" }}></i>
                    <div className="flex-grow-1">
                   {a.points > 0 && (
                        <span className="text-success fw-bold me-2">{a.points}</span>
                      )} 
                      {/* .......... */}
                      <span className="normal-text">You Earned New Achievement </span>
                      <span
                        dangerouslySetInnerHTML={{ __html: a.title || a.description || a.text }}
                        className="text-dark normal-text fw-bold"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="px-3 py-4 text-center text-muted small">You have no new achievements.</div>
          )}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}
