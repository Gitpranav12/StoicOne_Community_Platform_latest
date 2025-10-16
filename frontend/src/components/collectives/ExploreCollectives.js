import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Layout from "../../Layout/Layout"; // 1. Import the standard Layout
import { useCollectives } from "../collectives/CollectivesContext";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ExploreCollectives = () => {
    const [collectives, setCollectives] = useState([]);
    const { joinedCollectives, setJoinedCollectives } = useCollectives();

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const userId = currentUser.id; // 🔹 replace with logged-in user id

    const navigate = useNavigate();
    // Load all collectives with joined flag
    //  useEffect(() => {
    //     fetch(`http://localhost:8080/api/collectives`)
    //         .then((res) => res.json())
    //         .then((data) => setCollectives(data.data)) // ✅ pick the array
    //         .catch((err) => console.error("Error fetching collectives:", err));
    // }, [userId, joinedCollectives]);

    useEffect(() => {
        fetch(`http://localhost:8080/api/collectives`)
            .then((res) => res.json())
            .then((data) => {
                const updatedCollectives = data.data.map((c) => ({
                    ...c,
                    joined: joinedCollectives.some((j) => j.id === c.id), // mark if already joined
                }));
                setCollectives(updatedCollectives);
            })
            .catch((err) => console.error("Error fetching collectives:", err));
    }, [joinedCollectives]);



    const handleJoin = async (index) => {
        setCollectives((prev) =>
            prev.map((c, i) => {
                if (i === index) {
                    const updated = { ...c, joined: !c.joined };

                    // Call backend to update DB
                    fetch(`http://localhost:8080/api/collectives/${c.id}/toggle-member`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            userId,
                            action: updated.joined ? "join" : "unjoin",
                        }),
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            updated.members = data.members; // ✅ update member count
                        })
                        .catch((err) => console.error("Error updating members:", err));

                    // Update global context (for sidebar)
                    if (updated.joined) {
                        setJoinedCollectives((prevJoined) =>
                            prevJoined.some((j) => j.id === updated.id)
                                ? prevJoined
                                : [...prevJoined, updated]
                        );
                    } else {
                        setJoinedCollectives((prevJoined) =>
                            prevJoined.filter((j) => j.id !== updated.id)
                        );
                    }

                    return updated;
                }
                return c;
            })
        );
    };



    return (
        // 2. Wrap everything in the Layout component
        <Layout>
            <Container fluid className="my-4 px-3 px-md-5">
                <h1 className="mb-3">Explore all Collectives</h1>

                {collectives.length === 0 ? (
                    <div className="text-center text-muted py-5">
                        <h5>No collectives found.</h5>
                        <p>Try again later or check back when new collectives are added.</p>
                    </div>
                ) : (
                    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                        {collectives.map((collective, index) => (
                            <Col key={collective.id}>
                                <Card className="h-100 shadow-sm">
                                    <Card.Body>
                                        <div className="d-flex align-items-center mb-3">
                                            <img
                                                src={collective.icon}
                                                alt={collective.name}
                                                style={{ width: "40px", height: "40px", marginRight: "12px" }}
                                            />
                                            <div onClick={() => navigate(`/collectives/${collective.id}`)}>
                                                <Card.Title className="mb-0">{collective.name}</Card.Title>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Users className="h-3 w-3 text-gray-500" />
                                                    <span className="text-sm text-gray-600">
                                                        {collective.members} members
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Card.Text style={{ fontSize: "0.9rem" }}>
                                            {collective.description}
                                        </Card.Text>
                                        <Button
                                            size="sm"
                                            variant={collective.joined ? "primary" : "outline-primary"}
                                            onClick={() => handleJoin(index)}
                                        >
                                            {collective.joined ? "Joined" : "Join"}
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

export default ExploreCollectives;