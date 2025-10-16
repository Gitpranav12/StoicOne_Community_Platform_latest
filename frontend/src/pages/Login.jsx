import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
 import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setMsg("Login successful ✅");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      if (err.response && err.response.data.msg) {
        setMsg(err.response.data.msg);
      } else {
        setMsg("Login failed! Try again.");
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
      console.log("Google token:", credentialResponse);
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      // Send token to backend
      const res = await axios.post("http://localhost:5000/api/auth/google", {
        token: credentialResponse.credential,
        
      });

      localStorage.setItem("token", res.data.token);
      setMsg(`Welcome ${decoded.name} 🎉`);
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      console.error("Google login error:", err);
      setMsg("Google login failed ❌");
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div
          className="card shadow p-4"
          style={{ width: "350px", borderRadius: "15px" }}
        >
          <h3 className="text-center mb-3">Login</h3>

          {msg && <div className="alert alert-info text-center">{msg}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-dark w-100">
              Login
            </button>
          </form>

          {/* Google Login Button */}
          <div className="mt-3 d-flex justify-content-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setMsg("Google login failed ❌")}
            />
          </div>

          <div className="d-flex justify-content-between mt-3">
            <small
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/forgotpassword")}
            >
              Forgot Password?
            </small>
            <small
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/register")}
            >
              Create Account
            </small>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
