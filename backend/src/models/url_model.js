import mongoose from 'mongoose';

const { Schema } = mongoose;

const chatMessageSchema = new Schema(
  {
    role: { type: String, enum: ['system', 'user', 'assistant'], required: true },
    content: { type: String, default: '' },
    text: { type: String, default: '' },
    time: { type: String, default: '' }
  },
  { _id: false }
);

const onboardingTopicSchema = new Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    hints: [{ type: String, default: [] }]
  },
  { _id: false }
);

const historyEntrySchema = new Schema(
  {
    date: { type: String, default: '' },
    action: { type: String, default: '' },
    id: { type: String, default: '' },
    type: { type: String, default: '' },
    amount: { type: String, default: '' }
  },
  { _id: false }
);

const taskSchema = new Schema(
  {
    label: { type: String, required: true },
    severity: { type: String, enum: ['low', 'medium', 'high'], default: 'low' }
  },
  { _id: false }
);

const supportTicketSchema = new Schema(
  {
    title: { type: String, default: '' },
    state: { type: String, default: '' },
    time: { type: String, default: '' }
  },
  { _id: false }
);

const loanApplicationSchema = new Schema(
  {
    appId: { type: String, required: true, index: true, unique: true },
    title: { type: String, required: true },
    status: { type: String, required: true },
    statusTone: { type: String, default: '' },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    eta: { type: String, default: '' },
    amount: { type: String, default: '' },
    currentStep: { type: Schema.Types.Mixed, default: 'dashboard' },
    loanDetails: {
      full_name: { type: String, default: '' },
      dob: { type: String, default: '' },
      loan_purpose: { type: String, default: '' },
      loan_amount: { type: String, default: '' },
      employment: { type: String, default: '' },
      income: { type: String, default: '' },
      debts: { type: String, default: '' },
      consent: { type: Boolean, default: false }
    },
    profile: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      occupation: { type: String, default: '' },
      dob: { type: String, default: '' }
    },
    financialProfile: {
      bankName: { type: String, default: '' },
      maskedAccountNumber: { type: String, default: '' },
      creditReportUpdatedAt: { type: String, default: '' },
      creditTier: { type: String, default: '' }
    },
    settings: {
      notifications: { type: Boolean, default: true },
      darkMode: { type: Boolean, default: false },
      twoFactor: { type: Boolean, default: true },
      biometrics: { type: Boolean, default: true },
      cloudSync: { type: Boolean, default: true }
    },
    verification: {
      extractedName: { type: String, default: '' },
      dateOfBirth: { type: String, default: '' },
      idNumber: { type: String, default: '' },
      declaredAge: { type: String, default: '' },
      cameraPermission: { type: Boolean, default: false },
      microphonePermission: { type: Boolean, default: false },
      locationPermission: { type: Boolean, default: false },
      isCapturing: { type: Boolean, default: false },
      isFlashlightOn: { type: Boolean, default: false },
      status: { type: String, default: 'pending' }
    },
    onboarding: {
      channelName: { type: String, default: 'loan-verification' },
      messages: { type: [chatMessageSchema], default: [] },
      topics: { type: [onboardingTopicSchema], default: [] },
      onboardingStarted: { type: Boolean, default: false },
      onboardingCompleted: { type: Boolean, default: false },
      agentPaused: { type: Boolean, default: false },
      isRecording: { type: Boolean, default: false },
      isTranscribing: { type: Boolean, default: false },
      isThinking: { type: Boolean, default: false },
      isSpeaking: { type: Boolean, default: false }
    },
    history: { type: [historyEntrySchema], default: [] },
    pendingTasks: { type: [taskSchema], default: [] },
    supportTickets: { type: [supportTicketSchema], default: [] },
    offer: {
      approvedAmount: { type: String, default: '' },
      tenure: { type: Number, default: 12 },
      emi: { type: Number, default: 0 },
      isAccepted: { type: Boolean, default: false }
    }
  },
  {
    timestamps: true,
    minimize: false
  }
);

export const LoanApplication = mongoose.models.LoanApplication || mongoose.model('LoanApplication', loanApplicationSchema);