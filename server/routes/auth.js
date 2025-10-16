const router = require("express").Router();
const passport = require("passport");
const db = require("../db.js"); // your MySQL connection
const bcrypt = require("bcryptjs"); // optional, in case you want to hash any passwords

// --- Login success ---
router.get("/login/success", (req, res) => {
  if (req.session.user) {
    res.status(200).json({
      error: false,
      user: {
        ...req.session.user,
        profile_photo: req.session.user.profile_photo || "/default-avatar.png"
      },
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

// --- Login failed ---
router.get("/login/failed", (req, res) => {
    res.status(401).json({
        error: true,
        message: "Login failure",
    });
});

// --- Google Login ---
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// --- Google callback ---
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/auth/login/failed" }),
    async(req, res) => {
        try {
            const profile = req.user;

            // profile.photos[0].value contains Google profile photo URL
            const profilePhoto = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null;

            const [existing] = await db.query(
                "SELECT * FROM users WHERE google_id = ?", [profile.id]
            );

            let user;

            if (existing.length === 0) {
                const result = await db.query(
                    "INSERT INTO users (name, email, google_id, profile_photo) VALUES (?, ?, ?, ?)", [profile.displayName, profile.emails[0].value, profile.id, profilePhoto]
                );
                user = { id: result[0].insertId, name: profile.displayName, email: profile.emails[0].value, profile_photo: profilePhoto };
            } else {
                // Update profile photo if changed
                if (profilePhoto && profilePhoto !== existing[0].profile_photo) {
                    await db.query(
                        "UPDATE users SET profile_photo = ? WHERE id = ?", [profilePhoto, existing[0].id]
                    );
                    existing[0].profile_photo = profilePhoto;
                }
                user = existing[0];
            }

            req.session.user = user;

            res.redirect(`${process.env.CLIENT_URL}/dashboard`);
        } catch (err) {
            console.error("Google login error:", err);
            res.redirect("/auth/login/failed");
        }
    }
);



// --- Logout ---
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect(process.env.CLIENT_URL);
    });
});

module.exports = router;