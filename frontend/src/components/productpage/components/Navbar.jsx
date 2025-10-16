import { useState, useEffect } from 'react';
import { Menu, X, Users, FileText, DollarSign, Briefcase } from 'lucide-react';
import './navbar.css'

export function Navbar({ onNavigate }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const products = [
    { name: 'CRM', icon: <Users size={20} />, description: 'Customer Relationship Management', page: 'crm' },
    { name: 'HRM', icon: <Briefcase size={20} />, description: 'Human Resource Management', page: 'hrm' },
    { name: 'Invoicing', icon: <FileText size={20} />, description: 'Invoice & Billing System', page: 'invoicing' },
    { name: 'Suite', icon: <DollarSign size={20} />, description: 'Complete Business Suite', page: 'suite' },
  ];

  const navLinks = [
    { label: 'Features', page: 'features' },
    { label: 'Pricing', page: 'pricing' },
    { label: 'About Us', page: 'about' },
  ];

  return (
    <nav
      className={`navbar navbar-expand-lg fixed-top ${isScrolled ? 'navbar-scrolled' : 'navbar-transparent'}`}
      style={{
        transition: 'all 0.3s ease',
        zIndex: 1050,
        paddingTop: '1rem',       // inavbar height
        paddingBottom: '1rem',    // navbar height
      }}
    >
      <div className="container">
        {/* Logo */}
        <button
          className="navbar-brand d-flex align-items-center border-0 bg-transparent"
          onClick={() => onNavigate('home')}
          style={{ cursor: 'pointer' }}
        >
          <div className="d-flex align-items-center gap-2">
            <img
              src="\logo.png"
              alt="Stoicone Logo"
              style={{
                width: '40px',       // bigger logo
                height: '40px',
                objectFit: 'cover',
                borderRadius: '6px',
              }}
            />
            <span className="fw-semibold text-dark">Stoicone Products</span>
          </div>
        </button>

        {/* Mobile Menu Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navbar Links */}
        <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 d-flex align-items-center gap-3">
            {/* Products Dropdown FIRST */}
            <li
              className="nav-item dropdown position-relative"
              onMouseEnter={() => setShowProductDropdown(true)}
              onMouseLeave={() => setShowProductDropdown(false)}
            >
              <a
                className="nav-link dropdown-toggle text-dark d-flex align-items-center"
                href="#products"
                role="button"
                style={{ transition: 'color 0.3s ease' }}
              >
                Products
              </a>

              <div
                className={`dropdown-menu shadow-lg border-0 ${showProductDropdown ? 'show' : ''}`}
                style={{
                  minWidth: '500px',
                  padding: '1.5rem',
                  marginTop: '0.5rem',
                  borderRadius: '12px',
                  display: showProductDropdown ? 'block' : 'none',
                }}
              >
                <div className="row g-3">
                  {products.map((product, index) => (
                    <div className="col-6" key={index}>
                      <button
                        onClick={() => {
                          onNavigate(product.page);
                          setShowProductDropdown(false);
                        }}
                        className="text-decoration-none border-0 bg-transparent w-100 text-start"
                        style={{ transition: 'all 0.3s ease' }}
                      >
                        <div
                          className="p-3 rounded d-flex gap-3 align-items-start"
                          style={{
                            border: '1px solid #e0e0e0',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = '#1E88E5';
                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = '#e0e0e0';
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <div
                            className="d-flex align-items-center justify-content-center rounded"
                            style={{
                              width: '40px',
                              height: '40px',
                              background: 'linear-gradient(135deg, #1E88E5, #1565C0)',
                              color: 'white',
                              flexShrink: 0,
                            }}
                          >
                            {product.icon}
                          </div>
                          <div>
                            <h6 className="mb-1 text-dark fw-semibold">{product.name}</h6>
                            <small className="text-muted">{product.description}</small>
                          </div>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </li>

            {/* Other Nav Links */}
            {navLinks.map((link, idx) => (
              <li className="nav-item" key={idx}>
                <a
                  className="nav-link text-dark"
                  href={`#${link.page}`}
                  onClick={() => onNavigate(link.page)}
                  style={{ transition: 'color 0.3s ease' }}
                  onMouseEnter={e => (e.target.style.color = '#1E88E5')}
                  onMouseLeave={e => (e.target.style.color = '')}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Buttons */}
          <div className="d-flex gap-2 align-items-center">
            <button className="btn btn-outline-dark" onClick={() => onNavigate('try-free')}>
              Contact us
            </button>
            {/* <button className="btn btn-dark" onClick={() => onNavigate('book-demo')}>
              Book Demo
            </button> */}
          </div>
        </div>
      </div>
    </nav>
  );
}
