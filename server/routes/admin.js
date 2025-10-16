const express = require("express");
const router = express.Router();
const pool = require("../db");



router.get("/stats", async (req, res) => {
    try {
        // Current total users
        const [totalUsers] = await pool.query("SELECT COUNT(*) AS count FROM users");

        // New users in the last 30 days
        const [newUsers] = await pool.query(
            "SELECT COUNT(*) AS count FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)"
        );

        // Users in the previous month (30–60 days ago)
        const [prevMonthUsers] = await pool.query(
            "SELECT COUNT(*) AS count FROM users WHERE created_at BETWEEN DATE_SUB(NOW(), INTERVAL 60 DAY) AND DATE_SUB(NOW(), INTERVAL 30 DAY)"
        );

        // Total questions and answers
        const [totalQuestions] = await pool.query("SELECT COUNT(*) AS count FROM questions");
        const [totalAnswers] = await pool.query("SELECT COUNT(*) AS count FROM answers");

        // Total comments...... 26 sep
        const [totalComments] = await pool.query("SELECT COUNT(*) AS count FROM comments");

        // Total votes (upvotes only → vote_type = 1, adjust if needed).. 26 sep
        const [totalVotes] = await pool.query(
            "SELECT COUNT(*) AS count FROM question_votes WHERE vote_type = 1"
        );


        // Previous month questions (30–60 days ago)
        const [prevMonthQuestions] = await pool.query(
            "SELECT COUNT(*) AS count FROM questions WHERE createdAt BETWEEN DATE_SUB(NOW(), INTERVAL 60 DAY) AND DATE_SUB(NOW(), INTERVAL 30 DAY)"
        );
        // Previous month answers (30–60 days ago)
        const [prevMonthAnswers] = await pool.query(
            "SELECT COUNT(*) AS count FROM answers WHERE createdAt BETWEEN DATE_SUB(NOW(), INTERVAL 60 DAY) AND DATE_SUB(NOW(), INTERVAL 30 DAY)"
        );

        res.json({
            totalUsers: totalUsers[0].count,
            newUsers: newUsers[0].count,
            prevMonthUsers: prevMonthUsers[0].count,
            totalQuestions: totalQuestions[0].count,
            prevMonthQuestions: prevMonthQuestions[0].count,  
            totalAnswers: totalAnswers[0].count,
            prevMonthAnswers: prevMonthAnswers[0].count,       
            totalComments: totalComments[0].count,// added 26 sep
            totalVotes: totalVotes[0].count// added sep
        });


    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});





// --------------------
// Trending Tags
// --------------------
router.get("/trending-tags", async (req, res) => {
  try {
    const [tags] = await pool.query(`
      SELECT name, questions_count 
      FROM tagspage
      WHERE questions_count > 0
      ORDER BY questions_count DESC
      LIMIT 5
    `);

    const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

    const data = tags.map((tag, idx) => ({
      name: tag.name,
      count: tag.questions_count,
      color: colors[idx % colors.length],
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



// --------------------
// Top Contributors
// --------------------

router.get("/top-contributors", async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT u.id, u.name, u.department,
             (SELECT COUNT(*) FROM questions q WHERE q.user_id = u.id) +
             (SELECT COUNT(*) FROM answers a WHERE a.user_id = u.id) AS contributions
      FROM users u
      HAVING contributions > 0
      ORDER BY contributions DESC
      LIMIT 5
    `);

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});




// --------------------
// Monthly Activity
// --------------------
router.get("/monthly-activity", async (req, res) => {
    try {
        const [questions] = await pool.query(`
      SELECT DATE_FORMAT(createdAt, '%Y-%m') AS month, COUNT(*) AS count 
      FROM questions 
      GROUP BY month
    `);

        const [answers] = await pool.query(`
      SELECT DATE_FORMAT(createdAt, '%Y-%m') AS month, COUNT(*) AS count 
      FROM answers 
      GROUP BY month
    `);

        // Merge data
        const monthSet = new Set([...questions.map(q => q.month), ...answers.map(a => a.month)]);
        const months = Array.from(monthSet).sort();

        const data = months.map(month => {
            const q = questions.find(q => q.month === month)?.count || 0;
            const a = answers.find(a => a.month === month)?.count || 0;
            return { month, questions: q, answers: a };
        });

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});



router.get("/popular-unanswered", async (req, res) => {
    try {
        const [rows] = await pool.query(`
      SELECT q.id, q.title, q.tags, u.name AS author, u.score, q.createdAt
      FROM questions q
      JOIN users u ON q.user_id = u.id
      WHERE q.id NOT IN (SELECT question_id FROM answers)
      ORDER BY q.views DESC
      LIMIT 1
    `);

        if (!rows.length) return res.json(null);

        const row = rows[0];

        // 🔹 Handle tags properly
        let parsedTags = [];
        if (row.tags) {
            try {
                if (typeof row.tags === "string") {
                    // try JSON.parse first
                    try {
                        parsedTags = JSON.parse(row.tags);
                    } catch {
                        // if it's just "reactjs,javascript"
                        parsedTags = row.tags.split(",").map((t) => t.trim());
                    }
                } else if (Buffer.isBuffer(row.tags)) {
                    const str = row.tags.toString();
                    try {
                        parsedTags = JSON.parse(str);
                    } catch {
                        parsedTags = str.split(",").map((t) => t.trim());
                    }
                } else if (Array.isArray(row.tags)) {
                    parsedTags = row.tags;
                }
            } catch {
                parsedTags = [];
            }
        }

        const unanswered = {
            id: row.id,
            title: row.title,
            tags: parsedTags,
            author: row.author,
            score: row.score,
            createdAt: row.createdAt, // format later in React if needed
        };

        res.json(unanswered);
    } catch (err) {
        console.error("Error fetching popular unanswered:", err);
        res.status(500).json({ error: "Server error" });
    }
});





// Approve or reject answer
router.put("/answers/:id/approve", async (req, res) => {
  const { id } = req.params;
  const { approved } = req.body; // 1 or 0

  try {
    await pool.query("UPDATE answers SET approved = ? WHERE id = ?", [approved, id]);
    res.json({ success: true, message: `Answer ${approved ? "approved" : "rejected"} successfully.` });
  } catch (err) {
    console.error("Error updating answer approval:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});







module.exports = router;
