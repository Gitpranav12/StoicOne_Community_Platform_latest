// routes/users.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all users (exclude current if passed)
router.get("/", async (req, res) => {
  try {
    const excludeId = req.query.excludeId;
    let query = "SELECT id, name, email, designation, department, profile_photo, score ,created_at FROM users";
    const params = [];

    if (excludeId) {
      query += " WHERE id != ?";
      params.push(excludeId);
    }

    const [rows] = await pool.query(query, params);

    // ✅ Handle both URL and LONGBLOB cases
    const users = rows.map((user) => {
      let avatar = null;

      if (user.profile_photo) {
        if (Buffer.isBuffer(user.profile_photo)) {
          // Case: LONGBLOB (binary)
          avatar = `data:image/jpeg;base64,${user.profile_photo.toString("base64")}`;
        } else if (typeof user.profile_photo === "string" && user.profile_photo.startsWith("http")) {
          // Case: Google URL (string)
          avatar = user.profile_photo;
        }
      }

      return {
        ...user,
        avatar,
      };
    });

    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// DELETE /api/users/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
