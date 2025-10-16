import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import axios from "axios";

export default function NotificationDropdown({ userId }) {
  const [notifications, setNotifications] = useState([]);

  // ✅ Fetch notifications
  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(
        `http://localhost:8080/api/notificationsQuestions/${userId}`
      );
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  // ✅ Mark all notifications as read
  const markAllNotificationsRead = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/notificationsQuestions/mark-read/${userId}`
      );
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_status: 1 }))
      );
      setNotifications([]); // clear unread notifications after marking read

    } catch (err) {
      console.error("Error marking notifications as read:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  return (
    <Dropdown align="end">
      {/* Bell Icon */}
      <Dropdown.Toggle
        as="div"
        id="dropdown-notifications"
        className="border-0 bg-transparent position-relative dropdown-toggle"
        style={{ cursor: "pointer" }}
      >
        <i className="bi bi-bell fs-5"></i>
        {notifications.some((n) => n.read_status === 0) && (
          <span
            className="position-absolute top-0 start-100 translate-middle badge bg-primary"
            style={{
              fontSize: "12px",
              borderRadius: "50%",
              minWidth: "20px",
              height: "20px",
              lineHeight: "14px",
              textAlign: "center",
            }}
          >
            {notifications.filter((n) => n.read_status === 0).length}
          </span>
        )}
      </Dropdown.Toggle>

      {/* Popup */}
      <Dropdown.Menu
        style={{
          width: "360px",
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
          border: "none",
        }}
      >
        <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
          <span className="fw-bold">New notifications</span>
          {notifications.some((n) => n.read_status === 0) && (
            <button
              className="btn btn-sm btn-outline-primary"
              style={{ fontSize: "14px" }}
              onClick={markAllNotificationsRead}
            >
              Mark as Read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="px-3 py-3 text-center text-muted">
            No new notifications
          </div>
        ) : (
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {notifications.map((n) => (
              <div
                key={n.id}
                className="d-flex align-items-start px-3 py-2 border-bottom notification-item"
              >
                <div style={{ fontSize: "13px", lineHeight: "1.3" }}>
                  <div>
                    <strong>{n.actor}</strong> {n.text}
                  </div>
                  <small className="text-muted" style={{ fontSize: "11px" }}>
                    {n.time}
                  </small>
                </div>
              </div>
            ))}
          </div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}
