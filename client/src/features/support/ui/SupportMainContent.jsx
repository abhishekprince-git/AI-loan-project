import React from 'react';
import { ArrowUpRight, Search, Send, Shield } from 'lucide-react';

export const SupportMainContent = ({ query, setQuery }) => (
  <div className="xl:col-span-8 space-y-6">
    <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 ambient-bloom">
      <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-4">Search Help Topics</h3>
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <label className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try: upload issue, KYC mismatch, payment schedule"
            className="w-full h-12 rounded-xl bg-surface-container-low border border-outline-variant/15 pl-11 pr-4 text-sm outline-none focus:border-primary/40"
          />
        </label>
        <button className="h-12 px-6 rounded-xl bg-primary-gradient text-white text-sm font-bold shadow-lg shadow-primary/20">Search</button>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          'How to retry document capture if OCR fails',
          'Why biometric verification can take extra time',
          'How to change repayment tenure after approval',
          'What to do if session disconnects mid-call'
        ].map((topic, i) => (
          <button key={i} className="flex items-center justify-between gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant/10 hover:border-primary/25 transition-all text-left">
            <span className="text-sm text-on-surface font-medium">{topic}</span>
            <ArrowUpRight size={16} className="text-primary shrink-0" />
          </button>
        ))}
      </div>
    </div>

    <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 ambient-bloom">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h3 className="text-lg sm:text-xl font-bold tracking-tight">Open Support Ticket</h3>
        <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">Secure channel</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="h-11 rounded-xl bg-surface-container-low border border-outline-variant/15 px-4 text-sm outline-none focus:border-primary/40" placeholder="Subject" />
        <input className="h-11 rounded-xl bg-surface-container-low border border-outline-variant/15 px-4 text-sm outline-none focus:border-primary/40" placeholder="Application ID (optional)" />
      </div>
      <textarea className="mt-4 w-full min-h-32 rounded-xl bg-surface-container-low border border-outline-variant/15 px-4 py-3 text-sm outline-none focus:border-primary/40" placeholder="Describe your issue in detail..." />
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-xs text-on-surface-variant flex items-center gap-2">
          <Shield size={14} className="text-primary" />
          Encrypted in transit and stored with session-level access control.
        </p>
        <button className="h-11 px-5 rounded-xl bg-primary text-white font-bold text-sm inline-flex items-center justify-center gap-2">
          Submit Ticket
          <Send size={16} />
        </button>
      </div>
    </div>
  </div>
);
