const express = require("express");
const pool = require("../db.js");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const router = express.Router();
const updateAchievements = require('../services/updateAchievements.js')
const seedAchievementsForUser = require('../services/seedAchievementsForUser.js')

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await updateAchievements(id);
        await seedAchievementsForUser(id);
        const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
        if (user.length === 0) return res.status(404).json({ error: "User not found" });

        const [questions] = await pool.query("SELECT * FROM questions WHERE user_id = ?", [id]);

        const [answers] = await pool.query(
            `SELECT a.*, q.title AS questionTitle
            FROM answers a
            JOIN questions q ON a.question_id = q.id
            WHERE a.user_id = ?`,
            [id]
        );

        const [[commentCountRow]] = await pool.query(
            `SELECT COUNT(*) AS cCount
     FROM comments
     WHERE user_id=?`,
            [id]
        );
        const commentsCount = commentCountRow.cCount || 0;

        const [badges] = await pool.query("SELECT * FROM badges WHERE user_id = ?", [id]);

        const [milestones] = await pool.query("SELECT * FROM milestones WHERE user_id = ?", [id]);


        const [[badgeRow]] = await pool.query(
            `SELECT COUNT(*) AS badgeCount
   FROM notifications
   WHERE user_id=? AND type='badge'`,
            [id]
        );

        const badgeCount = badgeRow.badgeCount || 0;
        const badgePoints = badgeCount * 10;

        const [[milestoneRow]] = await pool.query(
            `SELECT COUNT(*) AS milestoneCount
   FROM notifications
   WHERE user_id=? AND type='milestone'`,
            [id]
        );
        const milestoneCount = milestoneRow.milestoneCount || 0;
        const milestonePoints = milestoneCount * 50;


        const qViews = questions.length > 0
            ? Math.max(...questions.map(q => q.views || 0))
            : 0;

        const stats = {
            Badges: badges?.filter(b => b.achieved === 1).length || 0,
            Milestones: milestones?.filter(b => b.achieved === 1).length || 0,
            Questions: questions?.length || 0,
            Answers: answers?.length || 0,
            Comments: commentsCount,
            Contribution: (questions?.length || 0) + (answers?.length || 0),
        };

        const score =
            stats.Badges +
            stats.Milestones +
            stats.Questions +
            stats.Answers +
            stats.Comments +
            badgePoints +
            milestonePoints;

        await pool.query("UPDATE users SET score=? WHERE id=?", [score, id]);

        const reputationLevels = [
            { name: "Champion", min: 10000, icon: "/icons/champion.png" },
            { name: "Legendary", min: 5000, icon: "/icons/legendary.png" },
            { name: "Pro I", min: 4000, icon: "/icons/pro1.png" },
            { name: "Pro II", min: 3000, icon: "/icons/pro2.png" },
            { name: "Pro III", min: 2000, icon: "/icons/pro3.png" },
            { name: "Semi-Pro I", min: 1500, icon: "/icons/semipro1.png" },
            { name: "Semi-Pro II", min: 1000, icon: "/icons/semipro2.png" },
            { name: "Semi-Pro III", min: 500, icon: "/icons/semipro3.png" },
            { name: "Amature I", min: 100, icon: "/icons/amature1.png" },
            { name: "Amature II", min: 50, icon: "/icons/amature2.png" },
            { name: "Amature III", min: 10, icon: "/icons/amature3.png" },
            { name: "New", min: 0, icon: "/icons/new.png" },
        ];


        const getReputationInfo = (score) => {
            let currentLevel = reputationLevels.find((lvl) => score >= lvl.min);
            if (!currentLevel) currentLevel = reputationLevels[reputationLevels.length - 1];

            const currentIndex = reputationLevels.indexOf(currentLevel);
            const nextLevel = reputationLevels[currentIndex - 1] || null;

            let progress = 100;
            if (nextLevel) {
                const range = nextLevel.min - currentLevel.min;
                progress = Math.min(((score - currentLevel.min) / range) * 100, 100);
            }

            return {
                name: currentLevel.name,
                icon: currentLevel.icon,
                score,
                nextLevel: nextLevel ? nextLevel.name : null,
                nextMin: nextLevel ? nextLevel.min : null,
                progress: Math.round(progress),
            };
        };

        const reputation = getReputationInfo(score);
        const [prev] = await pool.query("SELECT reputation_level FROM users WHERE id=?", [id]);
        const prevLevel = prev[0]?.reputation_level || "New";
        if (reputation.name !== prevLevel) {
            await pool.query("UPDATE users SET reputation_level=? WHERE id=?", [reputation.name, id]);
            const currentIndex = reputationLevels.findIndex(l => l.name === reputation.name);
            const prevIndex = reputationLevels.findIndex(l => l.name === prevLevel);
            if (prevIndex === -1 || currentIndex < prevIndex) {
                await pool.query(
                    `INSERT INTO notifications (user_id, type, title, description)
             VALUES (?, 'reputation', ?, ?)`,
                    [
                        id,
                        `Reached ${reputation.name} Level`,
                        `You achieved ${reputation.name} level with ${score} points!`,
                    ]
                );
            }
            else if (currentIndex > prevIndex) {
                await pool.query(
                    `DELETE FROM notifications
             WHERE user_id=? AND type='reputation'`,
                    [id]
                );
            }
        }

        const calculateProgress = (items) =>
            items.map((item) => {
                let progress = 0;
                switch (item.type) {
                    case "questions":
                        progress = Math.min((stats.Questions / item.requirement) * 100, 100);
                        break;
                    case "answers":
                        progress = Math.min((stats.Answers / item.requirement) * 100, 100);
                        break;
                    case "comments":
                        progress = Math.min((stats.Comments / item.requirement) * 100, 100);
                        break;
                    case "views":
                        progress = Math.min((qViews / item.requirement) * 100, 100);
                        break;
                    case "badges":
                        progress = Math.min((stats.Badges / item.requirement) * 100, 100);
                        break;
                }
                return { ...item, progress: parseFloat(progress.toFixed(2)) };
            });

        res.json({
            profile: {
                id: user[0]?.id || null,
                name: user[0]?.name || "Unnamed User",
                avatar: user[0]?.avatar || null,
                designation: user[0]?.designation || "",
                bio: user[0]?.bio || "",
                department: user[0]?.department || "",
                score,
                reputation: getReputationInfo(score),
            },
            account: { email: user[0]?.email || "" },
            stats: stats || {},
            activity: {
                questions: questions || [],
                answers: answers || [],
            },
            achievements: {
                badges: calculateProgress(badges || []),
                milestones: calculateProgress(milestones || []),
            },
        });
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ error: "Server error" });
    }
});


