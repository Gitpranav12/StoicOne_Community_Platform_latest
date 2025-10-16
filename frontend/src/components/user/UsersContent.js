import React, { useState, useEffect } from "react";
import UserCard from "./UserCard";
import { Container, Row, Col, Form, InputGroup, Pagination } from "react-bootstrap";
import { Search } from "lucide-react";
import axios from "axios";

export default function UsersContent() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const usersPerPage = 25;



  // ✅ get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/users")
      .then((res) => {
        let allUsers = res.data;
        if (currentUser && currentUser.id) {
          // ✅ remove current user
          allUsers = allUsers.filter((u) => u.id !== currentUser.id);
        }
        setUsers(allUsers);
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, [currentUser]);

  // Filter users
  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.designation?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <Container fluid className="py-4 users-page">
      <h4 className="mb-3 heading-text">Users</h4>

      {/* Search Input */}
      <Form className="mb-4">
        <InputGroup>
          <InputGroup.Text className="bg-white border-end-0">
            <Search size={16} />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search users by name or designation..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="border-start-0 no-focus-outline"
          />
        </InputGroup>
      </Form>


      {/* User List
      <Row Row className="g-3 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xxl-5">
        {currentUsers.map((user) => (
          <Col key={user.id}>
            <div className="h-100">
              <UserCard user={user} />
            </div>
          </Col>
        ))}
      </Row> */}

      {/* User List or Empty State */}
      {filteredUsers.length === 0 ? (
        <div className="text-center my-5">
          <h5>No Users found.</h5>
          <p className="text-muted">
            Try adjusting your search or check back later when new Users are created.
          </p>
        </div>
      ) : (
        <Row className="g-3 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xxl-5">
          {currentUsers.map((user) => (
            <Col key={user.id}>
              <div className="h-100">
                <UserCard user={user} />
              </div>
            </Col>
          ))}
        </Row>
      )}




      {/* Pagination */}
      {/* <div className="d-flex justify-content-center mt-4">
        <Pagination>
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages)].slice(0, 5).map((_, i) => (
            <Pagination.Item
              key={i + 1}
              active={currentPage === i + 1}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
          {totalPages > 5 && <Pagination.Ellipsis disabled />}
          {totalPages > 5 && (
            <Pagination.Item onClick={() => handlePageChange(totalPages)}>
              {totalPages}
            </Pagination.Item>
          )}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div> */}

      {/* Pagination */}
      {filteredUsers.length > 0 && totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages)].slice(0, 5).map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={currentPage === i + 1}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            {totalPages > 5 && <Pagination.Ellipsis disabled />}
            {totalPages > 5 && (
              <Pagination.Item onClick={() => handlePageChange(totalPages)}>
                {totalPages}
              </Pagination.Item>
            )}
            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}


    </Container >
  );
}
