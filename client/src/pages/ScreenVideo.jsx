import React from 'react';
import { useVideoOnboarding, VideoCallPanel, TranscriptPanel, LiveFormPanel } from '../features/videoOnboarding';

export const ScreenVideo = ({ onNext }) => {
  const {
    transcriptContainerRef,
    messages,
    joinError,
    isJoining,
    isJoined,
    isMicOn,
    isVideoOn,
    onboardingStarted,
    onboardingCompleted,
    agentPaused,
    turnTheme,
    turnLabel,
    onboardingStatus,
    onboardingGuidance,
    joinCall,
    toggleMic,
    toggleVideo,
    startOnboarding,
    pauseOrResumeAgent,
    handleEndCall
  } = useVideoOnboarding(onNext);

  return (
    <div className="flex-1 h-[calc(100vh-5rem)] bg-background overflow-y-auto xl:overflow-hidden p-2 sm:p-4 lg:p-5">
      <div className="mx-auto h-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_340px_340px] gap-3 sm:gap-4 lg:gap-5">
        <VideoCallPanel
          isJoined={isJoined}
          isJoining={isJoining}
          isMicOn={isMicOn}
          isVideoOn={isVideoOn}
          joinError={joinError}
          onboardingStarted={onboardingStarted}
          onboardingCompleted={onboardingCompleted}
          agentPaused={agentPaused}
          onJoin={joinCall}
          onToggleMic={toggleMic}
          onToggleVideo={toggleVideo}
          onStart={startOnboarding}
          onPauseResume={pauseOrResumeAgent}
          onEnd={handleEndCall}
        />

        <div className="h-full hidden xl:block md:max-h-[calc(100vh-7rem)]">
          <LiveFormPanel isJoined={isJoined} />
        </div>

        <div className="h-full md:max-h-[calc(100vh-7rem)]">
          <TranscriptPanel
            transcriptContainerRef={transcriptContainerRef}
            messages={messages}
            turnTheme={turnTheme}
            turnLabel={turnLabel}
            onboardingStatus={onboardingStatus}
            onboardingGuidance={onboardingGuidance}
          />
        </div>
      </div>
    </div>
  );
};
