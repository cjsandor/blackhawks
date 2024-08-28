import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('API_URL:', API_URL); // Add this line for debugging

export const getScheduleData = async () => {
  try {
    console.log('Fetching data from:', `${API_URL}/schedule`);
    const response = await axios.get(`${API_URL}/schedule`);
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    console.log('Response data type:', typeof response.data);
    if (Array.isArray(response.data)) {
      console.log('Data is an array with length:', response.data.length);
    } else {
      console.log('Data is not an array');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching schedule data:', error);
    throw error;
  }
};