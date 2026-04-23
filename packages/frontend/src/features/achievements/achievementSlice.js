import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import achievementService from './achievementService';

const initialState = {
  achievements: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get all achievements
export const getAchievements = createAsyncThunk(
  'achievements/getAll',
  async (_, thunkAPI) => {
    try {
      return await achievementService.getAchievements();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Check achievement progress
export const checkAchievements = createAsyncThunk(
  'achievements/checkProgress',
  async (_, thunkAPI) => {
    try {
      return await achievementService.checkAchievements();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const achievementSlice = createSlice({
  name: 'achievement',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    // Update local state when an achievement is unlocked (e.g., from a socket event)
    unlockAchievement: (state, action) => {
      // Mark achievement as unlocked in user's achievement list
      // This will be handled in the auth reducer where user data is stored
      // But we can still update the UI here if needed
      state.isSuccess = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAchievements.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAchievements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.achievements = action.payload;
      })
      .addCase(getAchievements.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(checkAchievements.fulfilled, (state, action) => {
        state.isSuccess = true;
        // If there are newly unlocked achievements, the response might include them
        if (action.payload.unlockedAchievements?.length > 0) {
          // Update the state if needed, though this is primarily handled in auth state
        }
      });
  },
});

export const { reset, unlockAchievement } = achievementSlice.actions;
export default achievementSlice.reducer;