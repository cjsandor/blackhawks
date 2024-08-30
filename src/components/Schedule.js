import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Snackbar } from '@mui/material';
import { updateAttendance } from '../services/api';

const Schedule = ({ games, onAttendanceChange }) => {
  const [localGames, setLocalGames] = useState(games);
  const [errorMessage, setErrorMessage] = useState('');
  const ticketHolders = ['Charlie', 'Russell', 'Sam', 'Colin'];

  useEffect(() => {
    // Initialize localGames with the games prop, ensuring attendance is properly set
    const initializedGames = games.map(game => ({
      ...game,
      attendance: game.attendance || ticketHolders.reduce((acc, holder) => {
        acc[holder] = 'Not Attending';
        return acc;
      }, {})
    }));
    setLocalGames(initializedGames);
  }, [games]);

  const toggleAttendance = async (gameId, person) => {
    try {
      const game = localGames.find(g => g.id === gameId);
      const currentStatus = game.attendance[person] || 'Not Attending';
      const newStatus = currentStatus === 'Attending' ? 'Not Attending' : 'Attending';

      const response = await updateAttendance(gameId, person, newStatus);

      if (response.data && response.data.attendance) {
        setLocalGames(prevGames => 
          prevGames.map(g => 
            g.id === gameId 
              ? { ...g, attendance: { ...g.attendance, ...response.data.attendance } }
              : g
          )
        );

        onAttendanceChange(gameId, response.data.attendance);
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      if (error.response && error.response.status === 404) {
        setErrorMessage(`User ${person} not found. Please ensure all users are created in the database.`);
      } else {
        setErrorMessage('An error occurred while updating attendance. Please try again.');
      }
    }
  };

  const handleCloseError = () => {
    setErrorMessage('');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getAvailableTickets = (game) => {
    return ticketHolders.filter(person => game.attendance[person] !== 'Attending').length;
  };

  return (
    <>
      <Typography variant="h4" component="h2" gutterBottom align="center">
        Full Season Schedule
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="schedule table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Opponent</TableCell>
              {ticketHolders.map(person => (
                <TableCell key={person} align="center">{person}</TableCell>
              ))}
              <TableCell align="center">Available Tickets</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {localGames.map((game) => (
              <TableRow key={game.id}>
                <TableCell>{formatDate(game.date)}</TableCell>
                <TableCell>{game.time}</TableCell>
                <TableCell>{game.opponent}</TableCell>
                {ticketHolders.map(person => (
                  <TableCell key={`${game.id}-${person}`} align="center">
                    <Button
                      variant="contained"
                      onClick={() => toggleAttendance(game.id, person)}
                      color={game.attendance[person] === 'Attending' ? "success" : "error"}
                    >
                      {game.attendance[person] === 'Attending' ? 'Attending' : 'Not Attending'}
                    </Button>
                  </TableCell>
                ))}
                <TableCell align="center">{getAvailableTickets(game)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseError}
        message={errorMessage}
      />
    </>
  );
};

export default Schedule;