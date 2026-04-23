import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import habitReducer from '../features/habits/habitSlice';
import notificationReducer from '../features/notifications/notificationSlice';
// Import any other reducers you have
import rewardReducer from '../features/rewards/rewardSlice';
import aiReducer from '../features/ai/aiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    habits: habitReducer,
    notifications: notificationReducer, // Make sure this is added
    // Include any other reducers
    rewards: rewardReducer,  // Make sure this is included
    ai: aiReducer
  },
});