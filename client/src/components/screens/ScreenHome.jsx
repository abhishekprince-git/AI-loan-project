import React from 'react';
import { 
  BadgeCheck, 
  ShieldAlert, 
  ShieldCheck, 
  Timer, 
  Video, 
  Fingerprint, 
  Landmark 
} from 'lucide-react';

export const ScreenHome = ({ onNext }) => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 lg:py-16">
    <section className="text-center mb-12 sm:mb-16 lg:mb-24 max-w-3xl mx-auto">
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-10">
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-full">
          <BadgeCheck size={16} className="text-primary" />
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-tight">Secure</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-full">
          <ShieldAlert size={16} className="text-primary" />
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-tight">Encrypted</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-full">
          <ShieldCheck size={16} className="text-primary" />
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-tight">Compliant</span>
        </div>
      </div>
      
      <h2 className="text-3xl sm:text-5xl font-extrabold leading-[1.1] tracking-[-0.04em] text-on-surface mb-4 sm:mb-6">
        Get Your Loan Approved in <span className="text-primary">Minutes</span> via AI Video Call
      </h2>
      <p className="text-base sm:text-lg text-on-surface-variant font-medium leading-relaxed mb-8 sm:mb-10 opacity-80">
        No forms. No paperwork. Just a quick video interaction powered by next-generation verification intelligence.
      </p>
      
      <div className="flex flex-col items-center gap-4">
        <button 
          onClick={onNext}
          className="bg-primary-gradient text-white px-7 sm:px-10 py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg shadow-[0_20px_50px_rgba(0,81,213,0.2)] hover:scale-[0.98] transition-all"
        >
          Start Onboarding
        </button>
        <p className="text-xs font-medium text-on-surface-variant/60 flex items-center gap-2">
          <Timer size={14} />
          Estimated time: 4-6 minutes
        </p>
      </div>
    </section>

    <section className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 lg:mb-24">
      {[
        { icon: <Video size={28} />, title: "1. Join video call", desc: "Connect with our AI assistant for a 2-minute conversation to understand your needs.", step: 3 },
        { icon: <Fingerprint size={28} />, title: "2. Verify identity", desc: "Automated document scanning and biometric matching for instant security check.", step: 4 },
        { icon: <Landmark size={28} />, title: "3. Get instant offer", desc: "Receive a personalized loan decision immediately after the session concludes.", step: 6 }
      ].map((item, i) => (
        <button 
          key={i} 
          onClick={() => onNext && i === 0 ? onNext() : alert(`This will jump to Step ${item.step} in a real app.`)}
          className="bg-surface-container-lowest p-8 rounded-xl shadow-sm group hover:shadow-md transition-all border border-outline-variant/5 text-left"
        >
          <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            {item.icon}
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-3">{item.title}</h3>
          <p className="text-on-surface-variant text-sm leading-relaxed">{item.desc}</p>
        </button>
      ))}
    </section>

    <section className="relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] bg-surface-container-high mb-12 sm:mb-16 lg:mb-24 ambient-bloom">
      <img 
        src="https://picsum.photos/seed/interface/1200/600" 
        alt="System Interface" 
        className="w-full h-full object-cover opacity-80"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end p-4 sm:p-8 lg:p-12">
        <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-white/20 max-w-sm">
          <p className="text-sm font-semibold text-primary mb-1">REAL-TIME PROCESSING</p>
          <p className="text-on-surface text-sm opacity-80">Our AI analyzes over 200 data points during the interaction to ensure the highest accuracy.</p>
        </div>
      </div>
    </section>

    <footer className="pt-8 sm:pt-12 lg:pt-16 border-t-0 text-center max-w-2xl mx-auto opacity-60">
      <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-6">
        <button onClick={() => alert("Privacy Policy coming soon...")} className="text-sm font-semibold text-primary hover:underline">Privacy Policy</button>
        <button onClick={() => alert("Terms of Service coming soon...")} className="text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors">Terms of Service</button>
        <button onClick={() => alert("GDPR Info coming soon...")} className="text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors">GDPR Info</button>
      </div>
      <p className="text-xs text-on-surface-variant leading-relaxed">
        By clicking "Start Onboarding," you consent to our automated processing systems and verify that you have read our data usage agreement. We use bank-grade encryption to protect all transmitted data.
      </p>
      <div className="mt-12 text-[10px] font-bold tracking-widest text-on-surface uppercase">
        © 2024 LOANFLOW AI TECHNOLOGIES
      </div>
    </footer>
  </div>
);
