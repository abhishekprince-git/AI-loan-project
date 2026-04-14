import React, { useState } from 'react';
import { OfferAcceptedState, OfferMainCard, OfferSummaryCard, OfferActionBar, OfferFooter } from '../features/offer';

export const ScreenOffer = () => {
  const [tenure, setTenure] = useState(12);
  const [isAccepted, setIsAccepted] = useState(false);

  const emi = tenure === 12 ? 17725 : tenure === 24 ? 9380 : 6600;

  if (isAccepted) {
    return <OfferAcceptedState />;
  }

  return (
    <div className="mt-4 sm:mt-8 lg:mt-12 px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12 flex flex-col gap-8 sm:gap-10 max-w-6xl mx-auto w-full">
      <section className="flex flex-col gap-2">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-[-0.02em] leading-tight text-on-surface">Your Loan Offer is Ready</h2>
        <p className="text-on-surface-variant text-base sm:text-lg max-w-2xl">Based on your verification and credit profile, we have structured a premium offer with competitive rates.</p>
      </section>

      <div className="grid grid-cols-12 gap-6">
        <OfferMainCard tenure={tenure} setTenure={setTenure} emi={emi} />
        <OfferSummaryCard />
        <OfferActionBar onAccept={() => setIsAccepted(true)} />
      </div>
      <OfferFooter />
    </div>
  );
};
