import React from 'react';
import { useSelector } from 'react-redux';
import { CheckCircle, Clock } from 'lucide-react';
import { selectExtractedData } from '../../applicationData';

export const LiveFormPanel = () => {
  const extractedData = useSelector(selectExtractedData) || {};

  const loanTopics = [
    { key: 'full_name', label: 'Full Name' },
    { key: 'dob', label: 'Date of Birth' },
    { key: 'pan', label: 'PAN Number' },
    { key: 'aadhaar', label: 'Aadhaar Number' },
    { key: 'employment_type', label: 'Employment Type' },
    { key: 'monthly_income', label: 'Monthly Income' },
    { key: 'company_name', label: 'Company Name' },
    { key: 'work_experience', label: 'Work Experience' },
    { key: 'loan_amount', label: 'Required Amount' },
    { key: 'loan_purpose', label: 'Loan Purpose' }
  ];

  return (
    <div className="h-full bg-surface-container-low border border-outline-variant/30 rounded-3xl overflow-hidden flex flex-col shadow-sm">
      <div className="bg-surface-container/50 px-4 py-4 border-b border-outline-variant/30 backdrop-blur-md">
        <h3 className="font-bold text-on-surface text-base flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Live Application Form
        </h3>
        <p className="text-[11px] text-on-surface-variant font-medium mt-1">
          Auto-filling securely via AI Extraction
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {loanTopics.map((topic, i) => {
          const value = extractedData[topic.key];
          const isFilled = typeof value === 'string' && value.trim() !== '';

          return (
            <div key={i} className={`p-3 rounded-xl border transition-all duration-500 ${isFilled ? 'bg-primary/5 border-primary/20' : 'bg-surface-container-lowest border-outline-variant/20'}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  {topic.label}
                </span>
                {isFilled ? (
                  <CheckCircle size={14} className="text-primary" />
                ) : (
                  <Clock size={12} className="text-on-surface-variant opacity-50" />
                )}
              </div>
              <div className="min-h-[20px]">
                {isFilled ? (
                  <span className="text-sm font-semibold text-on-surface block">
                    {value}
                  </span>
                ) : (
                  <span className="text-xs text-on-surface-variant/50 italic block">Awaiting response...</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
