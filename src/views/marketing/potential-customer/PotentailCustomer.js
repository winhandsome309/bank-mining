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
  CDropdown,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheck, cilX, cilPlus, cilUserPlus } from '@coreui/icons'
import axios, { formToJSON } from 'axios'
import CommunicateFunction from '../../../components/CommunicateFunction'
import Voting from '../../../components/Voting'
import CreateFunction from '../../../components/CreateFunction'

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

const PotentialCustomer = (props) => {
  const [visibleCreate, setVisibleCreate] = useState(false)
  const [visibleApp, setVisibleApp] = useState(false)
  const [toast, addToast] = useState(0)
  const toaster = useRef()
  const [tableData, setTableData] = useState([])
  const [appData, setAppData] = useState({
    id: '',
    age: '',
    job: '',
    marital: '',
    education: '',
    default: '',
    balance: '',
    housing: '',
    loan: '',
    contact: '',
    day: '',
    month: '',
    duration: '',
    campaign: '',
    pdays: '',
    previous: '',
    poutcome: '',
  })
  const [form, setForm] = useState({
    age: '',
    job: '',
    marital: '',
    education: '',
    default: '',
    balance: '',
    housing: '',
    loan: '',
    contact: '',
    day: '',
    month: '',
    duration: '',
    campaign: '',
    pdays: '',
    previous: '',
    poutcome: '',
  })
  const [visibleRecheck, setVisibleRecheck] = useState(false)
  const [msgRecheck, setMsgRecheck] = useState('')
  const [predictResult, setPredictResult] = useState(false)
  const [changeApp, setChangeApp] = useState(false)
  const isMounted = useRef(false)

  const fetchCustomer = async () => {
    axios.get(process.env.REACT_APP_API_ENDPOINT + '/api/marketing/client').then((res) => {
      setTableData(res.data)
    })
  }

  const createCustomer = async () => {
    const formData = new FormData()
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key])
    })
    axios
      .post(process.env.REACT_APP_API_ENDPOINT + '/api/marketing/client', formData)
      .then((res) => {
        if (res.status === 201) {
          setVisibleCreate(false)
          fetchCustomer()
          addToast(successToast('Customer is created successfully'))
        }
      })
  }

  const createMultipleCustomer = (file) => {
    console.log(file)
  }

  const deleteCustomer = async (id) => {
    const formData = new FormData()
    formData.append('id', id)
    axios
      .delete(process.env.REACT_APP_API_ENDPOINT + '/api/marketing/client', {
        data: formData,
      })
      .then((res) => {
        if (res.status === 200) {
          addToast(warningToast('Rejected successfully'))
          fetchCustomer()
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

  const acceptCustomer = async (id) => {
    axios
      .post(
        process.env.REACT_APP_API_ENDPOINT + '/api/marketing/old_client',
        {},
        {
          params: {
            customer_id: id,
          },
        },
      )
      .then((res) => {
        if (res.status === 200) {
          addToast(successToast('Accepted successully'))
          fetchCustomer()
        }
      })
  }

  const likeCustomer = async (id) => {
    axios
      .post(
        process.env.REACT_APP_API_ENDPOINT + '/api/voting',
        {},
        {
          params: {
            id: id,
            status: 'like',
          },
        },
      )
      .then((res) => {
        if (res.status === 200) {
          addToast(successToast('Liked successully'))
          // fetchCustomer()
        }
      })
  }

  const dislikeCustomer = async (id) => {
    axios
      .post(
        process.env.REACT_APP_API_ENDPOINT + '/api/voting',
        {},
        {
          params: {
            id: id,
            status: 'dislike',
          },
        },
      )
      .then((res) => {
        if (res.status === 200) {
          addToast(successToast('Disliked successully'))
          // fetchCustomer()
        }
      })
  }

  useEffect(() => {
    fetchCustomer()
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
                {'Customer'}
                <CIcon
                  icon={cilUserPlus}
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
                      <CTableHeaderCell className="bg-body-tertiary">Age</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Job</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary ">Marital</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Education</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Default</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Balance</CTableHeaderCell>
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
        listParams={listMarketingParams}
        form={form}
        setForm={setForm}
        createMultiple={createMultipleCustomer}
        createSingle={createCustomer}
        nameCreate={'Customer'}
      />

      <CToaster ref={toaster} push={toast} placement="top-end" />

      <COffcanvas
        className="w-50"
        placement="end"
        visible={visibleApp}
        onHide={() => setVisibleApp(false)}
        backdrop="static"
      >
        <COffcanvasHeader>
          <COffcanvasTitle>Customer Detail</COffcanvasTitle>
          <CCloseButton className="text-reset ms-auto" onClick={() => setVisibleApp(false)} />
        </COffcanvasHeader>
        <COffcanvasBody>
          <CRow>
            <CCol>
              <CRow className="mb-3">
                <div>
                  <CCard>
                    <CCardHeader>
                      <div>
                        <strong>Detail</strong>
                      </div>
                    </CCardHeader>
                    <CCardBody>
                      <CCol>
                        {listMarketingParams.map((params, index) => (
                          <CRow className="mb-1">
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

                      <h5 className="text-center mb-2 bold-text">Result of Models</h5>
                      <CCol className="ms-2">
                        <CRow className="mb-2">
                          <CCol
                            style={{
                              color: predictResult['gaussiannb'] == 'yes' ? 'green' : 'red',
                            }}
                          >
                            gaussiannb:
                          </CCol>
                          <CCol
                            className="text-end"
                            style={{
                              color: predictResult['gaussiannb'] == 'yes' ? 'green' : 'red',
                            }}
                          >
                            {predictResult['gaussiannb'] == 'yes' ? 'Safe' : 'Unsafe'}
                          </CCol>
                        </CRow>
                        <CRow className="mb-2">
                          <CCol
                            style={{
                              color:
                                predictResult['gradientboostingclassifier'] == 'yes'
                                  ? 'green'
                                  : 'red',
                            }}
                          >
                            gradientboostingclassifier:
                          </CCol>
                          <CCol
                            className="text-end"
                            style={{
                              color:
                                predictResult['gradientboostingclassifier'] == 'yes'
                                  ? 'green'
                                  : 'red',
                            }}
                          >
                            {predictResult['gradientboostingclassifier'] == 'yes'
                              ? 'Safe'
                              : 'Unsafe'}
                          </CCol>
                        </CRow>
                        <CRow>
                          <CCol
                            style={{
                              color: predictResult['mlpclassifier'] == 'yes' ? 'green' : 'red',
                            }}
                          >
                            mlpclassifier:
                          </CCol>
                          <CCol
                            className="text-end"
                            style={{
                              color: predictResult['mlpclassifier'] == 'yes' ? 'green' : 'red',
                            }}
                          >
                            {predictResult['mlpclassifier'] == 'yes' ? 'Safe' : 'Unsafe'}
                          </CCol>
                        </CRow>
                      </CCol>
                    </CCardBody>
                  </CCard>
                </div>
              </CRow>
              <CRow>
                <div>
                  <Voting />
                </div>
              </CRow>
            </CCol>

            <CCol>{appData['id'] != '' && <CommunicateFunction id={appData['id']} />}</CCol>
          </CRow>
        </COffcanvasBody>
        <CFooter>
          <div></div>
          <div>
            <CButton
              color="danger"
              className="me-2"
              onClick={() => {
                setVisibleApp(false)
                if (props.role == 'staff') {
                  setMsgRecheck('DISLIKE')
                } else {
                  setMsgRecheck('REJECT')
                }
                setVisibleRecheck(true)
              }}
            >
              {props.role == 'admin' ? 'Reject' : 'Dislike'}
            </CButton>
            <CButton
              color="success"
              onClick={() => {
                setVisibleApp(false)
                if (props.role == 'staff') {
                  setMsgRecheck('LIKE')
                } else {
                  setMsgRecheck('ACCEPT')
                }
                setVisibleRecheck(true)
              }}
            >
              {props.role == 'admin' ? 'Accept' : 'Like'}
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
          <CModalTitle>Add Customer</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <span>Are you sure to want to </span>
          <span style={{ color: msgRecheck === 'ACCEPT' ? 'green' : 'red' }}>
            {props.role == 'admin' ? msgRecheck : msgRecheck == 'ACCEPT' ? 'LIKE' : 'DISLIKE'}
          </span>
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
                if (props.role == 'admin') {
                  acceptCustomer(appData.id)
                } else {
                  likeCustomer(appData.id)
                }
              } else {
                if (props.role == 'admin') {
                  deleteCustomer(appData.id)
                } else {
                  dislikeCustomer(appData.id)
                }
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

export default PotentialCustomer
