import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Card,
  Spinner,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import "./Article.css";
import Layout from "./../Layout/Layout"; 
const ArticlesPage = () => {
  const [search, setSearch] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const API_KEY = "pub_084d328963c24e3881054d19c6a8bb52";
  const BASE_URL = `https://newsdata.io/api/1/news?apikey=${API_KEY}&language=en`;
  useEffect(() => {
    fetchArticles("technology");
  }, []);
  const fetchArticles = async (q) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}&q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setArticles(data.results || []);
    } catch (err) {
      console.error("Error fetching articles:", err);
      setArticles([]);
    }
    setLoading(false);
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      setActiveCategory(null);
      fetchArticles(search);
    }
  };
  const handleCategoryClick = (categoryKey, query) => {
    setActiveCategory(categoryKey);
    fetchArticles(query);
  };
  return (
     <Layout>
    <Container className="articles-page">
      {/* Search */}
      <Form className="d-flex mb-4 search-bar" onSubmit={handleSearchSubmit}>
        <Form.Control
          type="search"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="me-2"
        />
        <Button variant="primary" type="submit">
          Search
        </Button>
      </Form>
      {/* Filter by Category */}
      <div className="mb-4 filter-section">
        <div
          className="filter-title"
          onClick={() => setShowFilter(!showFilter)}
        >
          Filter by Category
          <span className="arrow">{showFilter ? "▲" : "▼"}</span>
        </div>
        {showFilter && (
          <div className="filter-options">
            <button
              className={`filter-btn ${
                activeCategory === "announcements" ? "active" : ""
              }`}
              onClick={() =>
                handleCategoryClick("announcements", "announcements")
              }
            >
              Announcements
            </button>
            <button
              className={`filter-btn ${
                activeCategory === "product" ? "active" : ""
              }`}
              onClick={() => handleCategoryClick("product", "product")}
            >
              Product & Community
            </button>
            <button
              className={`filter-btn ${
                activeCategory === "life" ? "active" : ""
              }`}
              onClick={() => handleCategoryClick("life", "life")}
            >
              Life at Reddit
            </button>
            <button
              className={`filter-btn ${
                activeCategory === "policy" ? "active" : ""
              }`}
              onClick={() => handleCategoryClick("policy", "policy")}
            >
              Policy & Safety
            </button>
          </div>
        )}
      </div>
      {/* Articles */}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row>
          {articles.map((article, idx) => (
            <Col md={4} key={idx} className="mb-4">
              <Card className="article-card h-100">
                {article.image_url && (
                  <Card.Img
                    variant="top"
                    src={article.image_url}
                    alt={article.title}
                  />
                )}
                <Card.Body>
                  <Card.Title>{article.title}</Card.Title>
                  <Card.Text>
                    {article.description
                      ? article.description.slice(0, 120) + "..."
                      : "No description available."}
                  </Card.Text>
                  <Button
                    variant="outline-primary"
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read more
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
    </Layout>
  );
};
export default ArticlesPage;