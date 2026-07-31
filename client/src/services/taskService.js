import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const config = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('tms_token')}` } });
const request = async (method, path, data) => (await axios({ method, url: `${apiUrl}${path}`, data, ...config() })).data;
export const getTasks = () => request('get', '/tasks');
export const createTask = (data) => request('post', '/tasks', data);
export const updateTask = (id, data) => request('put', `/tasks/${id}`, data);
export const deleteTask = (id) => request('delete', `/tasks/${id}`);
export const completeTask = (id) => request('put', `/tasks/${id}/complete`);
