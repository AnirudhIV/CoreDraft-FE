import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000', // Update to FastAPI backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
