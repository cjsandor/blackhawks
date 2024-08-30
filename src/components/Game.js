// File: blackhawks/src/components/Game.js

import React from 'react';

const Game = ({ game, onAttendanceChange }) => {
  const handleAttendanceChange = (userId, attending) => {
    onAttendanceChange(game.id, userId, attending);
  };

  return (
    <div className="game-item mb-4 p-4 border rounded">
      <p className="font-bold">{game.date} - {game.time} vs {game.opponent}</p>
      <div className="attendance-toggles mt-2">
        {['Charlie', 'Russell', 'Sam', 'Colin'].map((user, index) => (
          <button
            key={user}
            onClick={() => handleAttendanceChange(`holder${index + 1}`, !game.attendance[`holder${index + 1}`])}
            className={`mr-2 px-2 py-1 rounded ${game.attendance[`holder${index + 1}`] ? 'bg-green-500' : 'bg-red-500'} text-white`}
          >
            {user}: {game.attendance[`holder${index + 1}`] ? 'Attending' : 'Not Attending'}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Game;