import React, { createContext, useState, useEffect, useCallback } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = "http://localhost:8080/api";

  // -------- Fetch User Data --------
  const fetchUserData = useCallback(
    async (retryCount = 0) => {
      const currentUserId = user?.id;
      if (!currentUserId) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const [userRes, deptRes] = await Promise.all([
          fetch(`${API_BASE}/user/${currentUserId}`, { credentials: "include" }),
          fetch(`${API_BASE}/departments/all`, { credentials: "include" }),
        ]);

        if (!userRes.ok || !deptRes.ok) {
          throw new Error("Failed to fetch user or department data");
        }

        const userData = await userRes.json();
        const deptMap = await deptRes.json();

        const updatedUser = {
          ...user,
          profile: userData?.profile || {},
          account: userData?.account || {},
          stats: userData?.stats || {},
          activity: userData?.activity || [],
          achievements: userData?.achievements || { badges: [], milestones: [] },
          departmentOptions: deptMap && typeof deptMap === "object" ? deptMap : {},
        };

        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setError(null);
      } catch (err) {
        console.error("Error fetching user:", err.message);

        if (retryCount < 2) {
          setTimeout(() => fetchUserData(retryCount + 1), (retryCount + 1) * 2000);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    },
    [API_BASE, user]
  );

  // -------- Trigger fetch after login or user change --------
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // If profile is missing, fetch full data
    if (!user.profile || !user.account) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [user, fetchUserData]);

  // -------- Update Profile --------
  const updateProfile = async (updatedProfile) => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API_BASE}/user/${user.id}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update profile");

      await res.json();
      await fetchUserData();
    } catch (err) {
      console.error("Error updating profile:", err);
      throw err;
    }
  };

  // -------- Update Account --------
  const updateAccount = async ({ currentPassword, newPassword }) => {
    if (!user?.id) return;
    try {
      if (!currentPassword || !newPassword) {
        throw new Error("Both current and new passwords are required");
      }

      const res = await fetch(`${API_BASE}/user/${user.id}/account`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update account");

      await fetchUserData();
      return data;
    } catch (err) {
      console.error("Error updating account:", err);
      throw err;
    }
  };

  // -------- Delete Account --------
  const deleteAccount = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API_BASE}/user/${user.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete account");

      localStorage.removeItem("currentUser");
      localStorage.removeItem("token");
      setUser(null);

      return data;
    } catch (err) {
      console.error("Error deleting account:", err);
      throw err;
    }
  };

  // -------- Update Profile Photo --------
  const updateProfilePhoto = async (file) => {
    if (!user?.id) return;
    try {
      const formData = new FormData();
      formData.append("profile_photo", file);

      const res = await fetch(`${API_BASE}/user/${user.id}/profile-photo`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update profile photo");

      await fetchUserData();
    } catch (err) {
      console.error("Error updating profile photo:", err);
      throw err;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        updateProfile,
        updateAccount,
        deleteAccount,
        updateProfilePhoto,
        fetchUserData,
        loading,
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
