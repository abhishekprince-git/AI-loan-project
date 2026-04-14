import multer from 'multer';

import {
  applyOfferUpdate,
  buildAgoraToken,
  createGroqClient,
  fetchAppState,
  fetchDashboardData,
  generateAgentReply,
  transcribeAudio
} from '../services/url_service.js';

export const groqAudioUpload = multer({ storage: multer.memoryStorage() }).single('audio');

export async function getDashboardData(req, res, next) {
  try {
    const dashboard = await fetchDashboardData();
    return res.json(dashboard);
  } catch (error) {
    return next(error);
  }
}

export async function getAppState(req, res, next) {
  try {
    const appState = await fetchAppState();
    return res.json(appState);
  } catch (error) {
    return next(error);
  }
}

export async function updateOfferDecision(req, res, next) {
  try {
    const { appId } = req.params;
    const updated = await applyOfferUpdate(appId, req.body || {});
    return res.json(updated);
  } catch (error) {
    return next(error);
  }
}

export async function issueAgoraToken(req, res) {
  const appId = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;

  if (!appId || !appCertificate) {
    return res.status(500).json({ error: 'AGORA_APP_ID and AGORA_APP_CERTIFICATE must be set in backend/.env' });
  }

  const { channelName, uid } = req.body || {};

  if (!channelName || typeof channelName !== 'string') {
    return res.status(400).json({ error: 'channelName is required' });
  }

  const parsedUid = Number(uid);
  const rtcUid = Number.isNaN(parsedUid) ? 0 : parsedUid;
  const expiresIn = Number(process.env.AGORA_TOKEN_EXPIRY_SECONDS || 3600);

  const token = buildAgoraToken({
    appId,
    appCertificate,
    channelName,
    uid: rtcUid,
    expiresIn
  });

  return res.json({ token, appId, channelName, uid: rtcUid, expiresIn });
}

export async function transcribeSpeech(req, res) {
  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY is not configured in backend/.env' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'audio file is required (multipart form field: audio)' });
  }

  try {
    const groq = createGroqClient(process.env.GROQ_API_KEY);
    const text = await transcribeAudio(groq, req.file, { model: process.env.GROQ_STT_MODEL });

    return res.json({ text });
  } catch (error) {
    console.error('Groq STT error:', error);
    return res.status(500).json({ error: 'Failed to transcribe audio with Groq.' });
  }
}

export async function chatWithAgent(req, res) {
  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY is not configured in backend/.env' });
  }

  const { messages } = req.body || {};
  const safeMessages = Array.isArray(messages) ? messages : [];

  try {
    const groq = createGroqClient(process.env.GROQ_API_KEY);
    const reply = await generateAgentReply(groq, safeMessages, { model: process.env.GROQ_CHAT_MODEL });

    return res.json({ reply });
  } catch (error) {
    console.error('Groq chat error:', error);
    return res.status(500).json({ error: 'Failed to generate agent response with Groq.' });
  }
}