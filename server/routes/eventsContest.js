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
            'INSERT INTO coding_questions (round_id, title, description, input_format, output_format, sample_input, sample_output) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [roundId, q.title, q.description, q.input_format, q.output_format, q.sample_input, q.sample_output]
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
          sample_output: q.sample_output
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
  try {
    // Include participant count in the main query
    const [contestRows] = await db.query(`
      SELECT 
        c.*, 
        COUNT(p.id) AS participants
      FROM contests c
      LEFT JOIN participants p ON c.id = p.contest_id
      GROUP BY c.id
      ORDER BY c.start_date DESC
    `);

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
            'INSERT INTO coding_questions (round_id, title, description, input_format, output_format, sample_input, sample_output) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [roundId, q.title, q.description, q.input_format, q.output_format, q.sample_input, q.sample_output]
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
      `SELECT u.id, u.name, u.email, u.profile_photo,  p.joined_at
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





//.................api to get contest results......

// GET: /api/contests/results/:contestId?type=quiz|coding|both
// router.get("/results/:contestId", async (req, res) => {
//   const { contestId } = req.params;
//   const type = req.query.type || "quiz"; // fallback

//   try {
//     // 1️⃣ Get contest info
//     const [contestRows] = await db.query(
//       "SELECT * FROM contests WHERE id = ?",
//       [contestId]
//     );

//     if (!contestRows.length) {
//       return res.status(404).json({ message: "Contest not found" });
//     }

//     const contest = contestRows[0];

//     // 2️⃣ Get participants
//     const [participants] = await db.query(
//       `SELECT u.id, u.name, u.email, u.profile_photo
//        FROM participants p
//        JOIN users u ON p.user_id = u.id
//        WHERE p.contest_id = ?`,
//       [contestId]
//     );

//     const results = [];

//     for (const user of participants) {
//       let quizPercentage = null;
//       let codingPercentage = null;
//       let finalScore = 0;

//       // Fetch quiz score
//       const [quizRes] = await db.query(
//         `SELECT AVG(score) AS quiz_percentage
//          FROM quiz_submissions
//          WHERE contest_id=? AND user_id=?`,
//         [contestId, user.id]
//       );
//       quizPercentage = quizRes[0]?.quiz_percentage || 0;

//       // Fetch coding score
//       const [codeRes] = await db.query(
//         `SELECT AVG(COALESCE(manual_score, auto_score)) AS coding_percentage
//          FROM coding_submissions
//          WHERE contest_id=? AND user_id=?`,
//         [contestId, user.id]
//       );
//       codingPercentage = codeRes[0]?.coding_percentage || 0;

//       // Calculate final score based on contest type
//       if (type === "quiz") {
//         finalScore = quizPercentage;
//       } else if (type === "coding") {
//         finalScore = codingPercentage;
//       } else if (type === "both") {
//         // ✅ Equal weightage (50% quiz, 50% coding)
//         finalScore = (quizPercentage + codingPercentage) / 2;
//       }

//       results.push({
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         avatar: user.profile_photo
//           ? `data:image/jpeg;base64,${user.profile_photo.toString("base64")}`
//           : null,
//         quizPercentage: quizPercentage.toFixed(2),
//         codingPercentage: codingPercentage.toFixed(2),
//         score: parseFloat(finalScore.toFixed(2)),
//         submittedAt: new Date(),
//         totalMarks: 100,
//         time: "-",
//       });
//     }

//     // Sort & rank
//     results.sort((a, b) => b.score - a.score);

//     // Prepare meta info for header
//     const meta = {
//       title: contest.title,
//       stats: {
//         participants: participants.length,
//         submissions: results.filter((r) => r.score > 0).length,
//         status: contest.status,
//         problems: "-", // optional, you can query total questions here
//       },
//     };

//     res.json({
//       type,
//       meta,
//       leaders: results,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });




module.exports = router;
