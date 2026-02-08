import axios from 'axios';

const API_URL = 'https://hrms-lite-production-d126.up.railway.app';
//const API_URL = 'http://127.0.0.1:8000';

export const employeeAPI = {
  getAll: () => axios.get(`${API_URL}/employees/`),
  create: (data) => axios.post(`${API_URL}/employees/`, data),
  update: (id, data) => axios.put(`${API_URL}/employees/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/employees/${id}`)
};

export const attendanceAPI = {
  getByEmployee: (employeeId) => axios.get(`${API_URL}/attendance/${employeeId}`),
  getByDate: (date) => axios.get(`${API_URL}/attendance/date/${date}`),
  getAll: () => axios.get(`${API_URL}/attendance/all/records`),
  mark: (data) => axios.post(`${API_URL}/attendance/`, data)
};