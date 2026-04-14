import { configureStore } from '@reduxjs/toolkit';
import { loanFlowReducer } from '../features/loanFlow/model/loanFlowSlice';
import { applicationDataReducer } from '../features/applicationData';

export const store = configureStore({
  reducer: {
    loanFlow: loanFlowReducer,
    applicationData: applicationDataReducer
  }
});
