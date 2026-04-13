import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// --- Components ---
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';

// --- Screens ---
import { ScreenHome } from './components/screens/ScreenHome';
import { ScreenSetup } from './components/screens/ScreenSetup';
import { ScreenVideo } from './components/screens/ScreenVideo';
import { ScreenVerification } from './components/screens/ScreenVerification';
import { ScreenDecision } from './components/screens/ScreenDecision';
import { ScreenOffer } from './components/screens/ScreenOffer';
import { ScreenSettings } from './components/screens/ScreenSettings';
import { ScreenProfile } from './components/screens/ScreenProfile';
import { ScreenSupport } from './components/screens/ScreenSupport';
import { ScreenDashboard } from './components/screens/ScreenDashboard';

export default function App() {
  const [currentStep, setCurrentStep] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const nextStep = () => {
    if (typeof currentStep === 'number' && currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const getStepTitle = () => {
    if (currentStep === 'dashboard') return { title: "User Dashboard", subtitle: "Track applications, history, and pending actions" };
    if (currentStep === 'settings') return { title: "Settings", subtitle: "Manage your preferences" };
    if (currentStep === 'profile') return { title: "My Profile", subtitle: "Personal and financial information" };
    if (currentStep === 'support') return { title: "Support Center", subtitle: "Help, tickets, and secure assistance" };
    
    switch (currentStep) {
      case 2: return { title: "Hardware Setup", subtitle: "Ensure your components are ready" };
      case 3: return { title: "Video Onboarding", subtitle: "AI-assisted verification call" };
      case 4: return { title: "Identity Verification", subtitle: "Confirm your documents and biometric data" };
      case 5: return { title: "Finalizing Decision", subtitle: "AI engine is processing your data" };
      case 6: return { title: "Loan Offer", subtitle: "Review and accept your structured offer" };
      default: return null;
    }
  };

  const stepInfo = getStepTitle();
  const progress = typeof currentStep === 'number' ? (currentStep / 6) * 100 : 100;

  return (
    <div className="min-h-screen bg-background font-sans">
      <Sidebar
        currentStep={currentStep}
        setStep={(step) => {
          setCurrentStep(step);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <TopBar 
        title={stepInfo?.title} 
        subtitle={stepInfo?.subtitle} 
        step={typeof currentStep === 'number' ? currentStep : 6} 
        progress={progress} 
        onProfileClick={() => setCurrentStep('profile')}
        onMenuClick={() => setIsSidebarOpen((prev) => !prev)}
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
            {currentStep === 'dashboard' && <ScreenDashboard />}
            {currentStep === 1 && <ScreenHome onNext={nextStep} />}
            {currentStep === 2 && <ScreenSetup onNext={nextStep} />}
            {currentStep === 3 && <ScreenVideo onNext={nextStep} />}
            {currentStep === 4 && <ScreenVerification onNext={nextStep} />}
            {currentStep === 5 && <ScreenDecision onNext={nextStep} />}
            {currentStep === 6 && <ScreenOffer />}
            {currentStep === 'settings' && <ScreenSettings />}
            {currentStep === 'profile' && <ScreenProfile />}
            {currentStep === 'support' && <ScreenSupport />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
