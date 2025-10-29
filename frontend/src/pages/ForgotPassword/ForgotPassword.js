import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "../../components/logo";
import Logo1 from "../../components/logom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  // ✅ नवीन स्टेट्स: पासवर्ड व्हिजिबिलिटी नियंत्रित करण्यासाठी
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // Step 1: Send OTP
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await fetch("http://localhost:8080/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        if (data.testOtp) {
          alert(`TESTING OTP: ${data.testOtp}`);
        }
        setMessage(data.message || data.msg || "OTP sent successfully!");
        setStep(2);
      } else {
        setError(data.message || data.msg || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Check if backend is running.");
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await fetch("http://localhost:8080/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("OTP verified, now enter new password");
        setStep(3);
      } else {
        setError(data.message || data.msg || "Invalid or expired OTP");
      }
    } catch (err) {
      console.error(err);
      setError("Server error during OTP verification.");
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || data.msg || "Password updated successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/"); // '/' (Login Page) वर रीडायरेक्ट करा
        }, 1500);
      } else {
        setError(data.message || data.msg || "Failed to reset password.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error during password reset.");
    }
  };

  // Password validation function
  const isPasswordValid = (password) => {
    // At least 8 chars, 1 uppercase, 1 lowercase, 2 numbers, 1 special char
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=(?:.*\d){2,})(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(password);
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 p-3"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div
        className="row shadow-lg rounded-4 overflow-hidden bg-white w-100"
        style={{ maxWidth: "900px" }}
      >
        <div
          className="col-md-5 d-none d-md-flex flex-column justify-content-center align-items-center p-4"
          style={{ backgroundColor: "#0d6efd10" }}
        >
          <Logo />
        </div>

        <div className="col-12 col-md-7 p-4 p-md-5 d-flex flex-column justify-content-center">
          <div className="d-flex d-md-none justify-content-center mb-4">
            <Logo1 />
          </div>

          <h3 className="text-center mb-4 fw-bold" style={{ color: "#0d6efd" }}>
            {step === 1 ? "Forgot Password" : step === 2 ? "Verify OTP" : "Reset Password"}
          </h3>

          {message && (
            <p className="text-center mb-3" style={{ color: "green" }}>
              {message}
            </p>
          )}

          {error && (
            <p className="text-center mb-3" style={{ color: "red" }}>
              {error}
            </p>
          )}

          {/* Step 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleForgotPassword}>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn w-100 mb-3"
                style={{ background: "#0d6efd", color: "white" }}
              >
                Send OTP
              </button>
            </form>
          )}

          {/* Step 2: Enter OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp}>
              <p className="text-center text-muted mb-3">
                OTP sent to {email}. Check your email and server console.
              </p>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn w-100 mb-3"
                style={{ background: "#0d6efd", color: "white" }}
              >
                Verify OTP
              </button>
              <div className="text-center">
                <Link onClick={handleForgotPassword} style={{ color: "#0d6efd", cursor: 'pointer', fontWeight: "500" }}>
                  Resend OTP
                </Link>
              </div>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!isPasswordValid(newPassword)) {
                  setError(
                    "Password must be at least 8 characters, include 1 uppercase, 1 lowercase, 2 numbers, and 1 special character."
                  );
                  return;
                }
                handleResetPassword(e);
              }}
            >
              <div className="mb-3 position-relative">
                <input
                  type={newPasswordVisible ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  style={{ paddingRight: '2.5rem' }}
                />
                <i
                  className={`bi ${newPasswordVisible ? "bi-eye-slash" : "bi-eye"} position-absolute translate-middle-y`}
                  onClick={() => setNewPasswordVisible(prevState => !prevState)}
                  style={{
                    right: '10px',
                    top: '50%',
                    cursor: 'pointer',
                    zIndex: 10,
                    color: '#6c757d'
                  }}
                ></i>
              </div>

              <div className="mb-3 position-relative">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  className="form-control"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{ paddingRight: '2.5rem' }}
                />
                <i
                  className={`bi ${confirmPasswordVisible ? "bi-eye-slash" : "bi-eye"} position-absolute translate-middle-y`}
                  onClick={() => setConfirmPasswordVisible(prevState => !prevState)}
                  style={{
                    right: '10px',
                    top: '50%',
                    cursor: 'pointer',
                    zIndex: 10,
                    color: '#6c757d'
                  }}
                ></i>
              </div>

              <button
                type="submit"
                className="btn w-100 mb-3"
                style={{ background: "#0d6efd", color: "white" }}
              >
                Reset Password
              </button>
              <div className="mb-2 text-muted small">
                Password must be at least 8 characters, include 1 uppercase, 1 lowercase, 2 numbers, and 1 special character.
              </div>
            </form>
          )}

          <div className="text-center mt-3">
            Back to{" "}
            <Link to="/" style={{ color: "#0d6efd", fontWeight: "500" }}>
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;