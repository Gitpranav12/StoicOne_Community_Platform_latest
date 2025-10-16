exports.forgotPassword = (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    User.saveOtp(email, otp, (err) => {
        if (err) return res.status(500).json({ msg: "Error saving OTP" });

        // ✅ Print OTP in console instead of sending email
        console.log(`OTP for ${email}: ${otp}`);

        res.json({ msg: "OTP generated. Check console for OTP." });
    });
};

exports.verifyOtp = (req, res) => {
    const { email, otp } = req.body;
    User.verifyOtp(email, otp, (err, results) => {
        if (err || results.length === 0) return res.status(400).json({ msg: "Invalid OTP" });
        res.json({ msg: "OTP verified successfully" });
    });
};

exports.resetPassword = (req, res) => {
    const { email, newPassword } = req.body;
    bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ msg: "Error hashing password" });
        User.updatePassword(email, hashedPassword, (err) => {
            if (err) return res.status(500).json({ msg: "Error updating password" });
            res.json({ msg: "Password updated successfully" });
        });
    });
};