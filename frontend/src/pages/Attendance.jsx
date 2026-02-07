import React, { useState, useEffect } from 'react';
import { employeeAPI, attendanceAPI } from '../services/api';

function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [formData, setFormData] = useState({ date: '', status: 'Present' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      fetchAttendance();
    }
  }, [selectedEmployee]);

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getAll();
      setEmployees(response.data);
    } catch (err) {
      setError('Failed to fetch employees');
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await attendanceAPI.getByEmployee(selectedEmployee);
      setAttendanceRecords(response.data);
    } catch (err) {
      setError('Failed to fetch attendance');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await attendanceAPI.mark({
        employee_id: parseInt(selectedEmployee),
        date: formData.date,
        status: formData.status
      });
      setFormData({ date: '', status: 'Present' });
      fetchAttendance();
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to mark attendance');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Attendance Management</h2>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.form}>
        <select 
          style={styles.select}
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          <option value="">Select Employee</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.full_name} ({emp.employee_id})
            </option>
          ))}
        </select>

        {selectedEmployee && (
          <form onSubmit={handleSubmit} style={styles.markForm}>
            <input
              type="date"
              style={styles.input}
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
            <select
              style={styles.select}
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
            <button style={styles.submitBtn} type="submit">Mark Attendance</button>
          </form>
        )}
      </div>

      {selectedEmployee && attendanceRecords.length > 0 && (
        <div style={styles.records}>
          <h3>Attendance Records</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record) => (
                <tr key={record.id} style={styles.tr}>
                  <td style={styles.td}>{record.date}</td>
                  <td style={styles.td}>
                    <span style={record.status === 'Present' ? styles.present : styles.absent}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedEmployee && attendanceRecords.length === 0 && (
        <div style={styles.empty}>No attendance records found.</div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  form: { background: '#f3f4f6', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' },
  markForm: { display: 'flex', gap: '1rem', marginTop: '1rem' },
  select: { padding: '0.75rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '1rem', flex: 1 },
  input: { padding: '0.75rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '1rem', flex: 1 },
  submitBtn: { background: '#2563eb', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: 'pointer' },
  error: { background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' },
  empty: { textAlign: 'center', padding: '3rem', color: '#6b7280' },
  records: { marginTop: '2rem' },
  table: { width: '100%', borderCollapse: 'collapse', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' },
  th: { background: '#f9fafb', padding: '1rem', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e5e7eb' },
  tr: { borderBottom: '1px solid #e5e7eb' },
  td: { padding: '1rem' },
  present: { background: '#d1fae5', color: '#065f46', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.875rem' },
  absent: { background: '#fee2e2', color: '#991b1b', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.875rem' }
};

export default Attendance;