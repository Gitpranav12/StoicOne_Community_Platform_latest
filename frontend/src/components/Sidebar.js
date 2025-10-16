import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from './Sidebar.module.css';
import {
  Home, Search, Tag, Bot, FileText, Users, UserCog,
  ChevronDown, ChevronRight, BarChart3, MessageSquare, Trophy
} from "lucide-react";
import { useCollectives } from "./collectives/CollectivesContext";
import { UserContext } from "../components/UserProfilePage/context/UserContext";

const menuItems = [
  { to: "/dashboard", label: "Home", icon: <Home size={20} /> },
  { to: "/questions", label: "Questions", icon: <Search size={20} /> },
  { to: "/tags", label: "Tags", icon: <Tag size={20} /> },
  { to: "/AiAssistant", label: "AI Assistant", icon: <Bot size={20} /> },
  { to: "/articles", label: "Articles", icon: <FileText size={20} /> },
  { to: "/user", label: "Users", icon: <Users size={20} /> },
   { to: "/events", label: "Events", icon: <Trophy size={20} /> },
  // { to: "/moderator", label: "Moderator", icon: <ShieldCheck size={20} /> },
  // { to: "/admin", label: "Admin", icon: <UserCog size={20} /> },
];

const adminItems = [
  { to: "/admin", label: "Analytics", icon: <BarChart3 size={18} /> },
  { to: "/admin/users", label: "Users", icon: <Users size={18} /> },
  { to: "/admin/questions", label: "Questions", icon: <Search size={18} /> },
  { to: "/admin/answers", label: "Answers", icon: <MessageSquare size={18} /> },
  { to: "/admin/tags", label: "Tags", icon: <Tag size={18} /> },
  { to: "/admin/collectives", label: "Collectives", icon: <UserCog size={18} /> },
   { to: "/admin/events", label: "Events", icon: <Trophy size={18} /> },

];

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const { joinedCollectives } = useCollectives();
  const { user } = useContext(UserContext); // Logged-in user
  const [adminOpen, setAdminOpen] = useState(location.pathname.startsWith("/admin"));

  useEffect(() => {
    if (location.pathname.startsWith("/admin")) {
      setAdminOpen(true);
    }
  }, [location.pathname]);


    // ..........added by raj -----23 sep

  // --- Explore Collectives toggle ---
  const [collectivesOpen, setCollectivesOpen] = useState(
    location.pathname.startsWith("/collectives")
  );
  useEffect(() => {
    if (location.pathname.startsWith("/collectives")) setCollectivesOpen(true);
  }, [location.pathname]);


  return (
   <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
  <nav className={styles.nav}>
    {menuItems.map((item) => (
      <Link
        key={item.to}
        to={item.to}
        className={`${styles.navLink} ${location.pathname === item.to ? styles.active : ""}`}
      >
        <span className={styles.icon}>{item.icon}</span>
        <span className={styles.label}>{item.label}</span>
      </Link>
    ))}

    {user?.role === "admin" && (
      <>
        <div
          className={`${styles.navLink} ${styles.adminToggle}`}
          onClick={() => setAdminOpen(!adminOpen)}
        >
          <span className={styles.icon}><UserCog size={20} /></span>
          <span className={styles.label}>Admin Dashboard</span>
          <span className={styles.chevron}>
            {adminOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        </div>

        {adminOpen && (
          <div className={styles.subMenu}>
            {adminItems.map((sub) => (
              <Link
                key={sub.to}
                to={sub.to}
                className={`${styles.navLink} ${styles.subLink} ${location.pathname === sub.to ? styles.active : ""}`}
              >
                <span className={styles.icon}>{sub.icon}</span>
                <span className={styles.label}>{sub.label}</span>
              </Link>
            ))}
          </div>
        )}
      </>
    )}
  </nav>

   {/* ---- Added by raj thakre   23 sep ---- */}
      <div className={styles.collectives}>
        <div
          className={`${styles.navLink} ${styles.adminToggle}`}
          onClick={() => setCollectivesOpen(!collectivesOpen)}
        >
          <span className={styles.icon}><Users size={20} /></span>
          <span className={styles.label}>Collectives</span>

          <span className={styles.chevron}>
            {collectivesOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        </div>

        {collectivesOpen && (
          <div className={styles.subMenu}>
            {/* Always visible link */}
            <Link
              to="/collectives"
              className={`${styles.navLink} ${styles.subLink} ${location.pathname === "/collectives" ? styles.active : ""}`}
            >
              <span className={styles.icon}><Users size={16} /></span>
              <span className={styles.label}>Explore all Collectives</span>
            </Link>

            {/* Dynamic joined collectives */}
            {joinedCollectives.length > 0 &&
              joinedCollectives.map((c) => (
                <Link
                  key={c.id}
                  to={`/collectives/${c.id}`}
                  className={`${styles.navLink} ${styles.subLink} ${location.pathname === `/collectives/${c.id}` ? styles.active : ""}`}
                >
                  <img
                    src={c.icon}
                    alt={c.name}
                    style={{ width: "16px", height: "16px", marginRight: "8px", borderRadius: "4px" }}
                  />
                  <span>{c.name}</span>
                </Link>
              ))}
          </div>
        )}
      </div>

  {/* <div className={styles.collectives}>
    <p>COLLECTIVES</p>
    <Link to="/collectives" className={styles.navLink}>Explore all Collectives</Link>
    {joinedCollectives.length > 0 && (
      <div className={styles.joinedCollectives}>
        {joinedCollectives.map((c) => (
          <Link
            key={c.id}
            to={`/collectives/${c.id}`}
            className={`${styles.navLink} ${styles.collectiveLink}`}
          >
            <img src={c.icon} alt={c.name} style={{ width: 16, height: 16, marginRight: 8, borderRadius: 4 }} />
            <span>{c.name}</span>
          </Link>
        ))}
      </div>
    )}
  </div> */}

</div>

  );
};

export default Sidebar;
