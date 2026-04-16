import pkg from 'agora-access-token';
import Groq from 'groq-sdk';

import { AGENT_SYSTEM_PROMPT, DEFAULT_AGORA_TOKEN_EXPIRY_SECONDS, DEFAULT_GROQ_CHAT_MODEL, DEFAULT_GROQ_STT_MODEL } from '../config/constants.js';
import { LoanApplication } from '../models/url_model.js';

const { RtcRole, RtcTokenBuilder } = pkg;
const PRIMARY_APP_ID = 'APP-4921-HL';

const DEFAULT_APPLICATIONS = [
  {
    appId: 'APP-4921-HL',
    title: 'Home Loan Application',
    status: 'Underwriting Review',
    statusTone: 'text-primary bg-primary/10 border-primary/20',
    progress: 82,
    eta: 'Decision expected in 1 business day',
    amount: 'INR 45,00,000',
    currentStep: 'dashboard',
    loanDetails: {
      full_name: 'Alex Rivera',
      dob: '14 March 1992',
      loan_purpose: 'Home purchase',
      loan_amount: 'INR 45,00,000',
      employment: 'Senior Product Designer',
      income: 'INR 3,20,000/month',
      debts: 'Vehicle EMI only',
      consent: true
    },
    profile: {
      name: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      phone: '+91 98765 43210',
      location: 'Austin, Texas',
      occupation: 'Senior Product Designer',
      dob: '14 March 1992'
    },
    financialProfile: {
      bankName: 'HDFC Bank',
      maskedAccountNumber: '• • • • 4921',
      creditReportUpdatedAt: 'Today',
      creditTier: 'Gold'
    },
    settings: {
      notifications: true,
      darkMode: false,
      twoFactor: true,
      biometrics: true,
      cloudSync: true
    },
    verification: {
      extractedName: 'Alex Julian Rivera',
      dateOfBirth: '14 March 1992',
      idNumber: 'XXXX-XXXX-4921',
      declaredAge: '32 Years',
      cameraPermission: true,
      microphonePermission: true,
      locationPermission: true,
      isCapturing: false,
      isFlashlightOn: false,
      status: 'verified'
    },
    onboarding: {
      channelName: 'loan-verification',
      topics: [
        { key: 'full_name', label: 'full legal name', hints: ['full name', 'legal name', 'name as per id'] },
        { key: 'dob', label: 'date of birth', hints: ['date of birth', 'dob', 'born'] },
        { key: 'loan_purpose', label: 'loan purpose', hints: ['loan purpose', 'purpose of the loan', 'why are you applying'] },
        { key: 'loan_amount', label: 'requested loan amount', hints: ['loan amount', 'how much', 'requested amount'] },
        { key: 'employment', label: 'employment details', hints: ['employment', 'employer', 'job title', 'self-employed'] },
        { key: 'income', label: 'monthly income', hints: ['monthly income', 'income', 'salary', 'take-home'] },
        { key: 'debts', label: 'existing debts', hints: ['existing debts', 'liabilities', 'emi', 'monthly obligations'] },
        { key: 'consent', label: 'consent to proceed', hints: ['consent', 'authorize', 'agree to proceed'] }
      ],
      onboardingStarted: true,
      onboardingCompleted: true,
      agentPaused: false,
      isRecording: false,
      isTranscribing: false,
      isThinking: false,
      isSpeaking: false,
      messages: []
    },
    history: [
      { date: '12 Apr 2026', action: 'KYC completed via video verification', id: 'APP-4921-HL', type: 'Verification', amount: '-' },
      { date: '05 Apr 2026', action: 'Initial application submitted', id: 'APP-4921-HL', type: 'Submission', amount: 'INR 45,00,000' }
    ],
    pendingTasks: [
      { label: 'Upload salary slips for credit-line application', severity: 'high' },
      { label: 'Review and sign refinance agreement', severity: 'medium' },
      { label: 'Add nominee details for active loan account', severity: 'low' }
    ],
    supportTickets: [
      { title: 'KYC Document Clarification', state: 'In Progress', time: 'Updated 12 min ago' },
      { title: 'EMI Schedule Request', state: 'Resolved', time: 'Resolved yesterday' }
    ],
    offer: {
      approvedAmount: 'INR 2,00,000',
      tenure: 12,
      emi: 17725,
      isAccepted: false
    }
  },
  {
    appId: 'APP-2077-PL',
    title: 'Personal Loan Refinance',
    status: 'Approved',
    statusTone: 'text-green-700 bg-green-50 border-green-100',
    progress: 100,
    eta: 'Agreement sent for e-signature',
    amount: 'INR 2,00,000',
    currentStep: 'dashboard'
  },
  {
    appId: 'APP-7812-CL',
    title: 'Credit Line Increase',
    status: 'Additional Documents Needed',
    statusTone: 'text-amber-700 bg-amber-50 border-amber-100',
    progress: 56,
    eta: 'Upload last 3 salary slips to continue',
    amount: '-',
    currentStep: 'dashboard'
  }
];

