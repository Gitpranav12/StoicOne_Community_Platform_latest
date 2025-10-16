import React from "react";
import { useNavigate } from "react-router-dom";
import questions from "./data/questions";

export default function OverallScorePopup({
    show,
    sectionScores,
    overallScore,
    overallTotal,
    userName = "Candidate",
    userPhotoUrl = "https://via.placeholder.com/80/fc5f7c/ffffff?text=U",// एक डिफ़ॉल्ट प्लेसहोल्डर इमेज
    contestId
}) {

    // React Router Navigate 
    const navigate = useNavigate();

    if (!show) return null;

    // --- LOGIC ---
    const score = overallScore;
    const total = overallTotal;

    const percentage = total > 0 ? ((score / total) * 100).toFixed(0) : 0;
    //Pass Or Fail Colors
    const statusColor = (score / total >= 0.7) ? "#0d6efd" : "#fc5f7c";

    // --- MODAL WRAPPER UI ---
    return (
        <div
            // Modal Overlay/Background
            style={{
                position: "fixed",
                zIndex: 2000,
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(134, 129, 129, 0.41)",
                display: "flex",
                alignItems: "center",
                backdropFilter: "blur(3px) saturate(180%)",
                WebkitBackdropFilter: "blur(3px) saturate(180%)",
                justifyContent: "center",
                fontFamily: "'Poppins', 'Segoe UI', Arial, sans-serif"
            }}
        >
            {/* Main Score Card Content */}
            <div
                className="card shadow-lg p-6 py-md-6"
                style={{
                    width: "90%",
                    maxWidth: "500px",
                    margin: "0px 50px",
                    borderRadius: "24px",
                }}
            >

                {/* User Info Header */}
                <div className="text-center mb-2 mt-2">
                    <img
                        src={userPhotoUrl}
                        alt={userName}
                        className="rounded-circle shadow-sm profile-avatar"
                        style={{
                            width: "90px",
                            height: "90px",
                            objectFit: "cover",
                            margin: "0 auto",
                            border: `4px solid ${statusColor}`,
                        }}
                    />
                    <h4 className="fw-bolder mt-2 mb-0" style={{ color: "#1d273b", fontSize: "1.25rem" }}>
                        Hello, {userName}!
                    </h4>
                </div>

                {/* Score header */}
                <h2 className="fw-bolder text-center mb-2" style={{ fontSize: "1.5rem", color: "#1d273b", letterSpacing: ".5px" }}>
                    Overall Quiz Score
                </h2>
                <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-4 mb-2">

                    {/* Attractive Score circle */}
                    <div style={{ position: "relative", width: 142, height: 142 }}>
                        <svg width="142" height="142" style={{ position: "absolute", left: 0, top: 0 }}>
                            <circle r="60" cx="71" cy="71" fill="none" stroke="#f1f3f7" strokeWidth="12" />
                            <circle
                                r="60" cx="71" cy="71"
                                fill="none"
                                stroke={statusColor}
                                strokeWidth="12"
                                strokeDasharray={`${(Number(percentage) / 100) * 377}, 377`}
                                strokeLinecap="round"
                                transform="rotate(-90 71 71)"
                            />
                        </svg>
                        <div
                            className="rounded-circle shadow-lg d-flex flex-column align-items-center justify-content-center"
                            style={{
                                width: '140px',
                                height: '140px',
                                transition: 'all 0.3s ease-in-out',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                background: '#fff'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', lineHeight: 1 }}>
                                <h3 className="fw-bold m-0" style={{ color: statusColor, fontSize: '3rem' }}>
                                    {percentage}
                                </h3>
                                <small style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: 12, marginLeft: 2 }}>
                                    %
                                </small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Scores Detail */}
                <h5 className="fw-bold text-center mt-2 mb-2" style={{ color: '#1d273b' }}>Score Breakdown</h5>
                <ul className="list-group mb-2 mx-auto" style={{ maxWidth: 350 }}>
                    {sectionScores.map((s, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center py-2 " style={{ fontSize: '1rem', fontWeight: 500 }}>
                            {questions[index] ? questions[index].title : `Section ${index + 1}`}
                            <span className="badge rounded-pill mx-2" style={{ background: '#0d6efd', color: '#ffff' }}>
                                {s.score} / {s.total}
                            </span>
                        </li>
                    ))}
                </ul>

                {/* Status bar/banner */}
                <div className="text-center my-1 px-0 px-md-2">
                    <span className="badge rounded-pill px-4 py-2 text-white shadow-sm"
                        style={{
                            fontSize: "1.1rem",
                            background: statusColor
                        }}>
                        <i className={`bi ${score / total >= 0.7 ? "bi-check-circle-fill" : "bi-x-circle-fill"} me-2`}></i>
                        {score / total >= 0.7 ? "Passed" : "Failed"}
                    </span>
                </div>

                {/* Action button */}
                <button
                    className="btn btn-primary w-100 fw-bold py-2 mt-2"
                    style={{
                        fontSize: "1.1rem",
                        borderRadius: "12px",
                        boxShadow: `0 6px 18px ${statusColor}60`,
                        background: statusColor,
                        border: "none",
                        color: "#ffff"
                    }}
                    onClick={() => navigate(`/events/progress/${contestId}`)}
                >
                    Return to Home
                </button>
            </div>
        </div>
    );
}