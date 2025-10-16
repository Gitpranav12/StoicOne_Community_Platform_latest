import React, { useState } from "react";
import { Badge } from "./badge";

export default function AnswerCell({ content , approved }) {
  const [expanded, setExpanded] = useState(false);

// Determine badge color
    // Inline style for badge
  const badgeStyle = {
    backgroundColor:
      approved === 1 ? "#22c55e" : // green for approved
      approved === 0 ? "#ef4444" : // red for rejected
      "#6b7280",                  // gray for pending
    color: "white",
  };

  return (
    <div className="flex items-start gap-2 pl-4 max-w-[48ch]">
           <Badge variant="outline" style={badgeStyle} className="text-xs mt-1">
        A
      </Badge>
      <div className="text-sm">
        <div
          style={{
            whiteSpace: "normal",
            wordBreak: "break-word",
            overflowWrap: "anywhere",
            display: "-webkit-box",
            WebkitLineClamp: expanded ? "unset" : 2, // limit to 2 lines
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {content}
        </div>

        {content.length > 150 && ( // show toggle only if content is likely > 5 lines
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 text-xs mt-1 hover:underline"
          >
            {expanded ? "Read less" : "Read more"}
          </button>
        )}
      </div>
    </div>
  );
}
