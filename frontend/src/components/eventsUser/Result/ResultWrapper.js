import React from "react";
import ResultPage from "./ResultPage";

const ResultWrapper = () => {
  const search = new URLSearchParams(window.location.search);
  const contestId = search.get("contest") || "1";
  const type = search.get("type") || "quiz"; // 'quiz', 'coding', or 'both'

  return <ResultPage contestId={contestId} type={type} />;
};

export default ResultWrapper;
