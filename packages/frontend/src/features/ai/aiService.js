import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Send message to AI with habit data
const chatWithAI = async (message, habitData, token, previousMessages) => {
  try {
    console.log('Sending message to AI:', { message, habitDataExists: !!habitData });
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const messageData = {
      message,
      habitData,
      previousMessages
    };

    const response = await sendMessage(messageData, token);
    console.log('AI response received:', response);
    return response;
  } catch (error) {
    console.error('Error in chatWithAI:', error.response?.data || error.message);
    throw error;
  }
};

// Send message to AI
const sendMessage = async (messageData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(`${API_URL}/api/ai/chat`, messageData, config);
  return response.data;
};

// Get habit data formatted for AI
const getHabitDataForAI = async (token) => {
  try {
    console.log('Fetching habit data for AI, API URL:', API_URL);
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const response = await axios.get(`${API_URL}/api/habits/ai-data`, config);
    console.log('Habit data received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching habit data:', error.response?.data || error.message);
    throw error;
  }
};

// Fallback function to use if the AI data endpoint fails
const getHabitDataFallback = () => {
  console.log('Using fallback habit data');
  return {
    habitCount: 0,
    activeHabits: 0,
    completedToday: 0,
    habits: [],
    user: {
      username: '',
      level: 1,
      experience: 0,
      streakCount: 0,
      longestStreak: 0
    }
  };
};

const aiService = {
  chatWithAI,
  getHabitDataForAI,
  getHabitDataFallback,
  sendMessage
};

export default aiService;
