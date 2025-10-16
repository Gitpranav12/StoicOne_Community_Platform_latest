import React, { useEffect, useState } from "react";
import { useParams, NavLink, Routes, Route } from "react-router-dom";
import ProfileTab from "../components/ProfileTab";
import ActivityTab from "../components/ActivityTab";
import AchievementsTab from "../components/AchievementsTab";
import ProfileHeader from "../components/ProfileHeader";
import Layout from "../../../Layout/Layout";

export default function UserPublicProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`http://localhost:8080/api/user/${id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data);
    
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <Layout>
      <div className="container-fluid p-3 my-2 body">
        <ProfileHeader user={user} />

        {/* Tabs without Settings */}
        <ul className="nav nav-tabs mt-3 normal-text">
          <li className="nav-item">
            <NavLink
              className={({ isActive }) =>
                "nav-link text-grey" + (isActive ? " active text-black" : "")
              }
              to={`/users/${id}`}
              end
            >
              Profile
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className={({ isActive }) =>
                "nav-link text-grey" + (isActive ? " active text-black" : "")
              }
              to={`/users/${id}/activity`}
            >
              Activity
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className={({ isActive }) =>
                "nav-link text-grey" + (isActive ? " active text-black" : "")
              }
              to={`/users/${id}/achievements`}
            >
              Achievements
            </NavLink>
          </li>
        </ul>

        <div className="mt-3">
          <Routes>
            <Route index element={<ProfileTab user={user} />} />
            <Route path="activity" element={<ActivityTab user={user} />} />
            <Route path="achievements" element={<AchievementsTab user={user} />} />
          </Routes>
        </div>
      </div>
    </Layout>
  );
}
