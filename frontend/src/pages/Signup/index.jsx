import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "../../components/logo";
import Logo1 from "../../components/logom";

// Checks if the name contains only alphabets and spaces
const isAlpha = (str) => /^[A-Za-z\s]+$/.test(str);

// Checks if the email is either gmail.com or yahoo.com
const isValidEmail = (email) =>
  /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/.test(email);

const Signup = () => {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    
    // ✅ नवीन स्टेट: पासवर्ड दृश्यमानता (Visibility) नियंत्रित करण्यासाठी
    const [passwordVisible, setPasswordVisible] = useState(false); 

    const togglePasswordVisibility = () => {
        setPasswordVisible(prevState => !prevState);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:8080/api/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: fullName, email, password }),
                credentials: "include",
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(
                  <span style={{ color: "green" }}>
                    {data.message || "Account created successfully! Redirecting to Log In..."}
                  </span>
                );
                setTimeout(() => navigate("/"), 1500); // '/' (Login Page) वर रीडायरेक्ट करा
            } else {
                setMessage(data.message || "Signup failed");
            }
        } catch (err) {
            setMessage("Server error");
        }
    };

    const googleAuth = () => {
        window.open(`http://localhost:8080/auth/google`, "_self");
    };
     const isValidPassword = (password) => {
    const lengthCheck = password.length >= 8;
    const upperCheck = /[A-Z]/.test(password);
    const lowerCheck = /[a-z]/.test(password);
    const specialCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const digitCheck = (password.match(/\d/g) || []).length >= 2;
    return lengthCheck && upperCheck && lowerCheck && specialCheck && digitCheck;
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
                        Create Account
                    </h3>

                    {message && (
                        <p className="text-center mb-3" style={{ color: "red" }}>
                            {message}
                        </p>
                    )}

                    <form  
                    onSubmit={(e) => {
              e.preventDefault();
              if (!isAlpha(fullName)) {
                setMessage("Full Name should contain alphabets and spaces only.");
                return;
              }
              if (!isValidEmail(email)) {
                setMessage("Email must be gmail.com or yahoo.com only.");
                return;
              }
              if (!isValidPassword(password)) {
                setMessage(
                  "Password must be 8+ chars, 1 uppercase, 1 lowercase, 2 numbers, 1 special char."
                );
                return;
              }
              handleSubmit(e);
            }}>
                        {/* Full Name Input */}
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Full Name"
                                value={fullName}
                                onChange={(e) => {
                                    // Only allow letters and spaces
                                    const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                                    setFullName(value);
                                }}
                                required
                            />
                        </div>
                                                
                        {/* Email Input */}
                        <div className="mb-3">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                pattern="[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$"
                                title="Please enter a valid Gmail or Yahoo email address"
                            />
                        </div>

                        {/* 🔑 Password Input (इमेज प्रमाणे सुधारित) */}
                        <div className="mb-3 position-relative">
                            <input
                                type={passwordVisible ? "text" : "password"}
                                className="form-control"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ paddingRight: '2.5rem' }}
                                pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+\-=\[\]{};':\{8,}$"
                                title="Password must be at least 8 characters, include 1 uppercase, 1 lowercase, 1 special character, and at least 2 numbers."
                            />
                            <i 
                                className={`bi ${passwordVisible ? "bi-eye-slash" : "bi-eye"} position-absolute translate-middle-y`}
                                onClick={togglePasswordVisibility}
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
                            Sign Up
                        </button>
                    </form>

                    {/* <button
                        className="btn btn-light w-100 border d-flex align-items-center justify-content-center gap-2"
                        onClick={googleAuth}
                    >
                        <i
                            className="bi bi-google"
                            style={{ fontSize: "1.3rem", color: "#DB4437" }}
                        ></i>
                        <span>Sign up with Google</span>
                    </button> */}

                    <div className="text-center mt-3">
                        Already have an account?{" "}
                        <Link to="/" style={{ color: "#0d6efd", fontWeight: "500" }}>
                            Log In
                        </Link>
                    </div> 
                </div>
            </div>
        </div>
    );
};

export default Signup;





// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Logo from "../../components/logo";
// import Logo1 from "../../components/logom";

// const Signup = () => {
//     const navigate = useNavigate();
//     const [fullName, setFullName] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [message, setMessage] = useState("");
    
//     // ✅ नवीन स्टेट: पासवर्ड दृश्यमानता (Visibility) नियंत्रित करण्यासाठी
//     const [passwordVisible, setPasswordVisible] = useState(false); 