router.put("/:id/profile", async (req, res) => {
    const userId = req.params.id;
    const { name, designation, bio, department, email } = req.body;
    try {
        const fields = [];
        const values = [];
        if (name !== undefined) {
            fields.push("name=?");
            values.push(name);
            await pool.query("UPDATE questions SET author=? WHERE user_id=?", [name, userId]);
            await pool.query("UPDATE answers SET author=? WHERE user_id=?", [name, userId]);
            await pool.query("UPDATE comments SET author=? WHERE user_id=?", [name, userId]);
        }
        if (designation !== undefined) { fields.push("designation=?"); values.push(designation); }
        if (bio !== undefined) { fields.push("bio=?"); values.push(bio); }
        if (department !== undefined) { fields.push("department=?"); values.push(department); }
        if (email !== undefined) { fields.push("email=?"); values.push(email); }
        if (fields.length === 0) return res.status(400).json({ error: "No fields to update" });
        values.push(userId);
        const query = `UPDATE users SET ${fields.join(", ")} WHERE id=?`;
        await pool.query(query, values);
        res.json({ message: "Profile updated successfully" });
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ error: "Failed to update profile" });
    }
});



router.put("/:id/account", async (req, res) => {
    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;

    try {
        // Fetch user hashed password
        const [rows] = await pool.query("SELECT password FROM users WHERE id=?", [userId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const storedHash = rows[0].password;

        // Compare current password with hash
        const isMatch = await bcrypt.compare(currentPassword, storedHash);
        if (!isMatch) {
            return res.status(400).json({ error: "Current password is incorrect" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password in DB
        await pool.query("UPDATE users SET password=? WHERE id=?", [hashedPassword, userId]);

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        console.error("Error updating account:", err);
        res.status(500).json({ error: "Failed to update account" });
    }
});

router.delete("/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        await pool.query("DELETE FROM answers WHERE user_id=?", [userId]);
        await pool.query("DELETE FROM questions WHERE user_id=?", [userId]);
        await pool.query("DELETE FROM badges WHERE user_id=?", [userId]);
        await pool.query("DELETE FROM milestones WHERE user_id=?", [userId]);

        const [result] = await pool.query("DELETE FROM users WHERE id=?", [userId]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });

        res.json({ message: "User and all associated data deleted successfully" });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ error: "Failed to delete user" });
    }
});

router.put("/:id/profile-photo", upload.single("profile_photo"), async (req, res) => {
    const userId = req.params.id;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        await pool.query("UPDATE users SET profile_photo=? WHERE id=?", [file.buffer, userId]);
        res.json({ message: "Profile photo updated successfully" });
    } catch (err) {
        console.error("Error updating profile photo:", err);
        res.status(500).json({ error: "Failed to update profile photo" });
    }
});

router.get("/:id/profile-photo", async (req, res) => {
    const userId = req.params.id;

    try {
        const [rows] = await pool.query("SELECT profile_photo FROM users WHERE id=?", [userId]);
        if (rows.length === 0 || !rows[0].profile_photo) {
            return res.status(404).json({ error: "Profile photo not found" });
        }

        res.setHeader("Content-Type", "image/jpeg"); // or png
        res.send(rows[0].profile_photo);
    } catch (err) {
        console.error("Error fetching profile photo:", err);
        res.status(500).json({ error: "Failed to fetch profile photo" });
    }
});

module.exports = router;
