const express = require("express");
const router = express.Router();
const db = require("../db"); // your MySQL connection pool
// Search endpoint
router.get("/", async(req, res) => {
    const searchTerm = req.query.q;
    if (!searchTerm) {
        return res.status(400).json({ error: "Search term is required" });
    }
    try {
        const [users] = await db.execute(
            `SELECT id, name, email, profile_photo
       FROM users
       WHERE name LIKE ? OR email LIKE ?`, [`%${searchTerm}%`, `%${searchTerm}%`]
        );
        const [questions] = await db.execute(
            `SELECT id, title, bodyText, tags, author, createdAt
       FROM questions
       WHERE title LIKE ? OR bodyText LIKE ?`, [`%${searchTerm}%`, `%${searchTerm}%`]
        );
        res.json({ users, questions });
    } catch (err) {
        console.error("Search error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
module.exports = router;