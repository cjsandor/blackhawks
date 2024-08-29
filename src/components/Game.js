import React from 'react';

// Game component: Displays game information and attendance toggles for each user
const Game = ({ game, onAttendanceChange }) => {
  // Handler function for attendance change
  const handleAttendanceChange = (userId, attending) => {
    onAttendanceChange(game.id, userId, attending);
  };

  return (
    <div className="game-item mb-4 p-4 border rounded">
      {/* Display game details */}
      <p className="font-bold">{game.date} - {game.time} vs {game.opponent}</p>
      <div className="attendance-toggles mt-2">
        {/* Map through users and create attendance toggle buttons */}
        {['Charlie', 'Russell', 'Sam', 'Colin'].map((user, index) => (
          <button
            key={user}
            onClick={() => handleAttendanceChange(`holder${index + 1}`, !game.attendance[`holder${index + 1}`])}
            className={`mr-2 px-2 py-1 rounded ${game.attendance[`holder${index + 1}`] ? 'bg-green-500' : 'bg-red-500'} text-white`}
          >
            {/* Display user name and attendance status */}
            {user}: {game.attendance[`holder${index + 1}`] ? 'Attending' : 'Not Attending'}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Game;