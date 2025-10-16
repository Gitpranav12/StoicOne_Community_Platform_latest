import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../Layout/Layout"; // 1. Import the standard Layout

export default function TagsPage() {
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12;

  const navigate = useNavigate();

  // All your data fetching and state logic remains the same
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/tags", {
          params: {
            search,
            sort: sortBy,
            page: currentPage,
            limit: pageSize,
          },
        });
        setTags(res.data.data);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Error fetching tags:", err);
      }
    };
    fetchTags();
  }, [search, sortBy, currentPage]);

  const handleTagClick = (tagName) => {
    navigate(`/questions?tag=${tagName}`);
  };

  return (
    // 2. Wrap everything in the Layout component
    <Layout>
      {/* 3. The page-specific content and Footer are placed inside */}
      <>
        <div className="container-fluid py-4">
          <h2 className="mb-2">Tags</h2>
          <p className="text-muted mb-4">
            A tag is a keyword or label that categorizes your question with other,
            similar questions. Using the right tags makes it easier for others to
            find and answer your question.
          </p>

          {/* Search + Sort */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2">
            <input
              type="text"
              className="form-control w-100 w-md-50"
              placeholder="Filter by tag name"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <div className="d-flex gap-2">
              <button
                className={`btn btn-sm ${sortBy === "popular" ? "btn-primary" : "btn-light"
                  }`}
                onClick={() => setSortBy("popular")}
              >
                Popular
              </button>
              <button
                className={`btn btn-sm ${sortBy === "name" ? "btn-primary" : "btn-light"
                  }`}
                onClick={() => setSortBy("name")}
              >
                Name
              </button>
            </div>
          </div>

      
          {/* Tags Grid */}
          {tags.length === 0 ? (
            <div className="text-center text-muted py-5">
              <h5>No tags found.</h5>
              <p>Try adjusting your search or check back later when new tags are added.</p>
            </div>
          ) : (
            <div className="row g-3">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="col-12 col-sm-6 col-md-4 col-lg-3"
                >
                  <div className="card h-100 shadow-sm border-0">
                    <div className="card-body">
                      <h6>
                        <span
                          className="badge bg-light text-dark border"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleTagClick(tag.name)}
                        >
                          {tag.name}
                        </span>
                      </h6>
                      <p className="small text-muted mb-2">
                        {tag.description}
                      </p>
                    </div>
                    <div className="card-footer bg-white border-0">
                      <small className="text-secondary d-block">
                        {tag.questions_count.toLocaleString()} questions
                      </small>
                      <small className="text-secondary d-block">
                        {tag.questions_today} asked today, {tag.questions_week} this week
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Pagination */}
          <nav className="d-flex justify-content-center mt-4">
            <ul className="pagination flex-wrap">
              {Array.from({ length: totalPages }).map((_, i) => (
                <li
                  key={i}
                  className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>


        </div>
      </>
    </Layout>
  );
} 