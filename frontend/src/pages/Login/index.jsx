import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "../../components/logo";
import Logo1 from "../../components/logom";
import { UserContext } from "../../components/UserProfilePage/context/UserContext";

const Login = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    
    // ✅ नवीन स्टेट: पासवर्ड दृश्यमानता (Visibility) नियंत्रित करण्यासाठी
    const [passwordVisible, setPasswordVisible] = useState(false); 

    const togglePasswordVisibility = () => {
        setPasswordVisible(prevState => !prevState);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:8080/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("currentUser", JSON.stringify(data.user));
                setUser(data.user);
                setMessage(<span style={{ color: "green" }}>Logged in successfully! Redirecting...</span>);

                setTimeout(() => {
                    if (data.user.role === "admin") {
                        navigate("/admin-dashboard");
                    } else {
                        navigate("/dashboard");
                    }
                }, 500);
            } else {
                setMessage(data.message || "Login failed");
            }
        } catch (err) {
            console.error(err);
            setMessage("Server error");
        }
    };

    const googleAuth = () => {
        window.open(`http://localhost:8080/auth/google`, "_self");
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
                        Log In
                    </h3>

                    {message && (
                        <p className="text-center mb-3" style={{ color: "red" }}>
                            {message}
                        </p>
                    )}

                    <form
                       onSubmit={(e) => {
              e.preventDefault();
              // Email validation for gmail.com or yahoo.com
              const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/;
              if (!emailRegex.test(email)) {
                setMessage(
                  "Please enter a valid email address (gmail.com or yahoo.com only)."
                );
                return;
              }
              // Password validation
              const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=(?:.*\d){2,})(?=.*[@#$%&!]).{8,}$/;
              if (!passwordRegex.test(password)) {
                setMessage(
                  "Password must be at least 8 characters, include 1 uppercase, 1 lowercase, 2 numbers, and 1 special character."
                );
                return;
              }
              handleLogin(e);
            }}
                    >
                        {/* Email Input */}
                        <div className="mb-3">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        
                        {/* 🔑 Password Input (इमेज प्रमाणे सुधारित) */}
                        <div className="mb-3 position-relative"> {/* position-relative ॲड करा */}
                            <input
                                // ✅ State नुसार type बदला
                                type={passwordVisible ? "text" : "password"} 
                                className="form-control"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                // आयकॉनसाठी जागा सोडण्यासाठी Padding-right ॲड करा
                                style={{ paddingRight: '2.5rem' }} 
                            />
                            {/* ✅ Eye Icon (position-absolute ॲड करा) */}
                            <i 
                                className={`bi ${passwordVisible ? "bi-eye-slash" : "bi-eye"} position-absolute translate-middle-y`}
                                onClick={togglePasswordVisibility}
                                style={{ 
                                    right: '10px', // उजवीकडून अंतर
                                    top: '50%',    // मध्यभागी
                                    cursor: 'pointer', // क्लिक करण्यायोग्य
                                    zIndex: 10,
                                    color: '#6c757d' // फिकट राखाडी रंग
                                }}
                            ></i> 
                        </div>

                        <button
                            type="submit"
                            className="btn w-100 mb-2"
                            style={{ background: "#0d6efd", color: "white" }}
                        >
                            Log In
                        </button>
                    </form>

                    {/* Forgot Password link */}
                    <div className="text-end mb-3">
                        <Link to="/forgot-password" style={{ color: "#0d6efd" }}>
                            Forgot Password?
                        </Link>
                    </div>

                    {/* <button
                        className="btn btn-light w-100 border d-flex align-items-center justify-content-center gap-2"
                        onClick={googleAuth}
                    >
                        <i
                            className="bi bi-google"
                            style={{ fontSize: "1.3rem", color: "#DB4437" }}
                        ></i>
                        <span>Sign in with Google</span>
                    </button> */}

                    <div className="text-center mt-3">
                        New here?{" "}
                        <Link to="/signup" style={{ color: "#0d6efd", fontWeight: "500" }}>
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;



// import React, { useState, useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Logo from "../../components/logo";
// import Logo1 from "../../components/logom";
// import { UserContext } from "../../components/UserProfilePage/context/UserContext";

// const Login = () => {
//     const navigate = useNavigate();
//     const { setUser } = useContext(UserContext);

//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [message, setMessage] = useState("");
    
//     // ✅ नवीन स्टेट: पासवर्ड दृश्यमानता (Visibility) नियंत्रित करण्यासाठी
//     const [passwordVisible, setPasswordVisible] = useState(false); 

//     const togglePasswordVisibility = () => {
//         setPasswordVisible(prevState => !prevState);
//     };

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         try {
//             const res = await fetch(`http://localhost:8080/api/login`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ email, password }),
//                 credentials: "include",
//             });

//             const data = await res.json();

//             if (res.ok) {
//                 localStorage.setItem("currentUser", JSON.stringify(data.user));
//                 setUser(data.user);
//                 setMessage(<span style={{ color: "green" }}>Logged in successfully! Redirecting...</span>);

//                 setTimeout(() => {
//                     if (data.user.role === "admin") {
//                         navigate("/admin-dashboard");
//                     } else {
//                         navigate("/dashboard");
//                     }
//                 }, 500);
//             } else {
//                 setMessage(data.message || "Login failed");
//             }
//         } catch (err) {
//             console.error(err);
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
//                         Log In
//                     </h3>

//                     {message && (
//                         <p className="text-center mb-3" style={{ color: "red" }}>
//                             {message}
//                         </p>
//                     )}

//                     <form
//                         onSubmit={(e) => {
//                             e.preventDefault();
//                             handleLogin(e);
//                         }}
//                     >
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
//                             className="btn w-100 mb-2"
//                             style={{ background: "#0d6efd", color: "white" }}
//                         >
//                             Log In
//                         </button>
//                     </form>

//                     {/* Forgot Password link */}
//                     <div className="text-end mb-3">
//                         <Link to="/forgot-password" style={{ color: "#0d6efd" }}>
//                             Forgot Password?
//                         </Link>
//                     </div>

//                     <button
//                         className="btn btn-light w-100 border d-flex align-items-center justify-content-center gap-2"
//                         onClick={googleAuth}
//                     >
//                         <i
//                             className="bi bi-google"
//                             style={{ fontSize: "1.3rem", color: "#DB4437" }}
//                         ></i>
//                         <span>Sign in with Google</span>
//                     </button>

//                     <div className="text-center mt-3">
//                         New here?{" "}
//                         <Link to="/signup" style={{ color: "#0d6efd", fontWeight: "500" }}>
//                             Sign Up
//                         </Link>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;