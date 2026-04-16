import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';

import {
  applyOfferUpdate,
  buildAgoraToken,
  createGroqClient,
  fetchAppState,
  fetchDashboardData,
  generateAgentReply,
  transcribeAudio,
  generateLoanOfferDetails
} from '../services/url_service.js';
import { ENV } from '../config/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DOCUMENT_UPLOAD_DIR = path.resolve(__dirname, '../uploads/documents');

const ensureDirectoryExists = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

ensureDirectoryExists(DOCUMENT_UPLOAD_DIR);

const documentStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, DOCUMENT_UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, `${timestamp}-${safeName}`);
  }
});

export const documentUpload = multer({ storage: documentStorage }).single('document');
export const groqAudioUpload = multer({ storage: multer.memoryStorage() }).single('audio');

const otpStore = new Map();

const buildOtpKey = (email) => String(email || '').trim().toLowerCase();

const generateOtpCode = () => String(Math.floor(100000 + Math.random() * 900000));

const getOtpEntry = (email) => {
  const key = buildOtpKey(email);
  const entry = otpStore.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(key);
    return null;
  }
  return entry;
};

const storeOtpEntry = (email, code) => {
  const key = buildOtpKey(email);
  const entry = {
    code: String(code),
    expiresAt: Date.now() + ENV.OTP_EXPIRY_SECONDS * 1000,
    createdAt: Date.now(),
    attempts: 0
  };
  otpStore.set(key, entry);
  return entry;
};

const clearOtpEntry = (email) => {
  otpStore.delete(buildOtpKey(email));
};

const createMailerTransport = () => {
  if (!ENV.EMAIL_HOST || !ENV.EMAIL_USER || !ENV.EMAIL_PASS) {
    throw new Error('Email transport credentials are not configured in backend/.env');
  }

  return nodemailer.createTransport({
    host: ENV.EMAIL_HOST,
    port: ENV.EMAIL_PORT,
    secure: ENV.EMAIL_SECURE,
    auth: {
      user: ENV.EMAIL_USER,
      pass: ENV.EMAIL_PASS
    }
  });
};

const sendOtpEmail = async (to, code) => {
  const transporter = createMailerTransport();
  const mailOptions = {
    from: ENV.EMAIL_FROM || ENV.EMAIL_USER,
    to,
    subject: 'Your verification code',
    text: `Your verification code is ${code}. It expires in ${ENV.OTP_EXPIRY_SECONDS} seconds.`,
    html: `<p>Your verification code is <strong>${code}</strong>.</p><p>It expires in ${ENV.OTP_EXPIRY_SECONDS} seconds.</p>`
  };

  return transporter.sendMail(mailOptions);
};

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

