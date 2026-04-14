import { Router } from 'express';

import { chatWithAgent, getAppState, getDashboardData, groqAudioUpload, issueAgoraToken, transcribeSpeech, updateOfferDecision, extractDataFromChat, ocrDocument, evaluateLoanEligibility } from '../controllers/url_controller.js';
import { auth } from '../middlewares/auth.js';

export const urlRouter = Router();

urlRouter.get('/app-state', getAppState);
urlRouter.get('/dashboard', auth, getDashboardData);
urlRouter.patch('/applications/:appId/offer', auth, updateOfferDecision);
urlRouter.post('/agora/token', issueAgoraToken);
urlRouter.post('/groq/stt', groqAudioUpload, transcribeSpeech);
urlRouter.post('/groq/chat', chatWithAgent);
urlRouter.post('/groq/extract', extractDataFromChat);
urlRouter.post('/groq/ocr', ocrDocument);
urlRouter.post('/loan/evaluate', evaluateLoanEligibility);