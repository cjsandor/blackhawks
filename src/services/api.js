import axios from 'axios';

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 5000, // 5 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor: Adds authentication token to requests
api.interceptors.request.use(
  async config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handles and logs errors
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Function to handle user login
export const login = (username, password) => {
  return api.post('/auth/login', { username, password });
};

// Function to fetch games from the server
export const getGames = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get('/schedule', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('API response:', response);
    return response.data;
  } catch (error) {
    console.error('Error in getGames:', error);
    throw error;
  }
};

// Function to update attendance status for a game
export const updateAttendance = (gameId, person, status) => {
  return api.put(`/games/${gameId}/attendance`, { person, status });
};

// Add more API calls as needed

export default api;