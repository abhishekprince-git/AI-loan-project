import React from 'react';
import { LayoutDashboard } from 'lucide-react';

export const DashboardHero = () => (
  <section className="bg-surface-container-lowest rounded-[2rem] p-6 sm:p-8 lg:p-10 ambient-bloom border border-outline-variant/10 relative overflow-hidden">
    <div className="absolute -right-14 -top-14 w-44 h-44 rounded-full bg-primary/10 blur-3xl" />
    <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
      <div>
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <LayoutDashboard size={14} />
          Account Dashboard
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-[-0.03em] text-on-surface leading-[1.08]">
          Track Every Application in One Place
        </h2>
        <p className="text-sm sm:text-base text-on-surface-variant mt-3 max-w-3xl leading-relaxed">
          Monitor status, review history, and complete pending tasks without switching between onboarding screens.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 min-w-full lg:min-w-[460px]">
        <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10">
          <p className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold">Active Applications</p>
          <p className="text-2xl font-bold text-on-surface mt-2">3</p>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10">
          <p className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold">Total Approved</p>
          <p className="text-2xl font-bold text-on-surface mt-2">INR 47L</p>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10">
          <p className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold">Open Alerts</p>
          <p className="text-2xl font-bold text-on-surface mt-2">2</p>
        </div>
      </div>
    </div>
  </section>
);
