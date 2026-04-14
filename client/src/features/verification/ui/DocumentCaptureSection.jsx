
import React, { useRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Camera, Sun, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { setOcrData } from '../../applicationData';

export const DocumentCaptureSection = ({ isFlashlightOn, onToggleFlashlight, onComplete }) => {
  const dispatch = useDispatch();
  const videoRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [streamObj, setStreamObj] = useState(null);

  const docsToCapture = ['Aadhaar Card', 'PAN Card', 'Salary Slip', 'Bank Statement'];
  const [currentDocIndex, setCurrentDocIndex] = useState(0);
  const currentDocLabel = docsToCapture[currentDocIndex];
  const isDone = currentDocIndex >= docsToCapture.length;
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  useEffect(() => {
    let activeStream;
    const startCam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        activeStream = stream;
        setStreamObj(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access failed", err);
      }
    };
    startCam();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current || isCapturing || isDone) return;
    setIsCapturing(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      const base64 = canvas.toDataURL('image/jpeg', 0.8);

      const res = await fetch(`${backendUrl}/groq/ocr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 })
      });

      if (!res.ok) throw new Error('OCR Failed');
      const data = await res.json();
      
      if (data.ocrData) {
        dispatch(setOcrData(data.ocrData));
      }
      
      if (currentDocIndex === docsToCapture.length - 1) {
        setCurrentDocIndex(prev => prev + 1);
        onComplete(); // Move to Mismatch resolver!
      } else {
        setCurrentDocIndex(prev => prev + 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCapturing(false);
    }
  };

  const progressPct = isDone ? 100 : Math.round((currentDocIndex / docsToCapture.length) * 100);

  return (
    <section className="bg-surface-container-lowest rounded-xl p-5 sm:p-6 lg:p-8 ambient-bloom">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-on-surface">1. Document Capture</h3>
          <p className="text-sm text-on-surface-variant font-semibold text-primary mt-1">
            {isDone ? 'All documents captured!' : `Please show your: ${currentDocLabel}`}
          </p>
        </div>
        <div className="flex items-center gap-2 text-primary font-semibold text-sm">
          {!isDone && <span className={`w-2 h-2 rounded-full bg-primary ${isCapturing ? 'animate-ping' : 'animate-pulse'}`}></span>}
          {isDone ? (
             <span className="text-emerald-500 flex items-center gap-1"><CheckCircle size={16}/> Completed</span>
          ) : isCapturing ? 'Analyzing via Groq Vision...' : 'Awaiting capture'}
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden bg-black/80 aspect-video flex items-center justify-center">
        {!isDone ? (
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted 
            className={`w-full h-full object-cover transition-opacity duration-500 ${isCapturing ? 'opacity-30' : 'opacity-100'}`}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-emerald-400 gap-3">
             <CheckCircle size={48} className="animate-bounce" />
             <span className="font-bold">Scan Complete</span>
          </div>
        )}

        {!isDone && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div className={`w-3/4 h-2/3 border-2 border-white/60 rounded-lg relative overflow-hidden flex items-center justify-center transition-all duration-500 ${isCapturing ? 'scale-105 border-primary' : ''}`}>
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-sm"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-sm"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-sm"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-sm"></div>
            </div>
          </div>
        )}

        {isFlashlightOn && !isDone && <div className="absolute inset-0 bg-white/20 pointer-events-none z-0"></div>}
        
        {!isDone && (
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-20">
            <div className="glass-panel p-4 rounded-xl max-w-xs border border-white/20 flex-1 mr-4">
              <span className="text-[10px] uppercase tracking-widest font-bold text-primary mb-1 block">
                Progress: {currentDocIndex} of {docsToCapture.length} Documents
              </span>
              <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${progressPct}%` }}
                  className="h-full bg-primary rounded-full transition-all duration-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={onToggleFlashlight}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isFlashlightOn ? 'bg-primary text-white' : 'bg-white/20 backdrop-blur-md text-white hover:bg-white/30'}`}
              >
                <Sun size={24} />
              </button>
              <button
                onClick={handleCapture}
                disabled={isCapturing}
                className="w-12 h-12 rounded-full bg-primary-gradient flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
              >
                <Camera size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
