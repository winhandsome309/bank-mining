import React from 'react'

// Loan Application
const CustomerLoanWaiting = React.lazy(() => import('./views/loan-app/waiting/CustomerWaiting'))
const LoanProcessed = React.lazy(() => import('./views/loan-app/processed/processed'))
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  // Loan Application
  { path: '/loan-app/waiting', name: 'Waiting', element: CustomerLoanWaiting },
  { path: '/loan-app/processed', name: 'Processed', element: LoanProcessed },
  //Other
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
]

export default routes
