// File: blackhawks/src/services/api.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const login = (username, password) => api.post('/auth/login', { username, password });

export const getSchedule = () => api.get('/schedule');

export const updateAttendance = (gameId, person, status) => 
  api.put(`/games/${gameId}/attendance`, { person, status });

export default api;