const toPublicDashboardCard = (application) => ({
  title: application.title,
  appId: application.appId,
  status: application.status,
  statusTone: application.statusTone,
  progress: application.progress,
  eta: application.eta
});

async function ensureSeedApplications() {
  const count = await LoanApplication.countDocuments();

  if (count > 0) {
    return LoanApplication.find().sort({ updatedAt: -1 }).lean();
  }

  await LoanApplication.insertMany(DEFAULT_APPLICATIONS);
  return LoanApplication.find().sort({ updatedAt: -1 }).lean();
}

export async function fetchAppState() {
  const applications = await ensureSeedApplications();
  const primary = applications.find((application) => application.appId === PRIMARY_APP_ID) || applications[0] || null;

  return {
    appId: primary?.appId || PRIMARY_APP_ID,
    currentStep: primary?.currentStep || 'dashboard',
    dashboard: {
      statusCards: applications.map(toPublicDashboardCard),
      historyRows: primary?.history || [],
      pendingTasks: primary?.pendingTasks || []
    },
    profile: primary?.profile || {},
    financialProfile: primary?.financialProfile || {},
    settings: primary?.settings || {},
    verification: primary?.verification || {},
    onboarding: primary?.onboarding || {},
    support: {
      tickets: primary?.supportTickets || []
    },
    offer: primary?.offer || {}
  };
}

export async function fetchDashboardData() {
  const state = await fetchAppState();
  return state.dashboard;
}

export async function fetchApplicationByAppId(appId) {
  await ensureSeedApplications();
  return LoanApplication.findOne({ appId }).lean();
}

export async function applyOfferUpdate(appId, payload) {
  return LoanApplication.findOneAndUpdate(
    { appId },
    { $set: { 'offer.isAccepted': Boolean(payload.isAccepted), 'offer.tenure': payload.tenure, 'offer.emi': payload.emi } },
    { new: true }
  ).lean();
}

export function buildAgoraToken({ appId, appCertificate, channelName, uid, expiresIn = DEFAULT_AGORA_TOKEN_EXPIRY_SECONDS }) {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expiresIn;

  return RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, RtcRole.PUBLISHER, privilegeExpiredTs);
}

export function createGroqClient(apiKey) {
  return new Groq({ apiKey });
}

export async function transcribeAudio(groq, file, { model = DEFAULT_GROQ_STT_MODEL } = {}) {
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

export function calculateEmi(principal, annualInterestRate, tenureMonths) {
  const loanAmount = Number(principal || 0);
  const rate = Number(annualInterestRate || 0);
  const tenure = Number(tenureMonths || 0);

  if (!loanAmount || loanAmount <= 0 || !tenure || tenure <= 0) {
    return 0;
  }

  const monthlyRate = rate / 12 / 100;

  if (monthlyRate === 0) {
    return Number((loanAmount / tenure).toFixed(0));
  }

  const factor = Math.pow(1 + monthlyRate, tenure);
  const emi = (loanAmount * monthlyRate * factor) / (factor - 1);
  return Number(emi.toFixed(0));
}

export function generateLoanOfferDetails({ loanAmount, annualInterestRate, tenureMonths, bank, product, offerId }) {
  const amount = Number(loanAmount || 0);
  const rate = Number(annualInterestRate || 0);
  const tenure = Number(tenureMonths || 0);
  const emi = calculateEmi(amount, rate, tenure);
  const totalPayment = Number((emi * tenure).toFixed(0));
  const totalInterest = Number((totalPayment - amount).toFixed(0));

  return {
    id: offerId || `${bank?.toLowerCase().replace(/\s+/g, '-') || 'offer'}-${tenure}`,
    bank: bank || 'Partner Bank',
    amount,
    rate: `${rate}%`,
    tenure,
    emi,
    totalPayment,
    totalInterest,
    type: product || 'Loan Offer'
  };
}

export async function generateAgentReply(groq, messages, { model = DEFAULT_GROQ_CHAT_MODEL } = {}) {
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