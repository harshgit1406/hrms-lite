import React, { useState, useRef, useEffect } from 'react';

function EmployeeMenu({ employee, onEdit, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={styles.container} ref={menuRef}>
      <button style={styles.menuButton} onClick={() => setIsOpen(!isOpen)}>
        ⋮
      </button>
      
      {isOpen && (
        <div style={styles.dropdown}>
          <button style={styles.menuItem} onClick={() => { onEdit(employee); setIsOpen(false); }}>
            ✏️ Edit
          </button>
          <button style={styles.deleteItem} onClick={() => { onDelete(employee.id); setIsOpen(false); }}>
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: 'relative'
  },
  menuButton: {
    background: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.25rem 0.5rem',
    color: '#64748b'
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '100%',
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    minWidth: '120px',
    zIndex: 10
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'transparent',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '0.9rem',
    color: '#334155'
  },
  deleteItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'transparent',
    border: 'none',
    borderTop: '1px solid #e2e8f0',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '0.9rem',
    color: '#ef4444'
  }
};

export default EmployeeMenu;