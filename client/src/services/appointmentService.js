import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getAuthConfig() {
  return { headers: { Authorization: `Bearer ${localStorage.getItem('tms_token')}` } };
}

async function sendRequest(method, path, data) {
  const response = await axios({ method, url: `${apiUrl}${path}`, data, ...getAuthConfig() });
  return response.data;
}

export function getAppointments() { return sendRequest('get', '/appointments'); }
export function getAppointment(id) { return sendRequest('get', `/appointments/${id}`); }
export function createAppointment(data) { return sendRequest('post', '/appointments', data); }
export function updateAppointment(id, data) { return sendRequest('put', `/appointments/${id}`, data); }
export function deleteAppointment(id) { return sendRequest('delete', `/appointments/${id}`); }
export function searchAppointments(keyword) { return sendRequest('get', `/appointments/search?keyword=${encodeURIComponent(keyword)}`); }
export function filterAppointments(date, status) { return sendRequest('get', `/appointments/filter?date=${date}&status=${status}`); }
