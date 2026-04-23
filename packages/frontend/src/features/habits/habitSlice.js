import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import habitService from './habitService'

const initialState = {
  habits: [],
  habit: null,
  stats: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
}

export const createHabit = createAsyncThunk(
  'habits/create',
  async (habitData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await habitService.createHabit(habitData, token)
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong'
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const getHabits = createAsyncThunk(
  'habits/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await habitService.getHabits(token)
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong'
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const getHabitById = createAsyncThunk(
  'habits/getById',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await habitService.getHabitById(id, token)
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong'
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const updateHabit = createAsyncThunk(
  'habits/update',
  async ({ id, habitData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await habitService.updateHabit(id, habitData, token)
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong'
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const deleteHabit = createAsyncThunk(
  'habits/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await habitService.deleteHabit(id, token)
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong'
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Update the completeHabit thunk to handle level-ups

export const completeHabit = createAsyncThunk(
  'habits/complete',
  async (habitId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await habitService.completeHabit(habitId, token);
      
      // After habit completion, update the user data in auth state
      const { user } = thunkAPI.getState().auth;
      if (user) {
        // Calculate new XP and level
        const newXP = (user.experience || 0) + response.xpGained;
        const levelIncrease = Math.floor(newXP / 100);
        const remainingXP = newXP % 100;
        const newLevel = (user.level || 1) + levelIncrease;
        
        // Update user in localStorage with new XP and level
        const updatedUser = { 
          ...user, 
          experience: remainingXP,
          level: newLevel
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Dispatch an action to update Redux state
        thunkAPI.dispatch({ 
          type: 'auth/updateUserXP', 
          payload: updatedUser 
        });
        
        // Show level up toast if user leveled up
        if (levelIncrease > 0) {
          thunkAPI.dispatch({ type: 'toast/levelUp', payload: newLevel });
        }
      }
      
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getHabitStats = createAsyncThunk(
  'habits/stats',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await habitService.getHabitStats(token)
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong'
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const habitSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
    clearHabit: (state) => {
      state.habit = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createHabit.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createHabit.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.habits.push(action.payload)
      })
      .addCase(createHabit.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getHabits.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getHabits.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.habits = action.payload
      })
      .addCase(getHabits.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getHabitById.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getHabitById.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.habit = action.payload
      })
      .addCase(getHabitById.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateHabit.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateHabit.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.habits = state.habits.map(h => h._id === action.payload._id ? action.payload : h)
        state.habit = action.payload
      })
      .addCase(updateHabit.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteHabit.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteHabit.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.habits = state.habits.filter(h => h._id !== action.payload.id)
      })
      .addCase(deleteHabit.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(completeHabit.pending, (state) => {
        state.isLoading = true
      })
      .addCase(completeHabit.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.habits = state.habits.map(h => h._id === action.payload.habit._id ? action.payload.habit : h)
        state.habit = action.payload.habit
      })
      .addCase(completeHabit.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getHabitStats.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getHabitStats.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.stats = action.payload
      })
      .addCase(getHabitStats.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  }
})

export const { reset, clearHabit } = habitSlice.actions
export default habitSlice.reducer
