import axios from 'axios';

export const getScheduleData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/schedule');
    return response.data;
  } catch (error) {
    console.error('Error fetching schedule data:', error);
    throw error;
  }
};