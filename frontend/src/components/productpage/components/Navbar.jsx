import { useState, useEffect, useRef } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import "./navbar.css";

export function Navbar({ onNavigate, currentPage }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Handle scroll shadow
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProductDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const products = [
    { name: "Stoic CRM", page: "crm", description: "Customer Relationship Management" },
    { name: "Stoic HRM", page: "hrm", description: "Human Resource Management" },
    { name: "Stoic Invoicing", page: "invoicing", description: "Invoice & Billing System" },
    { name: "Stoic Business Suite", page: "suite", description: "Complete Business Solution" },
  ];

  const handleNavigate = (page) => {
    onNavigate(page);
    setShowProductDropdown(false);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light fixed-top"
      style={{
        backgroundColor: isScrolled ? "#ffffff" : "transparent",
        borderBottom: isScrolled ? "1px solid #e5e7eb" : "none",
        boxShadow: isScrolled ? "0 1px 3px rgba(0, 0, 0, 0.05)" : "none",
        transition: "all 0.3s ease",
        padding: "0.75rem 0",
      }}
    >
      <div className="container-fluid px-3 px-lg-4">
        {/* Logo */}
        <div
          className="d-flex align-items-center gap-3 flex-nowrap"
          style={{ cursor: "pointer", marginLeft: "1.5rem" }}
          onClick={() => handleNavigate("home")}
        >
          <img
            src="\logo.png"
            alt="StoicOne Logo"
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "10px",
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
          <span
            className="fw-semibold text-dark text-nowrap"
            style={{ fontSize: "1.25rem", letterSpacing: "0.5px" }}
          >
            <span className="fw-bold text-primary">STOIC</span> PRODUCT's
          </span>
        </div>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler border-0 shadow-none me-3"
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Nav Links */}
        <div className={`collapse navbar-collapse ${isMobileMenuOpen ? "show" : ""}`}>
          <ul className="navbar-nav mx-auto">
            {/* Products Dropdown */}
            <li className="nav-item dropdown position-relative" ref={dropdownRef}>
              <button
                className="nav-link d-flex align-items-center border-0 bg-transparent"
                onClick={() => setShowProductDropdown((prev) => !prev)}
                style={{
                  color: "#000",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  padding: "0.5rem 1rem",
                }}
              >
                Products
                <ChevronDown
                  size={16}
                  className="ms-1"
                  style={{
                    transform: showProductDropdown ? "rotate(180deg)" : "rotate(0)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>

              {showProductDropdown && (
                <div
                  className="dropdown-menu show border shadow-sm"
                  style={{
                    minWidth: "280px",
                    padding: "0.5rem",
                    marginTop: "0.5rem",
                    borderRadius: "8px",
                    borderColor: "#e5e7eb",
                    backgroundColor: "#fff",
                    position: "absolute",
                    zIndex: 999,
                  }}
                >
                  {products.map((product) => (
                    <button
                      key={product.page}
                      onClick={() => handleNavigate(product.page)}
                      className="dropdown-item border-0 bg-transparent w-100 text-start"
                      style={{
                        padding: "0.75rem 1rem",
                        borderRadius: "6px",
                        transition: "background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#E3F2FD")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <div className="fw-semibold" style={{ color: "#1E88E5", fontSize: "0.95rem" }}>
                        {product.name}
                      </div>
                      <small style={{ color: "#6b7280", fontSize: "0.85rem" }}>
                        {product.description}
                      </small>
                    </button>
                  ))}
                </div>
              )}
            </li>

            {/* Other Nav Links */}
            {[
              { name: "Features", href: "#features" },
              { name: "Pricing", href: "#pricing" },
              { name: "About Us", href: "#about" },
            ].map((link) => (
              <li className="nav-item" key={link.name}>
                <a
                  href={link.href}
                  className="nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    color: "#000",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    padding: "0.5rem 1rem",
                  }}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Contact Button */}
          <div className="d-flex gap-2 align-items-center">
            <button className="btn btn-outline-dark" onClick={() => onNavigate("contact")}>
              Contact us
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
