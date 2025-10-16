const Question = require('../models/questionModel');
const updateAchievements = require('../services/updateAchievements');
const pool = require("../db");


// .............commented by Raj Thakre ..........

// exports.create = async (req, res) => {
//   try {
//     const { user_id, title, bodyHtml, bodyText, tags, author, time } = req.body;
//     const [result] = await Question.createQuestion({ user_id, title, bodyHtml, bodyText, tags, author, time });
//     await Question.upsertTags(user_id, tags);

//     res.json({ id: result.insertId });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// .............Added by Raj Thakre ..........

// .............Updated Logic By Pranav Jawarkar ..........
exports.create = async (req, res) => {
  try {
    let { user_id, title, bodyHtml, bodyText, tags, author, time } = req.body;

    // Basic sanity checks and defaults
    user_id = user_id || null;
    title = (typeof title === "string" && title.trim()) || "Untitled question";
    bodyHtml = bodyHtml || "";
    bodyText = bodyText || "";
    author = (typeof author === "string" && author.trim()) || "Guest";
    time = (typeof time === "string" && time.trim()) || "Just now";

    // Ensure tags is always an array
    const safeTags = Array.isArray(tags) ? tags : [];

    console.log("Inserting question:", {
      user_id,
      title,
      bodyHtml,
      bodyText,
      tags: safeTags,
      author,
      time,
    });

    const [result] = await Question.createQuestion({
      user_id,
      title,
      bodyHtml,
      bodyText,
      tags: safeTags,
      author,
      time,
    });

    await updateAchievements(user_id);
    await Question.incrementTagCounts(safeTags);

    res.json({ id: result.insertId });
  } catch (err) {
    console.error("Create question error:", err);
    res.status(500).json({ error: err.message });
  }
};



exports.list = async (req, res) => {
  try {
    const [questions] = await Question.getAllQuestions();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

 // .............Added by Pranav Jawarkar 29 sep ..........
exports.detail = async (req, res) => {
  try {
    const { id } = req.params;
    const incViews = req.query.incViews === "true"; // check query param

    if (incViews) {
      await Question.incViews(id);
    }

    const [rows] = await Question.getQuestionById(id);
    if (rows.length === 0) return res.status(404).json({ error: 'Question not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.recent = async (req, res) => {
  try {
    const [questions] = await Question.getRecentQuestions();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add this function in questionController.js
exports.allTags = async (req, res) => {
  try {
    const tags = await Question.getAllTags();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// --- ANSWERS ---
exports.addAnswer = async (req, res) => {
  try {
    const { user_id, question_id, author, content } = req.body;

    // Check how many answers user has posted for this question
    const [existingAnswers] = await Question.getAnswersByQuestionAndUser(question_id, user_id);
    if (existingAnswers.length >= 10) {
      return res.status(400).json({ error: "You can post maximum 10 answers per question." });
    }

    await Question.addAnswer({ user_id, question_id, author, content });
    await Question.incAnswers(question_id);

    // Find question owner
    const [[question]] = await pool.query("SELECT user_id FROM questions WHERE id=?", [question_id]);

    // Insert notification for question owner (skip if same user)
    if (question?.user_id && question.user_id !== user_id) {
      await pool.query(
        "INSERT INTO notificationsQuestions (user_id, type, text, actor, question_id, read_status, createdAt) VALUES (?, ?, ?, ?, ?, 0, NOW())",
        [
          question.user_id, // question owner
          "answer",
          "answered your question",
          author,
          question_id
        ]
      );
    }

    await updateAchievements(user_id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.getAnswersByQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const [answers] = await Question.getAnswersByQuestion(id);
    res.json(answers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- COMMENTS ---
exports.addComment = async (req, res) => {
  try {
    const { question_id, user_id, author, content } = req.body;
    await Question.addComment({ question_id, user_id, author, content });

    // Find question owner
    const [[question]] = await pool.query("SELECT user_id FROM questions WHERE id=?", [question_id]);

    // Insert notification for question owner (skip if same user)
    if (question?.user_id && question.user_id !== user_id) {
      await pool.query(
        "INSERT INTO notificationsQuestions (user_id, type, text, actor, question_id, read_status, createdAt) VALUES (?, ?, ?, ?, ?, 0, NOW())",
        [
          question.user_id,
          "comment",
          "commented on your question",
          author,
          question_id
        ]
      );
    }

    const [[user]] = await pool.query("SELECT id FROM users WHERE name=?", [author]);
    if (user?.id) await updateAchievements(user.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCommentsByQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const [comments] = await Question.getCommentsByQuestion(id);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- VOTES ---
exports.voteQuestion = async (req, res) => {
  try {
    const { question_id, voter, vote_type } = req.body;
    const votes = await Question.voteQuestion({ question_id, voter, vote_type });
    res.json({ votes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getQuestionVotes = async (req, res) => {
  try {
    const { id } = req.params;
    const votes = await Question.getQuestionVotes(id);
    res.json({ votes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//.................................................


// .............Added by Raj Thakre ..........
// Delete a question
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await Question.deleteQuestion(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// .............below code Added by Raj Thakre ..........

// Flag a question
exports.flag = async (req, res) => {
  try {
    const question_id = parseInt(req.params.id);
    const { flagged_by, reason } = req.body;

    // Check if question exists
    const [question] = await Question.getQuestionById(question_id);
    if (question.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Use model function
    await Question.flagQuestion({ question_id, flagged_by, reason });

    // Update flagged status in main table
    await Question.updateFlagStatus(question_id, reason); // <-- create this in model

    res.json({ success: true });
  } catch (err) {
    console.error('Flag question error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Unflag a question
exports.unflag = async (req, res) => {
  try {
    const question_id = parseInt(req.params.id);
    const { unflagged_by } = req.body;

    // Remove from question_flags table
    await Question.unflagQuestion(question_id, unflagged_by);

    // Update main questions table
    await Question.update(question_id, { flagged: 0, flag_reason: null });

    res.json({ success: true });
  } catch (err) {
    console.error("Unflag question error:", err);
    res.status(500).json({ error: err.message });
  }
};

// .............Added by Raj Thakre ..........
// Optional: Get flags for a question
exports.getFlags = async (req, res) => {
  try {
    const { id } = req.params;
    const [flags] = await Question.getQuestionFlags(id);
    res.json(flags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// .............Added by Raj Thakre ..........
// Delete an answer
// exports.deleteAnswer = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Question.deleteAnswer(id);
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
// .............Added by Pranav Jawarkar 27 sep ..........
exports.deleteAnswer = async (req, res) => {
  try {
    const { id } = req.params;

    // First fetch the question_id of this answer
    const [rows] = await Question.getAnswerById(id);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Answer not found" });
    }
    const questionId = rows[0].question_id;

    // Delete the answer
    await Question.deleteAnswer(id);

    // Decrement the answer count for the parent question
    await Question.decAnswers(questionId);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// .............Added by Pranav Jawarkar 27 sep ..........
// For Edit The Question 
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body; // Expect fields to update such as { title, bodyHtml, ... }
    await Question.update(id, fields);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// .............Added by Pranav Jawarkar 27 sep ..........
// For updating the vote status of user for a particular question
exports.getUserVote = async (req, res) => {
  try {
    const { question_id, voter } = req.query;
    const rows = await Question.getUserVote(question_id, voter);
    if (rows.length > 0) {
      res.json({ vote_type: rows[0].vote_type });
    } else {
      res.json({ vote_type: null });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// .............Added by Pranav Jawarkar 27 sep ..........
// Update an answer content
exports.updateAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "No content provided" });

    await Question.updateAnswer(id, { content });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
