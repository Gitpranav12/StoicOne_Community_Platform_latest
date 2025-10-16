const express = require("express");
const router = express.Router();
const db = require("../db"); // your MySQL connection
const multer = require("multer");

// multer setup (store file in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * POST /api/collectives
 * Create a new collective (with file upload + tags)
 */
router.post("/", upload.single("icon"), async (req, res) => {
  try {
    const { name, description, members, tags } = req.body;
    const icon = req.file ? req.file.buffer : null;

    // normalize tags to JSON
    let tagsJson = null;
    if (tags) {
      try {
        tagsJson = JSON.stringify(JSON.parse(tags)); // already JSON string
      } catch {
        tagsJson = JSON.stringify(tags.split(",").map((t) => t.trim())); // fallback
      }
    }

    await db.query(
      "INSERT INTO collectives (name, members, description, icon, tags) VALUES (?, ?, ?, ?, ?)",
      [name, members || 0, description, icon, tagsJson]
    );

    res.json({ success: true, message: "Collective created successfully" });
  } catch (err) {
    console.error("Error creating collective:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /api/collectives
 * List all collectives (convert icon blob -> base64, parse tags JSON)
 */


// GET /api/collectives
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.id, c.name, c.members, c.description, c.icon, c.tags,
        (SELECT COUNT(*) FROM questions q WHERE JSON_OVERLAPS(q.tags, c.tags)) AS questionsCount,
        (SELECT COUNT(*) FROM answers a 
         JOIN questions q ON a.question_id = q.id 
         WHERE JSON_OVERLAPS(q.tags, c.tags)) AS answersCount
      FROM collectives c
    `);

    const data = rows.map((row) => ({
      ...row,
      icon: row.icon ? `data:image/png;base64,${row.icon.toString("base64")}` : null,
      tags: (() => {
        if (!row.tags) return [];
        try {
          if (typeof row.tags === "string") return JSON.parse(row.tags);
          if (Buffer.isBuffer(row.tags)) return JSON.parse(row.tags.toString());
          if (Array.isArray(row.tags)) return row.tags;
          return [];
        } catch {
          return [];
        }
      })(),
    }));

    res.json({ data });
  } catch (err) {
    console.error("Error fetching collectives:", err);
    res.status(500).json({ error: "Server error" });
  }
});



// **
//  * PUT /api/collectives/:id
//  * Update a collective
//  */
router.put("/:id", upload.single("icon"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, tags } = req.body;
    const icon = req.file ? req.file.buffer : null;

    // Fetch existing collective to ensure it exists
    const [rows] = await db.query("SELECT * FROM collectives WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Collective not found" });

    // Normalize tags to JSON array
    let tagsJson = null;
    if (tags) {
      try {
        tagsJson = JSON.stringify(JSON.parse(tags)); // if valid JSON
      } catch {
        tagsJson = JSON.stringify(tags.split(",").map(t => t.trim())); // fallback
      }
    }

    // Build query dynamically depending on whether icon is updated
    const query = [];
    const params = [];

    if (name) {
      query.push("name = ?");
      params.push(name);
    }
    if (description) {
      query.push("description = ?");
      params.push(description);
    }
    if (tagsJson) {
      query.push("tags = ?");
      params.push(tagsJson);
    }
    if (icon) {
      query.push("icon = ?");
      params.push(icon);
    }

    if (query.length === 0) return res.status(400).json({ error: "No fields to update" });

    const sql = `UPDATE collectives SET ${query.join(", ")} WHERE id = ?`;
    params.push(id);

    await db.query(sql, params);

    res.json({ success: true, message: "Collective updated successfully" });
  } catch (err) {
    console.error("Error updating collective:", err);
    res.status(500).json({ error: "Server error" });
  }
});


/**
 * DELETE /api/collectives/:id
 * Delete a collective by ID
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if collective exists
    const [rows] = await db.query("SELECT * FROM collectives WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Collective not found" });

    // Delete the collective
    await db.query("DELETE FROM collectives WHERE id = ?", [id]);

    res.json({ success: true, message: "Collective deleted successfully" });
  } catch (err) {
    console.error("Error deleting collective:", err);
    res.status(500).json({ error: "Server error" });
  }
});


/**
 * GET /api/collectives/:id/questions
 * Get questions related to collective tags
 * 
 *............changes query to show flagged and reason 23 sep
 */
router.get("/:id/questions", async (req, res) => {
  try {
    const { id } = req.params;

    // Get collective tags
    const [rows] = await db.query("SELECT tags FROM collectives WHERE id = ?", [id]);

    // Check if the collective exists and has tags
    if (!rows.length || !rows[0].tags) {
      return res.json([]);
    }

    let collectiveTags = rows[0].tags;

    // Attempt to parse the tags as a JSON array
    try {
      if (typeof collectiveTags === 'string') {
        collectiveTags = JSON.parse(collectiveTags);
      }
    } catch (e) {
      console.error("Failed to parse collective tags as JSON. Assuming a single tag string.");
      // If parsing fails, it might be a single tag string. Wrap it in an array.
      collectiveTags = [collectiveTags];
    }

    // Ensure collectiveTags is a non-empty array before proceeding
    if (!Array.isArray(collectiveTags) || collectiveTags.length === 0) {
      console.log("Collective tags are empty or invalid after parsing. Returning empty array.");
      return res.json([]);
    }

    const collectiveTagsJson = JSON.stringify(collectiveTags);

    console.log("Final JSON string being queried:", collectiveTagsJson);

    // Use JSON_OVERLAPS to find questions that share at least one tag
    const [questions] = await db.query(
      `SELECT * FROM questions WHERE JSON_OVERLAPS(tags, ?) ORDER BY createdAt DESC`,
      [collectiveTagsJson]
    );

    // Normalize and send the response
    const normalized = questions.map(q => ({
      id: q.id,
      title: q.title,
      bodyText: q.bodyText,
      flagged : q.flagged, //........................added 23sep
      flag_reason: q.flag_reason, //..........................added 23sep
      votes: q.votes || 0,
      answers: q.answers || 0,
      views: q.views || 0,
      author: q.author || "Anonymous",
      time: q.createdAt || "",
      tags: (() => {
        try {
          if (!q.tags) return [];
          if (typeof q.tags === "string") return JSON.parse(q.tags);
          return Array.isArray(q.tags) ? q.tags : [];
        } catch {
          return [];
        }
      })(),
    }));

    res.json(normalized);
  } catch (err) {
    console.error("Error fetching questions for collective:", err);
    res.status(500).json({ error: "Server error" });
  }
});




/**
 * GET /api/collectives/:id
 * Get single collective by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      "SELECT id, name, members, description, icon, tags FROM collectives WHERE id = ?",
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Collective not found" });

    const collective = rows[0];
    collective.icon = collective.icon
      ? `data:image/png;base64,${collective.icon.toString("base64")}`
      : null;

    // Corrected tag parsing logic
    collective.tags = (() => {
      if (!collective.tags) return [];
      try {
        // If it's already a string, parse it.
        // The database might return a string representation of the JSON array.
        if (typeof collective.tags === "string") {
          return JSON.parse(collective.tags);
        }
        // If it's a buffer (unlikely for JSON, but good practice), parse it.
        if (Buffer.isBuffer(collective.tags)) {
          return JSON.parse(collective.tags.toString());
        }
        // If it's already an array (MySQL can sometimes return this directly), just return it.
        if (Array.isArray(collective.tags)) {
          return collective.tags;
        }
        // Fallback for non-JSON strings.
        // This is a safety net for cases where the data is incorrect.
        if (typeof collective.tags === "string") {
          return [collective.tags]; // Wrap the single string in an array
        }

        return [];
      } catch (e) {
        console.error("Tag parse error:", e);
        // Fallback for any other parsing errors, assuming a single tag.
        if (typeof collective.tags === "string") {
          return [collective.tags];
        }
        return [];
      }
    })();


    res.json(collective);
  } catch (err) {
    console.error("Error fetching collective:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// POST /api/collectives/:id/toggle-member
router.post("/:id/toggle-member", async (req, res) => {
  const { id } = req.params;           // collective id
  const { userId, action } = req.body; // frontend must send userId + "join" or "unjoin"

  // Get current members
  const [rows] = await db.query("SELECT members FROM collectives WHERE id = ?", [id]);
  if (rows.length === 0) return res.status(404).json({ error: "Collective not found" });

  let members = rows[0].members;

  if (action === "join") {
    await db.query(
      "INSERT IGNORE INTO user_collectives (user_id, collective_id) VALUES (?, ?)",
      [userId, id]
    );
    members++;
  } else if (action === "unjoin") {
    await db.query(
      "DELETE FROM user_collectives WHERE user_id = ? AND collective_id = ?",
      [userId, id]
    );
    if (members > 0) members--;
  }

  await db.query("UPDATE collectives SET members = ? WHERE id = ?", [members, id]);

  res.json({ success: true, members });
});


// GET /api/collectives/user/:userId
// GET /api/collectives/user/:userId
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT c.id, c.name, c.members, c.description, c.icon
       FROM collectives c
       JOIN user_collectives uc ON c.id = uc.collective_id
       WHERE uc.user_id = ?`,
      [userId]
    );

    // Convert icon blob to base64
    const data = rows.map(row => ({
      ...row,
      icon: row.icon ? `data:image/png;base64,${row.icon.toString("base64")}` : null
    }));

    res.json(data);
  } catch (err) {
    console.error("Error fetching joined collectives:", err);
    res.status(500).json({ error: "Server error" });
  }
});





module.exports = router;
