export const statusCards = [
  {
    title: 'Home Loan Application',
    appId: 'APP-4921-HL',
    status: 'Underwriting Review',
    statusTone: 'text-primary bg-primary/10 border-primary/20',
    progress: 82,
    eta: 'Decision expected in 1 business day'
  },
  {
    title: 'Personal Loan Refinance',
    appId: 'APP-2077-PL',
    status: 'Approved',
    statusTone: 'text-green-700 bg-green-50 border-green-100',
    progress: 100,
    eta: 'Agreement sent for e-signature'
  },
  {
    title: 'Credit Line Increase',
    appId: 'APP-7812-CL',
    status: 'Additional Documents Needed',
    statusTone: 'text-amber-700 bg-amber-50 border-amber-100',
    progress: 56,
    eta: 'Upload last 3 salary slips to continue'
  }
];

export const historyRows = [
  { date: '12 Apr 2026', action: 'KYC completed via video verification', id: 'APP-4921-HL', type: 'Verification', amount: '-' },
  { date: '10 Apr 2026', action: 'Loan terms revised and accepted', id: 'APP-2077-PL', type: 'Agreement', amount: 'INR 2,00,000' },
  { date: '08 Apr 2026', action: 'Bank statement parsed successfully', id: 'APP-7812-CL', type: 'Document', amount: '-' },
  { date: '05 Apr 2026', action: 'Initial application submitted', id: 'APP-4921-HL', type: 'Submission', amount: 'INR 45,00,000' }
];

export const pendingTasks = [
  { label: 'Upload salary slips for credit-line application', severity: 'high' },
  { label: 'Review and sign refinance agreement', severity: 'medium' },
  { label: 'Add nominee details for active loan account', severity: 'low' }
];
