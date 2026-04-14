import React, { useState } from 'react';
import { RequiredPermissionsSection, EnvironmentCheckSection, PreviewAndActionsPanel } from '../features/setup';

export const ScreenSetup = ({ onNext }) => {
  const [permissions, setPermissions] = useState({
    camera: true,
    mic: true,
    location: true
  });

  const togglePermission = (key) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allAllowed = permissions.camera && permissions.mic && permissions.location;

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12">
      <div className="mb-8 sm:mb-10 lg:mb-12">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-[-0.02em] text-on-surface mb-2">Hardware Setup</h2>
        <p className="text-on-surface-variant text-base sm:text-lg max-w-2xl">To begin your identity verification, we need to ensure your audio and video components are ready for the secure call.</p>
      </div>

      <div className="grid grid-cols-12 gap-5 sm:gap-6 lg:gap-8">
        <div className="col-span-12 lg:col-span-7 space-y-5 sm:space-y-6 lg:space-y-8">
          <RequiredPermissionsSection permissions={permissions} onTogglePermission={togglePermission} />
          <EnvironmentCheckSection />
        </div>
        <PreviewAndActionsPanel permissions={permissions} allAllowed={allAllowed} onNext={onNext} />
      </div>
    </div>
  );
};
