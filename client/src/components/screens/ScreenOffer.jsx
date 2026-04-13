import React, { useState } from 'react';
import { 
  CheckCircle, 
  CreditCard, 
  Calendar, 
  Download, 
  BadgeCheck 
} from 'lucide-react';
import { motion } from 'motion/react';

export const ScreenOffer = () => {
  const [tenure, setTenure] = useState(12);
  const [isAccepted, setIsAccepted] = useState(false);

  const emi = tenure === 12 ? 17725 : tenure === 24 ? 9380 : 6600;

  if (isAccepted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8"
        >
          <CheckCircle size={48} className="fill-current" />
        </motion.div>
        <h2 className="text-3xl sm:text-4xl font-bold text-on-surface mb-4">Application Submitted!</h2>
        <p className="text-on-surface-variant text-base sm:text-lg max-w-md mb-10">
          Your loan agreement has been signed and submitted. Funds will be disbursed to your account within 24 hours.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-primary-gradient text-white px-10 py-4 rounded-xl font-bold shadow-lg"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 sm:mt-8 lg:mt-12 px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12 flex flex-col gap-8 sm:gap-10 max-w-6xl mx-auto w-full">
      <section className="flex flex-col gap-2">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-[-0.02em] leading-tight text-on-surface">Your Loan Offer is Ready</h2>
        <p className="text-on-surface-variant text-base sm:text-lg max-w-2xl">Based on your verification and credit profile, we have structured a premium offer with competitive rates.</p>
      </section>

      <div className="grid grid-cols-12 gap-6">
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
                      tenure === t 
                        ? 'bg-primary/10 text-primary border-primary/20' 
                        : 'bg-surface-container-high text-on-surface-variant border-transparent hover:bg-surface-container'
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

        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-xl p-8 ambient-bloom ghost-border flex flex-col gap-6">
          <h4 className="text-lg font-bold tracking-tight">Onboarding Summary</h4>
          <div className="flex flex-col gap-5">
            {[
              { label: "Verified identity", sub: "Aadhar e-KYC Complete" },
              { label: "Documents validated", sub: "Bank Statements Verified" },
              { label: "Consent recorded", sub: "Digital Signature Auth" }
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
            <button 
              onClick={() => alert("Summary download started...")}
              className="w-full py-3 rounded-lg text-primary text-sm font-bold flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors"
            >
              <Download size={16} />
              Download Summary
            </button>
          </div>
        </div>

        <div className="col-span-12 flex flex-col md:flex-row items-center justify-between gap-6 p-1 bg-surface-container-low rounded-2xl">
          <div className="px-8 py-4 md:py-0">
            <p className="text-sm text-on-surface-variant">By accepting, you agree to the <span className="text-primary font-semibold cursor-pointer hover:underline" onClick={() => alert("Opening Terms...")}>Loan Agreement Terms</span> and repayment schedule.</p>
          </div>
          <div className="flex gap-4 p-4 w-full md:w-auto">
            <button 
              onClick={() => alert("Opening term modification...")}
              className="flex-1 md:flex-none px-8 py-4 rounded-xl bg-surface-container-high text-on-surface font-bold text-sm hover:bg-surface-container-highest transition-all"
            >
              Modify Terms
            </button>
            <button 
              onClick={() => setIsAccepted(true)}
              className="flex-1 md:flex-none px-12 py-4 rounded-xl bg-primary-gradient text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
            >
              Accept Offer
            </button>
          </div>
        </div>
      </div>

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
    </div>
  );
};
