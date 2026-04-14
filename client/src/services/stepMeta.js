import {
  FLOW_LAST_STEP,
  STATIC_STEP_DASHBOARD,
  STATIC_STEP_SETTINGS,
  STATIC_STEP_PROFILE,
  STATIC_STEP_SUPPORT,
  isFlowStep
} from '../configs/constants';

const STATIC_STEP_META = {
  [STATIC_STEP_DASHBOARD]: {
    title: 'User Dashboard',
    subtitle: 'Track applications, history, and pending actions'
  },
  [STATIC_STEP_SETTINGS]: {
    title: 'Settings',
    subtitle: 'Manage your preferences'
  },
  [STATIC_STEP_PROFILE]: {
    title: 'My Profile',
    subtitle: 'Personal and financial information'
  },
  [STATIC_STEP_SUPPORT]: {
    title: 'Support Center',
    subtitle: 'Help, tickets, and secure assistance'
  }
};

const FLOW_STEP_META = {
  1: { title: null, subtitle: null },
  2: { title: 'Hardware Setup', subtitle: 'Ensure your components are ready' },
  3: { title: 'Video Onboarding', subtitle: 'AI-assisted verification call' },
  4: { title: 'Identity Verification', subtitle: 'Confirm your documents and biometric data' },
  5: { title: 'Finalizing Decision', subtitle: 'AI engine is processing your data' },
  6: { title: 'Loan Offer', subtitle: 'Review and accept your structured offer' }
};

export const getStepMeta = (step) => {
  if (isFlowStep(step)) {
    return FLOW_STEP_META[step] ?? null;
  }

  return STATIC_STEP_META[step] ?? null;
};

export const getStepProgress = (step) => (isFlowStep(step) ? (step / FLOW_LAST_STEP) * 100 : 100);