//     const togglePasswordVisibility = () => {
//         setPasswordVisible(prevState => !prevState);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const res = await fetch(`http://localhost:8080/api/signup`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ name: fullName, email, password }),
//                 credentials: "include",
//             });
//             const data = await res.json();
//             if (res.ok) {
//                 setMessage(
//                   <span style={{ color: "green" }}>
//                     {data.message || "Account created successfully! Redirecting to Log In..."}
//                   </span>
//                 );
//                 setTimeout(() => navigate("/"), 1500); // '/' (Login Page) वर रीडायरेक्ट करा
//             } else {
//                 setMessage(data.message || "Signup failed");
//             }
//         } catch (err) {
//             setMessage("Server error");
//         }
//     };

//     const googleAuth = () => {
//         window.open(`http://localhost:8080/auth/google`, "_self");
//     };

//     return (
//         <div
//             className="d-flex align-items-center justify-content-center min-vh-100 p-3"
//             style={{ backgroundColor: "#f8f9fa" }}
//         >
//             <div
//                 className="row shadow-lg rounded-4 overflow-hidden bg-white w-100"
//                 style={{ maxWidth: "900px" }}
//             >
//                 <div
//                     className="col-md-5 d-none d-md-flex flex-column justify-content-center align-items-center p-4"
//                     style={{ backgroundColor: "#0d6efd10" }}
//                 >
//                     <Logo />
//                 </div>

//                 <div className="col-12 col-md-7 p-4 p-md-5 d-flex flex-column justify-content-center">
//                     <div className="d-flex d-md-none justify-content-center mb-4">
//                         <Logo1 />
//                     </div>

//                     <h3 className="text-center mb-4 fw-bold" style={{ color: "#0d6efd" }}>
//                         Create Account
//                     </h3>

//                     {message && (
//                         <p className="text-center mb-3" style={{ color: "red" }}>
//                             {message}
//                         </p>
//                     )}

//                     <form onSubmit={handleSubmit}>
//                         {/* Full Name Input */}
//                         <div className="mb-3">
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 placeholder="Full Name"
//                                 value={fullName}
//                                 onChange={(e) => setFullName(e.target.value)}
//                                 required
//                             />
//                         </div>
                        
//                         {/* Email Input */}
//                         <div className="mb-3">
//                             <input
//                                 type="email"
//                                 className="form-control"
//                                 placeholder="Email"
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 required
//                             />
//                         </div>
                        
//                         {/* 🔑 Password Input (इमेज प्रमाणे सुधारित) */}
//                         <div className="mb-3 position-relative"> {/* position-relative ॲड करा */}
//                             <input
//                                 // ✅ State नुसार type बदला
//                                 type={passwordVisible ? "text" : "password"} 
//                                 className="form-control"
//                                 placeholder="Password"
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 required
//                                 // आयकॉनसाठी जागा सोडण्यासाठी Padding-right ॲड करा
//                                 style={{ paddingRight: '2.5rem' }} 
//                             />
//                             {/* ✅ Eye Icon (position-absolute ॲड करा) */}
//                             <i 
//                                 className={`bi ${passwordVisible ? "bi-eye-slash" : "bi-eye"} position-absolute translate-middle-y`}
//                                 onClick={togglePasswordVisibility}
//                                 style={{ 
//                                     right: '10px', // उजवीकडून अंतर
//                                     top: '50%',    // मध्यभागी
//                                     cursor: 'pointer', // क्लिक करण्यायोग्य
//                                     zIndex: 10,
//                                     color: '#6c757d' // फिकट राखाडी रंग
//                                 }}
//                             ></i> 
//                         </div>

//                         <button
//                             type="submit"
//                             className="btn w-100 mb-3"
//                             style={{ background: "#0d6efd", color: "white" }}
//                         >
//                             Sign Up
//                         </button>
//                     </form>

//                     <button
//                         className="btn btn-light w-100 border d-flex align-items-center justify-content-center gap-2"
//                         onClick={googleAuth}
//                     >
//                         <i
//                             className="bi bi-google"
//                             style={{ fontSize: "1.3rem", color: "#DB4437" }}
//                         ></i>
//                         <span>Sign up with Google</span>
//                     </button>

//                     <div className="text-center mt-3">
//                         Already have an account?{" "}
//                         <Link to="/" style={{ color: "#0d6efd", fontWeight: "500" }}>
//                             Log In
//                         </Link>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Signup;