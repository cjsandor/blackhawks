import axios from 'axios';

   const api = axios.create({
     baseURL: process.env.REACT_APP_API_URL
   });

   // Request interceptor for API calls
   api.interceptors.request.use(
     async config => {
       const token = localStorage.getItem('token');
       if (token) {
         config.headers = { 
           'Authorization': `Bearer ${token}`,
           'Accept': 'application/json',
           'Content-Type': 'application/json'
         }
       }
       return config;
     },
     error => {
       Promise.reject(error)
   });

   // Response interceptor for API calls
   api.interceptors.response.use((response) => {
     return response
   }, async function (error) {
     if (error.response.status === 401) {
       // Handle 401 error - e.g., redirect to login page
     }
     return Promise.reject(error);
   });

   export const login = (username, password) => {
     return api.post('/auth/login', { username, password });
   };

   export const getGames = () => {
     return api.get('/games');
   };

   export const updateAttendance = (gameId, userId, attending) => {
     return api.put(`/games/${gameId}/attendance`, { userId, attending });
   };

   // Add more API calls as needed

   export default api;