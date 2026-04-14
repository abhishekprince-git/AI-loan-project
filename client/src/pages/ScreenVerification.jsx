import React, { useState } from 'react';
import { DocumentCaptureSection, BiometricAnalysisSection, VerificationSidebar, MismatchResolver } from '../features/verification';

export const ScreenVerification = ({ onNext }) => {
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);
  const [showMismatchResolver, setShowMismatchResolver] = useState(false);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
      <div className="grid grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-start">
        <div className="col-span-12 lg:col-span-8 space-y-5 sm:space-y-6 lg:space-y-8">
          {!showMismatchResolver ? (
            <>
              <DocumentCaptureSection
                isFlashlightOn={isFlashlightOn}
                onToggleFlashlight={() => setIsFlashlightOn((prev) => !prev)}
                onComplete={() => setShowMismatchResolver(true)}
              />
              <BiometricAnalysisSection />
            </>
          ) : (
            <MismatchResolver onResolved={onNext} />
          )}
        </div>
        <VerificationSidebar onNext={showMismatchResolver ? onNext : () => setShowMismatchResolver(true)} />
      </div>
    </div>
  );
};
