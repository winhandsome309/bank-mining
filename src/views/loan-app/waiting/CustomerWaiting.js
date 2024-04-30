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

const listLoanParams = [
  ['credit_policy', 'abc', 'select', ['yes', 'no'], [1, 0]],
  [
    'purpose',
    'abc',
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
  ['int_rate', 'abc', 'normal'],
  ['installment', 'abc', 'normal'],
  ['log_annual_inc', 'abc', 'normal'],
  ['dti', 'abc', 'normal'],
  ['fico', 'abc', 'normal'],
  ['days_with_cr_line', 'abc', 'normal'],
  ['revol_bal', 'abc', 'normal'],
  ['revol_util', 'abc', 'normal'],
  ['inq_last_6mths', 'abc', 'select', ['yes', 'no'], [1, 0]],
  ['delinq_2yrs', 'abc', 'select', ['yes', 'no'], [1, 0]],
  ['pub_rec', 'abc', 'select', ['yes', 'no'], [1, 0]],
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
  const [visibleRecheck, setVisibleRecheck] = useState(false)
  const [msgRecheck, setMsgRecheck] = useState('')
  const [predictResult, setPredictResult] = useState(false)
  const [changeApp, setChangeApp] = useState(false)
  const isMounted = useRef(false)

  const fetchApplication = async () => {
    axios
      .get(process.env.REACT_APP_API_ENDPOINT + '/api/loan_application/waiting-list')
      .then((res) => {
        setTableData(res.data)
      })
  }

  const createApplication = async () => {
    const formData = new FormData()
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key])
    })
    axios
      .post(process.env.REACT_APP_API_ENDPOINT + '/api/loan_application/waiting-list', formData)
      .then((res) => {
        if (res.status === 201) {
          setVisibleCreate(false)
          fetchApplication()
          addToast(successToast('Application is created successfully'))
        }
      })
  }

  const deleteApplication = async (id) => {
    const formData = new FormData()
    formData.append('id', id)
    axios
      .delete(process.env.REACT_APP_API_ENDPOINT + '/api/loan_application/waiting-list', {
        data: formData,
      })
      .then((res) => {
        if (res.status === 200) {
          addToast(warningToast('Rejected successfully'))
          fetchApplication()
        }
      })
  }

  const fetchPredictResult = async () => {
    axios
      .get(process.env.REACT_APP_API_ENDPOINT + '/api/predict-result', {
        params: {
          application_id: appData.id,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          var temp = JSON.parse(res.data[0]['predict'].replace(/'/g, '"'))
          setPredictResult(temp)
        }
      })
  }

  const acceptApplication = async (id) => {
    axios
      .post(
        process.env.REACT_APP_API_ENDPOINT + '/api/loan_application/processed-list',
        {},
        {
          params: {
            application_id: id,
          },
        },
      )
      .then((res) => {
        if (res.status === 200) {
          addToast(successToast('Accepted successully'))
          fetchApplication()
        }
      })
  }

  useEffect(() => {
    fetchApplication()
  }, [])

  useEffect(() => {
    if (changeApp == true) {
      fetchPredictResult()
    }
  }, [appData, changeApp])

  useEffect(() => {
    if (predictResult != false) {
      setVisibleApp(true)
    }
  }, [appData, predictResult])

  useEffect(() => {
    if (visibleApp == false && isMounted.current) {
      setChangeApp(!changeApp)
      // setPredictResult(false)
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

  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              <div className="d-none d-md-flex">
                {'Application'}
                <CIcon
                  icon={cilPlus}
                  size="lg"
                  className="ms-auto focus:cursor-auto"
                  onClick={() => setVisibleCreate(true)}
                />
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
                          setAppData(item)
                          setChangeApp(!changeApp)
                        }}
                      >
                        <CTableDataCell className="text-center">
                          <div>{item.id}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{item.purpose}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{item.credit_policy}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{item.int_rate}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{item.installment}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{item.log_annual_inc}</div>
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

      <CModal
        scrollable
        visible={visibleCreate}
        backdrop="static"
        onClose={() => setVisibleCreate(false)}
      >
        <CModalHeader>
          <CModalTitle>Create Application</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CCol>
            {listLoanParams.map(
              (params, index) =>
                index % 2 == 0 && (
                  <CRow className="mb-3">
                    <CCol>
                      <CTooltip placement="left" content={listLoanParams[index][0]}>
                        {params[2] == 'normal' ? (
                          <CFormInput
                            floatingLabel={listLoanParams[index][0]}
                            id={listLoanParams[index][0]}
                            placeholder={listLoanParams[index][0]}
                            onChange={(e) => {
                              setForm({ ...form, [listLoanParams[index][0]]: e.target.value })
                            }}
                          />
                        ) : (
                          <CFormSelect
                            floatingLabel={listLoanParams[index][0]}
                            aria-label="Default"
                            onChange={(e) => {
                              setForm({ ...form, [listLoanParams[index][0]]: e.target.value })
                            }}
                          >
                            <option>Select</option>
                            {listLoanParams[index][3].map((value, i) => (
                              <option value={listLoanParams[index][4][i]}>{value}</option>
                            ))}
                          </CFormSelect>
                        )}
                      </CTooltip>
                    </CCol>
                    {index + 1 < listLoanParams.length ? (
                      <CCol>
                        <CTooltip placement="left" content={listLoanParams[index + 1][0]}>
                          {listLoanParams[index + 1][2] == 'normal' ? (
                            <CFormInput
                              floatingLabel={listLoanParams[index + 1][0]}
                              id={listLoanParams[index + 1][0]}
                              placeholder={listLoanParams[index + 1][0]}
                              onChange={(e) => {
                                setForm({
                                  ...form,
                                  [listLoanParams[index + 1][0]]: e.target.value,
                                })
                              }}
                            />
                          ) : (
                            <CFormSelect
                              floatingLabel={listLoanParams[index + 1][0]}
                              aria-label="Default"
                              onChange={(e) => {
                                setForm({
                                  ...form,
                                  [listLoanParams[index + 1][0]]: e.target.value,
                                })
                              }}
                            >
                              <option>Select</option>
                              {listLoanParams[index + 1][3].map((value, i) => (
                                <option value={listLoanParams[index + 1][4][i]}>{value}</option>
                              ))}
                            </CFormSelect>
                          )}
                        </CTooltip>
                      </CCol>
                    ) : (
                      <CCol></CCol>
                    )}
                  </CRow>
                ),
            )}
          </CCol>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleCreate(false)}>
            Close
          </CButton>
          <CButton
            color="primary"
            onClick={() => {
              createApplication()
              // setVisibleCreate(false)
              // addToast(successToast('Application is created successfully'))
            }}
          >
            Create
          </CButton>
        </CModalFooter>
      </CModal>
      <CToaster ref={toaster} push={toast} placement="top-end" />

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
                            <CTooltip placement="left" content={listLoanParams[index + 1][1]}>
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
        </COffcanvasBody>
        <CFooter></CFooter>
      </COffcanvas>
    </>
  )
}

export default CustomerWaiting
