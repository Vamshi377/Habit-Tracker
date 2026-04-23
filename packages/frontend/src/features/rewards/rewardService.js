import axios from 'axios';

// Make sure this correctly gets your backend URL
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Get user rewards
const getRewards = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  try {
    const response = await axios.get(`${API_URL}/api/rewards`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching rewards:", error);
    return []; // Return empty array rather than letting the error propagate
  }
};

// Collect a new reward
const collectReward = async (rewardData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.post(`${API_URL}/api/rewards`, rewardData, config);
  return response.data;
};

const rewardService = {
  getRewards,
  collectReward
};

export default rewardService;