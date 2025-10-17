import React from 'react';
import LeaderItem from './LeaderItem';
import { Card } from 'react-bootstrap';

export default function Rankings({ leaders, type }) {
  return (
    <Card className="p-3 shadow-sm border-0 bg-light rounded-3">
      <h5 className="fw-bold mb-3 fw-semibold">Rankings</h5>
      {leaders.map((user, i) => (
        <LeaderItem key={user.id} user={user} index={i} type={type} />
      ))}
    </Card>
  );
}
