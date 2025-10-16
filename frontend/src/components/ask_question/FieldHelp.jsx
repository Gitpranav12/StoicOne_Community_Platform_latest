import React from "react";

export default function FieldHelp() {
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <h6 className="mb-2">Writing a great question</h6>
        <ul className="small text-muted mb-0">
          <li>Summarize the problem in a one-line title.</li>
          <li>Describe what you’ve tried and what you expected to happen.</li>
          <li>Include minimal, reproducible code and error messages.</li>
          <li>Add tags to help others find it.</li>
        </ul>
      </div>
    </div>
  );
}
