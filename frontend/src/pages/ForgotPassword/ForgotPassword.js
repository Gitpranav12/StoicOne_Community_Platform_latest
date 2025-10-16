// src/components/AttitudeSection.jsx
import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { UserContext } from "../../components/UserProfilePage/context/UserContext";

/*
Props:
 - userId: id of profile to show
 - editable: boolean (show edit controls if true and current user matches)
Usage:
 <AttitudeSection userId={user.id} editable={true} />
*/

const ForgotPassword = ({ userId, editable = false }) => {
  const { user: currentUser, fetchUserData } = useContext(UserContext);
  const [data, setData] = useState({
    score: 0,
    rank: null,
    percentile: null,
    badges: [],
    endorsements: 0,
    note: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080/api";

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`${API_BASE}/user/${userId}/attitude`, { credentials: "include" })
      .then((r) => r.json())
      .then((res) => {
        if (!mounted) return;
        if (res && res.attitude) setData(res.attitude);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setError("Failed to load attitude");
        setLoading(false);
      });
    return () => (mounted = false);
  }, [userId]);

  const isOwner = currentUser?.id === userId;

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/user/${userId}/attitude`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attitude: data }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Save failed");
      // refresh context/profile if needed
      if (isOwner && fetchUserData) fetchUserData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEndorse = async () => {
    // optimistic UI
    setData((d) => ({ ...d, endorsements: (d.endorsements || 0) + 1 }));
    try {
      const res = await fetch(`${API_BASE}/user/${userId}/attitude/endorse`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        // revert on failure
        const json = await res.json();
        setData((d) => ({ ...d, endorsements: Math.max((d.endorsements || 1) - 1, 0) }));
        throw new Error(json.message || "Endorse failed");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading attitude...</div>;

  return (
    <section style={{ border: "1px solid #e6e6e6", padding: 16, borderRadius: 8, background: "#fff", maxWidth: 800 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div>
          <h4 style={{ margin: 0 }}>Attitude</h4>
          <p style={{ marginTop: 6, color: "#666" }}>A quick snapshot of the user's attitude & soft-skill standing (HackerRank-like)</p>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{data.score ?? 0}</div>
          <div style={{ color: "#666", fontSize: 12 }}>Score</div>
        </div>
      </div>

      {/* Rank / Percentile */}
      <div style={{ display: "flex", gap: 12, marginTop: 14, alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 14, color: "#333" }}>Rank</div>
          <div style={{ fontWeight: 600 }}>{data.rank ?? "—"}</div>
        </div>
        <div>
          <div style={{ fontSize: 14, color: "#333" }}>Percentile</div>
          <div style={{ fontWeight: 600 }}>{data.percentile ? `${data.percentile}%` : "—"}</div>
        </div>

        {/* Endorse button */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={handleEndorse}
            style={{
              border: "1px solid #0d6efd",
              background: "white",
              color: "#0d6efd",
              padding: "6px 10px",
              borderRadius: 6,
              cursor: "pointer",
            }}
            title="Endorse this user's attitude"
          >
            Endorse
          </button>
          <div style={{ fontSize: 13, color: "#333" }}>{data.endorsements ?? 0} endorsements</div>
        </div>
      </div>

      {/* Progress bar to show score visually */}
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 13, color: "#444", marginBottom: 6 }}>Progress</div>
        <div style={{ background: "#eee", height: 10, borderRadius: 6, overflow: "hidden" }}>
          <div
            style={{
              width: `${Math.min(100, data.score ?? 0)}%`,
              height: "100%",
              background: "linear-gradient(90deg,#0d6efd,#00c2ff)",
            }}
          />
        </div>
      </div>

      {/* Badges */}
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 13, color: "#444", marginBottom: 6 }}>Badges</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(data.badges || []).length === 0 ? (
            <div style={{ color: "#888" }}>No badges yet</div>
          ) : (
            data.badges.map((b, i) => (
              <div key={i} style={{ padding: "6px 10px", borderRadius: 999, background: "#f1f7ff", border: "1px solid #dbeafe", fontSize: 13 }}>
                {b}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Note / Description (editable for owner) */}
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 13, color: "#444", marginBottom: 6 }}>Summary</div>
        {editable && isOwner ? (
          <>
            <textarea
              value={data.note || ""}
              onChange={(e) => setData((d) => ({ ...d, note: e.target.value }))}
              rows={4}
              style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd", resize: "vertical" }}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button onClick={handleSave} disabled={saving} style={{ padding: "8px 12px", background: "#0d6efd", color: "#fff", borderRadius: 6 }}>
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => {
                  // revert by re-fetching
                  setLoading(true);
                  fetch(`${API_BASE}/user/${userId}/attitude`, { credentials: "include" })
                    .then((r) => r.json())
                    .then((res) => {
                      setData(res.attitude || {});
                      setLoading(false);
                    })
                    .catch(() => setLoading(false));
                }}
                style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ddd" }}
              >
                Cancel
              </button>
            </div>
            {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
          </>
        ) : (
          <div style={{ whiteSpace: "pre-wrap", color: "#333" }}>{data.note || <span style={{ color: "#888" }}>No summary added</span>}</div>
        )}
      </div>
    </section>
  );
};

ForgotPassword.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  editable: PropTypes.bool,
};

export default ForgotPassword;