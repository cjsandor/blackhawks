import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from '@mui/material';

const Schedule = ({ games, onAttendanceChange }) => {
  const [attendance, setAttendance] = useState({});
  const ticketHolders = ['Charlie', 'Russell', 'Sam', 'Colin'];

  useEffect(() => {
    console.log('Games prop updated:', games);
    const initialAttendance = {};
    games.forEach(game => {
      initialAttendance[game.id] = game.attendance || {};
    });
    console.log('Initial attendance state:', initialAttendance);
    setAttendance(initialAttendance);
  }, [games]);

  const toggleAttendance = async (gameId, person) => {
    const currentAttendance = attendance[gameId] || {};
    const isCurrentlyAttending = !!currentAttendance[person];
    const newIsAttending = !isCurrentlyAttending;

    console.log(`Toggling attendance for game ${gameId}, person: ${person}, new status: ${newIsAttending}`);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/games/${gameId}/attendance`, 
        { person, isAttending: newIsAttending },
        { headers: { 'x-auth-token': token } }
      );

      console.log('Server response:', response.data);

      const updatedAttendance = response.data.attendance || {};
      console.log('Updated attendance from server:', updatedAttendance);

      setAttendance(prev => {
        const newAttendance = {
          ...prev,
          [gameId]: updatedAttendance
        };
        console.log('New attendance state:', newAttendance);
        return newAttendance;
      });

      onAttendanceChange(gameId, updatedAttendance);
    } catch (error) {
      console.error('Error updating attendance:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const getAvailableTickets = (gameId) => {
    const gameAttendance = attendance[gameId] || {};
    return ticketHolders.filter(person => !gameAttendance[person]).length;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <TableContainer component={Paper}>
      <Typography variant="h5" sx={{ p: 2, textAlign: 'center' }}><strong>Full Season Schedule</strong></Typography>
      <Table sx={{ minWidth: 650 }} aria-label="schedule table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
            <TableCell align="center">Opponent</TableCell>
            {ticketHolders.map(person => (
              <TableCell key={person} align="center">{person}</TableCell>
            ))}
            <TableCell align="center">Available Tickets</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {games.map((game) => (
            <TableRow key={game.id}>
              <TableCell>{formatDate(game.date)}</TableCell>
              <TableCell>{game.time}</TableCell>
              <TableCell align="center"><strong>{game.opponent}</strong></TableCell>
              {ticketHolders.map(person => (
                <TableCell key={`${game.id}-${person}`} align="center">
                  <Button
                    variant="contained"
                    onClick={() => toggleAttendance(game.id, person)}
                    color={attendance[game.id]?.[person] ? "success" : "error"}
                    size="small"
                  >
                    {attendance[game.id]?.[person] ? 'Attending' : 'Not Attending'}
                  </Button>
                </TableCell>
              ))}
              <TableCell align="center"><strong>{getAvailableTickets(game.id)}</strong></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Schedule;