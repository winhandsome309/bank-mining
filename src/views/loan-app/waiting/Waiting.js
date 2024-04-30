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
  CCollapse,
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
import CreateFunction from '../../../components/CreateFunction'

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

const Waiting = () => {
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

  const createMultipleApplication = (file) => {
    console.log(file)
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
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        Result
                      </CTableHeaderCell>
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
                          // setVisibleApp(true)
                        }}
                      >
                        <CTableDataCell className="text-center">
                          {/* <div className="fw-semibold">{item.id.substring(0, 5)}...</div> */}
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
                        <CTableDataCell className="text-center space-between">
                          <CIcon
                            icon={cilCheck}
                            className="text-success"
                            onClick={(e) => {
                              setAppData(item)
                              e.stopPropagation()
                              setMsgRecheck('ACCEPT')
                              setVisibleRecheck(true)
                            }}
                          />
                          {'  '}
                          <CIcon
                            icon={cilX}
                            className="text-danger"
                            onClick={(e) => {
                              setAppData(item)
                              e.stopPropagation()
                              setMsgRecheck('REJECT')
                              setVisibleRecheck(true)
                            }}
                          />
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

      <CreateFunction
        visibleCreate={visibleCreate}
        setVisibleCreate={setVisibleCreate}
        listParams={listLoanParams}
        form={form}
        setForm={setForm}
        createMultiple={createMultipleApplication}
        createSingle={createApplication}
        nameCreate={'Application'}
      />

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
          <CCol>
            <CRow className="mb-2">
              <CCol>
                <CContainer>
                  <CTooltip placement="left" content="abcd">
                    <div> Id </div>
                  </CTooltip>
                </CContainer>
              </CCol>
              <CCol>{appData['id']}</CCol>
            </CRow>
            <CRow className="mb-2">
              <CCol>
                <CContainer>
                  <CTooltip placement="left" content="abcd">
                    <div> Credit Policy </div>
                  </CTooltip>
                </CContainer>
              </CCol>
              <CCol>{appData['credit_policy']}</CCol>
            </CRow>
            <CRow className="mb-2">
              <CCol>
                <CContainer>
                  <CTooltip placement="left" content="abcd">
                    <div> Purpose </div>
                  </CTooltip>
                </CContainer>
              </CCol>
              <CCol>{appData['purpose']}</CCol>
            </CRow>
            <CRow className="mb-2">
              <CCol>
                <CContainer>
                  <CTooltip placement="left" content="abcd">
                    <div> Int Rate </div>
                  </CTooltip>
                </CContainer>
              </CCol>
              <CCol>{appData['int_rate']}</CCol>
            </CRow>
            <CRow className="mb-2">
              <CCol>
                <CContainer>
                  <CTooltip placement="left" content="abcd">
                    <div> Installment </div>
                  </CTooltip>
                </CContainer>
              </CCol>
              <CCol>{appData['installment']}</CCol>
            </CRow>
            <CRow className="mb-2">
              <CCol>
                <CContainer>
                  <CTooltip placement="left" content="abcd">
                    <div> Log Annual Inc </div>
                  </CTooltip>
                </CContainer>
              </CCol>
              <CCol>{appData['log_annual_inc']}</CCol>
            </CRow>
            <CRow className="mb-2">
              <CCol>
                <CContainer>
                  <CTooltip placement="left" content="abcd">
                    <div> Dti </div>
                  </CTooltip>
                </CContainer>
              </CCol>
              <CCol>{appData['dti']}</CCol>
            </CRow>
            <CRow className="mb-2">
              <CCol>
                <CContainer>
                  <CTooltip placement="left" content="abcd">
                    <div> Fico </div>
                  </CTooltip>
                </CContainer>
              </CCol>
              <CCol>{appData['fico']}</CCol>
            </CRow>
            <CRow className="mb-2">
              <CCol>
                <CContainer>
                  <CTooltip placement="left" content="abcd">
                    <div> Days With Cr Line </div>
                  </CTooltip>
                </CContainer>
              </CCol>
              <CCol>{appData['days_with_cr_line']}</CCol>
            </CRow>
            <CRow className="mb-2">
              <CCol>
                <CContainer>
                  <CTooltip placement="left" content="abcd">
                    <div> Revol Bal </div>
                  </CTooltip>
                </CContainer>
              </CCol>
              <CCol>{appData['revol_bal']}</CCol>
            </CRow>
            <CRow className="mb-2">
              <CCol>
                <CContainer>
                  <CTooltip placement="left" content="abcd">
                    <div> Revol Util </div>
                  </CTooltip>
                </CContainer>
              </CCol>
              <CCol>{appData['revol_util']}</CCol>
            </CRow>
            <CRow className="mb-2">
              <CCol>
                <CContainer>
                  <CTooltip placement="left" content="abcd">
                    <div> Inq Last 6mths </div>
                  </CTooltip>
                </CContainer>
              </CCol>
              <CCol>{appData['inq_last_6mths']}</CCol>
            </CRow>
            <CRow className="mb-2">
              <CCol>
                <CContainer>
                  <CTooltip placement="left" content="abcd">
                    <div> Delinq 2yrs </div>
                  </CTooltip>
                </CContainer>
              </CCol>
              <CCol>{appData['delinq_2yrs']}</CCol>
            </CRow>
            <CRow className="mb-2">
              <CCol>
                <CContainer>
                  <CTooltip placement="left" content="abcd">
                    <div> Pub Rec </div>
                  </CTooltip>
                </CContainer>
              </CCol>
              <CCol>{appData['pub_rec']}</CCol>
            </CRow>
          </CCol>

          <hr />

          <h5 className="text-center mb-4 bold-text">Result of Models</h5>
          <CCol className="ms-2">
            <CRow className="mb-2">
              <CCol
                style={{
                  color:
                    predictResult['logistic_regression_(feature_selected)'] == 0 ? 'green' : 'red',
                }}
              >
                logistic_regression_(feature_selected):
              </CCol>
              <CCol
                className="text-end"
                style={{
                  color:
                    predictResult['logistic_regression_(feature_selected)'] == 0 ? 'green' : 'red',
                }}
              >
                {predictResult['logistic_regression_(feature_selected)'] == 0 ? 'Safe' : 'Unsafe'}
              </CCol>
            </CRow>
            <CRow className="mb-2">
              <CCol
                style={{
                  color: predictResult['logistic_regression_(improved)'] == 0 ? 'green' : 'red',
                }}
              >
                logistic_regression_(improved):
              </CCol>
              <CCol
                className="text-end"
                style={{
                  color: predictResult['logistic_regression_(improved)'] == 0 ? 'green' : 'red',
                }}
              >
                {predictResult['logistic_regression_(improved)'] == 0 ? 'Safe' : 'Unsafe'}
              </CCol>
            </CRow>
            <CRow className="mb-2">
              <CCol
                style={{
                  color: predictResult['random_forest_(improved)'] == 0 ? 'green' : 'red',
                }}
              >
                random_forest_(improved):
              </CCol>
              <CCol
                className="text-end"
                style={{
                  color: predictResult['random_forest_(improved)'] == 0 ? 'green' : 'red',
                }}
              >
                {predictResult['random_forest_(improved)'] == 0 ? 'Safe' : 'Unsafe'}
              </CCol>
            </CRow>
          </CCol>
        </COffcanvasBody>
        <CFooter>
          <div></div>
          <div>
            <CButton
              color="danger"
              className="me-2"
              onClick={() => {
                setVisibleApp(false)
                setMsgRecheck('REJECT')
                setVisibleRecheck(true)
              }}
            >
              Reject
            </CButton>
            <CButton
              color="success"
              onClick={() => {
                setVisibleApp(false)
                setMsgRecheck('ACCEPT')
                setVisibleRecheck(true)
              }}
            >
              Accept
            </CButton>
          </div>
        </CFooter>
      </COffcanvas>
      <CModal
        scrollable
        visible={visibleRecheck}
        backdrop="static"
        onClose={() => setVisibleRecheck(false)}
      >
        <CModalHeader>
          <CModalTitle>Create Application</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <span>Are you sure to want to </span>
          <span style={{ color: msgRecheck === 'ACCEPT' ? 'green' : 'red' }}>{msgRecheck}</span>
          <span>?</span>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleRecheck(false)}>
            <div className="ms-1 me-1">No</div>
          </CButton>
          <CButton
            color="primary"
            onClick={() => {
              if (msgRecheck == 'ACCEPT') {
                acceptApplication(appData.id)
              } else {
                deleteApplication(appData.id)
              }
              setVisibleRecheck(false)
            }}
          >
            <div className="ms-1 me-1">Yes</div>
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Waiting
