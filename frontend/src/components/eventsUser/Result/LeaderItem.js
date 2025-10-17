import React from 'react';
import { Card } from 'react-bootstrap';

export default function LeaderItem({ user, index, type }) {
  const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : null;
  const rankDisplay = medal || index + 1;

  return (
    <Card className="p-3 mb-2 border-0 shadow-sm rounded-3 bg-white leader-item">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div className="d-flex align-items-center mb-2 mb-md-0 gap-3">
          <div style={{ fontSize: '20px', width: '2rem', textAlign: 'center' }}>
            {rankDisplay}
          </div>
          <img
            src={user.avatar || "/images/default-avatar.png"}
            alt={user.name}
            className="rounded-circle me-1"
            style={{ width: "45px", height: "45px", objectFit: "cover" }}
            onError={(e) => {
              e.target.src = "/images/default-avatar.png";
            }}
          />
          <div>
            <h6 className="fw-bold mb-0 text-primary">{user.name}</h6>
            <small className="text-muted">{user.email}</small>
          </div>
        </div>

        <div className="d-flex justify-content-end align-items-center gap-4 flex-wrap text-end">
          <div className="d-flex flex-column align-items-center">
            <div className="text-success fw-bold">{user.score}/{user.totalMarks}</div>
            <small className="text-muted">Score</small>
          </div>

          <div className="d-flex flex-column align-items-center">
            <div className="text-primary">{user.time}</div>
            <small className="text-muted">Time</small>
          </div>

          <div className="d-flex flex-column align-items-center">
            {(() => {
              const dateObj = new Date(user.submittedAt);
              const date = dateObj.toLocaleDateString();
              const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <>
                  <div className="text-secondary">{date}</div>
                  <div className="text-secondary">{time}</div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </Card>
  );
}
