export const LOAN_TYPES = [
  {
    id: 'personal_loan',
    name: 'Personal Loan',
    description: 'A flexible unsecured loan for personal needs such as medical bills, weddings, travel, or debt consolidation.',
    fieldKeys: [
      'full_name',
      'dob',
      'pan',
      'aadhaar',
      'employment_type',
      'monthly_income',
      'company_name',
      'work_experience',
      'loan_amount',
      'loan_tenure',
      'loan_purpose',
      'existing_emi'
    ]
  },
  {
    id: 'home_loan',
    name: 'Home Loan',
    description: 'A secured loan to purchase or renovate residential property, designed for long-term repayment.',
    fieldKeys: [
      'full_name',
      'dob',
      'pan',
      'aadhaar',
      'employment_type',
      'monthly_income',
      'company_name',
      'work_experience',
      'property_value',
      'property_type',
      'loan_amount',
      'loan_tenure',
      'loan_purpose',
      'existing_emi'
    ]
  },
  {
    id: 'auto_loan',
    name: 'Auto Loan',
    description: 'A loan to finance a new or used vehicle purchase, with flexible repayment options tied to the vehicle value.',
    fieldKeys: [
      'full_name',
      'dob',
      'pan',
      'aadhaar',
      'employment_type',
      'monthly_income',
      'company_name',
      'work_experience',
      'vehicle_make_model',
      'vehicle_year',
      'vehicle_cost',
      'loan_amount',
      'loan_tenure',
      'loan_purpose',
      'existing_emi'
    ]
  },
  {
    id: 'business_loan',
    name: 'Business Loan',
    description: 'A loan for business expansion, working capital, inventory, or equipment purchases.',
    fieldKeys: [
      'full_name',
      'dob',
      'pan',
      'aadhaar',
      'business_name',
      'business_type',
      'years_in_business',
      'annual_revenue',
      'employment_type',
      'monthly_income',
      'loan_amount',
      'loan_tenure',
      'loan_purpose',
      'existing_emi'
    ]
  }
];

