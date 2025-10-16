import React, { useState } from "react";
import QuestionCard from "./QuestionCard";

export default function QuestionsList({
  questions,
  sortOrder,
  initialTag,
  interestedTags = [],
  notInterestedTags = [],
}) {
  const questionsData = questions ?? JSON.parse(localStorage.getItem("questions_list") || "[]");

  // Sample fallback questions
  const sampleQuestions = [
    {
      id: 1,
      votes: 2,
      answers: 1,
      views: 120,
      title: "What is HTML?",
      excerpt: "HTML stands for HyperText Markup Language. What does it do in web development?",
      tags: ["html", "web-basics"],
      author: "Alice",
      time: "10 mins ago",
    },
    {
      id: 2,
      votes: 0,
      answers: 0,
      views: 45,
      title: "I am facing 'Connecting to my Database?' error",
      excerpt: "Whenever my database is not connected, I get this error. How can I handle or debug it?",
      tags: ["database", "mysql", "nodejs"],
      author: "Bob",
      time: "5 mins ago",
    },
  ];

  const displayQuestions = questionsData.length > 0 ? questionsData : sampleQuestions;

  // Sort questions
  const sortedQuestions = [...displayQuestions].sort((a, b) => {
    if (sortOrder === "oldest") {
      return a.id - b.id;
    } else {
      return b.id - a.id;
    }
  });

  // Manual filter tag selected by clicking tag badge
  const [filterTag, setFilterTag] = useState(initialTag || null);

  // Normalize tags for consistency
  const normalizeTag = (tag) => tag.trim().toLowerCase();

  // Parse question tags safely and normalize
  const parseTags = (q) => {
    let tags = [];
    if (Array.isArray(q.tags)) {
      tags = q.tags;
    } else if (typeof q.tags === "string") {
      try {
        tags = JSON.parse(q.tags);
      } catch {
        tags = q.tags.split(",").map((t) => t.trim());
      }
    }
    return tags.map(normalizeTag);
  };

  // Normalize filter tags lists
  const normalizeFilterTags = (tagList) => {
    return (tagList || []).map(normalizeTag);
  };

  const normInterestedTags = normalizeFilterTags(interestedTags);
  const normNotInterestedTags = normalizeFilterTags(notInterestedTags);

  // Decide base filter tags: manual filterTag > interestedTags > notInterestedTags > none
  const baseFilterTags = filterTag
    ? [normalizeTag(filterTag)]
    : normInterestedTags.length > 0
    ? normInterestedTags
    : normNotInterestedTags.length > 0
    ? normNotInterestedTags
    : []; // explicitly empty if none

  // Filter questions by any baseFilterTags match, or show all if none
  const filtered = baseFilterTags.length > 0
    ? sortedQuestions.filter((q) => {
        const tags = parseTags(q);
        return tags.some((t) => baseFilterTags.includes(t));
      })
    : sortedQuestions;

  return (
    <div className="container my-4">
      {filterTag && (
        <div className="mb-3 d-flex align-items-center gap-2">
          <span className="badge bg-primary">{filterTag}</span>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setFilterTag(null)}
          >
            Clear Filter
          </button>
        </div>
      )}
      {filtered.map((q, idx) => (
        <QuestionCard key={idx} question={q} onTagClick={setFilterTag} />
      ))}
    </div>
  );
}
