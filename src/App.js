import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import Schedule from './components/Schedule';
import UpcomingGames from './components/UpcomingGames';
import Login from './components/Login';

const App = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchScheduleData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/schedule', {
        headers: { 'x-auth-token': token }
      });
      setScheduleData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching schedule data:', err);
      setError('Failed to fetch schedule data');
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchScheduleData();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLoginSuccess = () => {
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

  if (loading) return (
    <Container maxWidth="lg" sx={{ textAlign: 'center', mt: 4 }}>
      <CircularProgress />
    </Container>
  );
  
  if (error) return (
    <Container maxWidth="lg" sx={{ textAlign: 'center', mt: 4 }}>
      <Typography color="error">Error: {error}</Typography>
    </Container>
  );

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
        {scheduleData.length > 0 ? (
          <>
            <Box sx={{ mb: 4, overflowX: 'auto' }}>
              <UpcomingGames games={scheduleData} />
            </Box>
            <Schedule games={scheduleData} onAttendanceChange={handleAttendanceChange} />
          </>
        ) : (
          <Typography>No games scheduled at the moment.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default App;