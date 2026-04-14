import React from 'react';
import { CheckCircle, Download } from 'lucide-react';

export const OfferSummaryCard = () => (
  <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-xl p-8 ambient-bloom ghost-border flex flex-col gap-6">
    <h4 className="text-lg font-bold tracking-tight">Onboarding Summary</h4>
    <div className="flex flex-col gap-5">
      {[
        { label: 'Verified identity', sub: 'Aadhar e-KYC Complete' },
        { label: 'Documents validated', sub: 'Bank Statements Verified' },
        { label: 'Consent recorded', sub: 'Digital Signature Auth' }
      ].map((item, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <CheckCircle size={14} className="fill-current" />
          </div>
          <div>
            <p className="text-sm font-semibold text-on-surface leading-tight">{item.label}</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">{item.sub}</p>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-auto pt-6 border-t border-outline-variant/10">
      <button onClick={() => alert('Summary download started...')} className="w-full py-3 rounded-lg text-primary text-sm font-bold flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors">
        <Download size={16} />
        Download Summary
      </button>
    </div>
  </div>
);
