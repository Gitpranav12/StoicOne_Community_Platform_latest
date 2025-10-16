import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export function StatsSection() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 200);
  }, []);

  const stats = [
    { value: "99.9%", label: "Uptime", color: "primary" },
    { value: "10K+", label: "Active Users", color: "success" },
    { value: "4.9/5", label: "Rating", color: "warning" },
  ];

  return (
    <div className="d-flex flex-wrap gap-4 pt-4 border-top justify-content-around">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`text-center p-3 rounded shadow-sm bg-light flex-fill`}
          style={{
            minWidth: "150px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            transform: animate ? "scale(1)" : "scale(0.9)",
            opacity: animate ? 1 : 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
          }}
        >
          <div className={`h4 fw-semibold text-${stat.color} mb-1`}>
            {stat.value}
          </div>
          <div className="text-muted small">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
