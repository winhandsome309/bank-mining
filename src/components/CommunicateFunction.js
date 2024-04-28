import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import { getStyle } from '@coreui/utils'
import { CChart, CChartRadar, CChartDoughnut } from '@coreui/react-chartjs'
import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CWidgetStatsD,
  CContainer,
} from '@coreui/react'
import { Doughnut } from 'react-chartjs-2'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
  cilBell,
  cilCheck,
  cilX,
} from '@coreui/icons'
import axios from 'axios'

const CommunicateFunction = () => {
  const [comFunction, setComFunction] = useState('Vote')
  return (
    <>
      <CCard>
        <CCardHeader>
          <CDropdown>
            <CDropdownToggle split={false} color="light">
              <strong>{comFunction}</strong>
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem onClick={() => setComFunction('Vote')}>Vote</CDropdownItem>
              <CDropdownItem onClick={() => setComFunction('Comment')}>Comment</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CCardHeader>
        <CCardBody></CCardBody>
      </CCard>
    </>
  )
}

export default CommunicateFunction
