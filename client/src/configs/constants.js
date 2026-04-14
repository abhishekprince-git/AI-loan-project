export const STATIC_STEP_DASHBOARD = 'dashboard';
export const STATIC_STEP_SETTINGS = 'settings';
export const STATIC_STEP_PROFILE = 'profile';
export const STATIC_STEP_SUPPORT = 'support';

export const FLOW_FIRST_STEP = 1;
export const FLOW_LAST_STEP = 6;

export const isFlowStep = (step) =>
  typeof step === 'number' && step >= FLOW_FIRST_STEP && step <= FLOW_LAST_STEP;
