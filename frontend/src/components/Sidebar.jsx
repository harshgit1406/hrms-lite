import React, { useState, useEffect } from 'react';

function Sidebar({ currentPage, setCurrentPage }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsCollapsed(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'employees', label: 'Manage Employees', icon: '👥' },
    { id: 'attendance', label: 'Attendance', icon: '📅' }
  ];

  const sidebarStyle = isCollapsed ? styles.sidebarCollapsed : styles.sidebar;

  return (
    <div style={sidebarStyle}>
      <div style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.globe}>🌐</span>
          {!isCollapsed && (
            <div style={styles.brandInfo}>
              <span style={styles.companyName}>Demo Company</span>
              <span style={styles.systemName}>HRMS Lite System</span>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button style={styles.toggleBtn} onClick={() => setIsCollapsed(!isCollapsed)}>
            ✕
          </button>
        )}
      </div>
      
      {isCollapsed && (
        <button style={styles.expandBtn} onClick={() => setIsCollapsed(false)}>
          ☰
        </button>
      )}
      
      <nav style={styles.nav}>
        {menuItems.map(item => (
          <button
            key={item.id}
            style={currentPage === item.id ? styles.activeItem : styles.menuItem}
            onClick={() => setCurrentPage(item.id)}
            title={isCollapsed ? item.label : ''}
          >
            <span style={styles.icon}>{item.icon}</span>
            {!isCollapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
}

const styles = {
  sidebar: {
    width: '250px',
    background: '#1e293b',
    minHeight: '100vh',
    color: 'white',
    padding: '1.5rem 0',
    transition: 'width 0.3s ease',
    fontFamily: "'Google Sans', 'Product Sans', -apple-system, BlinkMacSystemFont, sans-serif"
  },
  sidebarCollapsed: {
    width: '70px',
    background: '#1e293b',
    minHeight: '100vh',
    color: 'white',
    padding: '1.5rem 0',
    transition: 'width 0.3s ease',
    fontFamily: "'Google Sans', 'Product Sans', -apple-system, BlinkMacSystemFont, sans-serif"
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 1rem',
    marginBottom: '2rem'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  globe: {
    fontSize: '1.3rem'
  },
  brandInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.15rem'
  },
  companyName: {
    fontSize: '1rem',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    letterSpacing: '0.01em'
  },
  systemName: {
    fontSize: '0.7rem',
    fontWeight: '400',
    color: '#94a3b8',
    whiteSpace: 'nowrap',
    letterSpacing: '0.02em'
  },
  toggleBtn: {
    background: 'transparent',
    border: 'none',
    color: '#94a3b8',
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '0.25rem',
    transition: 'color 0.2s'
  },
  expandBtn: {
    background: 'transparent',
    border: 'none',
    color: '#94a3b8',
    fontSize: '1.3rem',
    cursor: 'pointer',
    padding: '0.5rem',
    width: '100%',
    textAlign: 'center',
    marginBottom: '1.5rem'
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    padding: '0 1rem'
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.7rem 0.9rem',
    background: 'transparent',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    borderRadius: '8px',
    fontSize: '0.85rem',
    transition: 'all 0.2s',
    textAlign: 'left',
    whiteSpace: 'nowrap',
    fontWeight: '400'
  },
  activeItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.7rem 0.9rem',
    background: '#3b82f6',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '500',
    textAlign: 'left',
    whiteSpace: 'nowrap'
  },
  icon: {
    fontSize: '1rem'
  }
};

export default Sidebar;