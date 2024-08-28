import React from 'react';

const UpcomingGames = ({ games }) => {
  const currentDate = new Date();
  const upcomingGames = games
    .filter(game => new Date(game.date) > currentDate)
    .slice(0, 5);

  return (
    <div className="upcoming-games mb-8">
      <h2 className="text-2xl font-bold mb-4">Upcoming Games</h2>
      <ul>
        {upcomingGames.map((game) => (
          <li key={game.id} className="mb-2">
            <span className="font-semibold">{game.date}</span> vs {game.opponent} - 
            Available Tickets: {4 - Object.values(game.attendance).filter(Boolean).length}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingGames;