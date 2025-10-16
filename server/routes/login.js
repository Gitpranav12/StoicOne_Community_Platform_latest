// routes/auth.js

const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db.js"); // तुमच्या डेटाबेस कनेक्शनसाठी
const router = express.Router();
const seedAchievementsForUser = require('../services/seedAchievementsForUser.js');
const updateAchievements = require('../services/updateAchievements.js');
// const authController = require("../controllers/authController.js"); // 👈 आता याची गरज नाही, लॉजिक इथेच ॲड करत आहोत
const { sendOtpEmail } = require("../utils/sendEmail.js"); // 📧 ईमेल पाठवण्यासाठी

// --- SIGNUP ---
router.post("/signup", async(req, res) => {
    // ... तुमचा सध्याचा SIGNUP कोड ...
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields required" });
    }

    try {
        const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existing.length > 0) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const role = email.toLowerCase().includes("admin") ? "admin" : "user";

        const [result] = await db.query(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [name, email, hashedPassword, role]
        );

        await seedAchievementsForUser(result.insertId);

        res.status(201).json({ message: `${role} account created successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// --- LOGIN ---
router.post("/login", async(req, res) => {
    // ... तुमचा सध्याचा LOGIN कोड ...
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    try {
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length === 0) return res.status(400).json({ message: "Invalid credentials" });

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const role = email.toLowerCase().includes("admin") ? "admin" : "user";
        if (user.role !== role) {
            await db.query("UPDATE users SET role = ? WHERE id = ?", [role, user.id]);
            user.role = role;
        }

        // JWT
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET, { expiresIn: "1h" }
        );

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// ------------------------------------------
// --- FORGOT PASSWORD (OTP FLOW) ---
// ------------------------------------------

// 1. FORGOT PASSWORD (OTP Generate आणि Console वर प्रिंट करणे)
// routes/auth.js

// ... [इतर आवश्यक इम्पोर्ट्स, जसे की db आणि sendOtpEmail] ...

// router.post("/forgot-password", async (req, res) => {
//     const { email } = req.body;

//     try {
//         const [userRows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

//         if (userRows.length === 0) {
//             console.log(`Attempted OTP generation for non-existent email: ${email}`);
//             // टेस्टिंगसाठी, नॉन-एग्झिस्टंट ईमेलसाठीही alert देऊ नका
//             return res.json({ message: "If account exists, OTP has been generated." });
//         }

//         const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
//         const expiryTime = Date.now() + 10 * 60 * 1000; // 10 मिनिटांसाठी

//         // 1. डेटाबेसमध्ये OTP आणि मुदत सेव्ह करणे
//         await db.query(
//             "UPDATE users SET otp = ?, otp_expires = ? WHERE email = ?",
//             [otp.toString(), expiryTime, email]
//         );

//         // 2. 📧 ईमेलमध्ये OTP पाठवणे
//         const emailSent = await sendOtpEmail(email, otp.toString()); 

//         // 3. ✅ कन्सोलमध्ये OTP प्रिंट करणे (Debugging साठी)
//         console.log(`\n\n✅ OTP for ${email} (Sent to Email): ${otp}\n\n`);

//         let responseMessage = "OTP has been sent to your email address.";

//         if (!emailSent) {
//             responseMessage = "OTP saved, but failed to send email. Please check server logs.";
//         }

//         // 4. 🚨 ॲलर्ट बॉक्समध्ये OTP दाखवण्यासाठी (Testing साठी)
//         // येथे मी response object मध्ये 'testOtp' नावाचा एक तात्पुरता फील्ड ॲड करत आहे.
//         // फ्रंटएंडमध्ये (ForgotPassword.jsx) तुम्हाला हा फील्ड वाचून alert दाखवावा लागेल.

//         res.json({ 
//             message: responseMessage,
//             testOtp: otp.toString() // 👈 टेस्टिंगसाठी फ्रंटएंडला पाठवत आहोत
//         });

//     } catch (err) {
//         console.error("Error in forgot-password:", err);
//         res.status(500).json({ message: "Server error during OTP generation or saving." });
//     }
// });

router.post("/forgot-password", async(req, res) => {
    const { email } = req.body;

    try {
        const [userRows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

        // 🛑 बदल येथे आहे: जर यूजर नसेल, तर स्पष्टपणे एरर मेसेज परत पाठवा
        if (userRows.length === 0) {
            console.log(`Email not found in database: ${email}`);
            // 400 status आणि स्पष्ट संदेश परत पाठवा
            return res.status(400).json({ message: "This email address is not associated with any account." });
            // किंवा 'हे खाते अस्तित्वात नाही' यासाठी:
            // return res.status(400).json({ message: "हे ईमेल ॲड्रेस कोणत्याही खात्याशी जोडलेले नाही." });
        }
        // ---------------------------------------------------------------------------------

        const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
        const expiryTime = Date.now() + 10 * 60 * 1000; // 10 मिनिटांसाठी

        // 1. डेटाबेसमध्ये OTP आणि मुदत सेव्ह करणे
        await db.query(
            "UPDATE users SET otp = ?, otp_expires = ? WHERE email = ?", [otp.toString(), expiryTime, email]
        );

        // 2. 📧 ईमेलमध्ये OTP पाठवणे
        const emailSent = await sendOtpEmail(email, otp.toString());

        // 3. ✅ कन्सोलमध्ये OTP प्रिंट करणे (Debugging साठी)
        console.log(`\n\n✅ OTP for ${email} (Sent to Email): ${otp}\n\n`);

        let responseMessage = "OTP has been sent to your email address.";

        if (!emailSent) {
            responseMessage = "OTP saved, but failed to send email. Please check server logs.";
        }

        // 4. 🚨 ॲलर्ट बॉक्समध्ये OTP दाखवण्यासाठी (Testing साठी)
        res.json({
            message: responseMessage,
            testOtp: otp.toString() // टेस्टिंगसाठी फ्रंटएंडला पाठवत आहोत
        });

    } catch (err) {
        console.error("Error in forgot-password:", err);
        res.status(500).json({ message: "Server error during OTP generation or saving." });
    }
});

// ... (verify-otp आणि reset-password राउट्स तसेच राहतील)
// 2. VERIFY OTP (OTP तपासणे)
router.post("/verify-otp", async(req, res) => {
    const { email, otp } = req.body;

    try {
        // 💡 डेटाबेसमध्ये दिलेला OTP, ईमेल आणि मुदत संपलेली नाही (otp_expires > NOW()) याची पडताळणी करणे
        const [rows] = await db.query(
            "SELECT id FROM users WHERE email = ? AND otp = ? AND otp_expires > ?", [email, otp, Date.now()]
        );

        if (rows.length === 0) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        // OTP verified झाल्यावर, नवीन पासवर्ड सेट करण्यासाठी यूजरला 'verified' ठेवण्यासाठी
        // आपण OTP आणि expiry फील्ड तसेच ठेवू शकतो किंवा एक तात्पुरते 'verified' स्टेटस सेट करू शकतो.
        // साधेपणासाठी, आपण फक्त OK रिस्पॉन्स देऊ, आणि reset-password मध्ये ईमेल आणि आधी verify झालेला OTP वापरू.

        res.json({ message: "OTP verified successfully. You can now reset your password." });
    } catch (err) {
        console.error("Error in verify-otp:", err);
        res.status(500).json({ message: "Server error during OTP verification." });
    }
});

// 3. RESET PASSWORD (नवीन पासवर्ड सेट करणे)
router.post("/reset-password", async(req, res) => {
    const { email, otp, newPassword } = req.body; // फ्रंटएंडकडून OTP घेणे आवश्यक आहे

    try {
        // 💡 पुन्हा OTP आणि मुदत तपासून, मगच पासवर्ड अपडेट करणे
        const [rows] = await db.query(
            "SELECT id FROM users WHERE email = ? AND otp = ? AND otp_expires > ?", [email, otp, Date.now()]
        );

        if (rows.length === 0) {
            return res.status(400).json({ message: "Verification failed. Please try the forgot password process again." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 💡 पासवर्ड अपडेट करणे आणि OTP/expiry फील्ड साफ करणे (Resetting the fields)
        await db.query(
            "UPDATE users SET password = ?, otp = NULL, otp_expires = NULL WHERE email = ?", [hashedPassword, email]
        );

        res.json({ message: "Password updated successfully!" });
    } catch (err) {
        console.error("Error in reset-password:", err);
        res.status(500).json({ message: "Server error during password reset." });
    }
});

module.exports = router;