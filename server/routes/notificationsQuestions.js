const express = require("express");
const pool = require("../db");
const router = express.Router();

// 🔹 Get unread notifications
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM notificationsQuestions WHERE user_id=? AND read_status=0 ORDER BY createdAt DESC",
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});


// 🔹 Mark all as read
router.put("/mark-read/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    await pool.query("UPDATE notificationsQuestions SET read_status=1 WHERE user_id=?", [userId]);
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    console.error("Error marking notifications as read:", err);
    res.status(500).json({ error: "Failed to mark as read" });
  }
});


module.exports = router;
