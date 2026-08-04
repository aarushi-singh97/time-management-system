import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const config = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('tms_token')}` } });
export const getReportDashboard = async () => (await axios.get(`${apiUrl}/reports/dashboard`, config())).data;
export const getAnalytics = async (params) => (await axios.get(`${apiUrl}/reports/appointments`, { ...config(), params })).data;
