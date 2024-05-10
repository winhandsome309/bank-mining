import React, { useRef, useState, useEffect } from 'react'
import classNames from 'classnames'

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
  CBadge,
  CForm,
} from '@coreui/react'
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
  cilPlus,
} from '@coreui/icons'
import axios, { formToJSON } from 'axios'
import AppTimeline from '../../../components/AppTimeline'
import client from '../../../hooks/useApi'

const listLoanParams = [
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

const CustomerWaiting = () => {
  const [uploadFile, setUploadFile] = useState(true)
  const [visibleCreate, setVisibleCreate] = useState(false)
  const [visibleApp, setVisibleApp] = useState(false)
  const [creditPolicy, setCreditPolicy] = useState()
  const [purpose, setPurpose] = useState()
  const [intRate, setIntRate] = useState()
  const [installment, setInstallment] = useState()
  const [logAnnualInc, setLogAnnualInc] = useState()
  const [dti, setDti] = useState()
  const [fico, setFico] = useState()
  const [daysWithCrLine, setDaysWithCrLine] = useState()
  const [revolBal, setRevolBal] = useState()
  const [revolUtil, setRevolUtil] = useState()
  const [inqLast6mths, setInqLast6mths] = useState()
  const [delinq2yrs, setDelinq2yrs] = useState()
  const [pubRec, setPubRec] = useState()
  const [toast, addToast] = useState(0)
  const toaster = useRef()
  const [tableData, setTableData] = useState([])
  const [appData, setAppData] = useState({
    id: '',
    credit_policy: '',
    purpose: '',
    int_rate: '',
    installment: '',
    log_annual_inc: '',
    dti: '',
    fico: '',
    days_with_cr_line: '',
    revol_bal: '',
    revol_util: '',
    inq_last_6mths: '',
    delinq_2yrs: '',
    pub_rec: '',
  })
  const [form, setForm] = useState({
    credit_policy: '',
    purpose: '',
    int_rate: '',
    installment: '',
    log_annual_inc: '',
    dti: '',
    fico: '',
    days_with_cr_line: '',
    revol_bal: '',
    revol_util: '',
    inq_last_6mths: '',
    delinq_2yrs: '',
    pub_rec: '',
  })
  const [changeApp, setChangeApp] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [lastUpdate, setLastUpdate] = useState('')
  const [validated, setValidated] = useState(false)
  const isMounted = useRef(false)

  const fetchApplication = async () => {
    client.get(process.env.REACT_APP_API_ENDPOINT + '/api/user/application').then((res) => {
      if (res.status == 200) setTableData(res.data)
    })
  }

  const createApplication = async () => {
    const formData = new FormData()
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key])
    })
    client
      .post(process.env.REACT_APP_API_ENDPOINT + '/api/loan_application/waiting-list', formData)
      .then((res) => {
        if (res.status === 201) {
          setVisibleCreate(false)
          fetchApplication()
          addToast(successToast('Application is created successfully'))
        }
      })
  }

  useEffect(() => {
    fetchApplication()
  }, [])

  // useEffect(() => {
  //   setVisibleApp(true)
  // }, [appData])

  useEffect(() => {
    if (visibleApp == false && isMounted.current) {
      setChangeApp(!changeApp)
    } else {
      isMounted.current = true
    }
  }, [visibleApp])

  const successToast = (msg) => (
    <CToast title="Success" color="success" className="d-flex">
      <CToastBody>{msg} !</CToastBody>
      <CToastClose className="me-2 m-auto" white />
    </CToast>
  )
  const warningToast = (msg) => (
    <CToast title="Success" color="warning" className="d-flex">
      <CToastBody>{msg} !</CToastBody>
      <CToastClose className="me-2 m-auto" white />
    </CToast>
  )

  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      setVisibleMultipleApp(false)
      setVisibleSingleApp(false)
      setSelectedFile(IconNumber0Small)
      createApplication()
    }
    setValidated(true)
  }

  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              <div className="d-none d-md-flex">
                {'Application'}
                {/* <CIcon
                  icon={cilPlus}
                  size="lg"
                  className="ms-auto focus:cursor-auto"
                  onClick={() => setVisibleCreate(true)}
                /> */}
              </div>
            </CCardHeader>
            <CCardBody>
              {tableData.length == 0 ? (
                <div>There is nothing to show</div>
              ) : (
                <CTable align="middle" className="mb-0 border" hover responsive>
                  <CTableHead className="text-nowrap">
                    <CTableRow>
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        ID
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Purpose</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary ">
                        Credit Policy
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Int Rate</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Installment</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">
                        Log Annual Inc
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">...</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Status</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {tableData.map((item, index) => (
                      <CTableRow
                        v-for="item in tableItems"
                        key={index}
                        onClick={() => {
                          setAppData(item['Application'])
                          setVisibleApp(true)
                          setCurrentStep(item['step'])
                          const myDate = new Date(item['Application'].id * 1000)
                            .toISOString()
                            .slice(0, 19)
                            .replace('T', ' ')
                          setLastUpdate(myDate)
                          setChangeApp(!changeApp)
                        }}
                      >
                        <CTableDataCell className="text-center">
                          <div>{item['Application'].id}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{item['Application'].purpose}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{item['Application'].credit_policy}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{item['Application'].int_rate}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{item['Application'].installment}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{item['Application'].log_annual_inc}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>...</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color="primary" shape="rounded-pill">
                            Waiting
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <COffcanvas
        className="w-50"
        placement="end"
        visible={visibleApp}
        onHide={() => setVisibleApp(false)}
      >
        <COffcanvasHeader>
          <COffcanvasTitle>Application Detail</COffcanvasTitle>
          <CCloseButton className="text-reset ms-auto" onClick={() => setVisibleApp(false)} />
        </COffcanvasHeader>
        <COffcanvasBody>
          <CCol>
            <CRow>
              <div className="mt-2 mb-4">
                <CCard>
                  <CCardHeader>Detail</CCardHeader>
                  <CCardBody>
                    {listLoanParams.map(
                      (params, index) =>
                        index % 2 == 0 && (
                          <CRow>
                            <CCol>
                              <CRow className="mb-2">
                                <CCol>
                                  <CContainer>
                                    <CTooltip placement="left" content={params[1]}>
                                      <div> {params[0]} </div>
                                    </CTooltip>
                                  </CContainer>
                                </CCol>
                                <CCol>{appData[params[0]]}</CCol>
                              </CRow>
                            </CCol>
                            {index + 1 < listLoanParams.length ? (
                              <CCol>
                                <CRow>
                                  <CCol>
                                    <CContainer>
                                      <CTooltip
                                        placement="left"
                                        content={listLoanParams[index + 1][1]}
                                      >
                                        <div> {listLoanParams[index + 1][0]} </div>
                                      </CTooltip>
                                    </CContainer>
                                  </CCol>
                                  <CCol>{appData[listLoanParams[index + 1][0]]}</CCol>
                                </CRow>
                              </CCol>
                            ) : (
                              <CCol></CCol>
                            )}
                          </CRow>
                        ),
                    )}
                  </CCardBody>
                </CCard>
              </div>
            </CRow>

            <CRow>
              <div>
                <CCard>
                  <CCardHeader>Application Status</CCardHeader>
                  <CCardBody>
                    <div className="mt-3 mb-3">
                      <AppTimeline currentStep={currentStep} />
                    </div>
                    <div className="mb-2">
                      <b className="me-3">Last update: </b>
                      {lastUpdate}
                    </div>
                  </CCardBody>
                </CCard>
              </div>
            </CRow>
          </CCol>
        </COffcanvasBody>
        <CFooter></CFooter>
      </COffcanvas>
    </>
  )
}

export default CustomerWaiting
