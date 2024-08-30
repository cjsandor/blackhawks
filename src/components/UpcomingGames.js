import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, CardActions, Button, Stack, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const UpcomingGames = ({ games }) => {
  const ticketHolders = ['Charlie', 'Russell', 'Sam', 'Colin'];
  const [ticketCounts, setTicketCounts] = useState({});

  const getAvailableTickets = (game) => {
    const attendance = game.attendance || {};
    return ticketHolders.filter(person => attendance[person] !== 'Attending').length;
  };

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

  const upcomingGamesWithTickets = games
    .filter((game) => {
      const gameDate = new Date(game.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return gameDate >= today && getAvailableTickets(game) > 0;
    })
    .slice(0, 6);

  const handleTicketCountChange = (gameId, change) => {
    setTicketCounts(prevCounts => {
      const currentCount = prevCounts[gameId] || 0;
      const newCount = Math.max(0, Math.min(currentCount + change, getAvailableTickets(games.find(g => g.id === gameId))));
      return { ...prevCounts, [gameId]: newCount };
    });
  };

  if (upcomingGamesWithTickets.length === 0) {
    return (
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Available Tickets
        </Typography>
        <Typography variant="body1" align="center">
          No upcoming games with available tickets.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" component="h2" gutterBottom align="center">
        Games with Available Tickets
      </Typography>
      <Stack
        direction="row"
        flexWrap="wrap"
        justifyContent="center"
        spacing={2}
        useFlexGap
      >
        {upcomingGamesWithTickets.map((game) => (
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
              <Typography variant="body1" fontWeight="bold" sx={{ mt: 2 }}>
                Available Tickets: {getAvailableTickets(game)}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={() => handleTicketCountChange(game.id, -1)} size="small">
                  <RemoveIcon />
                </IconButton>
                <Typography sx={{ mx: 1 }}>{ticketCounts[game.id] || 0}</Typography>
                <IconButton onClick={() => handleTicketCountChange(game.id, 1)} size="small">
                  <AddIcon />
                </IconButton>
              </Box>
              <Button size="small" color="primary" disabled={!ticketCounts[game.id]}>
                Claim Tickets
              </Button>
            </CardActions>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default UpcomingGames;