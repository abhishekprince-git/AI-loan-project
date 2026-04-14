import { LoanApplication } from '../models/url_model.js';

class LoanApplicationDao {
  async upsertApplication(payload) {
    const appId = payload.appId || payload.id || `APP-${Date.now()}`;

    return LoanApplication.findOneAndUpdate(
      { appId },
      {
        appId,
        title: payload.title || 'AI Loan Application',
        status: payload.status || 'Draft',
        statusTone: payload.statusTone || 'text-primary bg-primary/10 border-primary/20',
        progress: payload.progress ?? 0,
        eta: payload.eta || '',
        amount: payload.amount || '',
        currentStep: payload.currentStep || 'dashboard',
        loanDetails: payload.loanDetails || {},
        profile: payload.profile || {},
        financialProfile: payload.financialProfile || {},
        settings: payload.settings || {},
        verification: payload.verification || {},
        onboarding: payload.onboarding || {},
        history: payload.history || [],
        pendingTasks: payload.pendingTasks || [],
        supportTickets: payload.supportTickets || [],
        offer: payload.offer || {}
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
  }

  async findApplicationByAppId(appId) {
    return LoanApplication.findOne({ appId }).lean();
  }

  async getDashboardSnapshot() {
    const applications = await LoanApplication.find().sort({ updatedAt: -1 }).lean();
    return {
      statusCards: applications.map((application) => ({
        title: application.title,
        appId: application.appId,
        status: application.status,
        statusTone: application.statusTone,
        progress: application.progress,
        eta: application.eta
      })),
      historyRows: applications.flatMap((application) => application.history || []),
      pendingTasks: applications.flatMap((application) => application.pendingTasks || [])
    };
  }

  async updateOfferState(appId, payload) {
    return LoanApplication.findOneAndUpdate(
      { appId },
      { $set: { 'offer.isAccepted': Boolean(payload.isAccepted), 'offer.tenure': payload.tenure, 'offer.emi': payload.emi } },
      { new: true }
    ).lean();
  }
}

export const loanApplicationDao = new LoanApplicationDao();