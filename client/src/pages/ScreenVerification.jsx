import React, { useState } from 'react';
import { DocumentUploadVerificationSection, BiometricAnalysisSection, VerificationSidebar, MismatchResolver } from '../features/verification';

export const ScreenVerification = ({ onNext }) => {
  const [showMismatchResolver, setShowMismatchResolver] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [detectedAge, setDetectedAge] = useState(null);
  const [sidebarMessage, setSidebarMessage] = useState('Complete document upload and OTP verification before continuing.');

  const handleVerificationComplete = () => {
    setOtpVerified(true);
    setSidebarMessage('OTP verified. You may continue to biometric verification and complete the process.');
  };

  const handleSidebarNext = () => {
    if (!otpVerified) {
      setSidebarMessage('OTP verification is required before proceeding.');
      return;
    }
    setShowMismatchResolver(true);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
      <div className="grid grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-start">
        <div className="col-span-12 lg:col-span-8 space-y-5 sm:space-y-6 lg:space-y-8">
          {!showMismatchResolver ? (
            <>
              <DocumentUploadVerificationSection onVerified={handleVerificationComplete} />
              {otpVerified ? (
                <BiometricAnalysisSection onAgeDetected={setDetectedAge} />
              ) : (
                <div className="rounded-3xl border border-outline-variant/20 bg-surface-container-low p-6 text-sm text-on-surface-variant">
                  Please verify your email with OTP to unlock biometric analysis.
                </div>
              )}
            </>
          ) : (
            <MismatchResolver onResolved={onNext} />
          )}
        </div>
        <VerificationSidebar
          onNext={showMismatchResolver ? onNext : handleSidebarNext}
          detectedAge={detectedAge}
          canProceed={otpVerified}
          helperText={sidebarMessage}
        />
      </div>
    </div>
  );
};
