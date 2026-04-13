import React, { useState } from 'react';
import { 
  Camera, 
  Sun, 
  ArrowRight, 
  CheckCircle, 
  BadgeCheck, 
  CheckCircle2, 
  Info 
} from 'lucide-react';
import { motion } from 'motion/react';

export const ScreenVerification = ({ onNext }) => {
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => setIsCapturing(false), 2000);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
      <div className="grid grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-start">
        <div className="col-span-12 lg:col-span-8 space-y-5 sm:space-y-6 lg:space-y-8">
          <section className="bg-surface-container-lowest rounded-xl p-5 sm:p-6 lg:p-8 ambient-bloom">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 sm:mb-8">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-on-surface">1. Document Capture</h3>
                <p className="text-sm text-on-surface-variant">Aadhaar or PAN Card required</p>
              </div>
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <span className={`w-2 h-2 rounded-full bg-primary ${isCapturing ? 'animate-ping' : 'animate-pulse'}`}></span>
                {isCapturing ? 'Processing...' : 'Document detected'}
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden bg-black/5 aspect-video flex items-center justify-center">
              <img 
                src="https://picsum.photos/seed/doc-scan/1200/800" 
                alt="Scan" 
                className={`w-full h-full object-cover transition-opacity duration-500 ${isCapturing ? 'opacity-30' : 'opacity-60'}`}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <div className={`w-3/4 h-2/3 border-2 border-white/80 rounded-lg relative overflow-hidden flex items-center justify-center transition-all duration-500 ${isCapturing ? 'scale-105 border-primary' : ''}`}>
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-sm"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-sm"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-sm"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-sm"></div>
                  <div className="text-white text-xs font-bold bg-primary/80 px-3 py-1 rounded-full backdrop-blur-sm">
                    {isCapturing ? 'Analyzing...' : 'Capturing... 74%'}
                  </div>
                </div>
              </div>
              {isFlashlightOn && <div className="absolute inset-0 bg-white/20 pointer-events-none z-0"></div>}
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-20">
                <div className="glass-panel p-4 rounded-xl max-w-xs border border-white/20">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-primary mb-1 block">Live Scan Progress</span>
                  <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: '74%' }}
                      animate={{ width: isCapturing ? '100%' : '74%' }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsFlashlightOn(!isFlashlightOn)}
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
            </div>
            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                { label: "Extracted Name", value: "Alex Julian Rivera" },
                { label: "Date of Birth", value: "14 March 1992" },
                { label: "ID Number", value: "XXXX-XXXX-4921" }
              ].map((item, i) => (
                <div key={i} className="bg-surface-container-low p-4 rounded-xl">
                  <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block mb-1">{item.label}</span>
                  <span className="text-sm font-semibold text-on-surface">{item.value}</span>
                </div>
              ))}
            </div>
          </section>

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
              <div className="flex-1 aspect-square rounded-2xl overflow-hidden relative border-4 border-surface-container">
                <img 
                  src="https://picsum.photos/seed/face-live/400/400" 
                  alt="Live" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 border-2 border-primary/40 rounded-2xl flex items-center justify-center">
                  <div className="w-full h-0.5 bg-primary/40 absolute top-1/2 -translate-y-1/2"></div>
                  <div className="h-full w-0.5 bg-primary/40 absolute left-1/2 -translate-x-1/2"></div>
                  <span className="text-[10px] bg-primary text-white font-bold px-2 py-0.5 absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full uppercase tracking-tighter">Live Biometric</span>
                </div>
              </div>
              <div className="flex items-center justify-center xl:rotate-0 rotate-90">
                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                  <ArrowRight size={20} />
                </div>
              </div>
              <div className="flex-1 aspect-square rounded-2xl overflow-hidden relative border-4 border-surface-container grayscale opacity-80">
                <img 
                  src="https://picsum.photos/seed/face-id/400/400" 
                  alt="ID" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="text-[10px] bg-on-surface-variant text-white font-bold px-2 py-0.5 absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full uppercase tracking-tighter">Document ID</span>
              </div>
              <div className="flex-1 space-y-4">
                <div className="p-4 bg-surface-container-low rounded-xl">
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase mb-1">Match Confidence</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-on-surface">98.4%</span>
                    <span className="text-xs text-green-600 font-bold pb-1">Excellent</span>
                  </div>
                </div>
                <div className="p-4 bg-surface-container-low rounded-xl">
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase mb-1">Liveness Check</p>
                  <div className="flex items-center gap-2">
                    <BadgeCheck size={18} className="text-green-600" />
                    <span className="text-sm font-semibold text-on-surface">Human Detected</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-5 sm:space-y-6 lg:space-y-8">
          <section className="bg-surface-container-lowest rounded-xl p-5 sm:p-6 lg:p-8 ambient-bloom">
            <div className="mb-8">
              <h3 className="text-xl font-bold tracking-tight text-on-surface">3. Age Validation</h3>
              <p className="text-sm text-on-surface-variant">Legal compliance check</p>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-xs text-on-surface-variant font-medium">Declared Age</span>
                  <span className="text-lg font-bold text-on-surface">32 Years</span>
                </div>
                <div className="w-8 h-px bg-outline-variant/30"></div>
                <div className="flex flex-col text-right">
                  <span className="text-xs text-on-surface-variant font-medium">Detected Age</span>
                  <span className="text-lg font-bold text-on-surface">32 Years</span>
                </div>
              </div>
              <div className="p-6 bg-green-50/50 border border-green-100 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-green-800">Status: Match</h4>
                  <p className="text-xs text-green-700/80">User meets minimum age requirements for loan application.</p>
                </div>
              </div>
            </div>
          </section>

          <div className="bg-surface-container rounded-xl p-5 sm:p-6 lg:p-8 space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                <span>Step Progress</span>
                <span>66%</span>
              </div>
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '66.6%' }}></div>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              By clicking continue, you verify that all provided biometric data and documentation are accurate and belong to you.
            </p>
            <button 
              onClick={onNext}
              className="w-full bg-primary-gradient text-white font-bold py-4 rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Confirm & Continue
              <ArrowRight size={16} />
            </button>
            <button 
              onClick={() => alert("Re-scanning system initialized...")}
              className="w-full py-3 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Re-scan Documents
            </button>
          </div>

          <div className="bg-primary/5 rounded-xl p-6 border border-primary/10 flex gap-4">
            <Info size={20} className="text-primary shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-primary">Why this matters?</h4>
              <p className="text-xs text-primary/80 mt-1 leading-normal">
                Multi-factor identity verification ensures your account security and speeds up the decision process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
