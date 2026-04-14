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
import { ENV } from '../config/constants.js';

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
  const appId = ENV.AGORA_APP_ID;
  const appCertificate = ENV.AGORA_APP_CERTIFICATE;

  if (!appId || !appCertificate) {
    return res.status(500).json({ error: 'AGORA_APP_ID and AGORA_APP_CERTIFICATE must be set in backend/.env' });
  }

  const { channelName, uid } = req.body || {};

  if (!channelName || typeof channelName !== 'string') {
    return res.status(400).json({ error: 'channelName is required' });
  }

  const parsedUid = Number(uid);
  const rtcUid = Number.isNaN(parsedUid) ? 0 : parsedUid;
  const expiresIn = ENV.AGORA_TOKEN_EXPIRY_SECONDS;

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
  if (!ENV.GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY is not configured in backend/.env' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'audio file is required (multipart form field: audio)' });
  }

  try {
    const groq = createGroqClient(ENV.GROQ_API_KEY);
    const text = await transcribeAudio(groq, req.file, { model: ENV.GROQ_STT_MODEL });

    return res.json({ text });
  } catch (error) {
    console.error('Groq STT error:', error);
    return res.status(500).json({ error: 'Failed to transcribe audio with Groq.' });
  }
}

export async function chatWithAgent(req, res) {
  if (!ENV.GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY is not configured in backend/.env' });
  }

  const { messages } = req.body || {};
  const safeMessages = Array.isArray(messages) ? messages : [];

  try {
    const groq = createGroqClient(ENV.GROQ_API_KEY);
    const reply = await generateAgentReply(groq, safeMessages, { model: ENV.GROQ_CHAT_MODEL });

    return res.json({ reply });
  } catch (error) {
    console.error('Groq chat error:', error);
    return res.status(500).json({ error: 'Failed to generate agent response with Groq.' });
  }
}

export async function extractDataFromChat(req, res) {
  if (!ENV.GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY is not configured in backend/.env' });
  }

  const { messages } = req.body || {};
  const safeMessages = Array.isArray(messages) ? messages : [];

  const extractionPrompt = `You are a data extraction assistant. Based on the following interview transcript, extract the loan application details into a strictly formatted JSON object.
The JSON must have EXACTLY these keys:
"full_name", "dob", "pan", "aadhaar", "employment_type", "monthly_income", "company_name", "work_experience", "loan_amount", "loan_purpose".
If a value is not found, leave it as an empty string. Output ONLY the raw JSON object, without any markdown formatting, no \`\`\`json wrappers.

Transcript:
${safeMessages.map(m => `[${m.role}] ${m.content}`).join('\n')}
`;

  try {
    const groq = createGroqClient(ENV.GROQ_API_KEY);
    const reply = await generateAgentReply(groq, [{ role: 'user', content: extractionPrompt }], { model: ENV.GROQ_CHAT_MODEL });
    
    let parsed = {};
    try {
      const cleaned = reply.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.warn("Could not parse JSON cleanly:", reply);
      parsed = { raw: reply };
    }

    return res.json({ extractedData: parsed });
  } catch (error) {
    console.error('Groq extraction error:', error);
    return res.status(500).json({ error: 'Failed to extract data with Groq.' });
  }
}

export async function ocrDocument(req, res) {
  if (!ENV.GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY is not configured' });
  }

  const { imageBase64 } = req.body || {};
  if (!imageBase64) return res.status(400).json({ error: 'imageBase64 is required' });

  const systemPrompt = `Extract Name, Date of Birth, Address, PAN Number, Aadhaar Number, and Income Details from this document image. Return a STRICT JSON object only. Do not wrap in markdown \`\`\`. Keys: "name", "dob", "address", "pan", "aadhaar", "income". If missing, leave empty string.`;

  try {
    const groq = createGroqClient(ENV.GROQ_API_KEY);
    const completion = await groq.chat.completions.create({
      model: "llama-3.2-11b-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: systemPrompt },
            { type: "image_url", image_url: { url: imageBase64 } }
          ]
        }
      ],
      max_tokens: 1024
    });

    const reply = completion.choices[0]?.message?.content || '{}';
    let parsed = {};
    try {
      const cleaned = reply.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch(e) {
      parsed = { raw: reply };
    }

    return res.json({ ocrData: parsed });
  } catch (error) {
    console.error('Groq Vision error:', error);
    return res.status(500).json({ error: 'Failed to perform OCR with Groq.' });
  }
}

export async function evaluateLoanEligibility(req, res) {
  const { monthly_income, employment_type, loan_amount } = req.body || {};
  
  // Clean values from text (e.g. "50000 rupees" -> 50000)
  const extractNumber = (str) => {
    const match = String(str || '').match(/\d+/g);
    return match ? Number(match.join('')) : 0;
  };

  const parsedIncome = extractNumber(monthly_income);
  const parsedAmount = extractNumber(loan_amount);

  if (parsedIncome < 15000) {
    return res.json({
      decision: 'Rejected',
      reason: 'Minimum verified monthly income of 15,000 is required for premium products.'
    });
  }

  // Simplistic eligibility check: total amount shouldn't be insanely disproportionate to monthly income
  const estimatedEmi = parsedAmount / 36;

  if (estimatedEmi > (parsedIncome * 0.65)) {
    return res.json({
      decision: 'Rejected',
      reason: `Requested loan amount is disproportionate to the verified income bracket.`
    });
  }

  const empStr = String(employment_type).toLowerCase();
  if (empStr.includes('unemployed') || empStr.includes('student')) {
    return res.json({
      decision: 'Rejected',
      reason: 'Stable employment or business revenue is required for this loan product.'
    });
  }

  return res.json({
    decision: 'Approved',
    offers: [
      { id: '1', bank: 'Global Trust Bank', amount: parsedAmount, rate: '8.5%', term: '36 Months', type: 'Personal Loan' },
      { id: '2', bank: 'Prime National', amount: parsedAmount, rate: '9.2%', term: '48 Months', type: 'Flexi Loan' }
    ]
  });
}