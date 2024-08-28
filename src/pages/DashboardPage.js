import React, { useState, useEffect } from 'react';
import Schedule from '../components/Schedule';
import UpcomingGames from '../components/UpcomingGames';
import authService from '../services/authService';
import { useHistory } from 'react-router-dom';
import { getGames, updateAttendance } from '../services/api';

const DashboardPage = () => {
  const [games, setGames] = useState([]);
  const history = useHistory();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await getGames();
      setGames(response.data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const handleAttendanceChange = async (gameId, userId, attending) => {
    try {
      await updateAttendance(gameId, userId, attending);
      setGames(prevGames => prevGames.map(game => 
        game.id === gameId 
          ? { ...game, attendance: { ...game.attendance, [userId]: attending } }
          : game
      ));
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    history.push('/login');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Blackhawks Season Schedule</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
      <UpcomingGames games={games} />
      <Schedule games={games} onAttendanceChange={handleAttendanceChange} />
    </div>
  );
};

export default DashboardPage;