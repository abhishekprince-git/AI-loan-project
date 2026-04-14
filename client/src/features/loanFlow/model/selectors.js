export const selectLoanFlow = (state) => state.loanFlow;

export const selectCurrentStep = (state) => selectLoanFlow(state).currentStep;

export const selectIsSidebarOpen = (state) => selectLoanFlow(state).isSidebarOpen;
