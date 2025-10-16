import React, { useState } from "react";
import { Card, Badge } from "react-bootstrap";
import "./QuestionCard.css";
import { useNavigate } from "react-router-dom";

// Robust tag parsing for array or string from DB
function safeTags(tags) {
  if (!tags) return []; // handles null/undefined/empty string
  if (Array.isArray(tags)) return tags;

  try {
    const parsed = JSON.parse(tags);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    if (typeof tags === "string") return tags.split(",").map(t => t.trim());
    return [];
  }
}

function ReadMore({ html, charLimit = 200 }) {
  const [expanded, setExpanded] = useState(false);
  const div = document.createElement("div");
  div.innerHTML = html || "";
  const plain = div.textContent || div.innerText || "";
  const needsTruncate = plain.length > charLimit;
  let displayHtml = html;
  if (needsTruncate && !expanded) {
    displayHtml = plain.slice(0, charLimit) + "...";
  }
  return (
    <div>
      <span dangerouslySetInnerHTML={{ __html: displayHtml }} />
      {needsTruncate && (
        <button
          className="btn btn-link btn-sm p-0 ms-2"
          onClick={() => setExpanded(x => !x)}
        >
          {expanded ? "Show Less" : "Read More"}
        </button>
      )}
    </div>
  );
}

export default function QuestionCard({ question, onTagClick }) {
  const navigate = useNavigate();

  // Defensive for answers/views
  const answers = typeof question.answers === "number"
    ? question.answers
    : (question.answers_count || 0);

  const views = typeof question.views === "number"
    ? question.views : 0;

  return (
    <Card className="mb-3 border">
      <Card.Body className="d-flex">
        <div className="text-center me-3" style={{ width: "100px" }}>
          <div className="fw-semibold">{question.votes} votes</div>
          <div className={answers > 0 ? "text-success fw-bold" : "text-muted fw-semibold"}>
            {answers} answers
          </div>
          <div className="text-muted">{views} views</div>
        </div>
        <div className="flex-grow-1">
          {/* <a
            href="#"
            className="d-block qc-head-text text-primary mb-2 text-decoration-none"
            onClick={() => {
              if (question.id) {
                navigate(`/questions/${question.id}`);
              }
            }}
          > */}
          <a
            href="#"
            className="d-block qc-head-text text-primary mb-2 text-decoration-none"
            onClick={(e) => {
              e.preventDefault();
              if (question?.id) {
                navigate(`/questions/${question.id}`);
              }
            }}
          >
            {question.title}
          </a>

          <Card.Text className="normal-text text-body mb-2">
            {question.bodyHtml ? (
              <ReadMore html={question.bodyHtml} charLimit={200} />
            ) : (
              question.excerpt
            )}
          </Card.Text>

          {/* ........Added by Raj Thakre............to show flag reason 23 sep */}

          {/* Flagged Badge */}
          {question.flagged === 1 && (
            <Badge variant="destructive" className="mb-2">
              Flagged: {question.flag_reason || "No reason provided"}
            </Badge>
          )}

          {/* ................................. */}

          <div className="d-flex sub-head justify-content-between align-items-center">
            <div>
              {safeTags(question.tags).map((tag, i) => (
                <Badge
                  bg="light"
                  text="dark"
                  key={i}
                  className="me-1"
                  style={{ cursor: "pointer" }}
                  onClick={() => onTagClick?.(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            {/* <div className="text-muted normal-text">
              {question.author} • posted {" "}
              {new Date(question.createdAt).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div> */}
            <div className="text-muted normal-text">
              {question.author} • posted {" "}
              {new Date(question.createdAt).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>

          </div>
        </div>
      </Card.Body>
    </Card>
  );
}