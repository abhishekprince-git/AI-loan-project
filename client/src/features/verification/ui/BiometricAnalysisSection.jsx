import React from 'react';
import { ArrowRight, BadgeCheck, CheckCircle } from 'lucide-react';

export const BiometricAnalysisSection = () => (
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
        <img src="https://picsum.photos/seed/face-live/400/400" alt="Live" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
        <img src="https://picsum.photos/seed/face-id/400/400" alt="ID" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
);
