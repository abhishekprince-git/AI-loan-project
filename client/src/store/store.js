import { configureStore } from '@reduxjs/toolkit';
import { loanFlowReducer } from '../features/loanFlow/model/loanFlowSlice';

export const store = configureStore({
  reducer: {
    loanFlow: loanFlowReducer
  }
});
