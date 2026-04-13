import React from 'react';
import { motion } from 'motion/react';
import { Lock, Menu } from 'lucide-react';

export const TopBar = ({ title, subtitle, step, progress, onProfileClick, onMenuClick }) => (
  <header className="fixed top-0 right-0 left-0 lg:left-64 z-40 bg-white/80 backdrop-blur-md flex justify-between items-center px-4 sm:px-6 lg:px-10 h-20 shadow-sm border-b border-outline-variant/5">
    <div className="flex flex-col">
      <div className="lg:hidden mb-1">
        <button onClick={onMenuClick} className="w-9 h-9 rounded-lg bg-surface-container-low text-on-surface flex items-center justify-center" aria-label="Open menu">
          <Menu size={18} />
        </button>
      </div>
      {title ? (
        <>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-on-surface">{title}</h2>
          <p className="text-[11px] sm:text-xs text-on-surface-variant font-medium max-w-[46vw] sm:max-w-none truncate">{subtitle}</p>
        </>
      ) : (
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="hidden sm:inline text-xs font-bold tracking-widest text-on-surface-variant/50 uppercase">Application Flow</span>
          <div className="h-1 w-20 sm:w-32 bg-surface-container rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-primary rounded-full" 
            />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-primary">Step {step} of 6</span>
        </div>
      )}
    </div>
    
    <div className="flex items-center gap-3 sm:gap-6">
      <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-full">
        <Lock size={14} className="text-primary fill-primary" />
        <span className="text-xs font-semibold text-primary">Secure Session</span>
      </div>
      <button 
        onClick={onProfileClick}
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-primary-container/20 p-0.5 hover:border-primary transition-all"
      >
        <img 
          src="https://picsum.photos/seed/user-profile/100/100" 
          alt="Profile" 
          className="w-full h-full rounded-full object-cover"
          referrerPolicy="no-referrer"
        />
      </button>
    </div>
  </header>
);
