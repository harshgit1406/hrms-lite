import React from 'react';

function Navbar({ currentPage, setCurrentPage }) {
  return (
    <nav style={styles.nav}>
      <h1 style={styles.title}>HRMS Lite</h1>
      <div style={styles.links}>
        <button 
          style={currentPage === 'employees' ? styles.activeBtn : styles.btn}
          onClick={() => setCurrentPage('employees')}
        >
          Employees
        </button>
        <button 
          style={currentPage === 'attendance' ? styles.activeBtn : styles.btn}
          onClick={() => setCurrentPage('attendance')}
        >
          Attendance
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: '#2563eb',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  title: {
    color: 'white',
    margin: 0,
    fontSize: '1.5rem'
  },
  links: {
    display: 'flex',
    gap: '1rem'
  },
  btn: {
    background: 'transparent',
    color: 'white',
    border: '2px solid transparent',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  activeBtn: {
    background: 'white',
    color: '#2563eb',
    border: '2px solid white',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold'
  }
};

export default Navbar;