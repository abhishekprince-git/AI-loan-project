import { Router } from 'express';

import { chatWithAgent, getAppState, getDashboardData, groqAudioUpload, issueAgoraToken, transcribeSpeech, updateOfferDecision, extractDataFromChat, ocrDocument, evaluateLoanEligibility, generateLoanApplicationPdf, receiveDetectedAge, sendVerificationOtp, verifyOtp, documentUpload, uploadDocument } from '../controllers/url_controller.js';
import { loanFormChat, resetLoanFormSession } from '../controllers/loan_form_controller.js';
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
urlRouter.post('/verification/age', receiveDetectedAge);
urlRouter.post('/verification/send-otp', sendVerificationOtp);
urlRouter.post('/verification/verify-otp', verifyOtp);
urlRouter.post('/documents/upload', documentUpload, uploadDocument);
urlRouter.post('/loan/evaluate', evaluateLoanEligibility);
urlRouter.post('/loan/application/pdf', generateLoanApplicationPdf);
urlRouter.post('/loan/form-chat', loanFormChat);
urlRouter.post('/loan/form-chat/reset', resetLoanFormSession);