import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'agora-access-token';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import Groq from 'groq-sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { RtcTokenBuilder, RtcRole } = pkg;
const app = express();

const PORT = Number(process.env.PORT || 4000);
const AGORA_APP_ID = process.env.AGORA_APP_ID;
const AGORA_APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;
const TOKEN_EXPIRY_SECONDS = Number(process.env.AGORA_TOKEN_EXPIRY_SECONDS || 3600);
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_CHAT_MODEL = process.env.GROQ_CHAT_MODEL || 'llama-3.3-70b-versatile';
const GROQ_STT_MODEL = process.env.GROQ_STT_MODEL || 'whisper-large-v3';

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });
const groq = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null;

const AGENT_SYSTEM_PROMPT = [
  'You are a friendly, professional human loan onboarding specialist on a live verification call.',
  'Keep replies natural, warm, and short, like a real agent speaking live.',
  'Ask exactly one question at a time and wait for the applicant response.',
  'Collect information in this sequence when possible: full legal name, date of birth, loan purpose, requested loan amount, employment type and employer, monthly income, existing major debts, credit concerns, property details if mortgage-related, and consent to proceed.',
  'If something is missing or unclear, ask a polite clarification question.',
  'Avoid robotic phrasing, avoid long paragraphs, and do not mention being an AI model unless directly asked.',
  'The goal is to complete onboarding while sounding genuinely human and empathetic.'
].join(' ');

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'agora-token-server' });
});

app.post('/agora/token', (req, res) => {
  if (!AGORA_APP_ID || !AGORA_APP_CERTIFICATE) {
    return res.status(500).json({
      error: 'AGORA_APP_ID and AGORA_APP_CERTIFICATE must be set in backend/.env'
    });
  }

  const { channelName, uid } = req.body || {};

  if (!channelName || typeof channelName !== 'string') {
    return res.status(400).json({ error: 'channelName is required' });
  }

  const parsedUid = Number(uid);
  const rtcUid = Number.isNaN(parsedUid) ? 0 : parsedUid;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + TOKEN_EXPIRY_SECONDS;

  const token = RtcTokenBuilder.buildTokenWithUid(
    AGORA_APP_ID,
    AGORA_APP_CERTIFICATE,
    channelName,
    rtcUid,
    RtcRole.PUBLISHER,
    privilegeExpiredTs
  );

  return res.json({ token, appId: AGORA_APP_ID, channelName, uid: rtcUid, expiresIn: TOKEN_EXPIRY_SECONDS });
});

app.post('/groq/stt', upload.single('audio'), async (req, res) => {
  if (!groq) {
    return res.status(500).json({ error: 'GROQ_API_KEY is not configured in backend/.env' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'audio file is required (multipart form field: audio)' });
  }

  try {
    const transcription = await groq.audio.transcriptions.create({
      file: new File([req.file.buffer], req.file.originalname || 'speech.webm', {
        type: req.file.mimetype || 'audio/webm'
      }),
      model: GROQ_STT_MODEL,
      language: 'en',
      response_format: 'verbose_json'
    });

    const text = transcription?.text?.trim() || '';
    return res.json({ text });
  } catch (error) {
    console.error('Groq STT error:', error);
    return res.status(500).json({ error: 'Failed to transcribe audio with Groq.' });
  }
});

app.post('/groq/chat', async (req, res) => {
  if (!groq) {
    return res.status(500).json({ error: 'GROQ_API_KEY is not configured in backend/.env' });
  }

  const { messages } = req.body || {};
  const safeMessages = Array.isArray(messages) ? messages : [];

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_CHAT_MODEL,
      temperature: 0.6,
      max_completion_tokens: 220,
      messages: [
        { role: 'system', content: AGENT_SYSTEM_PROMPT },
        ...safeMessages.map((m) => ({ role: m.role, content: String(m.content || '') }))
      ]
    });

    const reply = completion?.choices?.[0]?.message?.content?.trim() || '';
    return res.json({ reply });
  } catch (error) {
    console.error('Groq chat error:', error);
    return res.status(500).json({ error: 'Failed to generate agent response with Groq.' });
  }
});

app.listen(PORT, () => {
  console.log(`Agora token backend running on port ${PORT}`);
});
