import React from "react";
import { Link } from "react-router-dom";
import "../components/logo.css";

export default function Logo() {
  return (<>
    <div className="logo-container logo-text">
 
        <span className="blue">St</span>
        <span className="blue">oic </span>
        <img src="/logo-modified.png" alt="O Logo" className="logo-o" />
        <span className="black">ne</span>
      
    </div>
<div className="logo">
  <span className="blue fw-600">Community</span>
  <span className="black fw-600">Platform</span>
</div>

    </>
    
  );
}
