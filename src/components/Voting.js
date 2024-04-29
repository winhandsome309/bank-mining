// import React, { useEffect, useState } from 'react'
import * as React from 'react'
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
  cilThumbDown,
  cilThumbUp,
} from '@coreui/icons'
import axios from 'axios'

const Voting = () => {
  const [comFunction, setComFunction] = React.useState('Comment')

  return (
    <>
      <CCard>
        <CCardHeader>
          <div>
            <strong>Voting</strong>
          </div>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol xs={2} />
            <CCol xs={1}>
              <CRow>
                <div
                  style={{
                    color: 'green',
                  }}
                >
                  <CIcon icon={cilThumbUp} className="me-2" />
                </div>
              </CRow>
              <CRow>
                <div
                  style={{
                    color: 'red',
                  }}
                >
                  <CIcon icon={cilThumbDown} className="me-2" />
                </div>
              </CRow>
            </CCol>
            <CCol xs={6}>
              <CRow className="mt-2 mb-3">
                <div
                  style={{
                    color: 'green',
                  }}
                >
                  <CProgress value={50} color="success" height={10} />
                </div>
              </CRow>
              <CRow className="mt-1 mb-1">
                <div
                  style={{
                    color: 'red',
                  }}
                >
                  <CProgress value={50} color="danger" height={10} />
                </div>
              </CRow>
            </CCol>
            <CCol xs={3}>
              <CRow>
                <div
                  style={{
                    color: 'green',
                  }}
                >
                  50%
                </div>
              </CRow>
              <CRow>
                <div
                  style={{
                    color: 'red',
                  }}
                >
                  50%
                </div>
              </CRow>
            </CCol>
          </CRow>
          {/* 
          <CCol className="ms-3">
            <CRow>
              <div
                style={{
                  color: 'green',
                }}
              >
                <CIcon icon={cilThumbUp} className="me-2" />
                Approve
              </div>
            </CRow>
            <CRow>
              <div
                style={{
                  color: 'red',
                }}
              >
                <CIcon icon={cilThumbDown} className="me-2" />
                Deny
              </div>
            </CRow>
          </CCol> */}
        </CCardBody>
      </CCard>
    </>
  )
}

export default Voting
