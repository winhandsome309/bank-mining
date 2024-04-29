import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilHistory,
  cilCheckCircle,
  cilClock,
  cilClipboard,
  cilGraph,
  cilTask,
  cilFindInPage,
  cilPeople,
  cilUserPlus,
  cilUser,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavTitle,
    name: 'Loan Application',
  },
  //   {
  //     component: CNavGroup,
  //     name: 'Loan Application',
  //     to: '/loan-app',
  //     items: [
  //       {
  //         component: CNavItem,
  //         name: 'Waiting App.',
  //         to: '/loan-app/waiting',
  //         icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
  //       },
  //       {
  //         component: CNavItem,
  //         name: 'Processed App.',
  //         to: '/loan-app/processed',
  //         icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
  //       },
  //     ],
  //   },
  {
    component: CNavItem,
    name: 'Loan Application',
    to: '/loan-app/waiting',
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
  },
]

export default _nav
