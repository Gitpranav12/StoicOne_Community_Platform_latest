// src/pages/CollectivePage.js
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Badge } from "react-bootstrap";
import { useCollectives } from "../collectives/CollectivesContext";
import CollectiveHeader from "./CollectiveHeader";
import "./CollectiveHeader.css";
import Layout from "../../Layout/Layout"; // 1. Import the standard Layout

const CollectivePage = () => {
  const { id } = useParams();
  const { joinedCollectives } = useCollectives();

  const [collective, setCollective] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch collective details + questions dynamically
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Fetch collective details
        const res1 = await fetch(`http://localhost:8080/api/collectives/${id}`);
        const data1 = await res1.json();

        // 2️⃣ Fetch questions based on collective tags
        const res2 = await fetch(`http://localhost:8080/api/collectives/${id}/questions`);
        const questionsData = await res2.json();

        // 3️⃣ Update collective info
        const updatedCollective = {
          ...data1,
          joined: joinedCollectives.some((j) => j.id === data1.id),
        };

        setCollective(updatedCollective);
        setQuestions(questionsData);
      } catch (err) {
        console.error("Error fetching collective info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, joinedCollectives]);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    // 2. Wrap everything in the Layout component
    <Layout>
      {/* 3. Your page's main content goes directly inside */}


      {/* Main Content */}
      <div className="container-fluid flex-grow-1 main-content px-4">
        {/* Dynamic Collective Header */}
        <CollectiveHeader collective={collective} questions={questions}
        />


        {/* Questions Section */}
        <h4 className="mb-3">Questions</h4>

        {questions.length === 0 ? (
          <div className="text-muted">No questions found.</div>
        ) : (
          questions.map((q) => (
            <Card key={q.id} className="mb-3 p-3 question-card shadow-sm">
              <div className="d-flex flex-column flex-md-row">

                {/* Stats */}
                <div className="stats text-center mb-2 mb-md-0 me-md-4">
                  <div className="mb-1">
                    <strong>{q.votes}</strong>
                    <div>vote{q.votes !== 1 ? "s" : ""}</div>
                  </div>
                  <div className="mb-1">
                    <strong>{q.answers}</strong>
                    <div>answers</div>
                  </div>
                  <div>
                    <strong>{q.views}</strong>
                    <div>views</div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-grow-1">
                  <h5 className="mb-1">
                    <a href={`/questions/${q.id}`} className="text-decoration-none text-dark">
                      {q.title}
                    </a>
                  </h5>
                  <p className="text-muted mb-2">{q.bodyText}</p>

                  {/* Flagged */}
                  {q.flagged === 1 && (
                    <Badge bg="danger" className="mb-2">
                      Flagged: {q.flag_reason || "No reason provided"}
                    </Badge>
                  )}

                  {/* Tags */}
                  <div className="mb-2">
                    {q.tags.map((tag, index) => (
                      <Badge key={index} bg="secondary" className="me-1 mb-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Author info */}
                  {q.author && (
                    <div className="text-muted small mt-2">
                      {q.author} • {new Date(q.time).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            // <Card key={q.id} className="mb-3 p-3 question-card">
            //   <div className="d-flex">
            //     {/* Stats */}
            //     <div className="me-4 text-center">
            //       <div className="mb-2">
            //         <strong>{q.votes}</strong>
            //         <div>vote{q.votes !== 1 ? "s" : ""}</div>
            //       </div>
            //       <div className="mb-2">
            //         <strong>{q.answers}</strong>
            //         <div>answers</div>
            //       </div>
            //       <div>
            //         <strong>{q.views}</strong>
            //         <div>views</div>
            //       </div>
            //     </div>

            //     {/* Content */}
            //     <div className="flex-grow-1">
            //       <h5>
            //         <a href={`/questions/${q.id}`} className="text-decoration-none">
            //           {q.title}
            //         </a>
            //       </h5>
            //       <p className="text-muted">{q.bodyText}</p>

            //       {/* flaged reason question */}
            //       <div className="mb-2">
            //         {/* Flagged Badge */}
            //         {q.flagged === 1 && (
            //           <Badge bg="danger" className="mb-2">
            //             Flagged: {q.flag_reason || "No reason provided"}
            //           </Badge>
            //         )}
            //       </div>


            //       {/* Tags */}
            //       <div className="mb-2">
            //         {q.tags.map((tag, index) => (
            //           <Badge key={index} bg="secondary" className="me-1">
            //             {tag}
            //           </Badge>
            //         ))}
            //       </div>

            //       {/* User Info at bottom-right */}
            //       {q.author && (
            //         <div className="d-flex justify-content-end mt-3">
            //           <div className="text-muted small">
            //             {q.author} • {new Date(q.time).toLocaleString("en-US", {
            //               year: "numeric",
            //               month: "short",
            //               day: "numeric",
            //               hour: "2-digit",
            //               minute: "2-digit",
            //             })}
            //           </div>
            //         </div>
            //       )}


            //     </div>

            //   </div>
            // </Card>
          ))
        )}
      </div>


    </Layout>

  );
};

export default CollectivePage;