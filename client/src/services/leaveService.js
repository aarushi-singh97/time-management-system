import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const config = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('tms_token')}` } });
const request = async (method, path, data) => (await axios({ method, url: `${apiUrl}${path}`, data, ...config() })).data;
export const getLeaves = () => request('get', '/leaves');
export const createLeave = (data) => request('post', '/leaves', data);
export const reviewLeave = (id, action) => request('put', `/leaves/${id}/${action}`);
export const cancelLeave = (id) => request('delete', `/leaves/${id}`);
