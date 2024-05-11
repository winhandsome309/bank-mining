const listLoanParams = [
  ['customer_id', 'ID of customer who submitted this application.', 'normal'],
  [
    'credit_policy',
    '1 if the customer meets the credit underwriting criteria; 0 otherwise.',
    'select',
    ['yes', 'no'],
    [1, 0],
  ],
  [
    'purpose',
    'The purpose of the loan.',
    'select',
    [
      'debt_consolidation',
      'educational',
      'credit_card',
      'major_purchase',
      'home_improvement',
      'small_business',
      'all_other',
    ],
    [
      'debt_consolidation',
      'educational',
      'credit_card',
      'major_purchase',
      'home_improvement',
      'small_business',
      'all_other',
    ],
  ],
  [
    'int_rate',
    'The interest rate of the loan (more risky borrowers are assigned higher interest rates).',
    'normal',
  ],
  ['installment', 'The monthly installments owed by the borrower if the loan is funded.', 'normal'],
  [
    'log_annual_inc',
    'The natural log of the self-reported annual income of the borrower.',
    'normal',
  ],
  [
    'dti',
    'The debt-to-income ratio of the borrower (amount of debt divided by annual income).',
    'normal',
  ],
  ['fico', 'The FICO credit score of the borrower.', 'normal'],
  ['days_with_cr_line', 'The number of days the borrower has had a credit line.', 'normal'],
  [
    'revol_bal',
    "The borrower's revolving balance (amount unpaid at the end of the credit card billing cycle).",
    'normal',
  ],
  [
    'revol_util',
    "The borrower's revolving line utilization rate (the amount of the credit line used relative to total credit available).",
    'normal',
  ],
  [
    'inq_last_6mths',
    "The borrower's number of inquiries by creditors in the last 6 months.",
    'select',
    ['yes', 'no'],
    [1, 0],
  ],
  [
    'delinq_2yrs',
    'The number of times the borrower had been 30+ days past due on a payment in the past 2 years.',
    'select',
    ['yes', 'no'],
    [1, 0],
  ],
  [
    'pub_rec',
    "The borrower's number of derogatory public records.",
    'select',
    ['yes', 'no'],
    [1, 0],
  ],
]

export default listLoanParams
