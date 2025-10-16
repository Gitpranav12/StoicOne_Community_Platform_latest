import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from './Sidebar.module.css';

// 1. Import the new icons from lucide-react
import {
  Home,
  Search,
  Tag,
  Bot,
  FileText,
  Users,
  UserCog,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  BarChart3,
  MessageSquare,
    Trophy
} from "lucide-react";  //<----added this.........
import { useCollectives } from "./collectives/CollectivesContext";

// 2. Define the navigation links in an array to make them easy to manage
const menuItems = [
  { to: "/dashboard", label: "Home", icon: <Home size={20} /> },
  { to: "/questions", label: "Questions", icon: <Search size={20} /> },
  { to: "/tags", label: "Tags", icon: <Tag size={20} /> },
  { to: "/AiAssistant", label: "AI Assistant", icon: <Bot size={20} /> },
  { to: "/articles", label: "Articles", icon: <FileText size={20} /> },
  { to: "/user", label: "Users", icon: <Users size={20} /> },
  // { to: "/moderator", label: "Moderator", icon: <ShieldCheck size={20} /> },
  // { to: "/admin", label: "Admin", icon: <UserCog size={20} /> },
      { to: "/events", label: "Events", icon: <Trophy size={20} /> },
];

const adminItems = [
  { to: "/admin", label: "Analytics", icon: <BarChart3 size={18} /> },
  { to: "/admin/users", label: "Users", icon: <Users size={18} /> },
  { to: "/admin/questions", label: "Questions", icon: <Search size={18} /> },
  { to: "/admin/answers", label: "Answers", icon: <MessageSquare size={18} /> },
  { to: "/admin/tags", label: "Tags", icon: <Tag size={18} /> },
  { to: "/admin/collectives", label: "Collectives", icon: <UserCog size={18} /> },
   { to: "/admin/events", label: "Events", icon: <Trophy size={18} /> },

];  //<----added this.........

const SidebarAdmin = ({ isOpen }) => {
  // 3. Get the current URL location to highlight the active link
  const location = useLocation();
  const { joinedCollectives } = useCollectives();

  // // Toggle Admin sub-menu
  // const [adminOpen, setAdminOpen] = useState(false); //<----added this.........
  // keep submenu open if current path starts with /admin
const [adminOpen, setAdminOpen] = useState(location.pathname.startsWith("/admin"));
React.useEffect(() => {
  if (location.pathname.startsWith("/admin")) {
    setAdminOpen(true);  // keep open when navigating inside /admin
  }
}, [location.pathname]);


  // ..........added by raj -----23 sep

  // --- Explore Collectives toggle ---
  const [collectivesOpen, setCollectivesOpen] = useState(
    location.pathname.startsWith("/collectives")
  );
  React.useEffect(() => {
    if (location.pathname.startsWith("/collectives")) setCollectivesOpen(true);
  }, [location.pathname]);
  

  return (
    // 4. We keep the original responsive wrapper div
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <nav className={styles.nav}>
        {/* 5. We map over the array to dynamically create the links */}
        {menuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            // The 'active' class is added if the link matches the current URL
            className={`${styles.navLink} ${location.pathname === item.to ? styles.active : ""}`}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </Link>
        ))}

        {/* //<----added this......... */}


        {/* Admin Section */}
        <div
          className={`${styles.navLink} ${styles.adminToggle}`}
          onClick={() => setAdminOpen(!adminOpen)}
        >
          <span className={styles.icon}>
            <UserCog size={20} />
          </span>
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
                className={`${styles.navLink} ${styles.subLink} ${location.pathname === sub.to ? styles.active : ""
                  }`}
              >
                <span className={styles.icon}>{sub.icon}</span>
                <span className={styles.label}>{sub.label}</span>
              </Link>
            ))}
          </div>
        )}



        {/* //<----added this......... */}


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
        <Link to="/collectives" className={styles.navLink}>
          Explore all Collectives
        </Link>
       
        {joinedCollectives.length > 0 && (
          <div className={styles.joinedCollectives}>
            {joinedCollectives.map((c) => (
              <Link
                key={c.id}
                to={`/collectives/${c.id}`}
                className={`${styles.navLink} ${styles.collectiveLink}`}
              >
                <img
                  src={c.icon}
                  alt={c.name}
                  style={{
                    width: "16px",
                    height: "16px",
                    marginRight: "8px",
                    borderRadius: "4px",
                  }}
                />
                <span>{c.name}</span>
              </Link>
            ))}
          </div>
        )}

      </div> */}



      
    </div>
  );
};

export default SidebarAdmin;