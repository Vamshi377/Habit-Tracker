import axios from 'axios';

let API_URL = import.meta.env.VITE_BACKEND_URL;

// Get user notifications
const getNotifications = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.get(`${API_URL}/api/notifications`, config);
  return response.data;
};

// Mark all notifications as read
const markAllAsRead = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.put(`${API_URL}/api/notifications/mark-read`, {}, config);
  return response.data;
};

// Mark notification as read
const markAsRead = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.put(`${API_URL}/api/notifications/${id}/mark-read`, {}, config);
  return response.data;
};

// Delete a notification
const deleteNotification = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.delete(`${API_URL}/api/notifications/${id}`, config);
  return response.data;
};

// Delete all read notifications
const deleteReadNotifications = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.delete(`${API_URL}/api/notifications/read`, config);
  return response.data;
};

const notificationService = {
  getNotifications,
  markAllAsRead,
  markAsRead,
  deleteNotification,
  deleteReadNotifications,
};

export default notificationService;