import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PatientCase } from '../../types';

interface CasesState {
  cases: PatientCase[];
}

const initialState: CasesState = {
  cases: [],
};

const casesSlice = createSlice({
  name: 'cases',
  initialState,
  reducers: {
    addCase: (state, action: PayloadAction<PatientCase>) => {
      state.cases.unshift(action.payload); // Add to beginning for latest first
    },
    updateCase: (state, action: PayloadAction<{ id: string; updates: Partial<PatientCase> }>) => {
      const index = state.cases.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.cases[index] = { ...state.cases[index], ...action.payload.updates };
      }
    },
    removeCase: (state, action: PayloadAction<string>) => {
      state.cases = state.cases.filter(c => c.id !== action.payload);
    },
    clearCases: (state) => {
      state.cases = [];
    },
  },
});

export const { addCase, updateCase, removeCase, clearCases } = casesSlice.actions;
export default casesSlice.reducer;