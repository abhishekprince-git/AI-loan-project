import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDispatch, useSelector } from 'react-redux';

// --- Components ---
import { Sidebar, TopBar } from './components';

import { getStepMeta, getStepProgress, getScreenComponent } from './services';
import { FLOW_LAST_STEP, isFlowStep } from './configs/constants';
import { closeSidebar, navigateToStep, nextStep, toggleSidebar, selectCurrentStep, selectIsSidebarOpen } from './features/loanFlow';
import { loadApplicationState } from './features/applicationData';

export default function App() {
  const dispatch = useDispatch();
  const currentStep = useSelector(selectCurrentStep);
  const isSidebarOpen = useSelector(selectIsSidebarOpen);

  useEffect(() => {
    dispatch(loadApplicationState());
  }, [dispatch]);

  const stepInfo = getStepMeta(currentStep);
  const progress = getStepProgress(currentStep);
  const ActiveScreen = getScreenComponent(currentStep);
  const activeScreenProps = isFlowStep(currentStep) && currentStep < FLOW_LAST_STEP ? { onNext: () => dispatch(nextStep()) } : {};

  return (
    <div className="min-h-screen bg-background font-sans">
      <Sidebar
        currentStep={currentStep}
        setStep={(step) => dispatch(navigateToStep(step))}
        isOpen={isSidebarOpen}
        onClose={() => dispatch(closeSidebar())}
      />
      
      <TopBar 
        title={stepInfo?.title} 
        subtitle={stepInfo?.subtitle} 
        step={typeof currentStep === 'number' ? currentStep : FLOW_LAST_STEP} 
        progress={progress} 
        onProfileClick={() => dispatch(navigateToStep('profile'))}
        onMenuClick={() => dispatch(toggleSidebar())}
      />

      <main className="pt-20 lg:ml-64 min-h-[calc(100vh-5rem)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {ActiveScreen ? <ActiveScreen {...activeScreenProps} /> : null}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
