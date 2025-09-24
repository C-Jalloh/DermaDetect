import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface AppState {
  user: User | null;
  isOnline: boolean;
  isAnalyzing: boolean;
  isAuthenticated: boolean;
}

const initialState: AppState = {
  user: null,
  isOnline: true, // Default to online for demo
  isAnalyzing: false,
  isAuthenticated: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = action.payload !== null;
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    setAnalyzing: (state, action: PayloadAction<boolean>) => {
      state.isAnalyzing = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, setOnlineStatus, setAnalyzing, logout } = appSlice.actions;
export default appSlice.reducer;