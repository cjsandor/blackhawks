import React from 'react';

const AttendanceToggle = ({ holderId, gameId, isAttending, toggleAttendance }) => (
  <button
    className={`w-full px-2 py-1 rounded ${isAttending ? 'bg-green-500' : 'bg-red-500'} text-white`}
    onClick={() => toggleAttendance(holderId, gameId)}
  >
    {isAttending ? 'Attending' : 'Not Attending'}
  </button>
);

export default AttendanceToggle;