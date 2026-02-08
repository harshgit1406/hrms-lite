import React, { useState, useEffect } from 'react';
import { employeeAPI, attendanceAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [viewDate, setViewDate] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [dateRecords, setDateRecords] = useState([]);
  const [allAttendance, setAllAttendance] = useState([]);
  const [viewMode, setViewMode] = useState('mark');
  const [viewSubMode, setViewSubMode] = useState('employee');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [marking, setMarking] = useState({});

  useEffect(() => {
    fetchEmployees();
    fetchAllAttendance();
  }, []);

  useEffect(() => {
    if (selectedEmployee && viewMode === 'view' && viewSubMode === 'employee') {
      fetchAttendance();
    }
  }, [selectedEmployee, viewMode, viewSubMode]);

  useEffect(() => {
    if (viewDate && viewMode === 'view' && viewSubMode === 'date') {
      fetchDateAttendance();
    }
  }, [viewDate, viewMode, viewSubMode]);

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

  const fetchDateAttendance = async () => {
    try {
      const response = await attendanceAPI.getByDate(viewDate);
      setDateRecords(response.data);
    } catch (err) {
      setError('Failed to fetch attendance for date');
    }
  };

  const fetchAllAttendance = async () => {
    try {
      const response = await attendanceAPI.getAll();
      setAllAttendance(response.data);
    } catch (err) {
      console.error('Failed to fetch all attendance');
    }
  };

  const handleMarkAttendance = async (employeeId, status) => {
    if (!selectedDate) {
      setError('Please select a date first');
      return;
    }
    
    setMarking({ ...marking, [employeeId]: status });
    
    try {
      await attendanceAPI.mark({
        employee_id: parseInt(employeeId),
        date: selectedDate,
        status: status
      });
      setError('');
      setSuccess(`Marked ${status} successfully!`);
      setTimeout(() => setSuccess(''), 2000);
      await fetchAllAttendance();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to mark attendance');
      setMarking({ ...marking, [employeeId]: null });
    }
  };

  const getAttendanceByDate = () => {
    if (!selectedDate) return [];
    return allAttendance.filter(record => record.date === selectedDate);
  };

  const getEmployeePieData = () => {
    if (!attendanceRecords.length) return [];
    
    let present = 0;
    let absent = 0;
    
    attendanceRecords.forEach(record => {
      if (record.status === 'Present') present++;
      else absent++;
    });
    
    return [
      { name: 'Present', value: present },
      { name: 'Absent', value: absent }
    ];
  };

  const getAttendanceStats = () => {
    const stats = {};
    allAttendance.forEach(record => {
      const emp = employees.find(e => e.id === record.employee_id);
      if (emp) {
        if (!stats[emp.full_name]) {
          stats[emp.full_name] = { present: 0, absent: 0 };
        }
        if (record.status === 'Present') {
          stats[emp.full_name].present++;
        } else {
          stats[emp.full_name].absent++;
        }
      }
    });
    return Object.entries(stats).map(([name, data]) => ({
      name,
      Present: data.present,
      Absent: data.absent
    }));
  };

  const dateAttendance = getAttendanceByDate();
  const pieData = getEmployeePieData();
  const chartData = getAttendanceStats();
  const COLORS = ['#10b981', '#ef4444'];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Attendance Management</h1>

      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      <div style={styles.tabs}>
        <button 
          style={viewMode === 'mark' ? styles.activeTab : styles.tab}
          onClick={() => setViewMode('mark')}
        >
          Mark Attendance
        </button>
        <button 
          style={viewMode === 'view' ? styles.activeTab : styles.tab}
          onClick={() => setViewMode('view')}
        >
          View Records
        </button>
      </div>

      {viewMode === 'mark' ? (
        <div>
          <div style={styles.dateSelector}>
            <label style={styles.label}>Select Date:</label>
            <input
              type="date"
              style={styles.dateInput}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {selectedDate && (
            <div style={styles.employeeList}>
              <h3 style={styles.sectionTitle}>Mark Attendance for {selectedDate}</h3>
              {employees.length === 0 ? (
                <div style={styles.empty}>No employees found</div>
              ) : (
                <div style={styles.grid}>
                  {employees.map(emp => {
                    const marked = dateAttendance.find(a => a.employee_id === emp.id);
                    const isMarking = marking[emp.id];
                    
                    return (
                      <div key={emp.id} style={styles.employeeCard}>
                        <div style={styles.employeeInfo}>
                          <div style={styles.employeeName}>{emp.full_name}</div>
                          <div style={styles.employeeId}>{emp.employee_id}</div>
                        </div>
                        <div style={styles.actions}>
                          <button 
                            style={
                              marked?.status === 'Present' || isMarking === 'Present'
                                ? styles.presentBtnActive 
                                : styles.presentBtn
                            }
                            onClick={() => handleMarkAttendance(emp.id, 'Present')}
                          >
                            Present
                          </button>
                          <button 
                            style={
                              marked?.status === 'Absent' || isMarking === 'Absent'
                                ? styles.absentBtnActive 
                                : styles.absentBtn
                            }
                            onClick={() => handleMarkAttendance(emp.id, 'Absent')}
                          >
                            Absent
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div style={styles.viewTabs}>
            <button 
              style={viewSubMode === 'employee' ? styles.activeSubTab : styles.subTab}
              onClick={() => setViewSubMode('employee')}
            >
              By Employee
            </button>
            <button 
              style={viewSubMode === 'date' ? styles.activeSubTab : styles.subTab}
              onClick={() => setViewSubMode('date')}
            >
              By Date
            </button>
          </div>

          {viewSubMode === 'employee' ? (
            <div>
              <div style={styles.filterSection}>
                <label style={styles.label}>Select Employee:</label>
                <select 
                  style={styles.select}
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                >
                  <option value="">Choose an employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.full_name} ({emp.employee_id})
                    </option>
                  ))}
                </select>
              </div>

              {selectedEmployee && attendanceRecords.length > 0 && (
                <div>
                  <div style={styles.records}>
                    <h3 style={styles.sectionTitle}>Attendance Records</h3>
                    <div style={styles.tableContainer}>
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
                                <span style={record.status === 'Present' ? styles.presentBadge : styles.absentBadge}>
                                  {record.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {pieData.length > 0 && (
                    <div style={styles.chartContainer}>
                      <h3 style={styles.sectionTitle}>Attendance Summary</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value} days`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              )}

              {selectedEmployee && attendanceRecords.length === 0 && (
                <div style={styles.empty}>No attendance records found.</div>
              )}
            </div>
          ) : (
            <div>
              <div style={styles.filterSection}>
                <label style={styles.label}>Select Date:</label>
                <input
                  type="date"
                  style={styles.dateInput}
                  value={viewDate}
                  onChange={(e) => setViewDate(e.target.value)}
                />
              </div>

              {viewDate && dateRecords.length > 0 && (
                <div>
                  <div style={styles.records}>
                    <h3 style={styles.sectionTitle}>Attendance for {viewDate}</h3>
                    <div style={styles.tableContainer}>
                      <table style={styles.table}>
                        <thead>
                          <tr>
                            <th style={styles.th}>Employee ID</th>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Department</th>
                            <th style={styles.th}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dateRecords.map((record) => (
                            <tr key={record.id} style={styles.tr}>
                              <td style={styles.td}>{record.employee_code}</td>
                              <td style={styles.td}>{record.employee_name}</td>
                              <td style={styles.td}>{record.department}</td>
                              <td style={styles.td}>
                                <span style={record.status === 'Present' ? styles.presentBadge : styles.absentBadge}>
                                  {record.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {chartData.length > 0 && (
                    <div style={styles.chartContainer}>
                      <h3 style={styles.sectionTitle}>Attendance Overview</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="Present" fill="#10b981" />
                          <Bar dataKey="Absent" fill="#ef4444" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              )}

              {viewDate && dateRecords.length === 0 && (
                <div style={styles.empty}>No attendance records found for this date.</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    fontFamily: "'Product Sans', 'Google Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    maxWidth: '1400px'
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '2rem'
  },
  tabs: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    borderBottom: '2px solid #e2e8f0'
  },
  tab: {
    background: 'transparent',
    border: 'none',
    padding: '1rem 1.5rem',
    cursor: 'pointer',
    fontSize: '1rem',
    color: '#64748b',
    borderBottom: '2px solid transparent',
    marginBottom: '-2px',
    fontWeight: '500'
  },
  activeTab: {
    background: 'transparent',
    border: 'none',
    padding: '1rem 1.5rem',
    cursor: 'pointer',
    fontSize: '1rem',
    color: '#3b82f6',
    borderBottom: '2px solid #3b82f6',
    marginBottom: '-2px',
    fontWeight: '600'
  },
  viewTabs: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    background: '#f1f5f9',
    padding: '0.5rem',
    borderRadius: '8px',
    width: 'fit-content'
  },
  subTab: {
    background: 'transparent',
    border: 'none',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    color: '#64748b',
    borderRadius: '6px',
    fontWeight: '500'
  },
  activeSubTab: {
    background: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    color: '#3b82f6',
    borderRadius: '6px',
    fontWeight: '600',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  },
  dateSelector: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#475569',
    marginBottom: '0.5rem'
  },
  dateInput: {
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '1rem',
    width: '100%',
    maxWidth: '300px'
  },
  filterSection: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  select: {
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '1rem',
    width: '100%',
    maxWidth: '400px'
  },
  employeeList: {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '1.5rem',
    marginTop: 0
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1rem'
  },
  employeeCard: {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  employeeInfo: {
    flex: 1
  },
  employeeName: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#1e293b'
  },
  employeeId: {
    fontSize: '0.875rem',
    color: '#64748b'
  },
  actions: {
    display: 'flex',
    gap: '0.5rem'
  },
  presentBtn: {
    background: '#e0f2fe',
    color: '#0369a1',
    border: '1px solid #bae6fd',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  presentBtnActive: {
    background: '#10b981',
    color: 'white',
    border: '1px solid #10b981',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600',
    boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)'
  },
  absentBtn: {
    background: '#fee2e2',
    color: '#b91c1c',
    border: '1px solid #fecaca',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  absentBtnActive: {
    background: '#ef4444',
    color: 'white',
    border: '1px solid #ef4444',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600',
    boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
  },
  error: {
    background: '#fee2e2',
    color: '#991b1b',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem'
  },
  success: {
    background: '#d1fae5',
    color: '#065f46',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem'
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    color: '#64748b'
  },
  records: {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    marginBottom: '2rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  tableContainer: {
    overflow: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    background: '#f8fafc',
    padding: '1rem',
    textAlign: 'left',
    fontWeight: '600',
    color: '#475569',
    borderBottom: '2px solid #e2e8f0'
  },
  tr: {
    borderBottom: '1px solid #e2e8f0'
  },
  td: {
    padding: '1rem',
    color: '#334155'
  },
  presentBadge: {
    background: '#d1fae5',
    color: '#065f46',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  absentBadge: {
    background: '#fee2e2',
    color: '#991b1b',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  chartContainer: {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  }
};

export default Attendance;