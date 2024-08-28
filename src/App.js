import React, { useState, useEffect } from 'react';
import { getScheduleData } from './data/scheduleData';
import Schedule from './components/Schedule';
import UpcomingGames from './components/UpcomingGames';

const App = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching schedule data...');
        const data = await getScheduleData();
        console.log('Received data:', data);
        if (Array.isArray(data)) {
          setScheduleData(data);
          setLoading(false);
        } else {
          throw new Error('Invalid data format received: expected an array');
        }
      } catch (err) {
        console.error('Error fetching schedule data:', err);
        setError(err.message || 'Failed to fetch schedule data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Blackhawks Season Schedule</h1>
      {scheduleData.length > 0 ? (
        <>
          <UpcomingGames games={scheduleData} />
          <Schedule games={scheduleData} />
        </>
      ) : (
        <div>No games scheduled at the moment.</div>
      )}
    </div>
  );
};

export default App;