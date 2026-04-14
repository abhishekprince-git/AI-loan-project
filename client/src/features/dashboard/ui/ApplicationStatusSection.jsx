import React from 'react';
import { CheckCircle2, Clock3 } from 'lucide-react';

export const ApplicationStatusSection = ({ statusCards }) => (
  <div className="bg-surface-container rounded-3xl p-5 sm:p-6 border border-outline-variant/10">
    <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-5">Application Status</h3>
    <div className="space-y-4">
      {statusCards.map((card, idx) => (
        <div key={idx} className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/10 ambient-bloom">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-on-surface">{card.title}</p>
              <p className="text-xs text-on-surface-variant mt-1">{card.appId}</p>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border inline-flex items-center gap-1.5 ${card.statusTone}`}>
              {card.status.includes('Approved') ? <CheckCircle2 size={13} /> : <Clock3 size={13} />}
              {card.status}
            </span>
          </div>

          <div className="mt-4">
            <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${card.progress}%` }}></div>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">Progress: {card.progress}%</span>
              <span className="text-primary font-semibold">{card.eta}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
