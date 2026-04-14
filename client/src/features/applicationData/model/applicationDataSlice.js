import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { fetchApplicationState, updateOfferAcceptance } from '../../../services/api';

const initialState = {
  data: null,
  status: 'idle',
  error: null
};

export const loadApplicationState = createAsyncThunk('applicationData/load', async () => fetchApplicationState());

export const acceptOffer = createAsyncThunk('applicationData/acceptOffer', async ({ appId, payload }) => {
  return updateOfferAcceptance(appId, payload);
});

const applicationDataSlice = createSlice({
  name: 'applicationData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadApplicationState.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadApplicationState.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(loadApplicationState.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error?.message || 'Failed to load application state';
      })
      .addCase(acceptOffer.fulfilled, (state, action) => {
        if (state.data) {
          state.data.offer = action.payload?.offer || state.data.offer;
        }
      });
  }
});

export const applicationDataReducer = applicationDataSlice.reducer;

export const selectApplicationData = (state) => state.applicationData.data;
export const selectApplicationLoadStatus = (state) => state.applicationData.status;
export const selectDashboardData = (state) => state.applicationData.data?.dashboard || null;
export const selectProfileData = (state) => state.applicationData.data?.profile || null;
export const selectFinancialProfile = (state) => state.applicationData.data?.financialProfile || null;
export const selectSupportData = (state) => state.applicationData.data?.support || null;
export const selectOfferData = (state) => state.applicationData.data?.offer || null;