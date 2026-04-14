import React from 'react';
import { Calendar, CreditCard } from 'lucide-react';

export const OfferMainCard = ({ tenure, setTenure, emi }) => (
  <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl p-8 ambient-bloom ghost-border relative overflow-hidden">
    <div className="absolute top-0 right-0 p-6 opacity-5">
      <CreditCard size={120} />
    </div>
    <div className="flex flex-col gap-8 relative z-10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-5">
        <div>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Approved Amount</p>
          <h3 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-primary">₹2,00,000</h3>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Interest Rate</p>
          <p className="text-3xl font-bold text-on-surface">11.5% <span className="text-sm font-medium text-on-surface-variant">p.a.</span></p>
        </div>
      </div>
      <div className="space-y-4">
        <p className="text-sm font-semibold text-on-surface">Select Repayment Tenure</p>
        <div className="flex flex-wrap gap-3">
          {[12, 24, 36].map((t) => (
            <button
              key={t}
              onClick={() => setTenure(t)}
              className={`px-6 py-3 rounded-lg font-bold text-sm border transition-all ${
                tenure === t ? 'bg-primary/10 text-primary border-primary/20' : 'bg-surface-container-high text-on-surface-variant border-transparent hover:bg-surface-container'
              }`}
            >
              {t} Months
            </button>
          ))}
        </div>
      </div>
      <div className="bg-surface-container-low rounded-lg p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-primary">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Monthly EMI</p>
            <p className="text-2xl font-bold text-on-surface">₹{emi.toLocaleString()}</p>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs font-medium text-on-surface-variant">First Payment</p>
          <p className="text-sm font-semibold text-on-surface">Oct 05, 2024</p>
        </div>
      </div>
    </div>
  </div>
);
