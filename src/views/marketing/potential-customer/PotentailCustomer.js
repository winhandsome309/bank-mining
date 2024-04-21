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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheck, cilX, cilPlus, cilUserPlus } from '@coreui/icons'
import axios, { formToJSON } from 'axios'

const listMarketingParams = [
  ['id', 'abc', 'normal'],
  ['age', 'abc', 'normal'],
  ['job', 'abc', 'normal'],
  ['marital', 'abc', 'select', ['single', 'married', 'divorced']],
  ['education', 'abc', 'select', ['primary', 'secondary', 'tertiary']],
  ['default', 'abc', 'select', ['yes', 'no']],
  ['balance', 'abc', 'normal'],
  ['housing', 'abc', 'select', ['yes', 'no']],
  ['loan', 'abc', 'select', ['yes', 'no']],
  ['contact', 'abc', 'select', ['cellular', 'telephone', 'unknown']],
  ['day', 'abc', 'normal'],
  [
    'month',
    'abc',
    'select',
    ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
  ],
  ['duration', 'abc', 'normal'],
  ['campaign', 'abc', 'normal'],
  ['pdays', 'abc', 'normal'],
  ['previous', 'abc', 'normal'],
  ['poutcome', 'abc', 'select', ['success', 'failure', 'other', 'unknown']],
]

const PotentialCustomer = () => {
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

  const fetchApplication = async () => {
    axios.get(process.env.REACT_APP_API_ENDPOINT + '/api/marketing/client').then((res) => {
      setTableData(res.data)
    })
  }

  const createApplication = async () => {
    const formData = new FormData()
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key])
    })
    axios
      .post(process.env.REACT_APP_API_ENDPOINT + '/api/marketing/client', formData)
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
      .delete(process.env.REACT_APP_API_ENDPOINT + '/api/marketing/client', {
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
          console.log(temp)
          setPredictResult(temp)
        }
      })
  }

  const acceptApplication = async (id) => {
    console.log(id)
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
            {listMarketingParams.map(
              (params, index) =>
                index % 2 != 0 && (
                  <CRow className="mb-3">
                    <CCol>
                      <CTooltip placement="left" content={listMarketingParams[index][0]}>
                        {params[2] == 'normal' ? (
                          <CFormInput
                            floatingLabel={listMarketingParams[index][0]}
                            id={listMarketingParams[index][0]}
                            placeholder={listMarketingParams[index][0]}
                            onChange={(e) => {
                              setForm({ ...form, [listMarketingParams[index][0]]: e.target.value })
                            }}
                          />
                        ) : (
                          <CFormSelect
                            floatingLabel={listMarketingParams[index][0]}
                            aria-label="Default"
                            onChange={(e) => {
                              setForm({ ...form, [listMarketingParams[index][0]]: e.target.value })
                            }}
                          >
                            <option>Select</option>
                            {listMarketingParams[index][3].map((value) => (
                              <option value={value}>{value}</option>
                            ))}
                          </CFormSelect>
                        )}
                      </CTooltip>
                    </CCol>
                    <CCol>
                      <CTooltip placement="left" content={listMarketingParams[index + 1][0]}>
                        {listMarketingParams[index + 1][2] == 'normal' ? (
                          <CFormInput
                            floatingLabel={listMarketingParams[index + 1][0]}
                            id={listMarketingParams[index + 1][0]}
                            placeholder={listMarketingParams[index + 1][0]}
                            onChange={(e) => {
                              setForm({
                                ...form,
                                [listMarketingParams[index + 1][0]]: e.target.value,
                              })
                            }}
                          />
                        ) : (
                          <CFormSelect
                            floatingLabel={listMarketingParams[index + 1][0]}
                            aria-label="Default"
                            onChange={(e) => {
                              setForm({
                                ...form,
                                [listMarketingParams[index + 1][0]]: e.target.value,
                              })
                            }}
                          >
                            <option>Select</option>
                            {listMarketingParams[index + 1][3].map((value) => (
                              <option value={value}>{value}</option>
                            ))}
                          </CFormSelect>
                        )}
                      </CTooltip>
                    </CCol>
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
            }}
          >
            Create
          </CButton>
        </CModalFooter>
      </CModal>
      <CToaster ref={toaster} push={toast} placement="top-end" />

      <COffcanvas
        className="w-25"
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

          <h5 className="text-center mb-4 bold-text">Result of Models</h5>
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
                  color: predictResult['gradientboostingclassifier'] == 'yes' ? 'green' : 'red',
                }}
              >
                gradientboostingclassifier:
              </CCol>
              <CCol
                className="text-end"
                style={{
                  color: predictResult['gradientboostingclassifier'] == 'yes' ? 'green' : 'red',
                }}
              >
                {predictResult['gradientboostingclassifier'] == 'yes' ? 'Safe' : 'Unsafe'}
              </CCol>
            </CRow>
            <CRow className="mb-2">
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

export default PotentialCustomer
