const db = require("../db");


const User = {
    create: (user, callback) => {
        db.query("INSERT INTO users SET ?", user, callback);
    },
    findByEmail: (email, callback) => {
        db.query("SELECT * FROM users WHERE email = ?", [email], callback);
    },
    updatePassword: (email, password, callback) => {
        db.query("UPDATE users SET password = ? WHERE email = ?", [password, email], callback);
    },
    saveOtp: (email, otp, callback) => {
        db.query("UPDATE users SET otp = ? WHERE email = ?", [otp, email], callback);
    },
    verifyOtp: (email, otp, callback) => {
        db.query("SELECT * FROM users WHERE email = ? AND otp = ?", [email, otp], callback);
    }
};


module.exports = User;