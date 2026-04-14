import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { setExtractedData } from '../../applicationData';

export const useVideoOnboarding = (onNext) => {
  const dispatch = useDispatch();
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
    { key: 'full_name', label: 'full name', hints: ['full name', 'legal name', 'name'] },
    { key: 'dob', label: 'date of birth', hints: ['date of birth', 'dob', 'born'] },
    { key: 'pan', label: 'PAN number', hints: ['pan', 'pan number'] },
    { key: 'aadhaar', label: 'Aadhaar number', hints: ['aadhaar', 'aadhaar number'] },
    { key: 'employment_type', label: 'employment type', hints: ['employment type', 'salaried', 'self-employed'] },
    { key: 'monthly_income', label: 'monthly income', hints: ['monthly income', 'salary', 'take-home', 'make a month'] },
    { key: 'company_name', label: 'company name', hints: ['company name', 'employer', 'work for'] },
    { key: 'work_experience', label: 'work experience', hints: ['work experience', 'how long', 'years of experience'] },
    { key: 'loan_amount', label: 'loan amount required', hints: ['loan amount', 'how much', 'required'] },
    { key: 'loan_purpose', label: 'loan purpose', hints: ['loan purpose', 'purpose', 'why are you applying'] }
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
      
      // Ensure we pick a valid voice (preferably English/Google) to prevent silent failures
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.startsWith('en-US') && v.name.includes('Google')) ||
                           voices.find(v => v.lang.startsWith('en-'));
      if (englishVoice) {
         utterance.voice = englishVoice;
      }

      utterance.rate = 1;
      utterance.pitch = 1;
      
      // Fix for Chrome bug where 'utterance' is garbage collected before it speaks
      window._activeSpeechUtterance = utterance;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        window._activeSpeechUtterance = null;
        resolve();
      };
      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        setIsSpeaking(false);
        window._activeSpeechUtterance = null;
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
      content: `Interview state for internal guidance: covered topics = ${covered.join(', ') || 'none'}. missing topics = ${missing.join(', ') || 'none'}. 
Protocol to follow strictly:
1. If the user just gave you new information for a topic, explicitly repeat what you collected and ask for their confirmation (e.g., 'You said your PAN is ABCDE1234F. Is that correct?'). Do not ask about a new topic yet.
2. If the user just confirmed the information (e.g., 'yes', 'correct'), or if we are just starting, ask exactly one question about the next missing topic.`
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
        
        // Extract data
        try {
          const extractResponse = await fetch(`${backendUrl}/groq/extract`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: chatMessages })
          });
          const extractData = await extractResponse.json();
          if (extractData.extractedData) {
            dispatch(setExtractedData(extractData.extractedData));
          }
        } catch (err) {
          console.error("Failed to extract data:", err);
        }

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

  const initializeTTS = () => {
    // Unlocks browser TTS engine synchronously on user gesture so async TTS doesn't get blocked
    if ('speechSynthesis' in window) {
      const dummy = new SpeechSynthesisUtterance('');
      dummy.volume = 0;
      window.speechSynthesis.speak(dummy);
    }
  };

  const startOnboarding = async () => {
    if (!isJoined) {
      setJoinError('Join the call first.');
      return;
    }
    
    initializeTTS();

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

  return {
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
  };
};