const parseNumber = (value) => {
  if (value == null) return 0;
  const normalized = String(value).replace(/[^0-9.]/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const calculateAgeFromDob = (dob) => {
  if (!dob) return null;
  const date = new Date(dob);
  if (Number.isNaN(date.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age -= 1;
  }
  return age;
};

const isVerificationComplete = (value) => {
  if (typeof value === 'boolean') return value;
  const normalized = String(value || '').trim().toLowerCase();
  return ['true', 'verified', 'complete', 'yes', 'passed', 'ok'].includes(normalized);
};

export async function evaluateLoanEligibility(req, res) {
  const payload = req.body || {};
  const monthlyIncome = parseNumber(payload.monthly_income || payload.monthlyIncome || payload.income || payload.salary);
  const loanAmount = parseNumber(payload.loan_amount || payload.loanAmount || payload.requested_loan_amount || payload.loanAmountRequested);
  const rawAge = payload.age || payload.user_age || payload.declared_age;
  const ageFromDob = calculateAgeFromDob(payload.dob || payload.date_of_birth || payload.dobString);
  const age = Number.isFinite(Number(rawAge)) && Number(rawAge) > 0 ? Number(rawAge) : ageFromDob;
  const verificationComplete = isVerificationComplete(payload.verification_status ?? payload.verified ?? payload.document_verified ?? payload.phoneVerified ?? payload.identityVerified ?? payload.verificationComplete);

  const explanationFragments = [];
  const decisionDetails = {
    monthlyIncome,
    age,
    loanAmount,
    verificationComplete
  };

  if (!monthlyIncome || monthlyIncome <= 0) {
    return res.json({
      decision: 'Rejected',
      reason: 'Missing or invalid income information.',
      explanation: 'We could not determine your verified monthly income. Please provide valid income details to proceed with eligibility evaluation.',
      details: decisionDetails
    });
  }

  if (!loanAmount || loanAmount <= 0) {
    return res.json({
      decision: 'Rejected',
      reason: 'Missing or invalid loan amount requested.',
      explanation: 'The requested loan amount must be specified and greater than zero. Please review your application and try again.',
      details: decisionDetails
    });
  }

  if (!Number.isFinite(age) || age <= 0) {
    return res.json({
      decision: 'Rejected',
      reason: 'Missing or invalid age information.',
      explanation: 'Your age could not be determined from the provided data. Please confirm your date of birth or age before submission.',
      details: decisionDetails
    });
  }

  if (!verificationComplete) {
    explanationFragments.push('Verification status is incomplete. Completed document and email OTP verification are required for approval.');
  }

  if (monthlyIncome < 15000) {
    explanationFragments.push('Your verified monthly income is below the minimum threshold of INR 15,000 for this loan product.');
  }

  if (age < 21 || age > 65) {
    explanationFragments.push('Your age does not fall within our eligible range of 21 to 65 years.');
  }

  const maxLoanMultiple = 25;
  const maxEligibleLoan = Math.max(0, Math.floor(monthlyIncome * maxLoanMultiple));
  const estimatedEmi = loanAmount / 36;
  const maxAllowableEmi = monthlyIncome * 0.65;

  if (loanAmount > maxEligibleLoan) {
    explanationFragments.push(`The requested amount is too high for your income profile. We typically limit this product to a maximum of INR ${maxEligibleLoan.toLocaleString()} for your earnings.`);
  }

  if (estimatedEmi > maxAllowableEmi) {
    explanationFragments.push(`The estimated monthly EMI of INR ${estimatedEmi.toFixed(0)} exceeds 65% of your monthly income, which is outside our debt-service affordability threshold.`);
  }

  if (explanationFragments.length > 0) {
    return res.json({
      decision: 'Rejected',
      reason: 'Application does not meet one or more eligibility criteria.',
      explanation: explanationFragments.join(' '),
      details: decisionDetails,
      maxEligibleAmount: maxEligibleLoan,
      estimatedEmi: Number(estimatedEmi.toFixed(0)),
      maximumAllowedEmi: Number(maxAllowableEmi.toFixed(0))
    });
  }

  return res.json({
    decision: 'Approved',
    reason: 'Application meets all eligibility criteria.',
    explanation: `Your verified income of INR ${monthlyIncome.toLocaleString()} and age of ${age} years support an approval for the requested loan amount of INR ${loanAmount.toLocaleString()}. Verification status is complete, and the loan fits within our affordability limits.`,
    details: decisionDetails,
    approvedAmount: loanAmount,
    maxEligibleAmount: maxEligibleLoan,
    estimatedEmi: Number(estimatedEmi.toFixed(0)),
    maximumAllowedEmi: Number(maxAllowableEmi.toFixed(0))
  });
}

export async function sendVerificationOtp(req, res) {
  const { email } = req.body || {};
  const formattedEmail = String(email || '').trim().toLowerCase();

  if (!formattedEmail) {
    return res.status(400).json({ error: 'email is required' });
  }

  try {
    const otp = generateOtpCode();
    storeOtpEntry(formattedEmail, otp);
    await sendOtpEmail(formattedEmail, otp);

    return res.json({
      status: 'sent',
      email: formattedEmail,
      expiresIn: ENV.OTP_EXPIRY_SECONDS
    });
  } catch (error) {
    console.error('Email send OTP error:', error);
    return res.status(500).json({ error: 'Failed to send OTP via email' });
  }
}

export async function verifyOtp(req, res) {
  const { email, code } = req.body || {};
  const formattedEmail = String(email || '').trim().toLowerCase();
  const enteredCode = String(code || '').trim();

  if (!formattedEmail || !enteredCode) {
    return res.status(400).json({ error: 'email and code are required' });
  }

  const entry = getOtpEntry(formattedEmail);
  if (!entry) {
    return res.status(400).json({ error: 'OTP expired or not found' });
  }

  if (entry.code !== enteredCode) {
    entry.attempts += 1;
    return res.status(400).json({ error: 'Invalid OTP code' });
  }

  clearOtpEntry(formattedEmail);
  return res.json({ verified: true, email: formattedEmail });
}

export async function uploadDocument(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'document file is required' });
  }

  const documentType = String(req.body.documentType || '').trim() || null;
  const fileData = {
    originalName: req.file.originalname,
    storedName: req.file.filename,
    mimeType: req.file.mimetype,
    size: req.file.size,
    path: path.relative(path.resolve(__dirname, '..'), req.file.path).replace(/\\/g, '/'),
    documentType
  };

  return res.json({ status: 'uploaded', document: fileData });
}

