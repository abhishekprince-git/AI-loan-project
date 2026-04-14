import React from 'react';
import { BadgeCheck } from 'lucide-react';

export const OfferFooter = () => (
  <footer className="mt-auto py-6 sm:py-8 lg:py-10 flex flex-col items-center gap-4 opacity-40">
    <div className="flex items-center gap-4 sm:gap-8">
      <div className="h-6 w-24 bg-on-surface-variant/20 rounded"></div>
      <div className="h-6 w-24 bg-on-surface-variant/20 rounded"></div>
      <div className="h-6 w-24 bg-on-surface-variant/20 rounded"></div>
    </div>
    <div className="flex items-center gap-2 text-on-surface-variant">
      <BadgeCheck size={14} />
      <span className="text-[10px] font-bold uppercase tracking-widest">Compliant onboarding</span>
    </div>
  </footer>
);
