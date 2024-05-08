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
  CFormTextarea,
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
  cilUserPlus,
} from '@coreui/icons'
import axios, { formToJSON } from 'axios'

const listCustomerParams = [
  ['email', 'abc', 'normal'],
  // ['username', 'abc', 'normal'],
  // ['role', 'abc', 'select', ['admin', 'customer'], ['admin', 'customer']],
  // ['permission', 'abc', 'select', ['read', 'write', 'all'], ['read', 'write', 'all']],
  // ['chat_token', 'abc', 'normal'],
  ['customer_id', 'abc', 'normal'],
  ['application_id', 'abc', 'normal'],
]

const CustomerManagement = () => {
  const [tableData, setTableData] = useState([])
  const [userInfo, setUserInfo] = useState({
    id: '',
    email: '',
    username: '',
    role: '',
    permission: '',
  })
  const [form, setForm] = useState({
    email: '',
    customer_id: '',
    application_id: '',
  })
  const [details, setDetails] = useState([])
  const [visibleCreate, setVisibleCreate] = useState(false)
  const [toast, addToast] = useState(0)
  const toaster = useRef()
  const [checkRenderInfo, setCheckRenderInfo] = useState({})

  const fetchCustomer = () => {
    axios.get(process.env.REACT_APP_API_ENDPOINT + '/api/admin/customers').then((res) => {
      if (res.status === 200) {
        setTableData(res.data['data'])
      }
    })
  }

  const createUser = async () => {
    const formData = new FormData()
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key])
    })
    axios
      .post(process.env.REACT_APP_API_ENDPOINT + '/api/customer/create', formData)
      .then((res) => {
        if (res.status === 201) {
          setVisibleCreate(false)
          fetchCustomer()
          addToast(successToast('Customer is created successfully'))
        }
      })
  }

  const toggleDetail = (index) => {
    const position = details.indexOf(index)
    let newDetails = details.slice()
    if (position !== -1) {
      newDetails.splice(position, 1)
    } else {
      newDetails = [...details, index]
    }
    setDetails(newDetails)
    let temp = checkRenderInfo
    if (temp[index] !== undefined) {
      temp[index] = !temp[index]
    } else temp[index] = true

    setCheckRenderInfo(temp)
  }

  useEffect(() => {
    fetchCustomer()
  }, [])

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
                <CTable align="middle" className="mb-0 border" responsive>
                  <CTableHead className="text-nowrap">
                    <CTableRow>
                      <CTableHeaderCell
                        className="bg-body-tertiary text-center"
                        style={{ width: '15rem' }}
                      >
                        ID
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary " style={{ width: '6rem' }} />
                      <CTableHeaderCell className="bg-body-tertiary" style={{ width: '15rem' }}>
                        Email
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary" style={{ width: '16.5rem' }}>
                        Username
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Role</CTableHeaderCell>
                      {/* <CTableHeaderCell className="bg-body-tertiary">Permission</CTableHeaderCell> */}
                      <CTableHeaderCell className="bg-body-tertiary"></CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {tableData.map((item, index) => (
                      <>
                        <CTableRow v-for="item in tableItems" key={index}>
                          <CTableDataCell className="text-center" colSpan={12}>
                            <CCol>
                              <CRow>
                                <CCol>
                                  <div>{item.id}</div>
                                </CCol>
                                <CCol>
                                  <div>{item.email}</div>
                                </CCol>
                                <CCol>
                                  <div>{item.username}</div>
                                </CCol>
                                <CCol>
                                  <div>{item.role}</div>
                                </CCol>
                                {/* <CCol style={{ width: '15rem' }}>
                                  <CBadge color="secondary"> {item.permission}</CBadge>
                                </CCol> */}
                                <CCol style={{ width: '5rem' }}>
                                  <CButton
                                    color="primary"
                                    variant="outline"
                                    shape="square"
                                    size="sm"
                                    onClick={() => {
                                      toggleDetail(item.id)
                                    }}
                                  >
                                    {details.includes(item.id) ? 'Hide' : 'Show'}
                                  </CButton>
                                </CCol>
                              </CRow>
                              <CRow>
                                <CCollapse visible={details.includes(item.id)}>
                                  <hr />
                                  <CCol className="ms-3 mb-3 me-5">
                                    <CRow>
                                      <CCol xs={2}>
                                        <CFormSelect
                                          floatingLabel={'Role'}
                                          aria-label="Default"
                                          onChange={(e) => {}}
                                        >
                                          <option>Select</option>
                                          <option>Mode</option>
                                          <option>Admin</option>
                                          <option>Customer</option>
                                        </CFormSelect>
                                      </CCol>
                                      {/* <CCol xs={2}>
                                        <CFormSelect
                                          floatingLabel={'Permission'}
                                          aria-label="Default"
                                          onChange={(e) => {}}
                                        >
                                          <option>Select</option>
                                          <option>Write</option>
                                          <option>Read</option>
                                          <option>Add</option>
                                        </CFormSelect>
                                      </CCol> */}
                                      <CCol xs={5} />
                                      <CCol>
                                        <CButton
                                          color="success"
                                          variant="outline"
                                          shape="square"
                                          size="sm"
                                          className="me-3"
                                          style={{ width: '7rem', height: '3.5rem' }}
                                        >
                                          Save changes
                                        </CButton>
                                        <CButton
                                          variant="outline"
                                          shape="square"
                                          size="sm"
                                          color="danger"
                                          style={{ width: '7rem', height: '3.5rem' }}
                                        >
                                          Delete User
                                        </CButton>
                                      </CCol>
                                    </CRow>
                                  </CCol>
                                </CCollapse>
                              </CRow>
                            </CCol>
                          </CTableDataCell>
                        </CTableRow>
                      </>
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
          <CModalTitle>Add Customer</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CCol>
            {listCustomerParams.map((params, index) => (
              <CRow className="mb-3">
                <CCol>
                  <CTooltip placement="left" content={listCustomerParams[index][0]}>
                    {params[2] == 'normal' ? (
                      <CFormTextarea
                        floatingLabel={listCustomerParams[index][0]}
                        id={listCustomerParams[index][0]}
                        placeholder={listCustomerParams[index][0]}
                        onChange={(e) => {
                          setForm({ ...form, [listCustomerParams[index][0]]: e.target.value })
                        }}
                      />
                    ) : (
                      <CFormSelect
                        floatingLabel={listCustomerParams[index][0]}
                        aria-label="Default"
                        onChange={(e) => {
                          setForm({ ...form, [listCustomerParams[index][0]]: e.target.value })
                        }}
                      >
                        <option>Select</option>
                        {listCustomerParams[index][3].map((value) => (
                          <option value={value}>{value}</option>
                        ))}
                      </CFormSelect>
                    )}
                  </CTooltip>
                </CCol>
              </CRow>
            ))}
          </CCol>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleCreate(false)}>
            Close
          </CButton>
          <CButton
            color="primary"
            onClick={() => {
              createUser()
            }}
          >
            Create
          </CButton>
        </CModalFooter>
      </CModal>
      <CToaster ref={toaster} push={toast} placement="top-end" />
    </>
  )
}

export default CustomerManagement
