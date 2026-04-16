import crypto from 'crypto';
import {
  LOAN_TYPES,
  LOAN_FORM_FIELDS,
  LOAN_FORM_QUESTION_ORDER
} from '../../../client/src/configs/loanFormConfig.js';

const SESSION_TTL_MS = 15 * 60 * 1000;
const sessions = new Map();

const getLoanTypeConfig = (loanTypeId) => LOAN_TYPES.find((loan) => loan.id === loanTypeId);

const buildLoanFieldQueue = (loanTypeConfig) =>
  LOAN_FORM_QUESTION_ORDER.filter((key) => loanTypeConfig.fieldKeys.includes(key));

const scheduleSessionExpiration = (session) => {
  if (!session) return;

  if (session.expirationTimer) {
    clearTimeout(session.expirationTimer);
  }

  session.expiresAt = Date.now() + SESSION_TTL_MS;
  session.expirationTimer = setTimeout(() => {
    sessions.delete(session.sessionId);
  }, SESSION_TTL_MS);
};

const createSession = (loanTypeId) => {
  const loanTypeConfig = getLoanTypeConfig(loanTypeId);
  if (!loanTypeConfig) {
    return null;
  }

  const sessionId = crypto.randomUUID();
  const fieldQueue = buildLoanFieldQueue(loanTypeConfig);

  const session = {
    sessionId,
    loanType: loanTypeId,
    fieldQueue,
    answers: {},
    currentStep: 0,
    completed: false,
    expiresAt: null,
    expirationTimer: null
  };

  sessions.set(sessionId, session);
  scheduleSessionExpiration(session);
  return session;
};

const refreshSession = (session) => {
  if (!session) return;
  scheduleSessionExpiration(session);
};

const getNextMissingField = (session) =>
  session.fieldQueue.find((fieldKey) => !session.answers[fieldKey] || String(session.answers[fieldKey]).trim() === '');

const getQuestionForField = (fieldKey) => {
  const field = LOAN_FORM_FIELDS[fieldKey];
  if (!field) {
    return `Please provide a value for ${fieldKey}.`;
  }
  return field.questions?.[0] || `Please provide your ${field.label || fieldKey}.`;
};

const detectLoanTypeFromText = (text) => {
  const normalized = String(text || '').toLowerCase();
  if (!normalized) return null;

  for (const loan of LOAN_TYPES) {
    const normalizedName = loan.name.toLowerCase();
    const normalizedId = loan.id.toLowerCase().replace(/_/g, ' ');
    const keywords = [normalizedName, normalizedId, ...normalizedName.split(' '), ...normalizedId.split(' ')].filter(Boolean);

    if (keywords.some((keyword) => normalized.includes(keyword))) {
      return loan.id;
    }
  }

  return null;
};

const buildSessionResponse = (session) => {
  const nextField = getNextMissingField(session);

  if (!nextField) {
    session.completed = true;
    return {
      status: 'FORM_COMPLETED',
      data: session.answers
    };
  }

  session.currentStep = session.fieldQueue.indexOf(nextField) + 1;

  return {
    status: 'IN_PROGRESS',
    loanType: session.loanType,
    currentField: nextField,
    step: session.currentStep,
    totalSteps: session.fieldQueue.length,
    nextQuestion: getQuestionForField(nextField),
    answers: session.answers
  };
};

export async function loanFormChat(req, res) {
  const { sessionId: incomingSessionId, loanType, message } = req.body || {};

  let session = null;
  let resolvedLoanType = typeof loanType === 'string' ? loanType : null;
  let ignoreFirstMessageAsAnswer = false;

  if (incomingSessionId && typeof incomingSessionId === 'string') {
    session = sessions.get(incomingSessionId);
  }

  if (!session) {
    if (!resolvedLoanType && message && typeof message === 'string') {
      resolvedLoanType = detectLoanTypeFromText(message);
      if (resolvedLoanType) {
        ignoreFirstMessageAsAnswer = true;
      }
    }

    if (!resolvedLoanType) {
      return res.json({
        sessionId: null,
        status: 'IN_PROGRESS',
        nextQuestion: 'Which loan type would you like to apply for? You can say Personal Loan, Home Loan, Auto Loan, or Business Loan.',
        answers: {}
      });
    }

    session = createSession(resolvedLoanType);
    if (!session) {
      return res.status(400).json({ error: `Unsupported loanType: ${resolvedLoanType}` });
    }
  }

  if (session.loanType !== resolvedLoanType && resolvedLoanType) {
    session = createSession(resolvedLoanType);
    if (!session) {
      return res.status(400).json({ error: `Unsupported loanType: ${resolvedLoanType}` });
    }
  }

  refreshSession(session);

  if (session.completed) {
    return res.json({
      sessionId: session.sessionId,
      status: 'FORM_COMPLETED',
      data: session.answers,
      loanType: session.loanType
    });
  }

  const currentField = getNextMissingField(session);
  if (currentField && message && typeof message === 'string' && message.trim() && !ignoreFirstMessageAsAnswer) {
    session.answers[currentField] = message.trim();
  }

  refreshSession(session);
  const response = buildSessionResponse(session);

  return res.json({
    sessionId: session.sessionId,
    loanType: session.loanType,
    ...response
  });
}

export async function resetLoanFormSession(req, res) {
  const { sessionId, loanType } = req.body || {};

  if (!loanType || typeof loanType !== 'string') {
    return res.status(400).json({ error: 'loanType is required' });
  }

  let session = null;
  if (sessionId && typeof sessionId === 'string') {
    session = sessions.get(sessionId);
  }

  if (session && session.loanType !== loanType) {
    session = null;
  }

  if (!session) {
    session = createSession(loanType);
    if (!session) {
      return res.status(400).json({ error: `Unsupported loanType: ${loanType}` });
    }
  } else {
    session.answers = {};
    session.currentStep = 0;
    session.completed = false;
    refreshSession(session);
  }

  const response = buildSessionResponse(session);
  return res.json({
    sessionId: session.sessionId,
    ...response
  });
}
