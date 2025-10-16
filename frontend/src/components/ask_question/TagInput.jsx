import React, { useMemo, useRef, useState } from "react";

export default function TagInput({
  value = [],
  onChange,
  maxTags = 5,
  suggestions = [],
}) {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  // Use ONLY backend suggestions, ignore hardcoded defaults
  const tagList = suggestions.length > 0 ? suggestions : [];

  const filteredSuggestions = useMemo(() => {
    const src = new Set(tagList);
    const list = Array.from(src);
    const term = input.trim().toLowerCase();
    return term
      ? list
          .filter((t) => t.toLowerCase().includes(term) && !value.includes(t))
          .slice(0, 6)
      : list.filter((t) => !value.includes(t)).slice(0, 6);
  }, [input, value, tagList]);

  // .............commented by Raj Thakre ..........
  // const add = (tag) => {
  //   const t = (tag || input).trim().toLowerCase();
  //   if (!t) return;
  //   if (value.includes(t)) return;
  //   if (value.length >= maxTags) return;
  //   onChange?.([...value, t]);
  //   setInput("");
  //   inputRef.current?.focus();
  // };
  
// .............Added by Raj Thakre ..........
  const add = (tag) => {
    const t = (tag || input).trim().toLowerCase();
    if (!t) return;
    if (!tagList.map((s) => s.toLowerCase()).includes(t)) return; // <-- only allow DB tags
    if (value.includes(t)) return;
    if (value.length >= maxTags) return;
    onChange?.([...value, t]);
    setInput("");
    inputRef.current?.focus();
  };

  const remove = (t) => onChange?.(value.filter((v) => v !== t));

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      add();
    } else if (e.key === "Backspace" && !input && value.length) {
      remove(value[value.length - 1]);
    }
  };

  return (
    <div>
      <div className="d-flex flex-wrap gap-2 mb-2">
        {value.map((t) => (
          <span
            key={t}
            className="badge text-bg-secondary d-flex align-items-center gap-2"
          >
            {t}
            <button
              type="button"
              className="btn btn-sm btn-outline-light py-0"
              onClick={() => remove(t)}
              style={{ lineHeight: 1 }}
            >
              ×
            </button>
          </span>
        ))}
        {value.length < maxTags && (
          <input
            ref={inputRef}
            className="form-control form-control-sm"
            style={{ width: 200, minWidth: 140 }}
            placeholder={value.length ? "Add another tag" : "e.g. javascript"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
          />
        )}
      </div>

      {/* Suggestions */}
      {filteredSuggestions.length > 0 && input && (
        <div className="list-group shadow-sm" style={{ maxWidth: 320 }}>
          {filteredSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              className="list-group-item list-group-item-action"
              onClick={() => add(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
