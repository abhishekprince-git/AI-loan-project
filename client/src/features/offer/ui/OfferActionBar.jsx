import React from 'react';

export const OfferActionBar = ({ onAccept }) => (
  <div className="col-span-12 flex flex-col md:flex-row items-center justify-between gap-6 p-1 bg-surface-container-low rounded-2xl">
    <div className="px-8 py-4 md:py-0">
      <p className="text-sm text-on-surface-variant">
        By accepting, you agree to the{' '}
        <span className="text-primary font-semibold cursor-pointer hover:underline" onClick={() => alert('Opening Terms...')}>
          Loan Agreement Terms
        </span>{' '}
        and repayment schedule.
      </p>
    </div>
    <div className="flex gap-4 p-4 w-full md:w-auto">
      <button
        onClick={() => alert('Opening term modification...')}
        className="flex-1 md:flex-none px-8 py-4 rounded-xl bg-surface-container-high text-on-surface font-bold text-sm hover:bg-surface-container-highest transition-all"
      >
        Modify Terms
      </button>
      <button
        onClick={onAccept}
        className="flex-1 md:flex-none px-12 py-4 rounded-xl bg-primary-gradient text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
      >
        Accept Offer
      </button>
    </div>
  </div>
);
