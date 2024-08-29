import React from 'react';
import { Box, Typography, Card, CardContent, CardActions, Button, Stack } from '@mui/material';

const UpcomingGames = ({ games }) => {
  const ticketHolders = ['Charlie', 'Russell', 'Sam', 'Colin'];

  const getAvailableTickets = (game) => {
    const attendance = game.attendance || {};
    return ticketHolders.filter(person => !attendance[person]).length;
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

  const upcomingGames = games
    .filter((game) => new Date(game.date) >= new Date())
    .slice(0, 6);

  return (
    <Box sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" component="h2" gutterBottom align="center">
        Upcoming Games
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
              <Typography variant="body1" fontWeight="bold" sx={{ mt: 2 }}>
                Available Tickets: {getAvailableTickets(game)}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
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