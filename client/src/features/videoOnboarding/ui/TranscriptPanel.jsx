import React from 'react';
import { Bot, CheckCheck } from 'lucide-react';

export const TranscriptPanel = ({
  transcriptContainerRef,
  messages,
  turnTheme,
  turnLabel,
  onboardingStatus,
  onboardingGuidance
}) => (
  <aside className="min-h-0 rounded-3xl bg-surface-container border border-outline-variant/20 shadow-sm p-4 sm:p-5 lg:p-6 flex flex-col overflow-hidden">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center">
        <Bot size={24} className="sm:w-7 sm:h-7 text-primary" />
      </div>
      <div>
        <h2 className="text-base sm:text-lg font-bold text-on-surface">Loan Onboarding Agent</h2>
        <p className="text-xs text-on-surface-variant">Live transcript and interview log</p>
      </div>
    </div>

    <div className={`mb-4 rounded-xl px-4 py-3 ${turnTheme}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] uppercase tracking-wider font-bold">Status</p>
        <span className="text-[11px] uppercase tracking-wider font-bold">{turnLabel}</span>
      </div>
      <p className="text-sm font-semibold mt-1">{onboardingStatus}</p>
      <p className="text-xs mt-1 opacity-95">{onboardingGuidance}</p>
    </div>

    <div ref={transcriptContainerRef} className="flex-1 min-h-40 xl:min-h-0 space-y-4 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
      {messages.length === 0 && (
        <div className="rounded-2xl bg-surface-container-lowest p-4 text-sm text-on-surface-variant">
          Transcript will appear here as soon as onboarding starts.
        </div>
      )}

      {messages.map((msg, i) => (
        <div key={`${msg.time}-${i}`} className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end ml-auto' : ''} max-w-[92%]`}>
          <div
            className={`p-3 sm:p-4 rounded-2xl shadow-sm ${
              msg.role === 'user'
                ? 'bg-primary text-white rounded-tr-none'
                : 'bg-surface-container-lowest text-on-surface rounded-tl-none'
            }`}
          >
            <p className={`text-sm leading-relaxed ${msg.role === 'user' ? 'italic' : ''}`}>{msg.text}</p>
          </div>
          <div className="flex items-center gap-1.5 px-1">
            {msg.role === 'user' && <CheckCheck size={12} className="text-emerald-500" />}
            <span className="text-[10px] text-on-surface-variant font-medium">
              {msg.role === 'ai' ? 'Agent' : 'Applicant'} • {msg.time}
            </span>
          </div>
        </div>
      ))}
    </div>
  </aside>
);
