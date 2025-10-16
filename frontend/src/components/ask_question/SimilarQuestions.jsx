import React, { useMemo } from "react";
import SAMPLES from "./sampleQuestions";

function similarity(a, b) {
  const as = new Set(a.toLowerCase().split(/\W+/).filter(Boolean));
  const bs = new Set(b.toLowerCase().split(/\W+/).filter(Boolean));
  const inter = [...as].filter(x => bs.has(x)).length;
  return inter / Math.max(1, Math.min(as.size, bs.size));
}

export default function SimilarQuestions({ title }) {
  const list = useMemo(() => {
    if (!title || title.trim().length < 8) return [];
    const scored = SAMPLES.map(q => ({ q, s: similarity(title, q.title) }));
    return scored
      .filter(x => x.s > 0)
      .sort((a,b) => b.s - a.s)
      .slice(0, 5)
      .map(x => x.q);
  }, [title]);

  if (!list.length) return null;

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h6 className="mb-3">Similar questions</h6>
        <ul className="list-unstyled m-0">
          {list.map((q) => (
            <li key={q.id} className="mb-2">
              <a href="#!" className="text-decoration-none">{q.title}</a>
              <div className="small text-muted">{(q.tags || []).map(t => `#${t}`).join(" ")}</div>
            </li>
          ))}
        </ul>
        <div className="small text-muted mt-2">
          Check if one of these already answers your problem before posting.
        </div>
      </div>
    </div>
  );
}
