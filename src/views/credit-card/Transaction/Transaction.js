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
  CBadge,
  CNavLink,
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
} from '@coreui/icons'
import axios, { formToJSON } from 'axios'
import CreateFunction from '../../../components/CreateFunction'
import CommunicateFunction from '../../../components/CommunicateFunction'
import Voting from '../../../components/Voting'
import client from '../../../hooks/useApi'
import listCreditCardParams from '../ListParams'
import Insight from '../../../components/Insight'
import Filter from '../../../components/Filter'

const Transaction = () => {
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
  const [result, setResult] = useState(0)

  const fetchApplication = async () => {
    client.get(process.env.REACT_APP_API_ENDPOINT + '/api/credit_card/transaction').then((res) => {
      if (res.status == 200) {
        var data = res.data
        // data = [
        //   {
        //     created: 'Sun, 28 Apr 2024 18:17:13 GMT',
        //     distance_from_home: 57.87785658389723,
        //     distance_from_last_transaction: 0.3111400080477545,
        //     id: '1714303033',
        //     online_order: 0.0,
        //     predict:
        //       "{'decisiontreeclassifier': 0.0, 'kneighborsclassifier': 0.0, 'randomforestclassifier': 0.0}",
        //     processed: false,
        //     processed_at: null,
        //     ratio_to_median_purchase_price: 1.9459399775518593,
        //     repeat_retailer: 1.0,
        //     used_chip: 1.0,
        //     used_pin_number: 0.0,
        //   },
        //   {
        //     created: 'Sat, 11 May 2024 11:00:54 GMT',
        //     distance_from_home: 10.829942699255545,
        //     distance_from_last_transaction: 0.17559150228166587,
        //     id: '1715400054',
        //     online_order: 0.0,
        //     predict:
        //       "{'decisiontreeclassifier': 0.0, 'kneighborsclassifier': 0.0, 'randomforestclassifier': 0.0}",
        //     processed: false,
        //     processed_at: null,
        //     ratio_to_median_purchase_price: 1.2942188106198573,
        //     repeat_retailer: 1.0,
        //     used_chip: 0.0,
        //     used_pin_number: 0.0,
        //   },
        //   {
        //     created: 'Sat, 11 May 2024 11:00:54 GMT',
        //     distance_from_home: 5.091079490616996,
        //     distance_from_last_transaction: 0.8051525945853258,
        //     id: '1715400054',
        //     online_order: 0.0,
        //     predict:
        //       "{'decisiontreeclassifier': 0.0, 'kneighborsclassifier': 0.0, 'randomforestclassifier': 0.0}",
        //     processed: false,
        //     processed_at: null,
        //     ratio_to_median_purchase_price: 0.42771456119427587,
        //     repeat_retailer: 1.0,
        //     used_chip: 0.0,
        //     used_pin_number: 0.0,
        //   },
        //   {
        //     created: 'Sat, 11 May 2024 11:00:54 GMT',
        //     distance_from_home: 2.2475643282963613,
        //     distance_from_last_transaction: 5.60004354707232,
        //     id: '1715400054',
        //     online_order: 0.0,
        //     predict:
        //       "{'decisiontreeclassifier': 0.0, 'kneighborsclassifier': 0.0, 'randomforestclassifier': 0.0}",
        //     processed: false,
        //     processed_at: null,
        //     ratio_to_median_purchase_price: 0.36266257805709584,
        //     repeat_retailer: 1.0,
        //     used_chip: 0.0,
        //     used_pin_number: 0.0,
        //   },
        //   {
        //     created: 'Sat, 11 May 2024 11:00:54 GMT',
        //     distance_from_home: 44.19093600261837,
        //     distance_from_last_transaction: 0.5664862680583477,
        //     id: '1715400054',
        //     online_order: 0.0,
        //     predict:
        //       "{'decisiontreeclassifier': 0.0, 'kneighborsclassifier': 0.0, 'randomforestclassifier': 0.0}",
        //     processed: false,
        //     processed_at: null,
        //     ratio_to_median_purchase_price: 2.2227672978404707,
        //     repeat_retailer: 1.0,
        //     used_chip: 0.0,
        //     used_pin_number: 0.0,
        //   },
        //   {
        //     created: 'Sat, 11 May 2024 11:00:54 GMT',
        //     distance_from_home: 5.586407674186407,
        //     distance_from_last_transaction: 13.261073268058121,
        //     id: '1715400054',
        //     online_order: 0.0,
        //     predict:
        //       "{'decisiontreeclassifier': 0.0, 'kneighborsclassifier': 0.0, 'randomforestclassifier': 0.0}",
        //     processed: false,
        //     processed_at: null,
        //     ratio_to_median_purchase_price: 0.06476846537046335,
        //     repeat_retailer: 1.0,
        //     used_chip: 0.0,
        //     used_pin_number: 0.0,
        //   },
        // ]
        for (var i = 0; i < data.length; i++) {
          var temp = JSON.parse(data[i]['predict'].replace(/'/g, '"'))
          data[i]['result'] =
            temp.decisiontreeclassifier + temp.kneighborsclassifier + temp.randomforestclassifier
        }
        setTableData(data)
      }
    })
  }

  const createApplication = async () => {
    const formData = new FormData()
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key])
    })
    client
      .post(process.env.REACT_APP_API_ENDPOINT + '/api/credit_card/transaction', formData)
      .then((res) => {
        if (res.status === 201) {
          setLoadingMultipleCreation(false)
          setVisibleCreate(false)
          fetchApplication()
          addToast(successToast('Transaction is created successfully'))
        }
      })
  }

  const createMultipleApplication = (file) => {
    const formData = new FormData()
    formData.append('file', file)
    client
      .post(
        process.env.REACT_APP_API_ENDPOINT + '/api/loan_application/list/waiting-list',
        formData,
      )
      .then((res) => {
        if (res.status == 201) {
          setVisibleCreate(false)
          setLoadingMultipleCreation(false)
          fetchApplication()
          addToast(successToast('Transaction is created successfully'))
        }
      })
  }

  const deleteApplication = async (id) => {
    const formData = new FormData()
    formData.append('application_id', id)
    formData.append('result', 0)
    client
      .delete(process.env.REACT_APP_API_ENDPOINT + '/api/credit_card/transaction', {
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
      .get(process.env.REACT_APP_API_ENDPOINT + '/api/predict-result', {
        params: {
          application_id: appData.id,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          if (res.data != []) {
            var temp = {
              decisiontreeclassifier: 0,
              kneighborsclassifier: 0,
              randomforestclassifier: 0,
            }
            setPredictResult(temp)
          }
          var temp = JSON.parse(res.data[0]['predict'].replace(/'/g, '"'))
          setResult(
            temp.decisiontreeclassifier + temp.kneighborsclassifier + temp.randomforestclassifier,
          )
          setPredictResult(temp)
        }
      })
  }

  const acceptApplication = async (id) => {
    const formData = new FormData()
    formData.append('application_id', id)
    formData.append('result', 1)
    client
      .post(process.env.REACT_APP_API_ENDPOINT + '/api/loan_application/process', formData)
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

  const round2Digit = (num) => {
    return Math.round(num * 100) / 100
  }

  const [loadingButton, setLoadingButton] = useState(false)

  useEffect(() => {
    if (loadingButton) {
      setTimeout(() => {
        setLoadingButton(false)
      }, 1000)
    }
  }, [loadingButton])

  const [filteredData, setFilteredData] = useState([])

  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              <div className="d-none d-md-flex ">
                <div className="mt-2">{'Transaction'}</div>
                <div className="me-2 ms-auto">
                  <CRow>
                    <CCol />
                    <CCol className="mt-2">
                      <CIcon icon={cilPlus} size="lg" onClick={() => setVisibleCreate(true)} />
                      {/* <Filter
                          params={listCreditCardParams}
                          data={tableData}
                          setFilteredData={setFilteredData}
                        /> */}
                    </CCol>
                    {/* <CCol>
                      {!loadingButton ? (
                        <CButton
                          color="primary"
                          onClick={() => {
                            setLoadingButton(true)
                          }}
                          className="ms-2"
                        >
                          Fetch
                        </CButton>
                      ) : (
                        <CSpinner className="ms-4 me-4" />
                      )}
                    </CCol> */}
                  </CRow>
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
                        ID
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        Distance from home
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        Distance from last transaction
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        Repeat retailer
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        Used chip
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        Used pin number
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
                        }}
                      >
                        <CTableDataCell className="text-center">
                          <div>{item.id}</div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <div>{round2Digit(item.distance_from_home)}</div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <div>{round2Digit(item.distance_from_last_transaction)}</div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <div>{item.repeat_retailer}</div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <div>{item.used_chip}</div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <div>{item.used_pin_number}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>...</div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center space-between">
                          <CBadge color={item['result'] <= 1 ? 'success' : 'danger'}>
                            {item['result'] <= 1 ? 'Safe' : 'Fraud'}
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

      <CreateFunction
        loadingMultipleCreation={loadingMultipleCreation}
        setLoadingMultipleCreation={setLoadingMultipleCreation}
        visibleCreate={visibleCreate}
        setVisibleCreate={setVisibleCreate}
        listParams={listCreditCardParams}
        form={form}
        setForm={setForm}
        createMultiple={createMultipleApplication}
        createSingle={createApplication}
        nameCreate={'Transaction'}
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
          <COffcanvasTitle>Transaction Detail</COffcanvasTitle>
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
                        {<Insight data={appData} api={'/api/credit_card/detail'} msg={'fraud'} />}
                      </div>
                    </CCardHeader>
                    <CCardBody>
                      <CCol>
                        {listCreditCardParams.map((params, index) => (
                          <CRow className="mb-3">
                            <CCol xs={9}>
                              <CContainer>
                                <CTooltip placement="left" content={params[1]}>
                                  <div> {params[0]} </div>
                                </CTooltip>
                              </CContainer>
                            </CCol>
                            <CCol xs={3}>{round2Digit(appData[params[0]])}</CCol>
                          </CRow>
                        ))}
                      </CCol>

                      <hr />

                      <h5 className="text-center mb-2 bold-text">Result of Models</h5>
                      <CCol className="ms-2">
                        <CRow className="mb-3">
                          <CCol
                            xs={8}
                            style={{
                              color: predictResult['decisiontreeclassifier'] == 0 ? 'green' : 'red',
                            }}
                          >
                            {' '}
                            <div>
                              <CNavLink href="#/fraud/model-information">Decision Tree:</CNavLink>
                            </div>
                          </CCol>
                          <CCol
                            xs={4}
                            className="text-end"
                            style={{
                              color: predictResult['decisiontreeclassifier'] == 0 ? 'green' : 'red',
                            }}
                          >
                            {predictResult['decisiontreeclassifier'] == 0 ? 'Safe' : 'Unsafe'}
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CCol
                            xs={8}
                            style={{
                              color: predictResult['kneighborsclassifier'] == 0 ? 'green' : 'red',
                            }}
                          >
                            <div>
                              <CNavLink href="#/fraud/model-information">
                                K-Nearest Neighbors:
                              </CNavLink>
                            </div>
                          </CCol>
                          <CCol
                            xs={4}
                            className="text-end"
                            style={{
                              color: predictResult['kneighborsclassifier'] == 0 ? 'green' : 'red',
                            }}
                          >
                            {predictResult['kneighborsclassifier'] == 0 ? 'Safe' : 'Unsafe'}
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CCol
                            xs={8}
                            style={{
                              color: predictResult['randomforestclassifier'] == 0 ? 'green' : 'red',
                            }}
                          >
                            <div>
                              <CNavLink href="#/fraud/model-information">Random Forest:</CNavLink>
                            </div>
                          </CCol>
                          <CCol
                            xs={4}
                            className="text-end"
                            style={{
                              color: predictResult['randomforestclassifier'] == 0 ? 'green' : 'red',
                            }}
                          >
                            {predictResult['randomforestclassifier'] == 0 ? 'Safe' : 'Unsafe'}
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
                    {/* <Voting
                      applicationId={appData['id']}
                      checkFetchVote={checkFetchVote}
                      setCheckFetchVote={setCheckFetchVote}
                    /> */}
                  </div>
                )}
              </CRow>
            </CCol>

            <CCol>{appData['id'] != '' && <CommunicateFunction id={appData['id']} />}</CCol>
          </CRow>
        </COffcanvasBody>
        <CFooter>
          <div></div>
          {/* <div>
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
          </div> */}
        </CFooter>
      </COffcanvas>
      <CModal
        scrollable
        visible={visibleRecheck}
        backdrop="static"
        onClose={() => setVisibleRecheck(false)}
      >
        <CModalHeader>
          <CModalTitle>Create Transaction</CModalTitle>
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

export default Transaction
