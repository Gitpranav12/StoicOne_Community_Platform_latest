import React, { useState, useContext } from 'react';
import { UserContext } from "../UserProfilePage/context/UserContext";


export default function TopHeader() {

  const { user, setUser } = useContext(UserContext);
  const id = user?.id || null;

  const userName =
    user?.profile?.name ||
    user?.name ||
    "Guest";

  const profilePhotoUrl = id
    ? `http://localhost:8080/api/user/${id}/profile-photo?${user?.photoUpdatedAt || Date.now()}`
    : "https://i.pravatar.cc/112?img=1";

  return (
    <header
      style={{
        width: "100%",
        background: "#fff",
        boxShadow: "rgba(0, 0, 0, 0.25) 0px 25px 50px -12px",
        display: "flex",
        alignItems: "center",
        padding: "0px 15px",
        minHeight: 60,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        boxSizing: "border-box"
      }}
    >
      <span style={{
        fontWeight: 600,
        fontSize: "1.35rem",
        marginRight: 18,
        color: "#16181c",
        letterSpacing: 0.1
      }}>
        Contest Platform
      </span>

      <div style={{ flex: 1 }}></div>
      <span style={{
        background: "#F2F3F6",
        borderRadius: 8,
        padding: "2px 14px",
        fontWeight: 500,
        marginRight: 10,
        fontSize: "15.2px",
        letterSpacing: 0
      }}>
        {userName}
      </span>
      {/* <button
        style={{
          border: "1px solid #e3e6ee",
          background: "#fff",
          borderRadius: 11,
          padding: "7px 18px",
          fontWeight: 500,
          fontSize: "15.5px",
          marginRight: 16,
          color: "#141722",
          cursor: "pointer",
        }}
      >
        Switch to Admin
      </button> */}
      <span>
        {profilePhotoUrl ? (
            <img
              src={profilePhotoUrl}
              alt="Profile"
              className="rounded-circle"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
              onError={(e) => {
                e.target.src = "/images/default-avatar.png";
              }}
            />
          ) : (
            <i className="bi bi-person-circle fs-4"></i>
          )}
      </span>
    </header>
  );
}
