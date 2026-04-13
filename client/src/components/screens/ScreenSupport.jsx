import React, { useState } from 'react';
import {
  LifeBuoy,
  MessageSquare,
  Phone,
  FileText,
  CheckCircle2,
  Search,
  ArrowUpRight,
  Clock3,
  Shield,
  Send
} from 'lucide-react';

export const ScreenSupport = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-14">
      <section className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 lg:p-12 ambient-bloom relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-52 h-52 rounded-full bg-primary/5 blur-2xl" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-5">
            <LifeBuoy size={14} />
            Support Center
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-[-0.03em] leading-[1.05] text-on-surface mb-4">
            Get Help Without Leaving Your Onboarding Flow
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-on-surface-variant max-w-3xl leading-relaxed">
            Talk to our secure support team, browse quick fixes, or raise a priority ticket. Everything stays tied to your application session.
          </p>

          <div className="mt-7 sm:mt-8 lg:mt-10 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {[
              { icon: <MessageSquare size={18} />, title: 'Live Chat', sub: 'Avg response: 2 min' },
              { icon: <Phone size={18} />, title: 'Call Back', sub: 'Within 15 minutes' },
              { icon: <FileText size={18} />, title: 'Priority Ticket', sub: 'Track every update' }
            ].map((card, idx) => (
              <button
                key={idx}
                className="text-left p-5 rounded-2xl bg-surface-container-low border border-outline-variant/10 hover:border-primary/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                  {card.icon}
                </div>
                <h3 className="text-base font-bold text-on-surface">{card.title}</h3>
                <p className="text-xs text-on-surface-variant mt-1">{card.sub}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 sm:mt-8 grid grid-cols-1 xl:grid-cols-12 gap-6">
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
              <button className="h-12 px-6 rounded-xl bg-primary-gradient text-white text-sm font-bold shadow-lg shadow-primary/20">
                Search
              </button>
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
      </section>
    </div>
  );
};
