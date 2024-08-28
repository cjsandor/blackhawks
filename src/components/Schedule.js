import React from 'react';
import Game from './Game';

const Schedule = ({ games, onAttendanceChange }) => {
  return (
    <div className="schedule mt-8">
      <h2 className="text-2xl font-bold mb-4">Full Schedule</h2>
      {games.map(game => (
        <Game 
          key={game.id}
          game={game}
          onAttendanceChange={onAttendanceChange}
        />
      ))}
    </div>
  );
};

export default Schedule;