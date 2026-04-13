import React, { useState } from 'react';
import { 
  Video, 
  Mic, 
  MapPin, 
  CheckCircle, 
  Sun, 
  Wifi, 
  VolumeX, 
  Mic2, 
  ArrowRight, 
  ShieldAlert, 
  Info 
} from 'lucide-react';
import { motion } from 'motion/react';

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
          <section className="bg-surface-container-lowest rounded-xl p-5 sm:p-6 lg:p-8 ambient-bloom">
            <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
              <h3 className="text-xl font-semibold tracking-tight">Required Permissions</h3>
              <span className="text-xs font-medium text-primary px-3 py-1 bg-primary/10 rounded-full">Mandatory</span>
            </div>
            <div className="space-y-6">
              {[
                { id: 'camera', icon: <Video size={20} />, title: "Camera Access", desc: "Required for identity verification" },
                { id: 'mic', icon: <Mic size={20} />, title: "Microphone Access", desc: "For clear communication with agents" },
                { id: 'location', icon: <MapPin size={20} />, title: "Location Access", desc: "Required for regional compliance" }
              ].map((item, i) => (
                <button 
                  key={i} 
                  onClick={() => togglePermission(item.id)}
                  className="w-full flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/10 hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${permissions[item.id] ? 'bg-primary/10 text-primary' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                      {item.icon}
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-on-surface-variant">{item.desc}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 font-semibold text-sm transition-colors ${permissions[item.id] ? 'text-primary' : 'text-on-surface-variant opacity-40'}`}>
                    {permissions[item.id] ? <CheckCircle size={14} /> : <div className="w-3.5 h-3.5 border-2 border-current rounded-full" />}
                    {permissions[item.id] ? 'Allowed' : 'Denied'}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="bg-surface-container-lowest rounded-xl p-5 sm:p-6 lg:p-8 ambient-bloom">
            <h3 className="text-xl font-semibold tracking-tight mb-6 sm:mb-8">Environment Check</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: <Sun size={24} />, label: "Good lighting" },
                { icon: <Wifi size={24} />, label: "Stable internet" },
                { icon: <VolumeX size={24} />, label: "Quiet room" }
              ].map((item, i) => (
                <div key={i} className="p-6 bg-surface-container rounded-xl text-center space-y-3">
                  <div className="flex justify-center text-primary opacity-60">{item.icon}</div>
                  <p className="text-sm font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-5 sm:space-y-6 lg:space-y-8">
          <section className="bg-surface-container-lowest rounded-xl p-4 sm:p-5 lg:p-6 ambient-bloom">
            <div className="aspect-video bg-surface-container rounded-lg overflow-hidden relative mb-6">
              <img 
                src="https://picsum.photos/seed/setup/600/400" 
                alt="Preview" 
                className={`w-full h-full object-cover transition-all duration-700 ${permissions.camera ? 'grayscale-[30%]' : 'grayscale blur-xl opacity-20'}`}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
                  <span className={`w-2 h-2 rounded-full ${permissions.camera ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></span>
                  <span className="text-xs font-bold text-on-surface uppercase tracking-tighter">
                    {permissions.camera ? 'Live Preview' : 'Camera Disabled'}
                  </span>
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
              <span className="text-xs font-medium">FaceTime HD Camera (Built-in)</span>
            </div>
          </section>

          <div className="space-y-6">
            <button 
              onClick={onNext}
              disabled={!allAllowed}
              className={`w-full py-5 rounded-xl text-white font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3 ${
                allAllowed 
                  ? 'bg-primary-gradient hover:shadow-xl hover:scale-[0.98]' 
                  : 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed opacity-50'
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
      </div>
    </div>
  );
};
