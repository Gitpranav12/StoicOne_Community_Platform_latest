// utils/emailSender.js

const nodemailer = require('nodemailer');

// ⚠️ महत्त्वाचे: Arjun_123 हा साधा पासवर्ड असेल तर ईमेल नक्कीच फेल होईल.
// Gmail मध्ये 2-Step Verification चालू करून, 16-अंकी APP PASSWORD वापरा.
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        // 1. ऑथेंटिकेशन यूजर (तुमचा ईमेल)
        user: 'Mitsu4483@gmail.com',
        // 2. ॲप पासवर्ड (16-अंकी कोड)
        pass: 'vaxh vfti ifpd sscn' // 👈 येथे 16-अंकी APP PASSWORD वापरा.
    }
});

exports.sendOtpEmail = async(toEmail, otp) => {
    const mailOptions = {
        // 3. 'From' ॲड्रेस auth.user शी जुळला पाहिजे
        from: 'mayurshinde70571@gmail.com',
        to: toEmail,
        subject: 'Your Password Reset OTP',
        html: `<p>Your One-Time Password (OTP) for resetting your password is: <strong>${otp}</strong>. This OTP is valid for 10 minutes.</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email with OTP sent successfully to ${toEmail}`);
        return true;
    } catch (error) {
        // 🚨 Nodemailer एरर तपासा (उदा. Invalid Login)
        console.error('Error sending email:', error);
        return false;
    }
};