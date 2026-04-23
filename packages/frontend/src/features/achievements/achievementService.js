import axios from 'axios';
// import from dotenv
// import dotenv from 'dotenv';
// dotenv.config();

let API_URL= import.meta.env.VITE_BACKEND_URL;
// console.log(API_URL)
// let API_URL = 'http:localhost:5000/api/achievements';

// Get all achievements
const getAchievements = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Check achievement progress (triggers server to check if any achievements are completed)
const checkAchievements = async () => {
  const response = await axios.post(`${API_URL}/achievements/check`);
  return response.data;
};

const achievementService = {
  getAchievements,
  checkAchievements,
};

export default achievementService;