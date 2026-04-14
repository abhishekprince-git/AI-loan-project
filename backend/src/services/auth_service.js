import { LoanApplication } from '../models/url_model.js';

export async function saveApplication(payload) {
  const appId = payload.appId || `APP-${Date.now()}`;

  return LoanApplication.findOneAndUpdate(
    { appId },
    {
      appId,
      title: payload.title || 'AI Loan Application',
      status: payload.status || 'Draft',
      profile: payload.profile || {},
      loanDetails: payload.loanDetails || {},
      verification: payload.verification || {},
      onboarding: payload.onboarding || {}
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();
}

export async function findApplication(appId) {
  return LoanApplication.findOne({ appId }).lean();
}