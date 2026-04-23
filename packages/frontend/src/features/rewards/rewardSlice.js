import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import rewardService from './rewardService';

const initialState = {
  rewards: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
};

// Get user rewards
export const getRewards = createAsyncThunk(
  'rewards/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await rewardService.getRewards(token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to load rewards';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Collect a new reward
export const collectReward = createAsyncThunk(
  'rewards/collect',
  async (rewardData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await rewardService.collectReward(rewardData, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to collect reward';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const rewardSlice = createSlice({
  name: 'rewards',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRewards.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRewards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.rewards = action.payload;
      })
      .addCase(getRewards.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(collectReward.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(collectReward.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.rewards.push(action.payload);
      })
      .addCase(collectReward.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset } = rewardSlice.actions;
export default rewardSlice.reducer;