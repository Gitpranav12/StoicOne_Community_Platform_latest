import React, { useEffect, useState, useRef } from "react";
import Layout from "../../Layout/Layout";
import QuestionsList from "./QuestionList";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";     // Added by raj Thakre.............. 23 sep 

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Added by raj Thakre.............. 23 sep 
  // 👇 get tag from query param
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tagFilter = queryParams.get("tag");

  useEffect(() => {
    fetch("http://localhost:8080/api/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Layout>
      <div
        style={{
          marginBottom: "10px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          minHeight: "10px",
          background: "#fff",
          borderRadius: "10px",
          padding: "0.4rem 0.8rem"
        }}
      >
        {/* Filter Button with Dropdown (left) */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.35rem 1rem",
              border: "2px solid #1976d2",
              color: "#1976d2",
              background: "#fff",
              fontWeight: 600,
              borderRadius: "8px",
              fontSize: "0.96rem",
              cursor: "pointer",
              minWidth: "92px",
              minHeight: "38px",
              maxHeight: "38px",
            }}
          >
            <span style={{ display: "flex", alignItems: "center" }}>
              <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                <rect y="4" width="20" height="2" rx="1" fill="#1976d2" />
                <rect x="3" y="9" width="14" height="2" rx="1" fill="#1976d2" />
                <rect x="7" y="14" width="6" height="2" rx="1" fill="#1976d2" />
              </svg>
            </span>
            Filter
          </button>
          {dropdownOpen && (
            <div
              ref={dropdownRef}
              style={{
                position: "absolute",
                top: "110%",
                left: 0,
                background: "#fff",
                border: "1px solid #c7d0db",
                borderRadius: "8px",
                boxShadow: "0 4px 20px rgba(54, 106, 178, 0.13)",
                minWidth: "140px",
                zIndex: 20,
                padding: "0.8rem 1rem"
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "0.98rem",
                  color: "#444",
                  marginBottom: "0.4rem",
                }}
              >
                Sorted by
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.35rem",
                }}
              >
                {sortOptions.map((opt) => (
                  <label
                    key={opt.value}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.38em",
                      cursor: "pointer",
                      fontSize: "0.95rem",
                      color: "#374151",
                    }}
                  >
                    <input
                      type="radio"
                      name="sort"
                      value={opt.value}
                      checked={sortOrder === opt.value}
                      onChange={() => {
                        setSortOrder(opt.value);
                        setDropdownOpen(false);
                      }}
                      style={{
                        accentColor: "#1976d2",
                        width: "1.08em",
                        height: "1.08em",
                        margin: 0,
                      }}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Spacer to shift Ask Question right */}
        <div style={{ marginLeft: "auto" }}>
          <Link to="/askquestion">
            <Button
              variant="outline-primary"
              style={{
                fontWeight: 600,
                fontSize: "0.98rem",
                minWidth: "100px",
                minHeight: "30px",
                borderRadius: "8px",
                padding: "0.42rem 1rem"
              }}
            >
              Ask Question
            </Button>
          </Link>
        </div>
      </div>

      {/* commented by raj Thakre.............. 23 sep  */}
      {/* <QuestionsList questions={questions} sortOrder={sortOrder} /> */}
      
      {/* Added by raj Thakre.............. 23 sep  */}
      {/* 👇 Pass tagFilter down */}
      <QuestionsList questions={questions} sortOrder={sortOrder} initialTag={tagFilter} />


    </Layout>
  );
}
