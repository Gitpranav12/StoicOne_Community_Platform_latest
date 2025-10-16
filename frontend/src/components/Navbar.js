import React, { useState, useRef, useContext,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Overlay, Popover, Button } from 'react-bootstrap';
import styles from './Navbar.module.css';
import { FaBars, FaTrophy, FaSignOutAlt } from 'react-icons/fa';
import AchievementsDropdown from './../components/notification/AchievementsDropdown';
import { UserContext } from "./UserProfilePage/context/UserContext";
import './../components/Navbar.css';

// Assuming these components exist in the same folder
import Logone from './Logone';
import NotificationDropdown from './notification/NotificationDropdown';

const Navbar = ({ toggleSidebar }) => {
  // --- Logic from your new component ---
  const [showProducts, setShowProducts] = useState(false);
  const productsRef = useRef(null);

  const { user, setUser } = useContext(UserContext);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);

  const id = user?.id || null;

const profilePhotoUrl = id
  ? `http://localhost:8080/api/user/${id}/profile-photo?${user?.photoUpdatedAt || Date.now()}`
  : "https://i.pravatar.cc/112?img=1";

 const handleLogout = () => {
  localStorage.removeItem("token");          // token clear
  localStorage.removeItem("currentUser");    // currentUser clear
  setUser(null);                              // context clear
  window.location.href = "/login";           // login page redirect
};


    useEffect(() => {
    if (query.trim() !== "") {
      const debounce = setTimeout(() => {
        fetch(`http://localhost:8080/api/search?q=${encodeURIComponent(query)}`)
          .then(res => res.json())
          .then(data => {
            setSuggestions([
              ...data.users.map(u => ({ label: u.name, path: `/users/${u.id}` })),
              ...data.questions.map(q => ({ label: q.title, path: `/questions/${q.id}` }))
            ]);
          });
      }, 300);
      return () => clearTimeout(debounce);
    } else {
      setSuggestions([]);
    }
  }, [query]);
  return (
    <header className={styles.navbar}>
      {/* --- Left Section (with our mobile toggle) --- */}
      <div className={styles.leftSection}>
        <div className={styles.menuIcon} onClick={toggleSidebar}>
          <FaBars />
        </div>
        <Link to="/dashboard" className={styles.logo}>
          <Logone />
        </Link>

        {/* Products Popover */}
        <div
          ref={productsRef}
          className={`products-btn  d-none d-md-block ${showProducts ? "active" : ""}`}
          onClick={() => setShowProducts(!showProducts)}
        >
          Products
        </div>
        <Overlay
          target={productsRef.current}
          show={showProducts}
          placement="bottom"
          rootClose
          onHide={() => setShowProducts(false)}
        >
          <Popover id="products-popover" className="products-popover">
            <div className="s-popover--arrow"></div>
            <ol className="list-reset">
              <li>
                <button
                  className="product-link"
                    onClick={() => window.location.href = '/product'}
                >
                  <span className="item-title">Stoic CRM</span>
                  <span className="item-desc">
                    With Stoic CRM sales teams organize leads, streamline workflows, and close deals more efficiently
                  </span>
                </button>
              </li>
              <li>
                <button
                  className="product-link"
                  onClick={() => window.location.href = "https://stoicsalamander.com/#"}
                >
                  <span className="item-title">stoic HRMS</span>
                  <span className="item-desc">
                    Streamlines HR functions, enhances compliance, and drives employee engagement
                  </span>
                </button>
              </li>
              <li>
                <button
                  className="product-link"
                  onClick={() => window.location.href = "https://stoicsalamander.com/#"}
                >
                  <span className="item-title">Stoic Invoicing</span>
                  <span className="item-desc">
                    Stoic Invoicing makes billing faster and easier with automated invoice generation and tracking
                  </span>
                </button>
              </li>
              <li>
                <button
                  className="product-link"
                  onClick={() => window.location.href = "https://stoicsalamander.com/#"}
                >
                  <span className="item-title">StoicOne Business Suite</span>
                  <span className="item-desc">
                    Enhance productivity with integrated tools and helps to connect with professionals
                  </span>
                </button>
              </li>
              <li>
                <button
                  className="product-link"
                  onClick={() => window.location.href = "https://stoicsalamander.com/#"}
                >
                  <span className="item-title">Stoic Club</span>
                  <span className="item-desc">
                    It's a professional growth ecosystem
                  </span>
                </button>
              </li>
              <li className="border-top mt-2 pt-2">
                <button
                  className="plain-link"
                  onClick={() => window.location.href = "https://stoicsalamander.com/#"}
                >
                  About the company
                </button>
              </li>
            </ol>
          </Popover>
        </Overlay>
      </div>

      {/* --- Search Container --- */}
         {/* Search Container with Dropdown Suggestions */}
      <div className={styles.searchContainer} style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          ref={searchRef}
          autoComplete="off"
        />
        {suggestions.length > 0 && (
          <ul className={styles.suggestionDropdown} style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 10,
            background: '#fff',
            border: '1px solid #ccc',
            width: '100%',
            padding: 0,
            margin: 0,
            maxHeight: 300,
            overflowY: 'auto',
          }}>
            {suggestions.map((s, idx) => (
              <li
                key={idx}
                className={styles.suggestionItem}
                style={{
                  padding: '8px',
                  listStyle: 'none',
                  cursor: 'pointer',
                }}
              >
                <Link to={s.path} style={{ textDecoration: "none", color: "#111" }}>
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* --- Right Section (with new functionality) --- */}
      {/* <div className={styles.rightSection}>
        <NotificationDropdown />
        <div className={styles.icon}><AchievementsDropdown/></div>
        <Link to="/profile" className={styles.icon}>
     
          <i className="bi bi-person-circle fs-4"></i>
        </Link>
        <Button 
          variant="outline-primary" 
          onClick={handleLogout}
          className={styles.logoutButton}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </Button>
      </div> */}

      <div className={styles.rightSection}>
        <NotificationDropdown userId={id} />
        <div className={`${styles.icon} d-none d-md-block`}><AchievementsDropdown userId={id} /></div>
        <Link to="/profile" className={styles.icon}>
          {profilePhotoUrl ? (
            <img
              src={profilePhotoUrl}
              alt="Profile"
              className="rounded-circle"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
          ) : (
            <i className="bi bi-person-circle fs-4"></i>
          )}
        </Link>
       <div className={styles.icon} onClick={handleLogout} title="Logout">
  <i className="bi bi-box-arrow-in-right fs-3 text-danger"></i>
</div>

      </div>

    </header>
  );
};

export default Navbar;