import axios from 'axios';

// const API_URL = '/api/auth/';
let API_URL= import.meta.env.VITE_BACKEND_URL ;


// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/api/auth/register`, userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/api/auth/login`, userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

// Update user profile
const updateProfile = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  // Fix the URL to match the server endpoint
  const response = await axios.put(`${API_URL}/api/auth/update-profile`, userData, config);

  // Update the stored user data with new profile info
  if (response.data) {
    // Get current user data first
    const currentUser = JSON.parse(localStorage.getItem('user'));
    
    // Update only the user info but keep the token
    const updatedUser = {
      ...currentUser,
      ...response.data,
      token: currentUser.token  // Ensure token is preserved
    };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }

  return response.data;
};

// Update password
const updatePassword = async (passwordData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.put(`${API_URL}/api/auth/update-password`, passwordData, config);
  return response.data;
};

// Update user settings
const updateSettings = async (settingsData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.put(`${API_URL}/api/auth/settings`, settingsData, config);
  
  // Update settings in local storage
  if (response.data) {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const updatedUser = {
      ...currentUser,
      settings: response.data.settings
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }

  return response.data;
};

// Get current user data
const getCurrentUser = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.get(API_URL + 'me', config);

  if (response.data) {
    // Update stored user data with fresh data
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const updatedUser = {
      ...response.data,
      token: currentUser.token // Keep the token
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }

  return response.data;
};

const authService = {
  register,
  login,
  logout,
  updateProfile,
  updatePassword,
  updateSettings,
  getCurrentUser  // Add this to the exports
};

export default authService;