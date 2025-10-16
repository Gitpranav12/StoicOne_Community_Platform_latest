import React, { useContext } from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import ProfileTab from "../components/ProfileTab";
import ActivityTab from "../components/ActivityTab";
import AchievementsTab from "../components/AchievementsTab";
import SettingsTab from "../components/SettingsTab";
import ProfileHeader from "../components/ProfileHeader";
import { UserContext } from "../context/UserContext"; // Import context
import Layout from "../../../Layout/Layout"; // 1. Import the standard Layout
 
export default function UserProfile() {
  const { user } = useContext(UserContext); // Access user data

  return (
    // 2. Wrap everything in the Layout component
    <Layout>
      {/* 3. The page-specific content and Footer are placed inside */}
      <>
        <div className="container-fluid p-3 my-2 body">
          {/* Profile Header with dynamic user data */}
          <ProfileHeader user={user} />

          {/* Tabs Navigation */}
          <ul className="nav nav-tabs mt-3 normal-text">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => "nav-link text-grey" + (isActive ? " active text-black" : "")}
                to="/profile"
                end
              >
                Profile
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => "nav-link text-grey" + (isActive ? " active text-black" : "")}
                to="/profile/activity"
              >
                Activity
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => "nav-link text-grey" + (isActive ? " active text-black" : "")}
                to="/profile/achievements"
              >
                Achievements
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => "nav-link text-grey" + (isActive ? " active text-black" : "")}
                to="/profile/settings"
              >
                Settings
              </NavLink>
            </li>
          </ul>

          {/* Tab Content */}
          <div className="mt-3">
            <Routes>
              <Route index element={<ProfileTab user={user} />} />
              <Route path="activity" element={<ActivityTab />} />
              <Route path="achievements" element={<AchievementsTab user={user} />} />
              <Route path="settings" element={<SettingsTab user={user} />} />
            </Routes>
          </div>
        </div>
      </>
     </Layout>
  );
}