export const LOAN_FORM_FIELDS = {
  full_name: {
    label: 'Full Name',
    type: 'text',
    required: true,
    placeholder: 'Enter your full legal name',
    questions: [
      'Can you please tell me your full name?',
      'What is your full legal name as it appears on your documents?'
    ],
    hints: ['full name', 'name']
  },
  dob: {
    label: 'Date of Birth',
    type: 'date',
    required: true,
    placeholder: 'DD/MM/YYYY',
    questions: [
      'What is your date of birth?',
      'Can you share your birth date for verification?'
    ],
    hints: ['date of birth', 'dob', 'born']
  },
  pan: {
    label: 'PAN Number',
    type: 'text',
    required: true,
    placeholder: 'ABCDE1234F',
    questions: [
      'Please provide your PAN number.',
      'What is your PAN for this application?'
    ],
    hints: ['pan', 'pan number']
  },
  aadhaar: {
    label: 'Aadhaar Number',
    type: 'text',
    required: true,
    placeholder: '1234 5678 9012',
    questions: [
      'Can I have your Aadhaar number?',
      'What is your Aadhaar number for identity verification?'
    ],
    hints: ['aadhaar', 'aadhaar number']
  },
  employment_type: {
    label: 'Employment Type',
    type: 'select',
    options: ['Salaried', 'Self-employed', 'Freelancer', 'Student', 'Retired'],
    required: true,
    placeholder: 'Select employment type',
    questions: [
      'What is your current employment type?',
      'Are you salaried, self-employed, or otherwise employed?'
    ],
    hints: ['employment type', 'salaried', 'self-employed', 'freelancer']
  },
  monthly_income: {
    label: 'Monthly Income',
    type: 'number',
    required: true,
    placeholder: 'Enter your monthly income',
    questions: [
      'What is your monthly income after taxes?',
      'Can you tell me your average monthly income?'
    ],
    hints: ['monthly income', 'salary', 'take-home']
  },
  company_name: {
    label: 'Company Name',
    type: 'text',
    required: false,
    placeholder: 'Enter your employer or company name',
    questions: [
      'What is the name of your employer or company?',
      'Which company do you work for?'
    ],
    hints: ['company name', 'employer', 'work for']
  },
  work_experience: {
    label: 'Work Experience',
    type: 'number',
    required: false,
    placeholder: 'Years of experience',
    questions: [
      'How many years of experience do you have in your current field?',
      'Can you tell me your work experience in years?'
    ],
    hints: ['work experience', 'years of experience', 'experience']
  },
  loan_amount: {
    label: 'Loan Amount',
    type: 'number',
    required: true,
    placeholder: 'Enter the loan amount required',
    questions: [
      'How much money are you looking to borrow?',
      'What loan amount do you need?'
    ],
    hints: ['loan amount', 'borrow', 'required']
  },
  loan_tenure: {
    label: 'Loan Tenure',
    type: 'select',
    options: ['12 months', '24 months', '36 months', '48 months', '60 months', '72 months'],
    required: true,
    placeholder: 'Choose a repayment term',
    questions: [
      'What repayment term would you prefer for this loan?',
      'How long would you like to take to repay the loan?'
    ],
    hints: ['tenure', 'term', 'repayment term']
  },
  loan_purpose: {
    label: 'Loan Purpose',
    type: 'text',
    required: true,
    placeholder: 'Reason for applying for the loan',
    questions: [
      'What is the purpose of this loan?',
      'Can you describe why you need this loan?'
    ],
    hints: ['loan purpose', 'purpose', 'why']
  },
  existing_emi: {
    label: 'Existing EMIs',
    type: 'number',
    required: false,
    placeholder: 'Enter your current monthly EMI amount',
    questions: [
      'Do you currently have any existing EMIs? If yes, how much?',
      'Please share your current monthly EMI obligations, if any.'
    ],
    hints: ['existing emi', 'current emi', 'monthly emi']
  },
  property_value: {
    label: 'Property Value',
    type: 'number',
    required: true,
    placeholder: 'Estimated property value',
    questions: [
      'What is the approximate value of the property you are financing?',
      'Please share the estimated value of the home or property.'
    ],
    hints: ['property value', 'home value', 'estimated value']
  },
  property_type: {
    label: 'Property Type',
    type: 'select',
    options: ['Apartment', 'Villa', 'Plot', 'Renovation', 'Other'],
    required: true,
    placeholder: 'Select property type',
    questions: [
      'What type of property are you applying for?',
      'Is this loan for an apartment, villa, plot, or renovation?'
    ],
    hints: ['property type', 'home', 'villa', 'apartment', 'plot', 'renovation']
  },
  vehicle_make_model: {
    label: 'Vehicle Make and Model',
    type: 'text',
    required: true,
    placeholder: 'Enter the vehicle make and model',
    questions: [
      'What make and model of vehicle are you financing?',
      'Please tell me the vehicle brand and model.'
    ],
    hints: ['vehicle make', 'make and model', 'car model', 'bike model']
  },
  vehicle_year: {
    label: 'Vehicle Year',
    type: 'number',
    required: true,
    placeholder: 'Year of manufacture',
    questions: [
      'What is the year of manufacture of the vehicle?',
      'Can you share the vehicle year?'
    ],
    hints: ['vehicle year', 'year of manufacture', 'model year']
  },
  vehicle_cost: {
    label: 'Vehicle Cost',
    type: 'number',
    required: true,
    placeholder: 'Enter the purchase price of the vehicle',
    questions: [
      'What is the purchase price of the vehicle?',
      'How much does the vehicle cost?'
    ],
    hints: ['vehicle cost', 'price', 'purchase price']
  },
  business_name: {
    label: 'Business Name',
    type: 'text',
    required: true,
    placeholder: 'Enter your business name',
    questions: [
      'What is the name of your business?',
      'Please provide the business name for this application.'
    ],
    hints: ['business name', 'company name']
  },
  business_type: {
    label: 'Business Type',
    type: 'select',
    options: ['Proprietorship', 'Partnership', 'LLP', 'Private Limited', 'Other'],
    required: true,
    placeholder: 'Select business type',
    questions: [
      'What type of business entity do you operate?',
      'Is your business a proprietorship, partnership, LLP, or private limited company?'
    ],
    hints: ['business type', 'entity type', 'proprietorship', 'llp', 'private limited']
  },
  years_in_business: {
    label: 'Years in Business',
    type: 'number',
    required: true,
    placeholder: 'How many years has your business operated?',
    questions: [
      'How long have you been operating this business?',
      'How many years has your business been active?'
    ],
    hints: ['years in business', 'business experience', 'operating years']
  },
  annual_revenue: {
    label: 'Annual Revenue',
    type: 'number',
    required: true,
    placeholder: 'Enter your yearly business revenue',
    questions: [
      'What is your business’s annual revenue?',
      'Can you share your yearly revenue or turnover?'
    ],
    hints: ['annual revenue', 'revenue', 'turnover']
  }
};

export const LOAN_FORM_QUESTION_ORDER = [
  'full_name',
  'dob',
  'pan',
  'aadhaar',
  'employment_type',
  'monthly_income',
  'company_name',
  'work_experience',
  'business_name',
  'business_type',
  'years_in_business',
  'annual_revenue',
  'property_type',
  'property_value',
  'vehicle_make_model',
  'vehicle_year',
  'vehicle_cost',
  'loan_amount',
  'loan_tenure',
  'loan_purpose',
  'existing_emi'
];

export const getLoanFields = (loanTypeId) => {
  const loanType = LOAN_TYPES.find((loan) => loan.id === loanTypeId);
  if (!loanType) {
    return [];
  }
  return loanType.fieldKeys.map((key) => LOAN_FORM_FIELDS[key]).filter(Boolean);
};
