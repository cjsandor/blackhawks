import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const TOTAL_TICKETS = 4;
const ATTENDEES = ['Charlie', 'Russell', 'Sam', 'Colin'];

// Main Schedule component
const Schedule = ({ games, onAttendanceChange }) => {
  const [localGames, setLocalGames] = useState(games);

  // Update local state when games prop changes
  useEffect(() => {
    setLocalGames(games);
  }, [games]);

  // Function to determine the next attendance status
  const getNextStatus = (currentStatus) => {
    if (currentStatus === 'Attending') return 'Not Attending';
    if (currentStatus === 'Claimed') return 'Attending';
    return 'Claimed';
  };

  // Handler for attendance button clicks
  const handleAttendanceClick = async (gameId, person, currentStatus) => {
    const newStatus = getNextStatus(currentStatus);

    try {
      const updatedGame = await onAttendanceChange(gameId, person, newStatus);
      // Update local state with the new game data
      setLocalGames(prevGames => prevGames.map(game => 
        game.id === gameId ? updatedGame : game
      ));
    } catch (error) {
      console.error('Error updating attendance:', error);
      alert('Failed to update attendance. Please try again.');
    }
  };

  // Function to calculate available tickets for a game
  const calculateAvailableTickets = (attendance) => {
    const attendingCount = Object.values(attendance).filter(status => status === 'Attending').length;
    return TOTAL_TICKETS - attendingCount;
  };

  // Render the schedule table
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Opponent</TableCell>
            {ATTENDEES.map(person => (
              <TableCell key={person} align="center">{person}</TableCell>
            ))}
            <TableCell align="center">Available Tickets</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {localGames.map((game) => (
            <TableRow key={game.id}>
              <TableCell>{new Date(game.date).toLocaleDateString()}</TableCell>
              <TableCell>{game.time}</TableCell>
              <TableCell>{game.opponent}</TableCell>
              {ATTENDEES.map((person) => (
                <TableCell key={person} align="center">
                  <Button
                    variant="contained"
                    color={game.attendance[person] === 'Attending' ? 'primary' : game.attendance[person] === 'Claimed' ? 'secondary' : 'default'}
                    onClick={() => handleAttendanceClick(game.id, person, game.attendance[person] || 'Not Attending')}
                    style={{ fontSize: '0.8rem' }}
                  >
                    {game.attendance[person] || 'Not Attending'}
                  </Button>
                </TableCell>
              ))}
              <TableCell align="center">{calculateAvailableTickets(game.attendance)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Schedule;