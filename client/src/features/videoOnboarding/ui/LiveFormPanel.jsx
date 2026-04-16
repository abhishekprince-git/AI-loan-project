import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { CheckCircle, Clock } from 'lucide-react';
import { selectExtractedData } from '../../applicationData';
import { chatLoanForm } from '../../../services/api';
import { getLoanFields, LOAN_TYPES } from '../../../configs/loanFormConfig';

export const LiveFormPanel = ({ isJoined }) => {
  const extractedData = useSelector(selectExtractedData) || {};
  const [detectedLoanType, setDetectedLoanType] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState('');
  const [nextQuestion, setNextQuestion] = useState('Join the call and tell us which loan you want to apply for.');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const loanFields = useMemo(() => getLoanFields(detectedLoanType), [detectedLoanType]);
  const displayedAnswers = useMemo(
    () => ({ ...extractedData, ...answers }),
    [answers, extractedData]
  );

  useEffect(() => {
    if (extractedData && Object.keys(extractedData).length > 0) {
      setAnswers((prev) => ({ ...prev, ...extractedData }));
    }
  }, [extractedData]);

  const mergeChatAnswers = (incomingAnswers) => {
    if (!incomingAnswers || typeof incomingAnswers !== 'object') return;
    setAnswers((prev) => ({ ...prev, ...incomingAnswers }));
  };

  const startConversationalForm = async () => {
    if (!isJoined || status === 'loading' || status === 'completed') {
      return;
    }

    setStatus('loading');
    setError(null);

    try {
      const response = await chatLoanForm({ sessionId: null, message: '' });
      setSessionId(response.sessionId);
      setDetectedLoanType(response.loanType || '');
      mergeChatAnswers(response.answers || response.data || {});

      if (response.status === 'FORM_COMPLETED') {
        setNextQuestion('Form completed. All fields have been collected.');
        setStatus('completed');
      } else {
        setNextQuestion(response.nextQuestion || 'Continue with the next question.');
        setStatus('in_progress');
      }
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to start the conversational form flow.');
      setStatus('error');
    }
  };

  useEffect(() => {
    if (isJoined && !sessionId && status === 'idle') {
      startConversationalForm();
    }
  }, [isJoined, sessionId, status]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = String(message || '').trim();
    if (!trimmed) {
      return;
    }

    setStatus('loading');
    setError(null);

    try {
      const response = await chatLoanForm({
        sessionId,
        loanType: detectedLoanType || undefined,
        message: trimmed
      });

      setSessionId(response.sessionId);
      setDetectedLoanType(response.loanType || detectedLoanType);
      mergeChatAnswers(response.answers || response.data || {});

      if (response.status === 'FORM_COMPLETED') {
        setNextQuestion('Form completed. All fields have been collected.');
        setStatus('completed');
      } else {
        setNextQuestion(response.nextQuestion || 'Continue with the next question.');
        setStatus('in_progress');
      }

      setMessage('');
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to continue the form flow.');
      setStatus('error');
    }
  };

  const renderFieldValue = (value) => {
    if (value === undefined || value === null || String(value).trim() === '') {
      return <span className="text-xs text-on-surface-variant/50 italic">Awaiting response...</span>;
    }
    return <span className="text-sm font-semibold text-on-surface block">{String(value)}</span>;
  };

  return (
    <div className="h-full bg-surface-container-low border border-outline-variant/30 rounded-3xl overflow-hidden flex flex-col shadow-sm">
      <div className="bg-surface-container/50 px-4 py-4 border-b border-outline-variant/30 backdrop-blur-md">
        <h3 className="font-bold text-on-surface text-base flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Live Loan Form
        </h3>
        <p className="text-[11px] text-on-surface-variant font-medium mt-1">
          Auto-filling fields from conversational responses.
        </p>
      </div>

      <div className="p-4 space-y-4">
        <div className="rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-4 space-y-3">
          <div className="text-xs text-on-surface-variant uppercase tracking-[0.2em] font-bold">Detected Loan Type</div>
          <div className="min-h-[20px] text-sm text-on-surface">
            {detectedLoanType ? LOAN_TYPES.find((loan) => loan.id === detectedLoanType)?.name : 'Waiting for your loan choice...'}
          </div>
        </div>

        <div className="rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-4 space-y-3">
          <div className="text-xs text-on-surface-variant uppercase tracking-[0.2em] font-bold">
            Conversational Prompt
          </div>
          <div className="min-h-[48px] text-sm text-on-surface">
            {nextQuestion}
          </div>
          <form className="grid gap-3" onSubmit={handleSubmit}>
            <textarea
              rows={3}
              className="w-full rounded-2xl bg-surface-container-high border border-outline-variant/15 px-3 py-2 text-sm text-on-surface outline-none focus:border-primary/40"
              placeholder="Reply with the requested information..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
            <div className="flex items-center justify-between gap-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Sending...' : 'Send Response'}
              </button>
              <span className="text-xs text-on-surface-variant">
                {status === 'completed' ? 'Completed' : status === 'in_progress' ? 'In progress' : 'Ready'}
              </span>
            </div>
            {error ? (
              <div className="rounded-2xl bg-error/10 border border-error/20 px-3 py-2 text-xs text-error">
                {error}
              </div>
            ) : null}
          </form>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {loanFields.map((field) => {
          const value = displayedAnswers[field.key];
          const isFilled = value !== undefined && value !== null && String(value).trim() !== '';

          return (
            <div
              key={field.key}
              className={`p-3 rounded-xl border transition-all duration-500 ${isFilled ? 'bg-primary/5 border-primary/20' : 'bg-surface-container-lowest border-outline-variant/20'}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  {field.label}
                </span>
                {isFilled ? (
                  <CheckCircle size={14} className="text-primary" />
                ) : (
                  <Clock size={12} className="text-on-surface-variant opacity-50" />
                )}
              </div>
              <div className="min-h-[20px]">
                {renderFieldValue(value)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
