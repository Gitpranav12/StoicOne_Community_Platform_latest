const express = require('express');
const router = express.Router();
const db = require('../db');

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // store file in memory

//  create contest
router.post('/', async (req, res) => {
  const { title, description, startDate, endDate, status, rounds } = req.body;

  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    const [contestResult] = await conn.query(
      'INSERT INTO contests (title, description, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)',
      [title, description, startDate, endDate, status]
    );

    const contestId = contestResult.insertId;

    // Insert rounds & questions
    for (const round of rounds) {
      const [roundResult] = await conn.query(
        'INSERT INTO rounds (contest_id, round_name, type, duration) VALUES (?, ?, ?, ?)',
        [contestId, round.round_name, round.type, round.duration]
      );
      const roundId = roundResult.insertId;

      if (round.type === 'quiz') {
        for (const q of round.questions) {
          await conn.query(
            'INSERT INTO quiz_questions (round_id, text, option_1, option_2, option_3, option_4, correct_index) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [roundId, q.text, q.option_1, q.option_2, q.option_3, q.option_4, q.correct_index]
          );
        }
      } else if (round.type === 'coding') {
        for (const q of round.questions) {
          
          await conn.query(
           // ✅ Added sample_input_2, sample_output_2
            `INSERT INTO coding_questions 
              (round_id, title, description, input_format, output_format, 
              sample_input, sample_output, sample_input_2, sample_output_2) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              roundId,
              q.title,
              q.description,
              q.input_format,
              q.output_format,
              q.sample_input,
              q.sample_output,
              q.sample_input_2 || null, // ✅
              q.sample_output_2 || null  // ✅
            ]
          );
        }
      }
    }

    await conn.commit();
    conn.release();
    res.json({ success: true, contestId });
  } catch (err) {
    await conn.rollback();
    conn.release();
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// Get contest with rounds & questions
router.get('/:id', async (req, res) => {
  const contestId = req.params.id;
  try {
    const [contestRows] = await db.query('SELECT * FROM contests WHERE id = ?', [contestId]);
    if (!contestRows.length) return res.status(404).json({ error: 'Contest not found' });

    const contest = contestRows[0];

    // ✅ Fetch participants for this contest
    const [participants] = await db.query(
      `SELECT u.id, u.name, u.email, u.profile_photo
       FROM participants p
       JOIN users u ON p.user_id = u.id
       WHERE p.contest_id = ?`,
      [contestId]
    );
    contest.participantList = participants;
    contest.participants = participants.length;

    const [rounds] = await db.query('SELECT * FROM rounds WHERE contest_id = ?', [contestId]);

    for (const round of rounds) {
      if (round.type === 'quiz') {
        const [questions] = await db.query('SELECT * FROM quiz_questions WHERE round_id = ?', [round.id]);
        round.questions = (questions || []).map(q => ({
          ...q,
          options: [q.option_1, q.option_2, q.option_3, q.option_4],
          correctIndex: q.correct_index
        }));
      } else if (round.type === 'coding') {
        const [questions] = await db.query('SELECT * FROM coding_questions WHERE round_id = ?', [round.id]);
        round.questions = (questions || []).map(q => ({
          id: q.id,
          title: q.title,
          description: q.description,
          input_format: q.input_format,
          output_format: q.output_format,
          sampleInsample_inputput: q.sample_input,
          sample_output: q.sample_output,
          sample_input_2: q.sample_input_2,   // ✅
          sample_output_2: q.sample_output_2  // ✅
        }));
      }
    }

    contest.rounds = rounds;
    res.json(contest);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// Get all contests with rounds (optional: include questions if needed)
router.get('/', async (req, res) => {
  const userId = req.query.userId; // Pass logged-in user's id from frontend
  try {
    // Include participant count in the main query
    const [contestRows] = await db.query(`
      SELECT 
        c.*, 
        COUNT(p.id) AS participants,
        u.status AS user_status,
        MIN(CASE WHEN p.status='completed' AND p.review_status='reviewed' THEN 1 ELSE 0 END) AS all_completed_and_reviewed
      FROM contests c
      LEFT JOIN participants p ON c.id = p.contest_id
      LEFT JOIN participants u ON c.id = u.contest_id AND u.user_id = ?
      GROUP BY c.id, u.status
      ORDER BY c.start_date DESC
    `, [userId || 0]); // if no userId, just use 0

    const contests = [];

    for (const contest of contestRows) {
      const [rounds] = await db.query('SELECT * FROM rounds WHERE contest_id = ?', [contest.id]);

      // Optionally include questions
      for (const round of rounds) {
        if (round.type === 'quiz') {
          const [questions] = await db.query('SELECT * FROM quiz_questions WHERE round_id = ?', [round.id]);
          round.questions = questions;
        } else if (round.type === 'coding') {
          const [questions] = await db.query('SELECT * FROM coding_questions WHERE round_id = ?', [round.id]);
          round.questions = questions;
        }
      }

      contest.rounds = rounds;
      contests.push(contest);
    }

    res.json(contests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

//update contest
router.put('/:id', async (req, res) => {
  const contestId = req.params.id;
  const { title, description, startDate, endDate, status, rounds } = req.body;

  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    await conn.query(
      'UPDATE contests SET title=?, description=?, start_date=?, end_date=?, status=? WHERE id=?',
      [title, description, startDate, endDate, status, contestId]
    );

    // Remove old rounds & questions
    const [oldRounds] = await conn.query('SELECT id, type FROM rounds WHERE contest_id=?', [contestId]);
    for (const r of oldRounds) {
      if (r.type === 'quiz') await conn.query('DELETE FROM quiz_questions WHERE round_id=?', [r.id]);
      if (r.type === 'coding') await conn.query('DELETE FROM coding_questions WHERE round_id=?', [r.id]);
    }
    await conn.query('DELETE FROM rounds WHERE contest_id=?', [contestId]);

    // Insert updated rounds & questions
    for (const round of rounds) {
      const [roundResult] = await conn.query(
        'INSERT INTO rounds (contest_id, round_name, type, duration) VALUES (?, ?, ?, ?)',
        [contestId, round.round_name, round.type, round.duration]
      );
      const roundId = roundResult.insertId;

      if (round.type === 'quiz') {
        for (const q of round.questions) {

          await conn.query(
            'INSERT INTO quiz_questions (round_id, text, option_1, option_2, option_3, option_4, correct_index) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [roundId, q.text, q.option_1, q.option_2, q.option_3, q.option_4, q.correct_index]
          );

        }
      } else if (round.type === 'coding') {
        for (const q of round.questions) {
                    await conn.query(
              // ✅ Updated to include test case 2
            `INSERT INTO coding_questions 
              (round_id, title, description, input_format, output_format, 
              sample_input, sample_output, sample_input_2, sample_output_2) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              roundId,
              q.title,
              q.description,
              q.input_format,
              q.output_format,
              q.sample_input,
              q.sample_output,
              q.sample_input_2 || null,
              q.sample_output_2 || null
            ]
          );
        }
      }
    }

    await conn.commit();
    conn.release();
    res.json({ success: true });

  } catch (err) {
    await conn.rollback();
    conn.release();
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// Delete contest along with rounds and questions
router.delete('/:id', async (req, res) => {
  const contestId = req.params.id;
  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    // Get all rounds for this contest
    const [rounds] = await conn.query('SELECT id, type FROM rounds WHERE contest_id=?', [contestId]);

    for (const r of rounds) {
      if (r.type === 'quiz') {
        await conn.query('DELETE FROM quiz_questions WHERE round_id=?', [r.id]);
      } else if (r.type === 'coding') {
        await conn.query('DELETE FROM coding_questions WHERE round_id=?', [r.id]);
      }
    }

    // Delete rounds
    await conn.query('DELETE FROM rounds WHERE contest_id=?', [contestId]);

    // Delete contest
    await conn.query('DELETE FROM contests WHERE id=?', [contestId]);

    await conn.commit();
    conn.release();
    res.json({ success: true });
  } catch (err) {
    await conn.rollback();
    conn.release();
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});



// Get quiz questions for a specific round
router.get('/:contestId/round/:roundId/quiz', async (req, res) => {
  const { contestId, roundId } = req.params;
  try {
    // Verify round belongs to contest and is a quiz
    const [roundRows] = await db.query(
      'SELECT * FROM rounds WHERE id=? AND contest_id=? AND type="quiz"',
      [roundId, contestId]
    );

    if (!roundRows.length) return res.status(404).json({ error: 'Quiz round not found' });

    const [questions] = await db.query(
      'SELECT * FROM quiz_questions WHERE round_id=?',
      [roundId]
    );

    // Transform questions for UI
    const transformedQuestions = questions.map(q => ({
      id: q.id,
      question: q.text,
      options: [q.option_1, q.option_2, q.option_3, q.option_4],
      correctAnswerIndex: q.correct_index
    }));

    // Optional: group by categories (e.g., round_name or logic)
    res.json({
      title: roundRows[0].round_name,
      duration: roundRows[0].duration, // <-- Send duration in minutes
      questions: transformedQuestions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



// ✅ Get coding questions for a specific round
router.get('/:contestId/round/:roundId/coding', async (req, res) => {
  const { contestId, roundId } = req.params;
  try {
    // Verify round belongs to contest and is a coding round
    const [roundRows] = await db.query(
      'SELECT * FROM rounds WHERE id=? AND contest_id=? AND type="coding"',
      [roundId, contestId]
    );

    if (!roundRows.length)
      return res.status(404).json({ error: 'Coding round not found' });

    // Get coding questions for that round
    const [questions] = await db.query(
      'SELECT * FROM coding_questions WHERE round_id=?',
      [roundId]
    );

    // Transform question for frontend
    const transformedQuestions = questions.map((q) => ({
      id: q.id,
      title: q.title,
      description: q.description,
      inputFormat: q.input_format,
      outputFormat: q.output_format,
      sampleInput: q.sample_input,
      sampleOutput: q.sample_output,
      sampleInput2: q.sample_input_2,   // ✅
      sampleOutput2: q.sample_output_2  // ✅
    }));

    res.json({
      title: roundRows[0].round_name,
      duration: roundRows[0].duration,
      questions: transformedQuestions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});




// ✅ Add participant when starting contest
router.post('/:contestId/join', async (req, res) => {
  const contestId = req.params.contestId;
  const { userId } = req.body;

  try {
    await db.query(
      'INSERT INTO participants (contest_id, user_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE joined_at=joined_at',
      [contestId, userId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// ✅ Get participants for a contest
router.get('/:contestId/participants', async (req, res) => {
  const contestId = req.params.contestId;

  try {
    const [rows] = await db.query(
      `SELECT u.id, u.name, u.email, u.profile_photo,  p.joined_at , p.submitted_at
       FROM participants p
       JOIN users u ON p.user_id = u.id
       WHERE p.contest_id = ?
        ORDER BY p.joined_at DESC`, // optional: newest first
      [contestId]
    );

    // ✅ Convert LONGBLOB or URL into avatar (like users API)
    const participants = rows.map((user) => {
      let avatar = null;

      if (user.profile_photo) {
        if (Buffer.isBuffer(user.profile_photo)) {
          // Case: Binary photo from DB
          avatar = `data:image/jpeg;base64,${user.profile_photo.toString("base64")}`;
        } else if (typeof user.profile_photo === "string" && user.profile_photo.startsWith("http")) {
          // Case: Already URL (Google / other)
          avatar = user.profile_photo;
        }
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar,
        joined_at: user.joined_at,
        submitted_at: user.submitted_at,
      };
    });

    res.json(participants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// POST /api/quiz_submissions
router.post('/quiz_submissions', async (req, res) => {
  const { contest_id, round_id, user_id, answers, score } = req.body;

  if (!contest_id || !round_id || !user_id || !answers) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const [existing] = await db.query(
      "SELECT id FROM quiz_submissions WHERE user_id = ? AND round_id = ?",
      [user_id, round_id]
    );

    if (existing.length > 0) {
      // Update existing record (if user re-submits)
      await db.query(
        `UPDATE quiz_submissions
         SET answers = ?, score = ?, submitted_at = CURRENT_TIMESTAMP
         WHERE user_id = ? AND round_id = ?`,
        [JSON.stringify(answers), score, user_id, round_id]
      );
      return res.json({ message: "Submission updated successfully" });
    } else {
      // Insert new record
      await db.query(
        `INSERT INTO quiz_submissions (contest_id, round_id, user_id, answers, score)
         VALUES (?, ?, ?, ?, ?)`,
        [contest_id, round_id, user_id, JSON.stringify(answers), score]
      );
      return res.status(201).json({ message: "Submission saved successfully" });
    }
  } catch (err) {
    console.error("Error saving quiz submission:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// POST /api/coding_submissions
router.post('/coding_submissions', async (req, res) => {
  const {
    contest_id,
    round_id,
    user_id,
    question_id,
    code,
    language,
    auto_score,
  } = req.body;

  if (!contest_id || !round_id || !user_id || !question_id || !code) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // prevent duplicate: update if exists
    const [existing] = await db.query(
      "SELECT id FROM coding_submissions WHERE user_id=? AND question_id=?",
      [user_id, question_id]
    );

    if (existing.length > 0) {
      await db.query(
        `UPDATE coding_submissions
         SET code=?, language=?, auto_score=?, manual_score=0, status='pending', submitted_at=CURRENT_TIMESTAMP
         WHERE user_id=? AND question_id=?`,
        [code, language, auto_score, user_id, question_id]
      );
      return res.json({ message: "Submission updated successfully" });
    }

    await db.query(
      `INSERT INTO coding_submissions
       (contest_id, round_id, user_id, question_id, code, language, auto_score, manual_score, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, 'pending')`,
      [contest_id, round_id, user_id, question_id, code, language, auto_score]
    );

    res.status(201).json({ message: "Submission saved successfully" });
  } catch (err) {
    console.error("Error saving coding submission:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Get all coding submissions (for admin review)
router.get('/coding_submissions/all', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        MAX(cs.id) AS id,
        cs.contest_id,
        cs.user_id,
        u.name AS username,
        c.title AS contestTitle,
        MAX(cs.submitted_at) AS latestSubmission,
        p.joined_at,
        TIMESTAMPDIFF(MINUTE, p.joined_at, MAX(p.submitted_at)) AS timeSpent,
        COUNT(DISTINCT cs.question_id) AS totalQuestionsSubmitted,
        GROUP_CONCAT(DISTINCT cs.language) AS languagesUsed,
        AVG(cs.auto_score) AS avgAutoScore,
        AVG(cs.manual_score) AS avgManualScore,
        MAX(cs.status) AS latestStatus,
        -- ✅ Average quiz score across all rounds in the same contest
        IFNULL(ROUND(AVG(qs.score), 2), 0) AS quiz_score,
        p.status AS participantStatus,
        p.review_status AS reviewStatus
      FROM coding_submissions cs
      JOIN users u ON cs.user_id = u.id
      JOIN contests c ON cs.contest_id = c.id
      JOIN participants p ON p.user_id = cs.user_id AND p.contest_id = cs.contest_id
      AND p.status = 'completed'  -- ✅ only completed participants
      LEFT JOIN quiz_submissions qs 
        ON qs.user_id = cs.user_id AND qs.contest_id = cs.contest_id
      GROUP BY cs.user_id, cs.contest_id
      ORDER BY latestSubmission DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching coding submissions:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Get coding submissions of a user for a contest (with user & contest info)
router.get('/coding_submissions/byUserAndContest', async (req, res) => {
  const { contestId, userId } = req.query;

  if (!contestId || !userId) {
    return res.status(400).json({ message: "Missing contestId or userId" });
  }

  try {
    // 1️⃣ Fetch user details
    // const [userRows] = await db.query(
    //   "SELECT id, name, email, profile_photo FROM users WHERE id = ?",
    //   [userId]
    // );
    const [userRows] = await db.query(
      "SELECT id, name, email, profile_photo FROM users WHERE id = ?",
      [userId]
    );
    if (!userRows.length) return res.status(404).json({ message: "User not found" });
    const user = userRows[0];

    let avatar = null;
    if (user.profile_photo) {
      if (Buffer.isBuffer(user.profile_photo)) {
        avatar = `data:image/jpeg;base64,${user.profile_photo.toString("base64")}`;
      } else if (typeof user.profile_photo === "string" && user.profile_photo.startsWith("http")) {
        avatar = user.profile_photo;
      }
    }
    user.avatar = avatar; // 👈 use same property name as other API
    delete user.profile_photo;


    // 2️⃣ Fetch contest info
    const [contestRows] = await db.query(
      "SELECT id, title, description, start_date AS start_time, end_date AS end_time FROM contests WHERE id = ?",
      [contestId]
    );
    if (!contestRows.length) return res.status(404).json({ message: "Contest not found" });
    const contest = contestRows[0];

    // 3️⃣ Fetch all coding submissions for that user & contest
    const [submissions] = await db.query(
      `SELECT 
        cs.id,
        cs.contest_id,
        cs.round_id,
        cs.question_id,
        cq.title AS question_title,
        cq.description AS problem_statement,
        cq.sample_input,
        cq.sample_output,
        cs.code,
        cs.language,
        cs.auto_score,
        cs.manual_score,
        cs.feedback,
        cs.submitted_at
       FROM coding_submissions cs
       JOIN coding_questions cq ON cs.question_id = cq.id
       WHERE cs.contest_id = ? AND cs.user_id = ?
       ORDER BY cs.submitted_at ASC`,
      [contestId, userId]
    );

    // 4️⃣ Parse JSON test_results if stored as string
    const formattedSubs = submissions.map((s) => ({
      ...s,
      test_results:
        typeof s.test_results === "string" && s.test_results.trim() !== ""
          ? JSON.parse(s.test_results)
          : [],
    }));

    res.json({
      user,
      contest,
      submissions: formattedSubs,
    });
  } catch (err) {
    console.error("Error fetching submission details:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// ✅ Update manual score & feedback for coding submission
router.put("/coding_submissions/:id", async (req, res) => {
  const { id } = req.params;
  let { manual_score, feedback } = req.body;

  try {
    // Convert manual_score safely
    if (manual_score === "" || manual_score === null || manual_score === undefined) {
      manual_score = null;
    } else {
      manual_score = parseFloat(manual_score);
    }

    await db.query(
      `UPDATE coding_submissions 
       SET manual_score = ?, feedback = ?, status = 'reviewed' 
       WHERE id = ?`,
      [manual_score, feedback, id]
    );

    // 2️⃣ Find contest_id and user_id of this submission
    const [[submission]] = await db.query(
      `SELECT contest_id, user_id FROM coding_submissions WHERE id = ?`,
      [id]
    );
    const { contest_id, user_id } = submission;

    // 3️⃣ Check if all submissions for this user & contest are reviewed
    const [pending] = await db.query(
      `SELECT COUNT(*) AS pendingCount 
       FROM coding_submissions 
       WHERE contest_id = ? AND user_id = ? AND status  != 'reviewed'`,
      [contest_id, user_id]
    );

    if (pending[0].pendingCount === 0) {
      // ✅ All submissions reviewed, mark participant as completed
      await db.query(
        `UPDATE participants 
         SET review_status  = 'reviewed' 
         WHERE contest_id = ? AND user_id = ?`,
        [contest_id, user_id]
      );
    }


    res.json({ message: "Submission updated successfully" });
  } catch (err) {
    console.error("Error updating submission:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// Mark contest as completed for a user
router.post('/participants/complete', async (req, res) => {
  const { contestId, userId } = req.body;

  if (!contestId || !userId) {
    return res.status(400).json({ message: 'Missing contestId or userId' });
  }

  try {
    const [result] = await db.execute(
      `UPDATE participants SET status = 'completed',
      submitted_at = NOW() 
       WHERE contest_id = ? AND user_id = ?`,
      [contestId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    res.json({ message: 'Contest marked as completed!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});





//.................api to get contest results......

function calculateDuration(joinedAt, submittedAt) {
  if (!joinedAt || !submittedAt) return "-";
  const diffMs = new Date(submittedAt) - new Date(joinedAt);
  if (diffMs < 0) return "-";
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${minutes}m`;
}


// GET: /api/contests/results/:contestId?type=quiz|coding|both
router.get("/results/:contestId", async (req, res) => {
  const { contestId } = req.params;
  const type = req.query.type || "quiz"; // fallback

  try {
    // 1️⃣ Get contest info
    const [contestRows] = await db.query(
      "SELECT * FROM contests WHERE id = ?",
      [contestId]
    );

    if (!contestRows.length) {
      return res.status(404).json({ message: "Contest not found" });
    }

    const contest = contestRows[0];

    // 2️⃣ Get participants
    const [participants] = await db.query(
      `SELECT u.id, u.name, u.email, u.profile_photo, p.joined_at, p.submitted_at
       FROM participants p
       JOIN users u ON p.user_id = u.id
       WHERE p.contest_id = ?`,
      [contestId]
    );

    const results = [];

    for (const user of participants) {
      let quizPercentage = null;
      let codingPercentage = null;
      let finalScore = 0;

      // Fetch quiz score
      const [quizRes] = await db.query(
        `SELECT AVG(score) AS quiz_percentage
         FROM quiz_submissions
         WHERE contest_id=? AND user_id=?`,
        [contestId, user.id]
      );
      quizPercentage = Number(quizRes[0]?.quiz_percentage) || 0;

      // Fetch coding score
      const [codeRes] = await db.query(
        `SELECT AVG(COALESCE(manual_score, auto_score)) AS coding_percentage
         FROM coding_submissions
         WHERE contest_id=? AND user_id=?`,
        [contestId, user.id]
      );
      codingPercentage = Number(codeRes[0]?.coding_percentage) || 0;

      // Calculate final score based on contest type
      if (type === "quiz") {
        finalScore = quizPercentage;
      } else if (type === "coding") {
        finalScore = codingPercentage;
      } else if (type === "both") {
        // ✅ Equal weightage (50% quiz, 50% coding)
        finalScore = (quizPercentage + codingPercentage) / 2;
      }

      results.push({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.profile_photo
          ? `data:image/jpeg;base64,${user.profile_photo.toString("base64")}`
          : null,
        quizPercentage: quizPercentage.toFixed(2),
        codingPercentage: codingPercentage.toFixed(2),
        score: parseFloat(finalScore.toFixed(2)),
        submittedAt: user.submitted_at,
        totalMarks: 100,
        time: calculateDuration(user.joined_at, user.submitted_at),
      });
    }

    // Sort & rank
    results.sort((a, b) => b.score - a.score);

    // Prepare meta info for header
    const meta = {
      title: contest.title,
      stats: {
        participants: participants.length,
        submissions: results.filter((r) => r.score > 0).length,
        status: contest.status,
        problems: "-", // optional, you can query total questions here
      },
    };

    res.json({
      type,
      meta,
      leaders: results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});




module.exports = router;
