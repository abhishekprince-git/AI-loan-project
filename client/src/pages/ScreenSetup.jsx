import React, { useState, useEffect } from 'react';
import { RequiredPermissionsSection, EnvironmentCheckSection, PreviewAndActionsPanel } from '../features/setup';

export const ScreenSetup = ({ onNext }) => {
  const [permissions, setPermissions] = useState({
    camera: false,
    mic: false,
    location: false
  });
  const [errors, setErrors] = useState({
    camera: null,
    mic: null,
    location: null
  });
  const [stream, setStream] = useState(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const requestMedia = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      setPermissions(prev => ({ ...prev, camera: true, mic: true }));
      setErrors(prev => ({ ...prev, camera: null, mic: null }));
    } catch (err) {
      console.error("Media permission error:", err);
      // Depending on the error, it might be heavily denied or just not found
      setErrors(prev => ({ ...prev, camera: 'Permission denied', mic: 'Permission denied' }));
      setPermissions(prev => ({ ...prev, camera: false, mic: false }));
    }
  };

  const requestLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPermissions(prev => ({ ...prev, location: true }));
          setErrors(prev => ({ ...prev, location: null }));
        },
        (err) => {
          console.error("Location error:", err);
          setErrors(prev => ({ ...prev, location: 'Permission denied' }));
          setPermissions(prev => ({ ...prev, location: false }));
        }
      );
    } else {
      setErrors(prev => ({ ...prev, location: 'Geolocation not supported' }));
      setPermissions(prev => ({ ...prev, location: false }));
    }
  };

  const togglePermission = (key) => {
    if (key === 'camera' || key === 'mic') {
      if (!permissions.camera || !permissions.mic) {
        requestMedia();
      }
    } else if (key === 'location') {
      if (!permissions.location) {
        requestLocation();
      }
    }
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
          <RequiredPermissionsSection 
            permissions={permissions} 
            errors={errors}
            onTogglePermission={togglePermission} 
          />
          <EnvironmentCheckSection stream={stream} />
        </div>
        <PreviewAndActionsPanel stream={stream} permissions={permissions} allAllowed={allAllowed} onNext={onNext} />
      </div>
    </div>
  );
};
