import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Bot,
  CheckCheck,
  LoaderCircle,
  Mic,
  Pause,
  PhoneOff,
  Play,
  Video,
  VolumeX
} from 'lucide-react';
import AgoraRTC from 'agora-rtc-sdk-ng';

export const ScreenVideo = ({ onNext }) => {
  const agoraClientRef = useRef(null);
  const localTracksRef = useRef({ audioTrack: null, videoTrack: null });
  const mediaRecorderRef = useRef(null);
  const recordingChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const callHistoryRef = useRef([]);
  const flowControlRef = useRef({ active: false, paused: false });
  const transcriptContainerRef = useRef(null);

  const [joinError, setJoinError] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [onboardingStarted, setOnboardingStarted] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [agentPaused, setAgentPaused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([]);

  const channelName = 'loan-verification';
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
  const agoraAppId = import.meta.env.VITE_AGORA_APP_ID || '';
  const loanTopics = [
    { key: 'full_name', label: 'full legal name', hints: ['full name', 'legal name', 'name as per id'] },
    { key: 'dob', label: 'date of birth', hints: ['date of birth', 'dob', 'born'] },
    { key: 'loan_purpose', label: 'loan purpose', hints: ['loan purpose', 'purpose of the loan', 'why are you applying'] },
    { key: 'loan_amount', label: 'requested loan amount', hints: ['loan amount', 'how much', 'requested amount'] },
    { key: 'employment', label: 'employment details', hints: ['employment', 'employer', 'job title', 'self-employed'] },
    { key: 'income', label: 'monthly income', hints: ['monthly income', 'income', 'salary', 'take-home'] },
    { key: 'debts', label: 'existing debts', hints: ['existing debts', 'liabilities', 'emi', 'monthly obligations'] },
    { key: 'consent', label: 'consent to proceed', hints: ['consent', 'authorize', 'agree to proceed'] }
  ];

  const formatTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const addMessage = (role, text) => {
    setMessages((prev) => [...prev, { role, text, time: formatTime() }]);
  };

  const clearTurnTimer = () => {
    if (recordingTimerRef.current) {
      clearTimeout(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  const resolveJoinErrorMessage = (error) => {
    const message = String(error?.message || '').toLowerCase();
    const code = String(error?.code || '').toLowerCase();
    const name = String(error?.name || '').toLowerCase();

    const isPermissionError =
      message.includes('permission denied') ||
      message.includes('notallowederror') ||
      code.includes('permission_denied') ||
      name.includes('notallowederror');

    if (isPermissionError) {
      return 'Camera or microphone permission is blocked. Allow both permissions for this site and retry.';
    }

    if (error instanceof TypeError) {
      return 'Cannot reach backend token server. Ensure backend is running on VITE_BACKEND_URL.';
    }

    return error?.message || 'Unable to continue onboarding.';
  };

  const speakText = (text) => {
    if (!text) {
      return Promise.resolve();
    }

    if (!('speechSynthesis' in window)) {
      return Promise.resolve();
    }

    window.speechSynthesis.cancel();

    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        resolve();
      };
      window.speechSynthesis.speak(utterance);
    });
  };

  const stopRecorder = () => {
    clearTurnTimer();
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
    }
    setIsRecording(false);
  };

  const postGroqChat = async (messagesPayload) => {
    const response = await fetch(`${backendUrl}/groq/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: messagesPayload })
    });

    if (!response.ok) {
      throw new Error('Groq chat failed. Check backend/GROQ_API_KEY.');
    }

    const data = await response.json();
    const reply = String(data?.reply || '').trim();

    if (!reply) {
      throw new Error('Agent response is empty.');
    }

    return reply;
  };

  const buildCoverageStateInstruction = (history) => {
    const aiText = history
      .filter((m) => m.role === 'assistant')
      .map((m) => String(m.content || '').toLowerCase())
      .join(' ');

    const userText = history
      .filter((m) => m.role === 'user')
      .map((m) => String(m.content || '').toLowerCase())
      .join(' ');

    const covered = loanTopics
      .filter((t) => t.hints.some((hint) => aiText.includes(hint) || userText.includes(hint)))
      .map((t) => t.label);

    const missing = loanTopics.filter((t) => !covered.includes(t.label)).map((t) => t.label);

    return {
      role: 'user',
      content: `Interview state for internal guidance: covered topics = ${covered.join(', ') || 'none'}. missing topics = ${missing.join(', ') || 'none'}. Ask exactly one non-repeated question focused on a missing topic.`
    };
  };

  const getAskedTopicCoverage = (history) => {
    const aiText = history
      .filter((m) => m.role === 'assistant')
      .map((m) => String(m.content || '').toLowerCase())
      .join(' ');

    const asked = loanTopics
      .filter((t) => t.hints.some((hint) => aiText.includes(hint)))
      .map((t) => t.label);

    const missing = loanTopics.filter((t) => !asked.includes(t.label)).map((t) => t.label);
    return { asked, missing };
  };

  const normalizeForDuplicateCheck = (text) =>
    String(text || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const isLikelyDuplicateQuestion = (candidate, assistantHistory) => {
    const normalizedCandidate = normalizeForDuplicateCheck(candidate);
    if (!normalizedCandidate) {
      return false;
    }

    return assistantHistory.some((prev) => {
      const normalizedPrev = normalizeForDuplicateCheck(prev);
      if (!normalizedPrev) {
        return false;
      }

      if (normalizedPrev === normalizedCandidate) {
        return true;
      }

      return normalizedPrev.includes(normalizedCandidate) || normalizedCandidate.includes(normalizedPrev);
    });
  };

  const runUserTurn = async (audioBlob) => {
    setIsTranscribing(true);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, `user-turn-${Date.now()}.webm`);

      const sttResponse = await fetch(`${backendUrl}/groq/stt`, {
        method: 'POST',
        body: formData
      });

      if (!sttResponse.ok) {
        throw new Error('Groq speech-to-text failed.');
      }

      const sttData = await sttResponse.json();
      const transcript = String(sttData?.text || '').trim();

      if (!transcript) {
        throw new Error('I could not hear your answer clearly. Please speak again.');
      }

      addMessage('user', transcript);

      const chatMessages = [...callHistoryRef.current.slice(-24), { role: 'user', content: transcript }];
      const askedCoverage = getAskedTopicCoverage(chatMessages);

      if (askedCoverage.missing.length === 0) {
        const completionPrompt = {
          role: 'user',
          content:
            'All required onboarding questions have already been asked. Give a short warm closing statement confirming onboarding is complete and that the case will move to review. Do not ask another question.'
        };

        setIsThinking(true);
        const completionReply = await postGroqChat([...chatMessages, completionPrompt]);
        callHistoryRef.current = [...chatMessages, { role: 'assistant', content: completionReply }].slice(-30);
        addMessage('ai', completionReply);
        setIsThinking(false);

        await speakText(completionReply);

        flowControlRef.current = { active: false, paused: false };
        setOnboardingCompleted(true);
        setAgentPaused(false);
        return;
      }

      const chatMessagesWithState = [...chatMessages, buildCoverageStateInstruction(chatMessages)];
      setIsThinking(true);
      let aiReply = await postGroqChat(chatMessagesWithState);

      const previousAssistantReplies = callHistoryRef.current
        .filter((m) => m.role === 'assistant')
        .map((m) => m.content)
        .slice(-8);

      if (isLikelyDuplicateQuestion(aiReply, previousAssistantReplies)) {
        const antiRepeatInstruction = {
          role: 'user',
          content:
            'You just repeated a previously asked question. Ask a different next question now. Do not repeat earlier wording.'
        };
        aiReply = await postGroqChat([...chatMessagesWithState, antiRepeatInstruction]);
      }

      callHistoryRef.current = [...chatMessages, { role: 'assistant', content: aiReply }].slice(-30);
      addMessage('ai', aiReply);
      setIsThinking(false);

      await speakText(aiReply);

      if (flowControlRef.current.active && !flowControlRef.current.paused) {
        startListeningTurn();
      }
    } finally {
      setIsTranscribing(false);
      setIsThinking(false);
    }
  };

  const startListeningTurn = async () => {
    if (!flowControlRef.current.active || flowControlRef.current.paused) {
      return;
    }

    if (isRecording || isTranscribing || isThinking || isSpeaking) {
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = recorder;
      recordingChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordingChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        clearTurnTimer();
        const [track] = stream.getTracks();
        if (track) {
          track.stop();
        }

        const audioBlob = new Blob(recordingChunksRef.current, { type: 'audio/webm' });
        recordingChunksRef.current = [];
        mediaRecorderRef.current = null;

        if (!flowControlRef.current.active || flowControlRef.current.paused) {
          return;
        }

        if (!audioBlob.size) {
          setJoinError('No audio captured for this turn.');
          return;
        }

        try {
          await runUserTurn(audioBlob);
        } catch (error) {
          setJoinError(error?.message || 'Onboarding voice processing failed.');
        }
      };

      recorder.start();
      setIsRecording(true);

      recordingTimerRef.current = setTimeout(() => {
        setIsRecording(false);
        stopRecorder();
      }, 10000);
    } catch (error) {
      setJoinError(resolveJoinErrorMessage(error));
      setIsRecording(false);
    }
  };

  const startOnboarding = async () => {
    if (!isJoined) {
      setJoinError('Join the call first.');
      return;
    }

    setJoinError('');
    setOnboardingStarted(true);
    setOnboardingCompleted(false);
    setAgentPaused(false);
    flowControlRef.current = { active: true, paused: false };

    try {
      const kickoffMessages = [
        {
          role: 'user',
          content:
            'Begin loan onboarding now. Greet me naturally, then ask the first required loan question in a warm and professional tone.'
        }
      ];

      const firstReply = await postGroqChat(kickoffMessages);
      callHistoryRef.current = [...kickoffMessages, { role: 'assistant', content: firstReply }];
      addMessage('ai', firstReply);
      await speakText(firstReply);

      if (flowControlRef.current.active && !flowControlRef.current.paused) {
        startListeningTurn();
      }
    } catch (error) {
      setJoinError(error?.message || 'Failed to start.');
    }
  };

  const pauseOrResumeAgent = () => {
    if (!onboardingStarted) {
      return;
    }

    const nextPaused = !agentPaused;
    setAgentPaused(nextPaused);
    flowControlRef.current.paused = nextPaused;

    if (nextPaused) {
      stopRecorder();
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      return;
    }

    if (flowControlRef.current.active) {
      startListeningTurn();
    }
  };

  const joinCall = async () => {
    setJoinError('');
    setIsJoining(true);

    try {
      const uid = Math.floor(Math.random() * 1000000);
      const response = await fetch(`${backendUrl}/agora/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelName, uid })
      });

      if (!response.ok) {
        let backendMessage = '';

        try {
          const errorPayload = await response.json();
          backendMessage = errorPayload?.error || '';
        } catch (_error) {
          backendMessage = '';
        }

        throw new Error(backendMessage || `Failed to fetch Agora token (HTTP ${response.status}).`);
      }

      const data = await response.json();
      const client = agoraClientRef.current;

      if (!client) {
        throw new Error('Agora client not initialized.');
      }

      const resolvedAppId = agoraAppId || data.appId;

      if (!resolvedAppId) {
        throw new Error('Agora appId is missing from frontend env and backend response.');
      }

      await client.join(resolvedAppId, channelName, data.token, uid);
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();

      localTracksRef.current = { audioTrack, videoTrack };
      await client.publish([audioTrack, videoTrack]);
      videoTrack.play('local-video');
      setIsJoined(true);
    } catch (error) {
      setJoinError(resolveJoinErrorMessage(error));
      await leaveCall();
    } finally {
      setIsJoining(false);
    }
  };

  const leaveCall = async () => {
    flowControlRef.current = { active: false, paused: false };
    clearTurnTimer();
    stopRecorder();
    window.speechSynthesis?.cancel();

    const client = agoraClientRef.current;
    const { audioTrack, videoTrack } = localTracksRef.current;

    try {
      if (audioTrack) {
        audioTrack.stop();
        audioTrack.close();
      }

      if (videoTrack) {
        videoTrack.stop();
        videoTrack.close();
      }

      localTracksRef.current = { audioTrack: null, videoTrack: null };

      if (client) {
        await client.leave();
      }
    } catch (error) {
      console.error('Error leaving Agora call:', error);
    } finally {
      setIsJoined(false);
      setIsJoining(false);
      setOnboardingStarted(false);
      setOnboardingCompleted(false);
      setAgentPaused(false);
      setIsRecording(false);
      setIsTranscribing(false);
      setIsThinking(false);
      setIsSpeaking(false);
      setIsMicOn(true);
      setIsVideoOn(true);
      callHistoryRef.current = [];
    }
  };

  const toggleMic = async () => {
    const audioTrack = localTracksRef.current.audioTrack;
    if (!audioTrack) {
      return;
    }

    const nextMicState = !isMicOn;
    await audioTrack.setEnabled(nextMicState);
    setIsMicOn(nextMicState);
  };

  const toggleVideo = async () => {
    const videoTrack = localTracksRef.current.videoTrack;
    if (!videoTrack) {
      return;
    }

    const nextVideoState = !isVideoOn;
    await videoTrack.setEnabled(nextVideoState);
    setIsVideoOn(nextVideoState);
  };

  const handleEndCall = async () => {
    await leaveCall();
    onNext();
  };

  useEffect(() => {
    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    agoraClientRef.current = client;

    const handleUserPublished = async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      if (mediaType === 'audio' && user.audioTrack) {
        user.audioTrack.play();
      }
    };

    client.on('user-published', handleUserPublished);

    return () => {
      client.off('user-published', handleUserPublished);
      leaveCall();
    };
  }, []);

  useEffect(() => {
    const container = transcriptContainerRef.current;
    if (!container) {
      return;
    }

    container.scrollTop = container.scrollHeight;
  }, [messages]);

  const isUserTurn = isRecording;
  const isAgentTurn = isSpeaking || isThinking || isTranscribing;

  const turnLabel = isUserTurn
    ? 'Your Turn - Speak Now'
    : isAgentTurn
      ? 'Agent Turn - Please Wait'
      : agentPaused
        ? 'Paused'
        : onboardingStarted
          ? 'Stand By'
          : 'Not Started';

  const turnHint = isUserTurn
    ? 'Answer the current loan question now.'
    : isAgentTurn
      ? 'The agent is processing or speaking. Please hold.'
      : agentPaused
        ? 'Resume when you are ready to continue.'
        : onboardingStarted
          ? 'Agent will prompt you shortly.'
          : 'Press Start to begin.';

  const turnTheme = isUserTurn
    ? 'bg-emerald-500 text-white'
    : isAgentTurn
      ? 'bg-amber-500 text-white'
      : agentPaused
        ? 'bg-slate-500 text-white'
        : 'bg-surface-container-high text-on-surface';

  const onboardingStatus = !isJoined
    ? 'Not Joined'
    : onboardingCompleted
      ? 'Onboarding Complete'
    : !onboardingStarted
      ? 'Ready to Start'
      : agentPaused
        ? 'Onboarding Paused'
        : isUserTurn
          ? 'Listening to You'
          : isTranscribing
            ? 'Transcribing Response'
            : isThinking
              ? 'Preparing Next Question'
              : isSpeaking
                ? 'Agent Speaking'
                : 'Onboarding Active';

  const onboardingGuidance = !isJoined
    ? 'Join Agora Call, then click Start.'
    : onboardingCompleted
      ? 'Interview is complete. You can end call or move to the next step.'
    : !onboardingStarted
      ? 'Please click Start to begin your live loan interview.'
      : turnHint;

  return (
    <div className="flex-1 h-[calc(100vh-5rem)] bg-background overflow-y-auto xl:overflow-hidden p-2 sm:p-4 lg:p-5">
      <div className="mx-auto h-full max-w-400 grid grid-cols-1 xl:grid-cols-[minmax(0,1.2fr)_420px] gap-3 sm:gap-4 lg:gap-5">
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
                  onClick={joinCall}
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
                    onClick={toggleMic}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${isMicOn ? 'bg-slate-200 text-slate-900' : 'bg-red-500 text-white'}`}
                  >
                    {isMicOn ? <Mic size={15} className="sm:w-4 sm:h-4" /> : <VolumeX size={15} className="sm:w-4 sm:h-4" />}
                  </button>
                  <span className="text-[11px] font-semibold hidden sm:inline">Mic {isMicOn ? 'On' : 'Off'}</span>
                </div>

                <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-white/90 text-slate-900 px-2.5 py-1.5 backdrop-blur-sm shadow-sm">
                  <span className="text-[11px] font-semibold hidden sm:inline">Camera {isVideoOn ? 'On' : 'Off'}</span>
                  <button
                    onClick={toggleVideo}
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
              onClick={startOnboarding}
              disabled={!isJoined || onboardingStarted || onboardingCompleted || isJoining}
              className="h-10 sm:h-12 rounded-full bg-primary text-white flex items-center justify-center gap-1 sm:gap-2 font-bold disabled:opacity-50 text-[10px] sm:text-sm px-1.5 sm:px-2"
            >
              <Play size={16} className="sm:w-4.5 sm:h-4.5 shrink-0" />
              <span className="hidden sm:inline">Start</span>
              <span className="sm:hidden max-[380px]:hidden">Start</span>
            </button>

            <button
              onClick={pauseOrResumeAgent}
              disabled={!onboardingStarted || onboardingCompleted}
              className="h-10 sm:h-12 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center gap-1 sm:gap-2 font-bold disabled:opacity-50 text-[10px] sm:text-sm px-1.5 sm:px-2"
            >
              {agentPaused ? <Play size={16} className="sm:w-4.5 sm:h-4.5 shrink-0" /> : <Pause size={16} className="sm:w-4.5 sm:h-4.5 shrink-0" />}
              <span className="hidden sm:inline">{agentPaused ? 'Resume Agent' : 'Pause Agent'}</span>
              <span className="sm:hidden max-[380px]:hidden">{agentPaused ? 'Resume' : 'Pause'}</span>
            </button>

            <button
              onClick={handleEndCall}
              className="h-10 sm:h-12 rounded-full bg-error text-white flex items-center justify-center gap-1 sm:gap-2 font-bold text-[10px] sm:text-sm px-1.5 sm:px-2"
            >
              <PhoneOff size={16} className="fill-current sm:w-4.5 sm:h-4.5 shrink-0" />
              <span className="hidden sm:inline">End Call</span>
              <span className="sm:hidden max-[380px]:hidden">End</span>
            </button>
          </div>
        </section>

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
      </div>
    </div>
  );
};
