import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, BadgeCheck, CheckCircle } from 'lucide-react';
import { submitDetectedAge } from '../../../services/api';

const MODEL_URL = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights';

export const BiometricAnalysisSection = ({ onAgeDetected }) => {
  const videoRef = useRef(null);
  const [detectedAge, setDetectedAge] = useState(null);
  const [ageStatus, setAgeStatus] = useState('Waiting for face detection...');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const lastSentAgeRef = useRef(null);
  const detectIntervalRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    let active = true;
    let faceapi = null;

    const loadModels = async () => {
      try {
        faceapi = await import('face-api.js');
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL)
        ]);

        if (!active) return;
        setModelsLoaded(true);
        setAgeStatus('Models loaded. Detecting age...');
        startDetection(faceapi);
      } catch (err) {
        console.error('Failed to load face-api.js models', err);
        setAgeStatus('Unable to load face detection models.');
      }
    };

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error('Unable to access webcam for age detection', err);
        setAgeStatus('Camera access is required for age detection.');
      }
    };

    const startDetection = (faceapiInstance) => {
      if (!videoRef.current || !faceapiInstance) return;

      detectIntervalRef.current = window.setInterval(async () => {
        if (!videoRef.current || videoRef.current.readyState < 2) {
          return;
        }

        try {
          const detections = await faceapiInstance
            .detectSingleFace(videoRef.current, new faceapiInstance.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }))
            .withAgeAndGender();

          if (detections && detections.age) {
            const age = Math.round(detections.age);
            setDetectedAge(age);
            setAgeStatus('Age detected. Sending to backend...');
            onAgeDetected?.(age);

            if (lastSentAgeRef.current !== age) {
              lastSentAgeRef.current = age;
              try {
                await submitDetectedAge(age);
                setAgeStatus('Detected age submitted successfully.');
              } catch (err) {
                console.warn('Failed to send detected age to backend', err);
                setAgeStatus('Detected age captured but backend submission failed.');
              }
            }
          }
        } catch (err) {
          console.warn('Face detection error', err);
        }
      }, 2500);
    };

    loadModels();
    startCamera();

    return () => {
      active = false;
      if (detectIntervalRef.current) {
        window.clearInterval(detectIntervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [onAgeDetected]);

  return (
    <section className="bg-surface-container-lowest rounded-xl p-5 sm:p-6 lg:p-8 ambient-bloom">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-on-surface">2. Biometric Analysis</h3>
          <p className="text-sm text-on-surface-variant">Liveness detection and photo comparison</p>
        </div>
        <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 px-4 py-1.5 rounded-full">
          <CheckCircle size={14} className="fill-current" />
          Verified ✅
        </div>
      </div>
      <div className="flex flex-col xl:flex-row gap-5 sm:gap-6 lg:gap-8 items-center">
        <div className="flex-1 aspect-square rounded-2xl overflow-hidden relative border-4 border-surface-container bg-black/80">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 border-2 border-primary/40 rounded-2xl flex items-center justify-center pointer-events-none">
            <div className="w-full h-0.5 bg-primary/40 absolute top-1/2 -translate-y-1/2"></div>
            <div className="h-full w-0.5 bg-primary/40 absolute left-1/2 -translate-x-1/2"></div>
            <span className="text-[10px] bg-primary text-white font-bold px-2 py-0.5 absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full uppercase tracking-tighter">
              Live Biometric
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center xl:rotate-0 rotate-90">
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
            <ArrowRight size={20} />
          </div>
        </div>
        <div className="flex-1 aspect-square rounded-2xl overflow-hidden relative border-4 border-surface-container grayscale opacity-80">
          <img src="https://picsum.photos/seed/face-id/400/400" alt="ID" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <span className="text-[10px] bg-on-surface-variant text-white font-bold px-2 py-0.5 absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full uppercase tracking-tighter">
            Document ID
          </span>
        </div>
        <div className="flex-1 space-y-4">
          <div className="p-4 bg-surface-container-low rounded-xl">
            <p className="text-[10px] text-on-surface-variant font-bold uppercase mb-1">Detected Age</p>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-on-surface">{detectedAge ?? '--'}</span>
              <span className="text-xs text-on-surface-variant font-semibold pb-1">years</span>
            </div>
          </div>
          <div className="p-4 bg-surface-container-low rounded-xl">
            <p className="text-[10px] text-on-surface-variant font-bold uppercase mb-1">Detection Status</p>
            <p className="text-sm text-on-surface-variant leading-relaxed">{ageStatus}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
