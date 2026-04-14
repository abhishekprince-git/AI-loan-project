import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Bolt, 
  CheckCircle, 
  BarChart3, 
  ClipboardCheck, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Wallet, 
  BadgeCheck,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { selectFinalVerifiedData } from '../features/applicationData';

export const ScreenDecision = ({ onNext }) => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [decisionResult, setDecisionResult] = useState(null);
  const finalData = useSelector(selectFinalVerifiedData) || {};

  useEffect(() => {
    const evaluateLoan = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
        const res = await fetch(`${backendUrl}/loan/evaluate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalData)
        });
        const data = await res.json();
        
        // Add fake delay to simulate deep checking
        setTimeout(() => {
          setDecisionResult(data);
          setIsProcessing(false);
        }, 3000);
      } catch (err) {
        console.error(err);
        setDecisionResult({ decision: 'Rejected', reason: 'Internal error communicating with eligibility engine.' });
        setIsProcessing(false);
      }
    };
    evaluateLoan();
  }, [finalData]);

  const isApproved = decisionResult?.decision === 'Approved';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12">
      <div className="mb-8 sm:mb-10 lg:mb-12">
        <div className="bg-surface-container-lowest rounded-[2rem] p-6 sm:p-8 lg:p-12 ambient-bloom text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 mb-8 relative">
              <div className="absolute inset-0 border-4 border-primary/10 rounded-full"></div>
              <div className={`absolute inset-0 border-4 border-primary border-t-transparent rounded-full ${isProcessing ? 'animate-spin' : ''}`}></div>
              <span className="absolute inset-0 flex items-center justify-center text-primary">
                {isProcessing ? <Bolt size={32} className="fill-current animate-pulse" /> : <CheckCircle size={32} className="fill-current" />}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
              {isProcessing ? 'Finalizing Decision' : 'Decision Ready'}
            </h2>
            <p className="text-on-surface-variant text-sm mb-6 sm:mb-8 lg:mb-10 max-w-sm mx-auto">
              {isProcessing 
                ? 'Our AI engine is processing your verified data points to generate an instant loan determination.'
                : 'Your application has been processed successfully. Review your results below.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 w-full">
              {[
                { icon: <BarChart3 size={20} />, label: "Analyzing responses", active: true, done: !isProcessing },
                { icon: <ClipboardCheck size={20} />, label: "Verifying documents", active: true, done: !isProcessing },
                { icon: <ShieldCheck size={20} />, label: "Evaluating eligibility", active: !isProcessing, done: !isProcessing }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center p-4 rounded-2xl bg-surface-container-low">
                  <div className={`${item.done ? 'text-green-600' : 'text-primary'} mb-2`}>
                    {item.done ? <CheckCircle size={20} /> : item.icon}
                  </div>
                  <span className="text-xs font-semibold">{item.label}</span>
                  <div className={`mt-2 w-full h-1 rounded-full ${item.active ? 'bg-primary' : 'bg-primary/20'} ${item.done ? 'bg-green-500' : ''}`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {!isProcessing && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-12 gap-5 sm:gap-6"
          >
            <div className="col-span-12 md:col-span-8 bg-surface-container-lowest rounded-[2rem] p-6 sm:p-8 lg:p-10 ambient-bloom flex flex-col justify-between">
              <div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-6 ${isApproved ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {isApproved ? <CheckCircle size={14} className="fill-current" /> : <XCircle size={14} className="fill-current" />}
                  SYSTEM {isApproved ? 'VERIFIED' : 'REJECTED'}
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">{isApproved ? 'Approved ✅' : 'Application Declined ❌'}</h1>
                <p className="text-on-surface-variant text-base sm:text-lg max-w-lg leading-relaxed">
                  {isApproved 
                    ? 'Congratulations! Based on your high confidence score and verified documentation, your application has been approved for the premium credit tier.' 
                    : decisionResult?.reason || 'Unfortunately, we are unable to provide a loan offer at this time based on our engine analysis.'}
                </p>
              </div>
              <div className="mt-8 sm:mt-10 lg:mt-12 pt-8 border-t border-outline-variant/10 flex items-center justify-between gap-4">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[10px] font-bold">AI</div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-surface-container-high flex items-center justify-center">
                    <Lock size={12} />
                  </div>
                </div>
                {isApproved && (
                  <button 
                    onClick={onNext}
                    className="px-8 py-4 bg-primary-gradient text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-lg transition-all active:scale-95"
                  >
                    View Your Offers
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="col-span-12 md:col-span-4 space-y-5 sm:space-y-6">
              <div className="bg-surface-container-lowest rounded-[2rem] p-6 sm:p-8 ambient-bloom text-center">
                <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Data Confidence</h3>
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle className="text-surface-container" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8"></circle>
                    <motion.circle 
                      initial={{ strokeDashoffset: 364.4 }}
                      animate={{ strokeDashoffset: isApproved ? 7.2 : 150 }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      className={isApproved ? "text-primary" : "text-amber-500"} cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeDasharray="364.4" strokeWidth="8"
                    ></motion.circle>
                  </svg>
                  <span className="absolute text-3xl font-black tracking-tighter">{isApproved ? '98%' : '60%'}</span>
                </div>
                <p className="text-[11px] text-on-surface-variant mt-4 font-medium italic">Based on Document Match</p>
              </div>

              <div className="bg-surface-container-high rounded-[2rem] p-6 sm:p-8">
                <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-6">Risk Profile</h3>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-3xl font-bold tracking-tight">{isApproved ? 'Low' : 'High'}</span>
                  <span className={`text-xs font-bold mb-1 ${isApproved ? 'text-green-600' : 'text-red-500'}`}>{isApproved ? 'Optimized' : 'Risky'}</span>
                </div>
                <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden">
                  <div className={`h-full w-1/4 rounded-full ${isApproved ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary">
                      <Wallet size={16} className="fill-current" />
                    </div>
                    <span className="text-xs font-semibold">Income evaluated</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary">
                      {isApproved ? <BadgeCheck size={16} className="fill-current" /> : <AlertTriangle size={16} className="fill-current text-amber-500" />}
                    </div>
                    <span className="text-xs font-semibold">{isApproved ? 'Verification successful' : 'Verification flagged'}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
