import React from 'react';
import { CheckCircle2, Clock3 } from 'lucide-react';

export const SupportSidebar = () => (
  <div className="xl:col-span-4 space-y-6">
    <div className="bg-surface-container-lowest rounded-3xl p-6 ambient-bloom">
      <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-5">Current Ticket Status</h4>
      <div className="space-y-4">
        {[
          { title: 'KYC Document Clarification', state: 'In Progress', time: 'Updated 12 min ago' },
          { title: 'EMI Schedule Request', state: 'Resolved', time: 'Resolved yesterday' }
        ].map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
            <p className="text-sm font-semibold text-on-surface mb-1">{item.title}</p>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold ${item.state === 'Resolved' ? 'text-green-600' : 'text-primary'}`}>{item.state}</span>
              <span className="text-[11px] text-on-surface-variant">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6">
      <h4 className="text-sm font-bold text-primary mb-4">Support SLA</h4>
      <ul className="space-y-3">
        {[
          'Live chat first response in under 2 minutes',
          'Critical onboarding blockers resolved within 30 minutes',
          'All tickets include timeline and clear next action'
        ].map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-xs text-primary/90">
            <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 pt-4 border-t border-primary/20 flex items-center gap-2 text-xs text-primary font-semibold">
        <Clock3 size={14} />
        24x7 assistance during active onboarding
      </div>
    </div>
  </div>
);
