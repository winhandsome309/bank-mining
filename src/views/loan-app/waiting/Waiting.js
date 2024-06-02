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
  CNavLink,
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
  cilSearch,
} from '@coreui/icons'
import axios, { formToJSON } from 'axios'
import CreateFunction from '../../../components/CreateFunction'
import CommunicateFunction from '../../../components/CommunicateFunction'
import Voting from '../../../components/Voting'
import client from '../../../hooks/useApi'
import listLoanParams from '../ListParams'
import Insight from '../../../components/Insight'
import Filter from '../../../components/Filter'

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
  const [predictResult, setPredictResult] = useState(-1)
  const [changeApp, setChangeApp] = useState(false)
  const [loadingMultipleCreation, setLoadingMultipleCreation] = useState(false)
  const isMounted = useRef(false)
  const [checkFetchVote, setCheckFetchVote] = useState(false)

  const fetchApplication = async () => {
    client
      .get( '/api/loan_application/waiting-list')
      .then((res) => {
        setTableData(res.data)
      })
  }

  const createApplication = async () => {
    const formData = new FormData()
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key])
    })
    client
      .post( '/api/loan_application/waiting-list', formData)
      .then((res) => {
        if (res.status === 201) {
          setLoadingMultipleCreation(false)
          setVisibleCreate(false)
          fetchApplication()
          addToast(successToast('Application is created successfully'))
        }
      })
  }

  const createMultipleApplication = (file) => {
    const formData = new FormData()
    formData.append('file', file)
    client
      .post(
         '/api/loan_application/list/waiting-list',
        formData,
      )
      .then((res) => {
        if (res.status == 201) {
          setVisibleCreate(false)
          setLoadingMultipleCreation(false)
          fetchApplication()
          addToast(successToast('Applications are created successfully'))
        }
      })
  }

  const deleteApplication = async (id) => {
    const formData = new FormData()
    formData.append('application_id', id)
    formData.append('result', 0)
    client
      .delete( '/api/loan_application/process', {
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
    client
      .get( '/api/predict-result', {
        params: {
          application_id: appData.id,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          if (res.data != []) {
            var temp = {
              'logistic_regression_(feature_selected)': 0,
              'logistic_regression_(improved)': 0,
              'random_forest_(improved)': 0,
            }
            setPredictResult(temp)
          }
          var temp = JSON.parse(res.data[0]['predict'].replace(/'/g, '"'))

          setPredictResult(temp)
        }
      })
  }

  const acceptApplication = async (id) => {
    const formData = new FormData()
    formData.append('application_id', id)
    formData.append('result', 1)
    client
      .post( '/api/loan_application/process', formData)
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
    if (predictResult != -1) {
      setVisibleApp(true)
    }
  }, [appData, predictResult, checkFetchVote])

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

  const [filteredData, setFilteredData] = useState([])

  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              <div className="d-none d-md-flex">
                {'Application'}
                <div className="ms-auto focus:cursor-auto">
                  <CIcon
                    icon={cilPlus}
                    size="lg"
                    className="me-3"
                    onClick={() => setVisibleCreate(true)}
                  />
                  <Filter
                    params={listLoanParams}
                    data={tableData}
                    setFilteredData={setFilteredData}
                  />
                </div>
              </div>
            </CCardHeader>
            <CCardBody>
              {tableData.length == 0 || filteredData == -1 ? (
                <div>There is nothing to show</div>
              ) : (
                <CTable align="middle" className="mb-0 border" hover responsive>
                  <CTableHead className="text-nowrap">
                    <CTableRow>
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        <div></div>
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
                    {(filteredData.length == 0 ? tableData : filteredData).map((item, index) => (
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
        loadingMultipleCreation={loadingMultipleCreation}
        setLoadingMultipleCreation={setLoadingMultipleCreation}
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
        backdrop="static"
      >
        <COffcanvasHeader>
          <COffcanvasTitle>Application Detail</COffcanvasTitle>
          <CCloseButton className="text-reset ms-auto" onClick={() => setVisibleApp(false)} />
        </COffcanvasHeader>
        <COffcanvasBody>
          <CRow>
            <CCol>
              <CRow className="mb-3">
                <div>
                  <CCard>
                    <CCardHeader>
                      <div className="d-none d-md-flex">
                        <strong>Detail</strong>
                        {<Insight data={appData} api={'/api/loan_application/detail'} />}
                      </div>
                    </CCardHeader>
                    <CCardBody>
                      <CCol>
                        {listLoanParams.map((params, index) => (
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
                            xs={8}
                            style={{
                              color:
                                predictResult['logistic_regression_(feature_selected)'] == 0
                                  ? 'green'
                                  : 'red',
                            }}
                          >
                            <CTooltip
                              placement="left"
                              content={'Logistic Regression using Feature Selection method'}
                            >
                              <div>
                                <CNavLink href="#/application-management/model-information">
                                  Logistic Regression (A):
                                </CNavLink>
                              </div>
                            </CTooltip>
                          </CCol>
                          <CCol
                            xs={4}
                            className="text-end"
                            style={{
                              color:
                                predictResult['logistic_regression_(feature_selected)'] == 0
                                  ? 'green'
                                  : 'red',
                            }}
                          >
                            {predictResult['logistic_regression_(feature_selected)'] == 0
                              ? 'Safe'
                              : 'Unsafe'}
                          </CCol>
                        </CRow>
                        <CRow className="mb-2">
                          <CCol
                            xs={8}
                            style={{
                              color:
                                predictResult['logistic_regression_(improved)'] == 0
                                  ? 'green'
                                  : 'red',
                            }}
                          >
                            <CTooltip placement="left" content={'Logistic Regression is improved'}>
                              <div>
                                <CNavLink href="#/application-management/model-information">
                                  Logistic Regression (B):
                                </CNavLink>
                              </div>
                            </CTooltip>
                          </CCol>
                          <CCol
                            xs={4}
                            className="text-end"
                            style={{
                              color:
                                predictResult['logistic_regression_(improved)'] == 0
                                  ? 'green'
                                  : 'red',
                            }}
                          >
                            {predictResult['logistic_regression_(improved)'] == 0
                              ? 'Safe'
                              : 'Unsafe'}
                          </CCol>
                        </CRow>
                        <CRow className="mb-2">
                          <CCol
                            xs={8}
                            style={{
                              color:
                                predictResult['random_forest_(improved)'] == 0 ? 'green' : 'red',
                            }}
                          >
                            <div>
                              <CNavLink href="#/application-management/model-information">
                                Random Forest:
                              </CNavLink>
                            </div>
                          </CCol>
                          <CCol
                            xs={4}
                            className="text-end"
                            style={{
                              color:
                                predictResult['random_forest_(improved)'] == 0 ? 'green' : 'red',
                            }}
                          >
                            {predictResult['random_forest_(improved)'] == 0 ? 'Safe' : 'Unsafe'}
                          </CCol>
                        </CRow>
                      </CCol>
                    </CCardBody>
                  </CCard>
                </div>
              </CRow>
              <CRow>
                {changeApp && (
                  <div>
                    <Voting
                      applicationId={appData['id']}
                      checkFetchVote={checkFetchVote}
                      setCheckFetchVote={setCheckFetchVote}
                    />
                  </div>
                )}
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
                setMsgRecheck('REJECT')
                setVisibleRecheck(true)
              }}
            >
              <span style={{ color: 'white' }}>Reject</span>
            </CButton>
            <CButton
              color="success"
              onClick={() => {
                setVisibleApp(false)
                setMsgRecheck('ACCEPT')
                setVisibleRecheck(true)
              }}
            >
              <span style={{ color: 'white' }}>Accept</span>
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
