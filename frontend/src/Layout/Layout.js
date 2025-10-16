import React, { useState } from 'react';
import Navbar from '../../src/components/Navbar';
import Sidebar from '../../src/components/Sidebar';
import Footer from '../../src/components/Footer1';
import styles from './Layout.module.css';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    // This fragment holds the fixed navbar and the main page container
    <>
      <Navbar toggleSidebar={toggleSidebar} />
      
      {/* This new container will manage the sticky footer */}
      <div className={styles.pageContainer}>
        
        {/* This area holds the sidebar and main content side-by-side */}
        <div className={styles.mainArea}>
          <Sidebar isOpen={isSidebarOpen} />
          <main className={styles.contentArea}>
            {children}
          </main>
        </div>
        
        {/* The Footer is now a direct child of the sticky footer container */}
        <Footer />
      </div>

      {/* Mobile overlay remains for the slide-out sidebar */}
      {isSidebarOpen && <div className={styles.overlay} onClick={toggleSidebar}></div>}
    </>
  );
};

export default Layout;