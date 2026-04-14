import React from 'react';
import { FileText, LifeBuoy, MessageSquare, Phone } from 'lucide-react';

export const SupportHero = () => (
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
          <button key={idx} className="text-left p-5 rounded-2xl bg-surface-container-low border border-outline-variant/10 hover:border-primary/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">{card.icon}</div>
            <h3 className="text-base font-bold text-on-surface">{card.title}</h3>
            <p className="text-xs text-on-surface-variant mt-1">{card.sub}</p>
          </button>
        ))}
      </div>
    </div>
  </section>
);
