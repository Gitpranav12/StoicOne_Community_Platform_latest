const db = require('../db');

// Create new question
exports.createQuestion = ({ user_id, title, bodyHtml, bodyText, tags, author, time }) =>
  db.execute(
    'INSERT INTO questions (user_id, title, bodyHtml, bodyText, tags, author, time) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [user_id, title, bodyHtml, bodyText, JSON.stringify(tags), author, time]
  );

// Get all questions
exports.getAllQuestions = () =>
  db.execute('SELECT * FROM questions ORDER BY createdAt DESC');

// Get one question by id
exports.getQuestionById = (id) =>
  db.execute('SELECT * FROM questions WHERE id = ?', [id]);

exports.getRecentQuestions = () =>
  db.execute('SELECT * FROM questions ORDER BY createdAt DESC LIMIT 5');

// Add this at the end of questionModel.js
exports.getAllTags = async () => {
  const [rows] = await db.execute('SELECT name FROM tags ORDER BY name');
  return rows.map(r => r.name);
};

exports.getAnswersByQuestionAndUser = (question_id, user_id) =>
  db.execute(
    "SELECT * FROM answers WHERE question_id = ? AND user_id = ?",
    [question_id, user_id]
  );


// --- ANSWERS ---
exports.addAnswer = ({ user_id, question_id, author, content }) =>
  db.execute(
    'INSERT INTO answers (user_id, question_id, author, content) VALUES (?, ?, ?, ?)',
    [user_id, question_id, author, content]
  );

exports.getAnswersByQuestion = (question_id) =>
  db.execute('SELECT * FROM answers WHERE question_id = ? ORDER BY createdAt ASC', [question_id]);

// --- COMMENTS ---
exports.addComment = ({ question_id, user_id, author, content }) =>
  db.execute(
    'INSERT INTO comments (question_id, user_id, author, content) VALUES (?, ?, ?, ?)',
    [question_id, user_id, author, content]
  );

exports.getCommentsByQuestion = (question_id) =>
  db.execute('SELECT * FROM comments WHERE question_id = ? ORDER BY createdAt ASC', [question_id]);

// --- VOTES ---
exports.voteQuestion = async ({ question_id, voter, vote_type }) => {
  // Upsert logic: if vote exists, update, else insert
  await db.execute(
    'INSERT INTO question_votes (question_id, voter, vote_type) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE vote_type = ?',
    [question_id, voter, vote_type, vote_type]
  );
  // Count votes
  const [rows] = await db.execute(
    'SELECT SUM(vote_type) as votes FROM question_votes WHERE question_id = ?',
    [question_id]
  );
  // Update main question votes field
  await db.execute('UPDATE questions SET votes = ? WHERE id = ?', [rows[0].votes || 0, question_id]);
  return rows[0].votes || 0;
};

exports.getQuestionVotes = async (question_id) => {
  const [rows] = await db.execute(
    'SELECT SUM(vote_type) as votes FROM question_votes WHERE question_id = ?',
    [question_id]
  );
  return rows[0].votes || 0;
};

// Increment views by 1 for each question detail fetch
exports.incViews = (id) =>
  db.execute('UPDATE questions SET views = views + 1 WHERE id = ?', [id]);

// Increment answer count on question
exports.incAnswers = (question_id) =>
  db.execute('UPDATE questions SET answers = answers + 1 WHERE id = ?', [question_id]);


// Fix getAllTags to fetch correctly
exports.getAllTags = async () => {
  const [rows] = await db.execute("SELECT DISTINCT tag FROM tags ORDER BY tag");
  return rows.map(r => r.tag);
};

// .............Added by Raj Thakre ..........
// Increment tagspage counts for a list of tags
exports.incrementTagCounts = async (tags) => {
  if (!tags || tags.length === 0) return;

  for (let tagName of tags) {
    await db.execute(
      `UPDATE tagspage
       SET questions_count = questions_count + 1,
           questions_today = questions_today + 1,
           questions_week = questions_week + 1
       WHERE name = ?`,
      [tagName]
    );
  }
};

// .............Added by Raj Thakre ..........
// Delete question by id
exports.deleteQuestion = (id) =>
  db.execute('DELETE FROM questions WHERE id = ?', [id]);

// .............Added by Raj Thakre ..........
// Add a flag to a question
exports.flagQuestion = ({ question_id, flagged_by, reason }) =>
  db.execute(
    'INSERT INTO question_flags (question_id, flagged_by, reason) VALUES (?, ?, ?)',
    [question_id, flagged_by, reason || null]
  );

// .............Added by Raj Thakre ..........
// Optional: get flags for a question
exports.getQuestionFlags = (question_id) =>
  db.execute('SELECT * FROM question_flags WHERE question_id = ?', [question_id]);

// Set flagged = 1 for a question
exports.setFlagged = (question_id) =>
  db.execute('UPDATE questions SET flagged = 1 WHERE id = ?', [question_id]);
// Update flagged status and reason in questions table
exports.updateFlagStatus = (question_id, reason) =>
  db.execute(
    'UPDATE questions SET flagged = 1, flag_reason = ? WHERE id = ?',
    [reason, question_id]
  );

// Remove flag from question_flags
exports.unflagQuestion = async (question_id, flagged_by) => {
  const sql = `DELETE FROM question_flags WHERE question_id = ? AND flagged_by = ?`;
  return db.execute(sql, [question_id, flagged_by]);
};

// Update main questions table
exports.update = async (id, fields) => {
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const setString = keys.map((key) => `${key} = ?`).join(", ");
  const sql = `UPDATE questions SET ${setString} WHERE id = ?`;
  return db.execute(sql, [...values, id]);
};

// .............Added by Raj Thakre ..........
// Delete answer by id
exports.deleteAnswer = (id) =>
  db.execute('DELETE FROM answers WHERE id = ?', [id]);


// Fetch single answer by id
exports.getAnswerById = (id) =>
  db.execute('SELECT * FROM answers WHERE id = ?', [id]);

// Decrement answer count
exports.decAnswers = (question_id) =>
  db.execute('UPDATE questions SET answers = GREATEST(answers - 1, 0) WHERE id = ?', [question_id]);

// .............Added by Pranav Jawarkar ..........
// Get user's vote on a question
exports.getUserVote = (question_id, voter) =>
  db.execute(
    'SELECT vote_type FROM question_votes WHERE question_id = ? AND voter = ?',
    [question_id, voter]
  );
// .............Added by Pranav Jawarkar ..........
  // Update answer content by ID
exports.updateAnswer = (id, fields) => {
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const setString = keys.map((key) => `${key} = ?`).join(", ");
  const sql = `UPDATE answers SET ${setString} WHERE id = ?`;
  return db.execute(sql, [...values, id]);
};
