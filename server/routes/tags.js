const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/tags?search=&sort=&page=&limit=
router.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";
    const sort = req.query.sort || "popular"; // popular = questions_count
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    // Build SQL
    let orderBy = "questions_count DESC";
    if (sort === "name") orderBy = "name ASC";

    const sql = `
      SELECT id, name, description, questions_count, questions_today, questions_week
      FROM tagspage
      WHERE name LIKE ?
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;

    const [rows] = await db.query(sql, [`%${search}%`, limit, offset]);

    // Count total for pagination
    const [countResult] = await db.query(
      "SELECT COUNT(*) as total FROM tagspage WHERE name LIKE ?",
      [`%${search}%`]
    );
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      data: rows,
      page,
      totalPages,
      total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/tags/all → return all tag names (for AskQuestionPage autocomplete)
router.get("/all", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT name FROM tagspage ORDER BY name ASC"
    );
    res.json(rows.map((r) => r.name)); // just return array of names
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// POST /api/tags - create new tag
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "Tag name required" });

    const sql = `
      INSERT INTO tagspage (name, description)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE description = VALUES(description)
    `;
    await db.query(sql, [name, description]);

    res.json({ success: true });
  } catch (err) {
    console.error("Error creating tag:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// PUT /api/tags/:id → update tag
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    await db.execute(
      "UPDATE tagspage SET name = ?, description = ? WHERE id = ?",
      [name, description, id]
    );
    res.json({ message: "Tag updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/tags/:id → delete tag
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute("DELETE FROM tagspage WHERE id = ?", [id]);
    res.json({ message: "Tag deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





module.exports = router;