const safeText = (value) => {
  if (value == null || value === '') return 'Not provided';
  return String(value);
};

const buildPdfField = (doc, label, value) => {
  doc.font('Helvetica-Bold').fontSize(11).text(`${label}: `, { continued: true });
  doc.font('Helvetica').text(safeText(value));
};

export async function generateLoanApplicationPdf(req, res) {
  const payload = req.body || {};
  const userDetails = {
    'Applicant name': payload.full_name || payload.name || payload.fullName || 'Not provided',
    'Date of birth': payload.dob || payload.date_of_birth || payload.dateOfBirth || 'Not provided',
    Age: payload.age || payload.user_age || payload.declared_age || 'Not provided',
    'PAN number': payload.pan || payload.pan_number || payload.panNumber || 'Not provided',
    'Aadhaar number': payload.aadhaar || payload.aadhaar_number || payload.aadhaarNumber || 'Not provided',
    'Monthly income': payload.monthly_income || payload.monthlyIncome || payload.income || 'Not provided',
    'Employment type': payload.employment_type || payload.employmentType || 'Not provided',
    'Company name': payload.company_name || payload.companyName || 'Not provided',
    'Loan purpose': payload.loan_purpose || payload.loanPurpose || 'Not provided',
    'Requested loan amount': payload.loan_amount || payload.loanAmount || 'Not provided',
    Phone: payload.phone || payload.mobile || 'Not provided',
    'Verification status': payload.verification_status || payload.verified || payload.verificationComplete || 'Not provided'
  };

  const decision = payload.decision || payload.status || 'Pending';
  const reason = payload.reason || 'Not provided';
  const explanation = payload.explanation || 'No additional explanation was provided.';

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="loan-application-summary.pdf"');

  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  doc.pipe(res);

  doc.fontSize(22).font('Helvetica-Bold').text('Loan Application Summary', { align: 'center' });
  doc.moveDown(1);

  doc.fontSize(12).font('Helvetica').text(`Generated on: ${new Date().toLocaleString()}`);
  doc.moveDown(1);

  doc.fontSize(16).font('Helvetica-Bold').text('Applicant Details');
  doc.moveDown(0.5);

  Object.entries(userDetails).forEach(([label, value]) => {
    buildPdfField(doc, label, value);
  });

  doc.moveDown(1);
  doc.fontSize(16).font('Helvetica-Bold').text('Loan Decision');
  doc.moveDown(0.5);
  buildPdfField(doc, 'Decision', decision);
  buildPdfField(doc, 'Reason', reason);
  doc.moveDown(0.5);
  doc.font('Helvetica-Bold').text('Explanation:');
  doc.font('Helvetica').fontSize(11).text(explanation, { align: 'justify', lineGap: 4 });

  doc.moveDown(1);
  doc.fontSize(12).font('Helvetica-Oblique').text('This document summarizes the loan eligibility decision and the data provided during your application process.', { align: 'left' });

  doc.end();
}

export async function receiveDetectedAge(req, res) {
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
      generateLoanOfferDetails({ loanAmount: parsedAmount, annualInterestRate: 8.5, tenureMonths: 36, bank: 'Global Trust Bank', product: 'Personal Loan', offerId: '1' }),
      generateLoanOfferDetails({ loanAmount: parsedAmount, annualInterestRate: 9.2, tenureMonths: 48, bank: 'Prime National', product: 'Flexi Loan', offerId: '2' })
    ]
  });
}