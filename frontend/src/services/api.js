import axios from 'axios';

const API_URL = 'https://hrms-lite-production-d126.up.railway.app';

export const employeeAPI = {
  getAll: () => axios.get(`${API_URL}/employees/`),
  create: (data) => axios.post(`${API_URL}/employees/`, data),
  delete: (id) => axios.delete(`${API_URL}/employees/${id}`)
};

export const attendanceAPI = {
  getByEmployee: (employeeId) => axios.get(`${API_URL}/attendance/${employeeId}`),
  mark: (data) => axios.post(`${API_URL}/attendance/`, data)
};