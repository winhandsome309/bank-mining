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
  CForm,
  CSpinner,
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
  cilBook,
  cilFindInPage,
} from '@coreui/icons'
import axios from 'axios'
import client from '../../../hooks/useApi'

// const listMarketingParams = [
//   ['id', 'abc'],
//   ['age', 'abc'],
//   ['job', 'abc'],
//   ['marital', 'abc'],
//   ['education', 'abc'],
//   ['default', 'abc'],
//   ['balance', 'abc'],
//   ['housing', 'abc'],
//   ['loan', 'abc'],
//   ['contact', 'abc'],
//   ['day', 'abc'],
//   ['month', 'abc'],
//   ['duration', 'abc'],
//   ['campaign', 'abc'],
//   ['pdays', 'abc'],
//   ['previous', 'abc'],
//   ['poutcome', 'abc'],
// ]

const listMarketingParams = [
  // ['id', 'abc', 'normal'],
  ['age', 'Age of customer', 'normal'],
  [
    'job',
    'Job of customer',
    'select',
    [
      'retired',
      'housemaid',
      'admin',
      'management',
      'entrepreneur',
      'blue-collar',
      'services',
      'technician',
      'unknown',
      'self-employed',
      'student',
      'unemployed',
    ],
    [
      'retired',
      'housemaid',
      'admin',
      'management',
      'entrepreneur',
      'blue-collar',
      'services',
      'technician',
      'unknown',
      'self-employed',
      'student',
      'unemployed',
    ],
  ],
  [
    'marital',
    'Martial status of customer',
    'select',
    ['single', 'married', 'divorced'],
    ['single', 'married', 'divorced'],
  ],
  [
    'education',
    'Customer education level',
    'select',
    ['primary', 'secondary', 'tertiary'],
    ['primary', 'secondary', 'tertiary'],
  ],
  ['default', 'Has credit in default?', 'select', ['yes', 'no'], ['1', '0']],
  ['balance', "Customer's individual balance", 'normal'],
  ['housing', 'If costumer has housing loan', 'select', ['yes', 'no'], ['1', '0']],
  ['loan', 'Has Personal Loan', 'select', ['yes', 'no'], ['1', '0']],
  [
    'contact',
    'Communication type',
    'select',
    ['cellular', 'telephone', 'unknown'],
    ['cellular', 'telephone', 'unknown'],
  ],
  ['day', 'Last contact day of the week', 'normal'],
  [
    'month',
    'Last contact month of year',
    'select',
    ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
    ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
  ],
  ['duration', 'Last contact duration, in seconds', 'normal'],
  ['campaign', 'Number of contacts performed during this campaign and for this client', 'normal'],
  [
    'pdays',
    'Number of days that passed by after the client was last contacted from a previous campaign',
    'normal',
  ],
  ['previous', 'Number of contacts performed before this campaign and for this client', 'normal'],
  [
    'poutcome',
    'outcome of the previous marketing campaign',
    'select',
    ['success', 'failure', 'other', 'unknown'],
    ['success', 'failure', 'other', 'unknown'],
  ],
]

const OldCustomer = () => {
  const [uploadFile, setUploadFile] = useState(true)
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
  const [visibleRecheck, setVisibleRecheck] = useState(false)
  const [msgRecheck, setMsgRecheck] = useState('')
  const [idSearch, setIdSearch] = useState('')
  const [searched, setSearched] = useState('')
  const [loadingFetch, setLoadingFetch] = useState(true)

  const fetchApplication = async () => {
    client.get(process.env.REACT_APP_API_ENDPOINT + '/api/marketing/history_data').then((res) => {
      let temp = []
      for (let i = 0; i < res.data.length; i++) {
        let p = res.data[i]['HistoryMarketingClients']
        p['id'] = i + 1
        temp.push(p)
      }
      setTableData(temp)
      setLoadingFetch(false)
    })
  }

  const sendIdSearch = async () => {
    for (let item of tableData) {
      if (item['id'] == idSearch) {
        setSearched([item])
        return
      }
    }
    // tableData.forEach((item) => {
    //   if (item['id'] == idSearch) {
    //     setSearched([item])
    //     return
    //   }
    // })
    if (idSearch == '') {
      setSearched('')
    } else {
      setSearched('NF')
    }
  }

  useEffect(() => {
    setLoadingFetch(true)
    fetchApplication()
  }, [])

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
                <CForm className="d-flex ms-auto">
                  <CFormInput
                    type="search"
                    className="me-2"
                    placeholder="Search by ID"
                    onChange={(e) => setIdSearch(e.target.value)}
                  />
                  <CButton
                    type="submit"
                    color="success"
                    variant="outline"
                    onClick={() => sendIdSearch()}
                  >
                    Search
                  </CButton>
                </CForm>
              </div>
            </CCardHeader>
            <CCardBody>
              {loadingFetch == true ? (
                <CSpinner />
              ) : tableData.length == 0 ? (
                <div>There is nothing to show</div>
              ) : searched == 'NF' ? (
                <div>Not found</div>
              ) : (
                <CTable align="middle" className="mb-0 border" hover responsive>
                  <CTableHead className="text-nowrap">
                    <CTableRow>
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        ID
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Age</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Job</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary ">Marital</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Education</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Default</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Balance</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">...</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {(searched == '' ? tableData : searched).map((item, index) => (
                      <CTableRow
                        v-for="item in tableItems"
                        key={index}
                        onClick={() => {
                          setAppData(item)
                          setVisibleApp(true)
                        }}
                      >
                        <CTableDataCell className="text-center">
                          <div>{item.id}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{item.age}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{item.job}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{item.marital}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{item.education}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{item.default}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{item.balance}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>...</div>
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

      <CToaster ref={toaster} push={toast} placement="top-end" />

      <COffcanvas placement="end" visible={visibleApp} onHide={() => setVisibleApp(false)}>
        <COffcanvasHeader>
          <COffcanvasTitle>Application Detail</COffcanvasTitle>
          <CCloseButton className="text-reset ms-auto" onClick={() => setVisibleApp(false)} />
        </COffcanvasHeader>
        <COffcanvasBody>
          <CCol>
            {listMarketingParams.map((params, index) => (
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
            ))}
          </CCol>

          <hr />

          {/* <div className="text-center">Result of Models</div> */}
        </COffcanvasBody>
        <CFooter>
          <div></div>
          <div>
            <CButton
              color="danger"
              className="me-2"
              onClick={() => {
                setVisibleApp(false)
                setMsgRecheck('CHURNED')
                setVisibleRecheck(true)
              }}
            >
              Churned
            </CButton>
            <CButton
              color="success"
              onClick={() => {
                setVisibleApp(false)
                setMsgRecheck('LOYAL')
                setVisibleRecheck(true)
              }}
            >
              Loyal
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
          <span>Application </span>
          <span className="fw-semibold"> {appData['purpose']} </span>
          <span>is </span>
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
              if (msgRecheck == 'ACCEPT') addToast(successToast('Accepted successully'))
              else addToast(warningToast('Rejected successfully'))
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

export default OldCustomer
