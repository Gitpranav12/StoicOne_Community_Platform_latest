import React, { useEffect, useMemo, useState, useContext } from "react";
import axios from "axios";
import RichEditor from "./RichEditor";
import TagInput from "./TagInput";
import SimilarQuestions from "./SimilarQuestions";
import FieldHelp from "./FieldHelp";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserProfilePage/context/UserContext";

const TITLE_MIN = 15;
const BODY_MIN = 20;
const TAGS_MIN = 1;
const TAGS_MAX = 5;
const LS_KEY = "ask_draft_v1";

export default function AskQuestionPage() {
  const { user } = useContext(UserContext);
  const user_id = user?.id || null;
  const author =
    user?.profile?.name ||
    user?.name ||
    "Guest";


  const { fetchUserData } = useContext(UserContext);
  const navigate = useNavigate();

  // --- ADDED FOR FULL FORM RESET ---
  const [formKey, setFormKey] = useState(0);

  const [title, setTitle] = useState("");
  const [bodyHtml, setBodyHtml] = useState(""); // HTML from rich editor
  const [bodyText, setBodyText] = useState(""); // plain text from editor
  const [tags, setTags] = useState([]);
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // FETCH TAG SUGGESTIONS FROM DATABASE
  const [tagSuggestions, setTagSuggestions] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8080/api/tags/all")
      .then((res) => res.json())
      .then((data) => setTagSuggestions(data))
      .catch((err) => console.error("Failed to load tag suggestions", err));
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      try {
        const d = JSON.parse(raw);
        setTitle(d.title || "");
        setBodyHtml(d.bodyHtml || "");
        setBodyText(d.bodyText || "");
        setTags(d.tags || []);
      } catch { }
    }
  }, [formKey]);

  useEffect(() => {
    const id = setTimeout(() => {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({ title, bodyHtml, bodyText, tags })
      );
    }, 500);
    return () => clearTimeout(id);
  }, [title, bodyHtml, bodyText, tags]);

  const errors = useMemo(() => {
    const e = {};
    if (!title || title.trim().length < TITLE_MIN)
      e.title = `Title must be at least ${TITLE_MIN} characters.`;
    if (!bodyText || bodyText.trim().length < BODY_MIN)
      e.body = `Body must be at least ${BODY_MIN} characters.`;
    if (tags.length < TAGS_MIN) e.tags = `Add at least ${TAGS_MIN} tag.`;
    if (tags.length > TAGS_MAX)
      e.tags = `No more than ${TAGS_MAX} tags allowed.`;
    return e;
  }, [title, bodyText, tags]);

  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    setSubmitting(true);
    try {
      await axios.post("http://localhost:8080/api/questions", {
        user_id: user_id,
        title,
        bodyHtml,
        bodyText,
        tags,
        author: author,
        time: "Just now",
      });

      // clear draft
      localStorage.removeItem(LS_KEY);

      // refresh user profile immediately
      await fetchUserData();

      alert("Question submitted!");
      setTitle("");
      setBodyHtml("");
      setBodyText("");
      setTags([]);
      setSubmitting(false);
      setTouched(false);

      navigate("/dashboard");
    } catch (err) {
      alert("Could not post question. Try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="container my-4" key={formKey}>
      <div className="row g-4">
        {/* Main form */}
        <div className="col-lg-8">
          <h2 className="mb-3">Ask a public question</h2>
          {/* Title card */}
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <label className="form-label fw-semibold mb-1">Title</label>
                <small className="text-muted">
                  {(title || "").length} / 300
                </small>
              </div>
              <input
                type="text"
                className={`form-control ${touched && errors.title ? "is-invalid" : ""
                  }`}
                placeholder="e.g. How do I center a div in CSS?"
                maxLength={300}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="form-text">
                Be specific and imagine you're asking a question to another
                person.
              </div>
              {touched && errors.title && (
                <div className="invalid-feedback d-block">{errors.title}</div>
              )}
            </div>
          </div>
          {/* Body card */}
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <label className="form-label fw-semibold mb-2">Body</label>
              <RichEditor
                initialContent={bodyHtml}
                onUpdate={({ html, text }) => {
                  setBodyHtml(html);
                  setBodyText(text);
                }}
              />
              <div className="form-text">
                Include details, what you tried, expected vs actual results, and
                minimal reproducible example.
              </div>
              {touched && errors.body && (
                <div className="invalid-feedback d-block">{errors.body}</div>
              )}
            </div>
          </div>
          {/* Tags card */}
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <label className="form-label fw-semibold mb-2">Tags</label>
              <TagInput
                value={tags}
                onChange={setTags}
                maxTags={TAGS_MAX}
                suggestions={tagSuggestions}
              />
              <div className="form-text">
                Add up to {TAGS_MAX} tags to describe what your question is
                about.
              </div>
              {touched && errors.tags && (
                <div className="invalid-feedback d-block">{errors.tags}</div>
              )}
            </div>
          </div>
          {/* Submit */}
          <div className="d-flex gap-2">
            <button
              className="btn btn-primary px-4"
              onClick={handleSubmit}
              disabled={submitting}
            >
              Post your question
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                localStorage.removeItem(LS_KEY);
                alert("Draft cleared.");
                setTitle("");
                setBodyHtml("");
                setBodyText("");
                setTags([]);
                setTouched(false);
                setFormKey((k) => k + 1); // ensures full reset
              }}
              disabled={submitting}
            >
              Discard draft
            </button>
            {/* Cancel button */}
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </div>
        {/* Right column */}
        <div className="col-lg-4">
          <FieldHelp />
          <SimilarQuestions title={title} />
        </div>
      </div>
    </div>
  );
}
