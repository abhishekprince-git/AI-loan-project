import Groq from 'groq-sdk';

import { AGENT_SYSTEM_PROMPT } from '../config/constants.js';

export function createGroqClient(apiKey) {
  return new Groq({ apiKey });
}

export async function transcribeAudio(groq, file, { model }) {
  const transcription = await groq.audio.transcriptions.create({
    file: new File([file.buffer], file.originalname || 'speech.webm', {
      type: file.mimetype || 'audio/webm'
    }),
    model,
    language: 'en',
    response_format: 'verbose_json'
  });

  return transcription?.text?.trim() || '';
}

export async function generateAgentReply(groq, messages, { model }) {
  const completion = await groq.chat.completions.create({
    model,
    temperature: 0.6,
    max_completion_tokens: 220,
    messages: [
      { role: 'system', content: AGENT_SYSTEM_PROMPT },
      ...messages.map((message) => ({
        role: message.role,
        content: String(message.content || '')
      }))
    ]
  });

  return completion?.choices?.[0]?.message?.content?.trim() || '';
}