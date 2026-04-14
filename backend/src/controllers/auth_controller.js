import { loanApplicationDao } from '../dao/url_dao.js';

export async function createOrUpdateOnboardingApplication(req, res, next) {
  try {
    const application = await loanApplicationDao.upsertApplication(req.body || {});
    return res.json(application);
  } catch (error) {
    return next(error);
  }
}

export async function getApplicationProfile(req, res, next) {
  try {
    const application = await loanApplicationDao.findApplicationByAppId(req.params.appId);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    return res.json(application);
  } catch (error) {
    return next(error);
  }
}