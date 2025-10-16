import { useState, useEffect } from 'react';
import { FaClock } from 'react-icons/fa';

export function Timer({ duration, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp?.();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isWarning = timeLeft < 300; // Last 5 minutes

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      borderRadius: '0.25rem',
      backgroundColor: isWarning ? 'rgba(220, 53, 69, 0.1)' : '#f8f9fa',
      color: isWarning ? '#dc3545' : '#212529'
    }}>
      <FaClock size={14} />
      <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
