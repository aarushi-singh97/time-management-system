import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const config = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('tms_token')}` } });
export const getNotificationSettings = async () => (await axios.get(`${apiUrl}/notifications/settings`, config())).data;
export const saveNotificationSettings = async (settings) => (await axios.put(`${apiUrl}/notifications/settings`, settings, config())).data;
