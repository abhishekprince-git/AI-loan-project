import { createSlice } from '@reduxjs/toolkit';
import {
  FLOW_LAST_STEP,
  STATIC_STEP_DASHBOARD,
  isFlowStep
} from '../../../configs/constants';

const initialState = {
  currentStep: STATIC_STEP_DASHBOARD,
  isSidebarOpen: false
};

const loanFlowSlice = createSlice({
  name: 'loanFlow',
  initialState,
  reducers: {
    navigateToStep: (state, action) => {
      state.currentStep = action.payload;
      state.isSidebarOpen = false;
    },
    nextStep: (state) => {
      if (isFlowStep(state.currentStep) && state.currentStep < FLOW_LAST_STEP) {
        state.currentStep += 1;
      }
    },
    openSidebar: (state) => {
      state.isSidebarOpen = true;
    },
    closeSidebar: (state) => {
      state.isSidebarOpen = false;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    }
  }
});

export const { navigateToStep, nextStep, openSidebar, closeSidebar, toggleSidebar } = loanFlowSlice.actions;
export const loanFlowReducer = loanFlowSlice.reducer;
