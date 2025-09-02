import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CORE_DRAFT_BACKEND|| 'http://localhost:8000',
 // Update to FastAPI backend URL
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
