import React from 'react';
import { AlertCircle, LoaderCircle, Mic, Pause, PhoneOff, Play, Video, VolumeX } from 'lucide-react';

export const VideoCallPanel = ({
  isJoined,
  isJoining,
  isMicOn,
  isVideoOn,
  joinError,
  onboardingStarted,
  onboardingCompleted,
  agentPaused,
  onJoin,
  onToggleMic,
  onToggleVideo,
  onStart,
  onPauseResume,
  onEnd
}) => (
  <section className="min-h-0 rounded-3xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm p-2.5 sm:p-4 lg:p-5 flex flex-col gap-2.5 sm:gap-3">
    <div className="relative flex-1 min-h-52 sm:min-h-80 xl:min-h-0 rounded-2xl overflow-hidden bg-black max-[380px]:min-h-48">
      <div id="local-video" className="w-full h-full" />

      {!isJoined && (
        <div className="absolute inset-0 bg-surface-container-highest/85 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
            <Video size={30} className="sm:w-9 sm:h-9" />
          </div>
          <p className="text-on-surface-variant font-bold text-sm sm:text-base">Join your live onboarding call</p>
          <button
            onClick={onJoin}
            disabled={isJoining}
            className="px-5 h-11 rounded-full bg-primary text-white font-bold inline-flex items-center gap-2 disabled:opacity-70"
          >
            {isJoining ? <LoaderCircle size={18} className="animate-spin" /> : <Video size={18} />}
            {isJoining ? 'Joining...' : 'Join Agora Call'}
          </button>
        </div>
      )}

      {isJoined && (
        <div className="absolute left-3 right-3 bottom-3 sm:left-4 sm:right-4 sm:bottom-4 flex items-end justify-between gap-2 pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-white/90 text-slate-900 px-2.5 py-1.5 backdrop-blur-sm shadow-sm">
            <button
              onClick={onToggleMic}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${isMicOn ? 'bg-slate-200 text-slate-900' : 'bg-red-500 text-white'}`}
            >
              {isMicOn ? <Mic size={15} className="sm:w-4 sm:h-4" /> : <VolumeX size={15} className="sm:w-4 sm:h-4" />}
            </button>
            <span className="text-[11px] font-semibold hidden sm:inline">Mic {isMicOn ? 'On' : 'Off'}</span>
          </div>

          <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-white/90 text-slate-900 px-2.5 py-1.5 backdrop-blur-sm shadow-sm">
            <span className="text-[11px] font-semibold hidden sm:inline">Camera {isVideoOn ? 'On' : 'Off'}</span>
            <button
              onClick={onToggleVideo}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${isVideoOn ? 'bg-slate-200 text-slate-900' : 'bg-red-500 text-white'}`}
            >
              <Video size={15} className="sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      )}
    </div>

    {joinError && (
      <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 flex items-start gap-2 text-sm">
        <AlertCircle size={16} className="mt-0.5 shrink-0" />
        <span>{joinError}</span>
      </div>
    )}

    <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-auto">
      <button
        onClick={onStart}
        disabled={!isJoined || onboardingStarted || onboardingCompleted || isJoining}
        className="h-10 sm:h-12 rounded-full bg-primary text-white flex items-center justify-center gap-1 sm:gap-2 font-bold disabled:opacity-50 text-[10px] sm:text-sm px-1.5 sm:px-2"
      >
        <Play size={16} className="sm:w-4.5 sm:h-4.5 shrink-0" />
        <span className="hidden sm:inline">Start</span>
        <span className="sm:hidden max-[380px]:hidden">Start</span>
      </button>

      <button
        onClick={onPauseResume}
        disabled={!onboardingStarted || onboardingCompleted}
        className="h-10 sm:h-12 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center gap-1 sm:gap-2 font-bold disabled:opacity-50 text-[10px] sm:text-sm px-1.5 sm:px-2"
      >
        {agentPaused ? <Play size={16} className="sm:w-4.5 sm:h-4.5 shrink-0" /> : <Pause size={16} className="sm:w-4.5 sm:h-4.5 shrink-0" />}
        <span className="hidden sm:inline">{agentPaused ? 'Resume Agent' : 'Pause Agent'}</span>
        <span className="sm:hidden max-[380px]:hidden">{agentPaused ? 'Resume' : 'Pause'}</span>
      </button>

      <button
        onClick={onEnd}
        className="h-10 sm:h-12 rounded-full bg-error text-white flex items-center justify-center gap-1 sm:gap-2 font-bold text-[10px] sm:text-sm px-1.5 sm:px-2"
      >
        <PhoneOff size={16} className="fill-current sm:w-4.5 sm:h-4.5 shrink-0" />
        <span className="hidden sm:inline">End Call</span>
        <span className="sm:hidden max-[380px]:hidden">End</span>
      </button>
    </div>
  </section>
);
