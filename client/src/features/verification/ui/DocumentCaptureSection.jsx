import React from 'react';
import { Camera, Sun } from 'lucide-react';
import { motion } from 'motion/react';

export const DocumentCaptureSection = ({ isCapturing, isFlashlightOn, onToggleFlashlight, onCapture }) => (
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
            onClick={onToggleFlashlight}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isFlashlightOn ? 'bg-primary text-white' : 'bg-white/20 backdrop-blur-md text-white hover:bg-white/30'}`}
          >
            <Sun size={24} />
          </button>
          <button
            onClick={onCapture}
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
        { label: 'Extracted Name', value: 'Alex Julian Rivera' },
        { label: 'Date of Birth', value: '14 March 1992' },
        { label: 'ID Number', value: 'XXXX-XXXX-4921' }
      ].map((item, i) => (
        <div key={i} className="bg-surface-container-low p-4 rounded-xl">
          <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block mb-1">{item.label}</span>
          <span className="text-sm font-semibold text-on-surface">{item.value}</span>
        </div>
      ))}
    </div>
  </section>
);
