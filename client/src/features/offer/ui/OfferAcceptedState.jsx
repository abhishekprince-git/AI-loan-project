import React from 'react';
import { CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const OfferAcceptedState = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12 text-center flex flex-col items-center justify-center min-h-[60vh]">
    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8">
      <CheckCircle size={48} className="fill-current" />
    </motion.div>
    <h2 className="text-3xl sm:text-4xl font-bold text-on-surface mb-4">Application Submitted!</h2>
    <p className="text-on-surface-variant text-base sm:text-lg max-w-md mb-10">
      Your loan agreement has been signed and submitted. Funds will be disbursed to your account within 24 hours.
    </p>
    <button onClick={() => window.location.reload()} className="bg-primary-gradient text-white px-10 py-4 rounded-xl font-bold shadow-lg">
      Back to Dashboard
    </button>
  </div>
);
