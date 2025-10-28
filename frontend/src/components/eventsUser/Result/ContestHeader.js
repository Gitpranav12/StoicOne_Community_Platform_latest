import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import {
  Download,
} from "lucide-react";

export default function ContestHeader({ title, stats, type, onBack, onExport }) {
  const typeTextMap = {
    quiz: "Quiz",
    coding: "Coding",
    both: "Quiz + Coding",
  };

  return (
    <Card className="p-3 mb-4 shadow-sm border-0 bg-white rounded-3">
      <div className="mb-3">
        {/* Row 1: Back (left) and Export (right) */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <button className="btn btn-outline-primary" onClick={onBack}>
            ← Back
          </button>

          <button
            className="btn btn-outline-primary d-flex align-items-center justify-content-center"
            onClick={onExport}
          >
            <Download size={18} className="me-2" />
            Export Results
          </button>
        </div>

        {/* Row 2: Title Centered */}
        <div className="text-center">
          <h4 className="fw-bold m-0">{title}</h4>
        </div>
      </div>


      <Row className="text-center mt-3">
        <Col xs={6} md={3} className="mb-3">
          <h5 className="text-primary fw-bold">{stats.participants}</h5>
          <p className="text-muted mb-0">Participants</p>
        </Col>
        <Col xs={6} md={3} className="mb-3">
          <h5 className="text-success fw-bold">{stats.submissions}</h5>
          <p className="text-muted mb-0">Submissions</p>
        </Col>
        <Col xs={6} md={3} className="mb-3">
          <h5 className="text-info fw-bold">Completed</h5>
          <p className="text-muted mb-0">Status</p>
        </Col>
        <Col xs={6} md={3} className="mb-3">
          {/* <h5 className="text-warning fw-bold">{stats.problems}</h5> */}
          <Badge bg="primary" className="fs-6 py-2 px-3">{typeTextMap[type]}</Badge>
          <p className="text-muted mb-0">Type</p>
        </Col>
      </Row>
    </Card>
  );
}
