import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getAuthConfig() {
  return {
    headers: { Authorization: `Bearer ${localStorage.getItem('tms_token')}` },
  };
}

export async function getAdminDashboard() {
  const response = await axios.get(`${apiUrl}/dashboard/admin`, getAuthConfig());
  return response.data;
}

export async function getSecretaryDashboard() {
  const response = await axios.get(`${apiUrl}/dashboard/secretary`, getAuthConfig());
  return response.data;
}

export async function getExecutiveDashboard() {
  const response = await axios.get(`${apiUrl}/dashboard/executive`, getAuthConfig());
  return response.data;
}
