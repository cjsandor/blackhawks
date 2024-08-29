import React, { useState, useEffect } from 'react';
import { getGames, updateAttendance } from './services/api';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import Schedule from './components/Schedule';
import UpcomingGames from './components/UpcomingGames';
import Login from './components/Login';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const App = () => {
  // State declarations
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [games, setGames] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Function to fetch schedule data from the API
  const fetchScheduleData = async () => {
    try {
      setLoading(true);
      const response = await getGames();
      console.log('Games response:', response);
      if (response && Array.isArray(response)) {
        setScheduleData(response);
      } else {
        console.error('Invalid response format:', response);
        setError('Invalid response format from server');
      }
    } catch (err) {
      console.error('Error fetching schedule data:', err);
      // Detailed error handling and logging
      if (err.response) {
        console.error('Error response:', err.response);
        setError(`Server error: ${err.response.status} ${err.response.statusText}`);
      } else if (err.request) {
        console.error('Error request:', err.request);
        setError('No response received from server');
      } else {
        console.error('Error message:', err.message);
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Effect hook to check authentication and fetch data on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token in App:', token);
    if (token) {
      setIsAuthenticated(true);
      fetchScheduleData();
    } else {
      setLoading(false);
    }
  }, []);

  // Handler for successful login
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    fetchScheduleData();
  };

  // Function to update attendance status for a game
  const handleAttendanceChange = async (gameId, person, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/games/${gameId}/attendance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ person, status: newStatus })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update attendance: ${errorText}`);
      }

      const updatedGame = await response.json();
      console.log('Updated game:', updatedGame);

      // Update the local state with the new attendance data
      setScheduleData(prevData => prevData.map(game => 
        game.id === gameId ? { ...game, attendance: updatedGame.attendance } : game
      ));

      return updatedGame;
    } catch (error) {
      console.error('Error in handleAttendanceChange:', error);
      console.error('Error details:', error.message, error.stack);
      throw error;
    }
  };

  // Render loading state
  if (loading) return (
    <Container maxWidth="lg" sx={{ textAlign: 'center', mt: 4 }}>
      <CircularProgress />
    </Container>
  );
  
  // Render error state
  if (error) return (
    <Container maxWidth="lg" sx={{ textAlign: 'center', mt: 4 }}>
      <Typography color="error">Error: {error}</Typography>
    </Container>
  );

  // Render login component if not authenticated
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

  // Main render for authenticated users
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Blackhawks Season Schedule
        </Typography>
        {scheduleData && scheduleData.length > 0 ? (
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