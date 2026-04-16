import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';



// Load .env before evaluating properties
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const DEFAULT_PORT = 4000;
export const DEFAULT_CLIENT_ORIGIN = '*';
export const DEFAULT_DB_NAME = 'ai-loan-app';
export const DEFAULT_MONGO_URI = `mongodb://127.0.0.1:27017/${DEFAULT_DB_NAME}`;
export const DEFAULT_AGORA_TOKEN_EXPIRY_SECONDS = 3600;
export const DEFAULT_GROQ_CHAT_MODEL = 'llama-3.3-70b-versatile';
export const DEFAULT_GROQ_STT_MODEL = 'whisper-large-v3';
export const DEFAULT_OTP_EXPIRY_SECONDS = 300;

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const toBoolean = (value, fallback) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.trim().toLowerCase();
    if (lower === 'true') return true;
    if (lower === 'false') return false;
  }
  return fallback;
};

export const ENV = {
  PORT: toNumber(process.env.PORT, DEFAULT_PORT),
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || DEFAULT_CLIENT_ORIGIN,
  MONGODB_URI: process.env.MONGODB_URI || process.env.MONGO_URI || DEFAULT_MONGO_URI,
  MONGO_DB_NAME: process.env.MONGO_DB_NAME || DEFAULT_DB_NAME,
  AGORA_APP_ID: process.env.AGORA_APP_ID || '',
  AGORA_APP_CERTIFICATE: process.env.AGORA_APP_CERTIFICATE || '',
  AGORA_TOKEN_EXPIRY_SECONDS: toNumber(process.env.AGORA_TOKEN_EXPIRY_SECONDS, DEFAULT_AGORA_TOKEN_EXPIRY_SECONDS),
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  GROQ_CHAT_MODEL: process.env.GROQ_CHAT_MODEL || DEFAULT_GROQ_CHAT_MODEL,
  GROQ_STT_MODEL: process.env.GROQ_STT_MODEL || DEFAULT_GROQ_STT_MODEL,
  EMAIL_HOST: process.env.EMAIL_HOST || '',
  EMAIL_PORT: toNumber(process.env.EMAIL_PORT, 587),
  EMAIL_SECURE: toBoolean(process.env.EMAIL_SECURE, false),
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASS: process.env.EMAIL_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || process.env.EMAIL_USER || '',
  OTP_EXPIRY_SECONDS: toNumber(process.env.OTP_EXPIRY_SECONDS, DEFAULT_OTP_EXPIRY_SECONDS)
};

export const AGENT_SYSTEM_PROMPT = [
  'You are a friendly, professional human loan onboarding specialist on a live verification call.',
  'Keep replies natural, warm, and short, like a real agent speaking live.',
  'Ask exactly one question at a time and wait for the applicant response.',
  'Collect information in this sequence when possible: full legal name, date of birth, loan purpose, requested loan amount, employment type and employer, monthly income, existing major debts, credit concerns, property details if mortgage-related, and consent to proceed.',
  'If something is missing or unclear, ask a polite clarification question.',
  'Avoid robotic phrasing, avoid long paragraphs, and do not mention being an AI model unless directly asked.',
  'The goal is to complete onboarding while sounding genuinely human and empathetic.'
].join(' ');