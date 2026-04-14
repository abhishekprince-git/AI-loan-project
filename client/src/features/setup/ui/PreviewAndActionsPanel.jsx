import React, { useEffect, useRef } from 'react';
import { ArrowRight, Info, Mic2, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export const PreviewAndActionsPanel = ({ stream, permissions, allAllowed, onNext }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="col-span-12 lg:col-span-5 space-y-5 sm:space-y-6 lg:space-y-8">
      <section className="bg-surface-container-lowest rounded-xl p-4 sm:p-5 lg:p-6 ambient-bloom">
        <div className="aspect-video bg-surface-container rounded-lg overflow-hidden relative mb-6">
          {stream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src="https://picsum.photos/seed/setup/600/400"
              alt="Preview"
              className={`w-full h-full object-cover transition-all duration-700 ${permissions.camera ? 'grayscale-[30%]' : 'grayscale blur-xl opacity-20'}`}
              referrerPolicy="no-referrer"
            />
          )}
          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-sm pointer-events-auto">
              <span className={`w-2 h-2 rounded-full ${permissions.camera ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></span>
              <span className="text-xs font-bold text-on-surface uppercase tracking-tighter">{permissions.camera ? 'Live Preview' : 'Camera Disabled'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-on-surface-variant">
          <div className="flex items-center gap-2">
            <Mic2 size={16} className={permissions.mic ? 'text-primary' : 'text-on-surface-variant opacity-40'} />
            <div className="flex gap-0.5">
              <motion.div animate={{ height: permissions.mic ? [12, 16, 12] : 4 }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-primary rounded-full"></motion.div>
              <motion.div animate={{ height: permissions.mic ? [8, 12, 8] : 4 }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-1 bg-primary/40 rounded-full mt-1"></motion.div>
              <motion.div animate={{ height: permissions.mic ? [16, 20, 16] : 4 }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-primary rounded-full -mt-1"></motion.div>
              <motion.div animate={{ height: permissions.mic ? [8, 12, 8] : 4 }} transition={{ repeat: Infinity, duration: 1.0 }} className="w-1 bg-primary/40 rounded-full mt-1"></motion.div>
            </div>
          </div>
          <span className="text-xs font-medium">Built-in Camera / Microphone</span>
        </div>
      </section>

      <div className="space-y-6">
        <button
          onClick={onNext}
          disabled={!allAllowed}
          className={`w-full py-5 rounded-xl text-white font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3 ${
            allAllowed ? 'bg-primary-gradient hover:shadow-xl hover:scale-[0.98]' : 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed opacity-50'
          }`}
        >
          {allAllowed ? 'Continue to Video Call' : 'Grant Permissions to Continue'}
          <ArrowRight size={20} />
        </button>
        <div className="flex items-center justify-center gap-2 text-on-surface-variant/60">
          <ShieldAlert size={14} />
          <span className="text-xs font-medium">Your data is encrypted end-to-end</span>
        </div>
        <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
          <div className="flex gap-4">
            <Info size={20} className="text-primary shrink-0" />
            <p className="text-sm text-primary font-medium leading-relaxed">
              The call usually takes 3-5 minutes. Please have your physical ID document ready to show on camera.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
