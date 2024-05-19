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
import client from '../../hooks/useApi'

const listCustomerParams = [
  ['email', 'abc', 'normal'],
  ['username', 'abc', 'normal'],
  // ['role', 'abc', 'select', ['admin', 'customer'], ['admin', 'customer']],
  // ['permission', 'abc', 'select', ['read', 'write', 'all'], ['read', 'write', 'all']],
  // ['chat_token', 'abc', 'normal'],
  // ['customer_id', 'abc', 'normal'],
  ['fname', 'abc', 'normal'],
  // ['application_id', 'abc', 'normal'],
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
    username: '',
    fname: '',
    application_id: '',
  })
  const [details, setDetails] = useState([])
  const [visibleCreate, setVisibleCreate] = useState(false)
  const [toast, addToast] = useState(0)
  const toaster = useRef()
  const [checkRenderInfo, setCheckRenderInfo] = useState({})

  const fetchCustomer = () => {
    client.get( '/api/admin/customers').then((res) => {
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
    client
      .post( '/api/customer/create', formData)
      .then((res) => {
        if (res.status === 200) {
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

  const deleteCustomer = (item) => {
    const formData = new FormData()
    formData.append('email', item.email)
    client.post( '/api/user/delete', formData).then((res) => {
      if (res.status === 201) {
        setVisibleCreate(false)
        fetchCustomer()
        addToast(warningToast('Customer is created successfully'))
      }
    })
  }

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
  const failToast = (msg) => (
    <CToast title="Success" color="danger" className="d-flex">
      <CToastBody>{msg} !</CToastBody>
      <CToastClose className="me-2 m-auto" white />
    </CToast>
  )

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
                        style={{ width: '13rem' }}
                      >
                        ID
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary " style={{ width: '10rem' }} />
                      <CTableHeaderCell className="bg-body-tertiary" style={{ width: '22rem' }}>
                        Email
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary" style={{ width: '18rem' }}>
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
                                <CCol xs={2}>
                                  <div>{item.id}</div>
                                </CCol>
                                <CCol xs={4}>
                                  <div>{item.email}</div>
                                </CCol>
                                <CCol xs={3}>
                                  <div>{item.username}</div>
                                </CCol>
                                <CCol xs={2}>
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
                                  <CCol className="ms-3 mb-2 me-5">
                                    <CRow>
                                      <CCol xs={3}>
                                        <CRow className="ms-2">Number of application: 1</CRow>
                                        <CRow className="ms-2">Is potential customer: Yes</CRow>
                                      </CCol>
                                      <CCol xs={7} />
                                      <CCol>
                                        <CButton
                                          variant="outline"
                                          shape="square"
                                          size="sm"
                                          color="danger"
                                          style={{ width: '7rem', height: '3.5rem' }}
                                          onClick={() => deleteCustomer(item)}
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
