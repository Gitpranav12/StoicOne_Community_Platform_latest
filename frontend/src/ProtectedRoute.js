// src/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./components/UserProfilePage/context/UserContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useContext(UserContext);

    // 1️⃣ जर user logged in नसेल
    if (!user) return <Navigate to = "/"
    replace / > ;

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to = "/unauthorized"
        replace / > ;
    }

    return children;

};

export default ProtectedRoute;