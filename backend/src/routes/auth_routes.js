import { Router } from 'express';

import { createOrUpdateOnboardingApplication, getApplicationProfile } from '../controllers/auth_controller.js';
import { auth } from '../middlewares/auth.js';

export const authRouter = Router();

authRouter.post('/applications', auth, createOrUpdateOnboardingApplication);
authRouter.get('/applications/:appId', auth, getApplicationProfile);