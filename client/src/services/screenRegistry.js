import {
  ScreenDashboard,
  ScreenHome,
  ScreenSetup,
  ScreenVideo,
  ScreenVerification,
  ScreenDecision,
  ScreenOffer,
  ScreenSettings,
  ScreenProfile,
  ScreenSupport
} from '../pages';

const SCREEN_COMPONENTS = {
  dashboard: ScreenDashboard,
  1: ScreenHome,
  2: ScreenSetup,
  3: ScreenVideo,
  4: ScreenVerification,
  5: ScreenDecision,
  6: ScreenOffer,
  settings: ScreenSettings,
  profile: ScreenProfile,
  support: ScreenSupport
};

export const getScreenComponent = (step) => SCREEN_COMPONENTS[step] ?? null;
