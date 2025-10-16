const pool = require("../db");

async function seedAchievementsForUser(userId) {
  const badgesRules = [
    { name: "Participation", type: "questions", requirement: 3, description: "Asked 3 questions", icon: "/icons/participation.png" },
    { name: "Curious Mind", type: "questions", requirement: 10, description: "Asked 10 questions", icon: "/icons/curiousMind.png" },
    { name: "Researcher", type: "questions", requirement: 50, description: "Asked 50 questions", icon: "/icons/researcher.png" },
    { name: "Helping Hand", type: "answers", requirement: 3, description: "Answered 3 questions", icon: "/icons/helpingHand.png" },
    { name: "Top Contributor", type: "answers", requirement: 10, description: "Answered 10 questions", icon: "/icons/topContributor.png" },
    { name: "Bronze", type: "answers", requirement: 20, description: "Answered 20 questions", icon: "/icons/bronze.png" },
    { name: "Silver", type: "answers", requirement: 50, description: "Answered 50 questions", icon: "/icons/silver.png" },
    { name: "Gold", type: "answers", requirement: 100, description: "Answered 100 questions", icon: "/icons/gold.png" },
    { name: "Diamond", type: "answers", requirement: 500, description: "Answered 500 questions", icon: "/icons/diamond.png" },
    { name: "Community Engagement", type: "comments", requirement: 10, description: "Posted 10 comments", icon: "/icons/communityEngagement.png" },
    { name: "Contribution", type: "comments", requirement: 20, description: "Posted 20 comments", icon: "/icons/contribution.png" },
    { name: "Supportive", type: "comments", requirement: 50, description: "Posted 50 comments", icon: "/icons/supportive.png" },
    { name: "Helping Community", type: "comments", requirement: 100, description: "Posted 100 comments", icon: "/icons/helpingCommunity.png" },
    { name: "Popular Question", type: "views", requirement: 1000, description: "Question received 1000 views", icon: "/icons/popularQuestion.png" },
  ];

  const milestonesRules = [
    { name: "Contributor", type: "answers", requirement: 100, description: "Answered 100 questions", icon: "/icons/contributor.png" },
    { name: "Mentor", type: "answers", requirement: 500, description: "Answered 500 questions", icon: "/icons/mentor.png" },
    { name: "Expert", type: "answers", requirement: 1000, description: "Answered 1000 questions", icon: "/icons/expert.png" },
    { name: "Elite", type: "answers", requirement: 10000, description: "Answered 10000 questions", icon: "/icons/elite.png" },
    { name: "Explorer", type: "questions", requirement: 100, description: "Asked 100 questions", icon: "/icons/explorer.png" },
    { name: "Innovator", type: "questions", requirement: 1000, description: "Asked 1000 questions", icon: "/icons/Innovator.png" },
    { name: "Victory", type: "badges", requirement: 10, description: "Unlocked 10 badges", icon: "/icons/victory.png" },
    { name: "Master", type: "comments", requirement: 500, description: "Posted 500 comments", icon: "/icons/master.png" },
  ];

  // ✅ Generic function to insert or update rules dynamically
  async function upsertRule(table, userId, rule) {
    try {
      const [rows] = await pool.query(
        `SELECT id FROM ${table} WHERE user_id = ? AND name = ?`,
        [userId, rule.name]
      );

      if (rows.length === 0) {
        // 🔹 Insert new rule if not exists
        await pool.query(
          `INSERT INTO ${table} 
            (user_id, name, type, requirement, description, icon, achieved)
           VALUES (?, ?, ?, ?, ?, ?, 0)`,
          [userId, rule.name, rule.type, rule.requirement, rule.description, rule.icon]
        );
      } else {
        // 🔹 Update existing rule fields if changed
        await pool.query(
          `UPDATE ${table} 
             SET type = ?, requirement = ?, description = ?, icon = ?
           WHERE user_id = ? AND name = ?`,
          [rule.type, rule.requirement, rule.description, rule.icon, userId, rule.name]
        );
      }
    } catch (err) {
      console.error(`❌ Error upserting ${rule.name} in ${table}:`, err.message);
    }
  }

  // 🔹 Process badges
  for (const badge of badgesRules) {
    await upsertRule("badges", userId, badge);
  }

  // 🔹 Process milestones
  for (const ms of milestonesRules) {
    await upsertRule("milestones", userId, ms);
  }

  console.log(`✅ Achievements seeded/updated successfully for user ${userId}`);
}

module.exports = seedAchievementsForUser;
