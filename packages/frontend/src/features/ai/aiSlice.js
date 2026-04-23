import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import aiService from './aiService';

// Get habit data for AI
export const getHabitData = createAsyncThunk(
  'ai/getHabitData',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await aiService.getHabitDataForAI(token);
    } catch (error) {
      console.error('Error in getHabitData thunk:', error);
      
      // Try fallback method if the main method fails
      try {
        console.log('Attempting fallback method for habit data...');
        return aiService.getHabitDataFallback();
      } catch (fallbackError) {
        console.error('Fallback method also failed:', fallbackError);
        return thunkAPI.rejectWithValue(fallbackError.response?.data?.message || fallbackError.message);
      }
    }
  }
);

// Send message to AI
export const sendMessage = createAsyncThunk(
  'ai/sendMessage',
  async (messageData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const { message, previousMessages } = messageData;
      
      // Get habit data from state or fetch it
      let habitData = thunkAPI.getState().ai.habitData;
      
      if (!habitData || Object.keys(habitData).length === 0) {
        try {
          const response = await aiService.getHabitDataForAI(token);
          habitData = response;
        } catch (error) {
          console.error('Error fetching habit data:', error);
          // Use fallback data if API fails
          habitData = aiService.getHabitDataFallback();
        }
      }
      
      return await aiService.chatWithAI(message, habitData, token, previousMessages);
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

const initialState = {
  habitData: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  previousMessages: []
};

export const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.previousMessages = [];
    },
    addMessage: (state, action) => {
      state.previousMessages.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getHabitData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getHabitData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.habitData = action.payload;
      })
      .addCase(getHabitData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to load habit data';
      })
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.previousMessages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to send message';
      });
  }
});

export const { reset, addMessage } = aiSlice.actions;
export default aiSlice.reducer;
