import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import Schedule from './components/Schedule';
import UpcomingGames from './components/UpcomingGames';
import Login from './components/Login';

const App = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const fetchScheduleData = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        throw new Error('No authentication token found');
      }
      const response = await axios.get('http://localhost:5000/api/schedule', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setScheduleData(response.data);
    } catch (err) {
      console.error('Error fetching schedule data:', err);
      if (err.response && err.response.status === 401) {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        setError('Session expired. Please log in again.');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch schedule data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchScheduleData();
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = (token) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsAuthenticated(true);
    fetchScheduleData();
  };

  const handleAttendanceChange = async (gameId, newAttendance) => {
    console.log(`Attendance changed for game ${gameId}:`, newAttendance);
    setScheduleData(prevData => {
      const newData = prevData.map(game => 
        game.id === gameId ? { ...game, attendance: newAttendance } : game
      );
      console.log('Updated schedule data:', newData);
      return newData;
    });
  };

  if (isCheckingAuth) {
    return (
      <Container maxWidth="lg" sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Login
          </Typography>
          <Login onLoginSuccess={handleLoginSuccess} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Blackhawks Season Schedule
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">{error}</Typography>
        ) : scheduleData.length > 0 ? (
          <>
            <Box sx={{ mb: 4, overflowX: 'auto' }}>
              <UpcomingGames games={scheduleData} />
            </Box>
            <Schedule games={scheduleData} onAttendanceChange={handleAttendanceChange} />
          </>
        ) : (
          <Typography align="center">No games scheduled at the moment.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default App;