import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardActions, Button, Stack, ButtonGroup } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Main component for displaying upcoming games with available tickets
const UpcomingGames = ({ games, setGames }) => {
  const ticketHolders = ['Charlie', 'Russell', 'Sam', 'Colin'];
  const [claimCounts, setClaimCounts] = useState({});
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Effect to update token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Function to calculate available tickets for a game
  const getAvailableTickets = (game) => {
    const attendance = game.attendance || {};
    return ticketHolders.filter(person => !attendance[person] || attendance[person] === false).length;
  };

  // Function to format date string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  // Filter and slice upcoming games with available tickets
  const upcomingGames = games
    .filter((game) => new Date(game.date) >= new Date())
    .filter((game) => getAvailableTickets(game) > 0)
    .slice(0, 6);

  // Function to handle claim count changes
  const handleClaimChange = (gameId, change) => {
    setClaimCounts(prevCounts => {
      const currentCount = prevCounts[gameId] || 0;
      const newCount = Math.max(0, Math.min(currentCount + change, getAvailableTickets(games.find(g => g.id === gameId))));
      return { ...prevCounts, [gameId]: newCount };
    });
  };

  // Function to update attendance status
  const handleAttendanceChange = async (gameId, person, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/games/${gameId}/attendance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ person, status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update attendance');
      }

      const updatedGame = await response.json();
      setGames(prevGames => prevGames.map(game => 
        game.id === gameId ? updatedGame : game
      ));

      return updatedGame;
    } catch (error) {
      console.error('Error updating attendance:', error);
      throw error;
    }
  };

  // Function to handle claiming tickets
  const handleClaimTickets = async (gameId) => {
    const claimCount = claimCounts[gameId] || 0;
    if (claimCount > 0) {
      // Find available ticket holders
      const availableTicketHolders = ticketHolders.filter(person => 
        !games.find(g => g.id === gameId).attendance?.[person]
      );
      
      // Update attendance for claimed tickets
      for (let i = 0; i < claimCount && i < availableTicketHolders.length; i++) {
        await handleAttendanceChange(gameId, availableTicketHolders[i], true);
      }
      
      // Reset claim count after processing
      setClaimCounts(prev => ({ ...prev, [gameId]: 0 }));
    }
  };

  // Render component
  return (
    <Box sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" component="h2" gutterBottom align="center">
        Upcoming Games with Available Tickets
      </Typography>
      <Stack
        direction="row"
        flexWrap="wrap"
        justifyContent="center"
        spacing={2}
        useFlexGap
      >
        {upcomingGames.map((game) => (
          <Card raised key={game.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.33% - 16px)' }, mb: 2 }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                {game.opponent}
              </Typography>
              <Typography color="text.secondary">
                {formatDate(game.date)}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {game.time}
              </Typography>
              <Typography variant="body1" fontWeight="bold" sx={{ mt: 2, textAlign: 'center', color: 'black' }}>
                Available Tickets: {getAvailableTickets(game)}
              </Typography>
            </CardContent>
            <CardActions sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <ButtonGroup variant="contained" size="small">
                <Button onClick={() => handleClaimChange(game.id, -1)}>-</Button>
                <Button disabled>{claimCounts[game.id] || 0}</Button>
                <Button onClick={() => handleClaimChange(game.id, 1)}>+</Button>
              </ButtonGroup>
              <Button 
                size="small" 
                color="primary" 
                variant="contained" 
                sx={{ mt: 1 }}
                disabled={!claimCounts[game.id]}
                onClick={() => handleClaimTickets(game.id)}
              >
                Claim {claimCounts[game.id] || 0} Ticket{claimCounts[game.id] !== 1 ? 's' : ''}
              </Button>
            </CardActions>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default UpcomingGames;