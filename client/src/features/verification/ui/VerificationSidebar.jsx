import React from 'react';
import { ArrowRight, CheckCircle2, Info } from 'lucide-react';

export const VerificationSidebar = ({ onNext }) => (
  <div className="col-span-12 lg:col-span-4 space-y-5 sm:space-y-6 lg:space-y-8">
    <section className="bg-surface-container-lowest rounded-xl p-5 sm:p-6 lg:p-8 ambient-bloom">
      <div className="mb-8">
        <h3 className="text-xl font-bold tracking-tight text-on-surface">3. Age Validation</h3>
        <p className="text-sm text-on-surface-variant">Legal compliance check</p>
      </div>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xs text-on-surface-variant font-medium">Declared Age</span>
            <span className="text-lg font-bold text-on-surface">32 Years</span>
          </div>
          <div className="w-8 h-px bg-outline-variant/30"></div>
          <div className="flex flex-col text-right">
            <span className="text-xs text-on-surface-variant font-medium">Detected Age</span>
            <span className="text-lg font-bold text-on-surface">32 Years</span>
          </div>
        </div>
        <div className="p-6 bg-green-50/50 border border-green-100 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-green-800">Status: Match</h4>
            <p className="text-xs text-green-700/80">User meets minimum age requirements for loan application.</p>
          </div>
        </div>
      </div>
    </section>

    <div className="bg-surface-container rounded-xl p-5 sm:p-6 lg:p-8 space-y-6">
      <div className="space-y-3">
        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-on-surface-variant">
          <span>Step Progress</span>
          <span>66%</span>
        </div>
        <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: '66.6%' }}></div>
        </div>
      </div>
      <p className="text-xs text-on-surface-variant leading-relaxed">
        By clicking continue, you verify that all provided biometric data and documentation are accurate and belong to you.
      </p>
      <button
        onClick={onNext}
        className="w-full bg-primary-gradient text-white font-bold py-4 rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        Confirm & Continue
        <ArrowRight size={16} />
      </button>
      <button onClick={() => alert('Re-scanning system initialized...')} className="w-full py-3 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors">
        Re-scan Documents
      </button>
    </div>

    <div className="bg-primary/5 rounded-xl p-6 border border-primary/10 flex gap-4">
      <Info size={20} className="text-primary shrink-0" />
      <div>
        <h4 className="text-sm font-bold text-primary">Why this matters?</h4>
        <p className="text-xs text-primary/80 mt-1 leading-normal">
          Multi-factor identity verification ensures your account security and speeds up the decision process.
        </p>
      </div>
    </div>
  </div>
);
