import React from 'react';
import { motion } from 'motion/react';

export const NavItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
      active 
        ? 'text-primary font-semibold relative bg-white/40 shadow-sm' 
        : 'text-on-surface-variant opacity-70 hover:bg-surface-container-high hover:opacity-100'
    }`}
  >
    {active && (
      <motion.div 
        layoutId="active-nav"
        className="absolute -left-4 w-1 h-6 bg-primary rounded-full"
      />
    )}
    <span className={`${active ? 'fill-current' : ''}`}>{icon}</span>
    <span className="tracking-tight text-xs sm:text-sm leading-snug">{label}</span>
  </button>
);
