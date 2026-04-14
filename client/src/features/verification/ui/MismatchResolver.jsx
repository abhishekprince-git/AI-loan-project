import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectExtractedData, selectOcrData, setFinalVerifiedData } from '../../applicationData';
import { CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

export const MismatchResolver = ({ onResolved }) => {
  const dispatch = useDispatch();
  const voiceData = useSelector(selectExtractedData) || {};
  const ocrData = useSelector(selectOcrData) || {};

  const fieldsToCheck = [
    { key: 'full_name', label: 'Full Name' },
    { key: 'dob', label: 'Date of Birth' },
    { key: 'pan', label: 'PAN Number' },
    { key: 'aadhaar', label: 'Aadhaar Number' },
    { key: 'monthly_income', label: 'Monthly Income' }
  ];

  // Map common keys since ocrData keys from prompt are: name, dob, address, pan, aadhaar, income
  const voiceToOcrMap = {
    'full_name': 'name',
    'dob': 'dob',
    'pan': 'pan',
    'aadhaar': 'aadhaar',
    'monthly_income': 'income'
  };

  const [finalData, setFinalData] = useState(() => {
    const base = { ...voiceData };
    fieldsToCheck.forEach(f => {
      const ocrVal = ocrData[voiceToOcrMap[f.key]];
      // default to OCR if present, otherwise voice
      base[f.key] = ocrVal || voiceData[f.key] || '';
    });
    return base;
  });

  const handleSelect = (fieldKey, value) => {
    setFinalData(prev => ({ ...prev, [fieldKey]: value }));
  };

  const submitFinalData = () => {
    dispatch(setFinalVerifiedData(finalData));
    onResolved();
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl p-5 sm:p-8 ambient-bloom border border-outline-variant/30">
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="text-amber-500" size={28} />
        <h2 className="text-2xl font-bold">Data Discrepancy Check</h2>
      </div>
      <p className="text-on-surface-variant mb-6">
        We noticed some differences between what you told us and what we scanned from your documents. 
        Please confirm the correct details below.
      </p>

      <div className="space-y-6 mb-8">
        {fieldsToCheck.map(field => {
          const voiceVal = voiceData[field.key] || 'Not Detected';
          const ocrVal = ocrData[voiceToOcrMap[field.key]] || 'Not Detected';
          const isSelectedVoice = finalData[field.key] === voiceVal;
          const isSelectedOcr = finalData[field.key] === ocrVal && voiceVal !== ocrVal;
          
          const highlightVoice = voiceVal !== ocrVal && isSelectedVoice ? 'ring-2 ring-primary bg-primary/5' : 'bg-surface-container hover:bg-surface-container-high cursor-pointer';
          const highlightOcr = voiceVal !== ocrVal && isSelectedOcr ? 'ring-2 ring-primary bg-primary/5' : 'bg-surface-container hover:bg-surface-container-high cursor-pointer';

          return (
            <div key={field.key} className="p-4 rounded-xl border border-outline-variant/10 bg-surface-container-lowest shadow-sm">
              <h3 className="text-sm font-bold tracking-tight text-on-surface mb-3 uppercase opacity-60 flex items-center gap-2">
                {field.label}
                {voiceVal === ocrVal && <span className="bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full text-[10px]">MATCH</span>}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div 
                  onClick={() => handleSelect(field.key, voiceVal)}
                  className={`p-3 rounded-lg flex flex-col gap-1 transition-all ${highlightVoice}`}
                >
                  <span className="text-[10px] font-semibold text-primary">From Voice Interview</span>
                  <span className="font-medium">{voiceVal}</span>
                </div>
                
                <div 
                  onClick={() => handleSelect(field.key, ocrVal)}
                  className={`p-3 rounded-lg flex flex-col gap-1 transition-all ${highlightOcr}`}
                >
                  <span className="text-[10px] font-semibold text-primary">From Document Scan</span>
                  <span className="font-medium">{ocrVal}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button 
          onClick={submitFinalData}
          className="px-6 py-3 bg-primary text-white rounded-full font-bold flex items-center gap-2 hover:bg-primary/90 transition-all"
        >
          Confirm & Proceed
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
