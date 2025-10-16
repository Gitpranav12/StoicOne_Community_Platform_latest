import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  InputGroup,
  Row,
  Col,
  ListGroup,
} from "react-bootstrap";
import axios from "axios";

export default function CustomizeFeedModal({ show, handleClose }) {
  const [interest, setInterest] = useState("interested");
  const [searchTerm, setSearchTerm] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState({
    interested: [],
    notinterested: [],
  });
  // .............Added by Pranav Jawarkar 27 sep ..........
  // fetch Tags from Tags Page API for Intrested and Not Interested Tags
  useEffect(() => {
    if (show) {
      axios
        .get("http://localhost:8080/api/tags", {
          params: { page: 1, limit: 100 },
        })
        .then((res) => {
          setAllTags(res.data.data);
          setFilteredTags(res.data.data);
        });
      setSearchTerm("");
    }
  }, [show]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredTags(allTags);
    } else {
      setFilteredTags(
        allTags.filter((tag) =>
          tag.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, allTags]);

  const handleTagSelect = (tagName) => {
    const otherType =
      interest === "interested" ? "notinterested" : "interested";
    setSelectedTags((prev) => {
      let a = prev[interest].includes(tagName)
        ? prev[interest]
        : [...prev[interest], tagName];
      let b = prev[otherType].filter((t) => t !== tagName);
      return { ...prev, [interest]: a, [otherType]: b };
    });
    setSearchTerm("");
  };

  const handleRemoveTag = (type, tag) => {
    setSelectedTags((prev) => ({
      ...prev,
      [type]: prev[type].filter((t) => t !== tag),
    }));
  };

  const renderSelected = (type) =>
    selectedTags[type].length > 0 ? (
      <div className="d-flex flex-wrap mb-2">
        {selectedTags[type].map((tag) => (
          <span
            key={tag}
            className="badge bg-primary text-light me-2 mb-1"
            style={{ fontSize: "15px" }}
          >
            {tag}
            <Button
              variant="link"
              size="sm"
              onClick={() => handleRemoveTag(type, tag)}
              style={{
                color: "white",
                padding: "0 4px",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              ×
            </Button>
          </span>
        ))}
      </div>
    ) : (
      <span className="text-muted">No tags selected</span>
    );

  const handleSave = () => {
    localStorage.setItem("customFeedTags", JSON.stringify(selectedTags));
    handleClose();
  };

 const handleResetTags = () => {
  setSelectedTags({
    interested: [],
    notinterested: [],
  });
};

  return (
    <Modal show={show} onHide={handleClose} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>Customize Feed</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "1rem 1.5rem" }}>
        <Row className="mb-3 text-center">
          <Col>
            <Button
              variant={
                interest === "interested" ? "success" : "outline-success"
              }
              className="w-100 py-2 sub-heading-text mb-2"
              onClick={() => setInterest("interested")}
            >
              Interested
            </Button>
          </Col>
          <Col>
            <Button
              variant={
                interest === "notinterested" ? "danger" : "outline-danger"
              }
              className="w-100 py-2 sub-heading-text mb-2"
              onClick={() => setInterest("notinterested")}
            >
              Not Interested
            </Button>
          </Col>
        </Row>
        {interest === "interested" ? (
          <>
            <Form.Label>Tags you are Interested in</Form.Label>
            {renderSelected("interested")}
          </>
        ) : (
          <>
            <Form.Label>Tags you are Not Interested in</Form.Label>
            {renderSelected("notinterested")}
          </>
        )}
        <InputGroup className="mb-2">
          <InputGroup.Text>
            <i className="bi bi-search"></i>
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </InputGroup>
        {searchTerm && filteredTags.length > 0 && (
          <ListGroup style={{ maxHeight: "150px", overflowY: "auto" }}>
            {filteredTags
              .filter(
                (tag) =>
                  !selectedTags.interested.includes(tag.name) &&
                  !selectedTags.notinterested.includes(tag.name)
              )
              .slice(0, 8)
              .map((tag) => (
                <ListGroup.Item
                  key={tag.id}
                  action
                  onClick={() => handleTagSelect(tag.name)}
                >
                  {tag.name}
                </ListGroup.Item>
              ))}
          </ListGroup>
        )}
      </Modal.Body>
      <Modal.Footer>
        {(selectedTags.interested.length > 0 || selectedTags.notinterested.length > 0) && (
          <Button variant="outline-danger" onClick={handleResetTags}>
            Reset Tags
          </Button>
        )}
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
