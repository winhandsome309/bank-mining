// import React, { useEffect, useState } from 'react'
import React, { useState, useEffect } from 'react'
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
  CInputGroupText,
  CFormInput,
  CInputGroup,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CToast,
  CToastBody,
  CToastClose,
  CToastHeader,
  CToaster,
  CTooltip,
  COffcanvas,
  COffcanvasHeader,
  COffcanvasTitle,
  CCloseButton,
  COffcanvasBody,
  CContainer,
  CFooter,
  CFormSelect,
  CCollapse,
  CForm,
  CSpinner,
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
import client from '../hooks/useApi'
import { BarChart } from '@mantine/charts'

const Insight = (props) => {
  const [data, setData] = useState([])
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const fetchInsight = () => {
    client
      .get(props.api, {
        params: {
          id: props.data.id,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setData(res.data['data'])
          setLoaded(true)
        }
      })
  }

  useEffect(() => {
    if (open) fetchInsight()
  }, [open])

  return (
    <>
      <CButton
        className="ms-auto focus:cursor-auto"
        style={{ backgroundColor: '#099' }}
        onClick={() => setOpen(true)}
      >
        <span style={{ color: 'white' }}>Insight</span>
      </CButton>
      <CModal scrollable visible={open} onClose={() => setOpen(false)} alignment="center" size="lg">
        <CModalHeader>
          <div style={{ fontWeight: '600', fontSize: '18px', color: '#099' }}>Insight</div>
        </CModalHeader>
        <CModalBody>
          {loaded == true ? (
            <CCol>
              {data.length > 0 &&
                data.map((value) => (
                  <CRow className="mb-4">
                    <div>
                      <CCard>
                        <CCardHeader style={{ fontWeight: '600' }}>{value.name}</CCardHeader>
                        <CCardBody>
                          {value.type == 'number' ? (
                            <>
                              <div>
                                <span
                                  className="mb-2"
                                  style={{ fontSize: '20px', fontWeight: '600' }}
                                >
                                  {props.data[value.name]}
                                </span>
                                <span>{' unit'}</span>
                              </div>
                              <CRow>
                                <CCol xs={6}>
                                  <span>{'Top '}</span>
                                  <span
                                    style={{
                                      color: value.value[0] > 50 ? '#02b128' : '#f03e3e',
                                      fontWeight: '700',
                                    }}
                                  >
                                    {value.value[0] == -1
                                      ? '100%'
                                      : Math.round(value.value[0] * 100) / 100 + '%'}
                                  </span>
                                </CCol>
                                <CCol xs={6}>
                                  <div className="text-end">
                                    <span>{value.value[1] > 0 ? 'Larger ' : 'Smaller '}</span>
                                    <span
                                      style={{
                                        color: value.value[1] > 0 ? '#02b128' : '#f03e3e',
                                        fontWeight: '700',
                                      }}
                                    >
                                      {Math.abs(value.value[1])}
                                    </span>
                                    <span>{' than average ('}</span>
                                    <span>{value.value[2] + ')'}</span>
                                  </div>
                                </CCol>
                              </CRow>
                            </>
                          ) : (
                            <>
                              <div className="mb-2" style={{ fontSize: '20px', fontWeight: '600' }}>
                                {props.data[value.name]}
                              </div>
                              <span>{'Have '}</span>
                              <span
                                style={{
                                  color: value.value[0] > 50 ? '#02b128' : '#f03e3e',
                                  fontWeight: '700',
                                }}
                              >
                                {value.value[0]}
                              </span>
                              {' people are fraud with this value'}
                            </>
                          )}
                        </CCardBody>
                      </CCard>
                    </div>
                  </CRow>
                ))}
            </CCol>
          ) : (
            <CSpinner />
          )}
        </CModalBody>
      </CModal>
    </>
  )
}

export default Insight
