const pool = require("../db");

// 🔹 Update achievements for a given user
async function updateAchievements(userId) {
  // Count stats
  const [[{ qCount }]] = await pool.query(
    "SELECT COUNT(*) AS qCount FROM questions WHERE user_id=?",
    [userId]
  );
  const [[{ aCount }]] = await pool.query(
    "SELECT COUNT(*) AS aCount FROM answers WHERE user_id=?",
    [userId]
  );
  const [[{ cCount }]] = await pool.query(
    `SELECT COUNT(*) AS cCount
   FROM comments c
   JOIN questions q ON c.question_id = q.id
   WHERE q.user_id = ?`,
    [userId]
  );
  const [[{ qViews }]] = await pool.query(
    "SELECT COALESCE(MAX(views),0) AS qViews FROM questions WHERE user_id = ?",
    [userId]
  );


  // 🔹 Badge rules with descriptions
  const badgesRules = [
    { name: "Participation", type: "questions", requirement: 3, description: "3 questions asked" },
    { name: "Curious Mind", type: "questions", requirement: 10, description: "10 questions asked" },
    { name: "Researcher", type: "questions", requirement: 50, description: "50 questions asked" },
    { name: "Helping Hand", type: "answers", requirement: 3, description: "3 answers given" },
    { name: "Top Contributor", type: "answers", requirement: 10, description: "10 answers given" },
    { name: "Bronze", type: "answers", requirement: 20, description: "20 answers given" },
    { name: "Silver", type: "answers", requirement: 50, description: "50 answers given" },
    { name: "Gold", type: "answers", requirement: 100, description: "100 answers given" },
    { name: "Diamond", type: "answers", requirement: 500, description: "500 answers given" },
    { name: "Community Engagement", type: "comments", requirement: 10, description: "10 comments made" },
    { name: "Contribution", type: "comments", requirement: 20, description: "20 comments made" },
    { name: "Supportive", type: "comments", requirement: 50, description: "50 comments made" },
    { name: "Helping Community", type: "comments", requirement: 100, description: "100 comments made" },
    { name: "Popular Question", type: "views", requirement: 1000, description: "Question reached 1000 views" },
  ];

  const badgesWithProgress = [];

  for (const badge of badgesRules) {
    let achieved = false;
    let progress = 0;

    switch (badge.type) {
      case "questions":
        achieved = qCount >= badge.requirement;
        progress = Math.min(100, Math.floor((qCount / badge.requirement) * 100));
        break;
      case "answers":
        achieved = aCount >= badge.requirement;
        progress = Math.min(100, Math.floor((aCount / badge.requirement) * 100));
        break;
      case "comments":
        achieved = cCount >= badge.requirement;
        progress = Math.min(100, Math.floor((cCount / badge.requirement) * 100));
        break;
      case "views":
        achieved = qViews >= badge.requirement;
        progress = Math.min(100, Math.floor((qViews / badge.requirement) * 100));
        break;
    }

    // 🔹 Update badge in DB
    const [result] = await pool.query(
      `UPDATE badges 
   SET achieved=?, achievedAt=IF(achieved=0 AND ?=1, NOW(), achievedAt) 
   WHERE user_id=? AND name=?`,
      [achieved, achieved, userId, badge.name]
    );

    // If achieved just now → insert notification
    if (achieved) {
      await pool.query(
        `INSERT INTO notifications (user_id, type, title, description, points)
     VALUES (?, 'badge', ?, ?, ?)
     ON DUPLICATE KEY UPDATE createdAt = createdAt`,
        [userId, badge.name, badge.description, 10]
      );
    } else {
      await pool.query(
        `DELETE FROM notifications WHERE user_id=? AND type='badge' AND title=?`,
        [userId, badge.name]
      );
    }

    badgesWithProgress.push({ ...badge, achieved, progress });
  }

  // 🔹 Milestones rules with descriptions
  const milestonesRules = [
    { name: "Contributor", type: "answers", requirement: 100, description: "100 answers given" },
    { name: "Mentor", type: "answers", requirement: 500, description: "500 answers given" },
    { name: "Expert", type: "answers", requirement: 1000, description: "1000 answers given" },
    { name: "Elite", type: "answers", requirement: 10000, description: "10000 answers given" },
    { name: "Explorer", type: "questions", requirement: 100, description: "100 questions asked" },
    { name: "Innovator", type: "questions", requirement: 1000, description: "1000 questions asked" },
    { name: "Victory", type: "badges", requirement: 10, description: "10 badges achieved" },
    { name: "Master", type: "comments", requirement: 500, description: "500 comments made" },
  ];

  const milestonesWithProgress = [];

  for (const ms of milestonesRules) {
    let achieved = false;
    let progress = 0;

    switch (ms.type) {
      case "answers":
        achieved = aCount >= ms.requirement;
        progress = Math.min(100, Math.floor((aCount / ms.requirement) * 100));
        break;
      case "questions":
        achieved = qCount >= ms.requirement;
        progress = Math.min(100, Math.floor((qCount / ms.requirement) * 100));
        break;
      case "badges": {
        const [[{ badgeCount }]] = await pool.query(
          "SELECT COUNT(*) AS badgeCount FROM badges WHERE user_id=? AND achieved=1",
          [userId]
        );
        achieved = badgeCount >= ms.requirement;
        progress = Math.min(100, Math.floor((badgeCount / ms.requirement) * 100));
        break;
      }
      case "comments":
        achieved = cCount >= ms.requirement;
        progress = Math.min(100, Math.floor((cCount / ms.requirement) * 100));
        break;
    }

    // 🔹 Update milestone in DB
    const [msResult] = await pool.query(
      `UPDATE milestones 
   SET achieved=?, achievedAt=IF(achieved=0 AND ?=1, NOW(), achievedAt) 
   WHERE user_id=? AND name=?`,
      [achieved, achieved, userId, ms.name]
    );

    // If achieved just now → insert notification
    if (achieved) {
      await pool.query(
        `INSERT INTO notifications (user_id, type, title, description, points)
     VALUES (?, 'milestone', ?, ?, ?)
     ON DUPLICATE KEY UPDATE createdAt = createdAt`,
        [userId, ms.name, ms.description, 50]
      );
    } else {
      await pool.query(
        `DELETE FROM notifications WHERE user_id=? AND type='milestone' AND title=?`,
        [userId, ms.name]
      );
    }

    milestonesWithProgress.push({ ...ms, achieved, progress });
  }

  return { badges: badgesWithProgress, milestones: milestonesWithProgress };
}

module.exports = updateAchievements;
