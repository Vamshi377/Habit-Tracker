import axios from 'axios';

// const API_URL = '/api/habits/';
let API_URL= import.meta.env.VITE_BACKEND_URL 


// Create a new habit
const createHabit = async (habitData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.post(`${API_URL}/api/habits`, habitData, config);
  return response.data;
};

// Get all habits
const getHabits = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.get(`${API_URL}/api/habits`, config);
  return response.data;
};

// Get habit by ID
const getHabitById = async (habitId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.get(`${API_URL}/api/habits/` + habitId, config);
  return response.data;
};

// Update habit
const updateHabit = async (habitId, habitData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.put(`${API_URL}/api/habits/` + habitId, habitData, config);
  return response.data;
};

// Delete habit
const deleteHabit = async (habitId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.delete(`${API_URL}/api/habits/` + habitId, config);
  return response.data;
};

// Complete habit
const completeHabit = async (habitId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.post(`${API_URL}/api/habits/` + habitId + '/complete', {}, config);
  return response.data;
};

// Get habit stats
const getHabitStats = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.get(`${API_URL}/api/habits/stats`, config);
  return response.data;
};

const habitService = {
  createHabit,
  getHabits,
  getHabitById,
  updateHabit,
  deleteHabit,
  completeHabit,
  getHabitStats
};

export default habitService;