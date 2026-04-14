export {
  acceptOffer,
  applicationDataReducer,
  loadApplicationState,
  selectApplicationData,
  selectApplicationLoadStatus,
  selectDashboardData,
  selectFinancialProfile,
  selectOfferData,
  selectProfileData,
  selectSupportData,
  setExtractedData,
  setOcrData,
  setFinalVerifiedData
} from './model/applicationDataSlice';

export const selectExtractedData = (state) => state.applicationData.extractedData;
export const selectOcrData = (state) => state.applicationData.ocrData;
export const selectFinalVerifiedData = (state) => state.applicationData.finalVerifiedData;