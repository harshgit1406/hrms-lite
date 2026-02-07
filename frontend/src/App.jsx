import React from 'react';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';

function App() {
  const [currentPage, setCurrentPage] = useState('employees');

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {currentPage === 'employees' ? <Employees /> : <Attendance />}
    </div>
  );
}

export default App;