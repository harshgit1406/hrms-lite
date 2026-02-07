import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../services/api';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: ''
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getAll();
      setEmployees(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await employeeAPI.create(formData);
      setFormData({ employee_id: '', full_name: '', email: '', department: '' });
      setShowForm(false);
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create employee');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this employee?')) {
      try {
        await employeeAPI.delete(id);
        fetchEmployees();
      } catch (err) {
        setError('Failed to delete employee');
      }
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Employee Management</h2>
        <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Employee'}
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {showForm && (
        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            style={styles.input}
            placeholder="Employee ID"
            value={formData.employee_id}
            onChange={(e) => setFormData({...formData, employee_id: e.target.value})}
            required
          />
          <input
            style={styles.input}
            placeholder="Full Name"
            value={formData.full_name}
            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            required
          />
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input
            style={styles.input}
            placeholder="Department"
            value={formData.department}
            onChange={(e) => setFormData({...formData, department: e.target.value})}
            required
          />
          <button style={styles.submitBtn} type="submit">Add Employee</button>
        </form>
      )}

      {employees.length === 0 ? (
        <div style={styles.empty}>No employees found. Add your first employee!</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Employee ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Department</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} style={styles.tr}>
                <td style={styles.td}>{emp.employee_id}</td>
                <td style={styles.td}>{emp.full_name}</td>
                <td style={styles.td}>{emp.email}</td>
                <td style={styles.td}>{emp.department}</td>
                <td style={styles.td}>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(emp.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  addBtn: { background: '#2563eb', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' },
  form: { background: '#f3f4f6', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: { padding: '0.75rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '1rem' },
  submitBtn: { background: '#10b981', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' },
  error: { background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' },
  loading: { textAlign: 'center', padding: '3rem', fontSize: '1.2rem' },
  empty: { textAlign: 'center', padding: '3rem', color: '#6b7280' },
  table: { width: '100%', borderCollapse: 'collapse', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' },
  th: { background: '#f9fafb', padding: '1rem', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e5e7eb' },
  tr: { borderBottom: '1px solid #e5e7eb' },
  td: { padding: '1rem' },
  deleteBtn: { background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }
};

export default Employees;