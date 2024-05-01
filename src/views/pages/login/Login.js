import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import axios from 'axios'

var csrf_token

axios
  .get(process.env.REACT_APP_API_ENDPOINT + '/login', {
    data: null,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
  })
  .then(function (resp) {
    csrf_token = resp.data['response']['csrf_token']
    document.cookie = 'csrf_token=' + csrf_token + '; expires=Fri, 31 Dec 2024 23:59:59 GMT; path=/'
  })

axios.interceptors.request.use(
  function (config) {
    if (['post', 'delete', 'patch', 'put'].includes(config['method'])) {
      if (csrf_token !== '') {
        config.headers['X-CSRF-Token'] = csrf_token
      }
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

const Login = () => {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [usernameResetPassword, setUsernameResetPassword] = useState('')
  const [oldPasswordResetPassword, setOldPasswordResetPassword] = useState('')
  const [newPasswordResetPassword, setNewPasswordResetPassword] = useState('')
  const [loadingButton, setLoadingButton] = useState(false)
  const [visibleResetPassword, setVisibleResetPassword] = useState(false)
  const [toast, setToast] = useState(0)
  const toaster = useRef()

  const afterLogin = () => {
    axios
      .post(
        process.env.REACT_APP_API_ENDPOINT + '/api/login',
        {
          email: userName,
          password: password,
        },
        {
          withCredentials: true,
          mode: 'cors',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        },
      )
      .then((res) => {
        if (res.status === 200) {
          window.location.replace('')
        }
      })
  }

  const login = () => {
    axios
      .post(
        process.env.REACT_APP_API_ENDPOINT + '/login',
        {
          email: userName,
          password: password,
          remember: false,
          csrf_token: csrf_token,
        },
        {
          withCredentials: true,
          credentials: 'include',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
        },
      )
      .then((res) => {
        if (res.status === 200) {
          afterLogin()
        }
        setLoadingButton(!loadingButton)
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

  const resetPassword = () => {
    // axios post
    setToast(successToast('Reset password successully'))
    setVisibleResetPassword(false)
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        value={userName}
                        placeholder="Username"
                        autoComplete="username"
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        value={password}
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={8}>
                        {!loadingButton ? (
                          <CButton
                            color="primary"
                            className="px-4"
                            onClick={() => {
                              setLoadingButton(!loadingButton)
                              login()
                            }}
                            disabled={userName == '' || password == ''}
                          >
                            Login
                          </CButton>
                        ) : (
                          <CSpinner />
                        )}
                      </CCol>
                      <CCol xs={4} className="text-right">
                        <CButton
                          color="link"
                          className="px-0"
                          onClick={() => setVisibleResetPassword(!visibleResetPassword)}
                        >
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
      <CModal
        scrollable
        visible={visibleResetPassword}
        backdrop="static"
        onClose={() => setVisibleResetPassword(false)}
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>Reset Your Password</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CCol>
              <CRow>
                <CInputGroup className="mb-4">
                  <CInputGroupText>
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput
                    value={usernameResetPassword}
                    type="username"
                    placeholder="Username"
                    autoComplete=""
                    onChange={(e) => setUsernameResetPassword(e.target.value)}
                  />
                </CInputGroup>
              </CRow>
              <CRow>
                <CInputGroup className="mb-4">
                  <CInputGroupText>
                    <CIcon icon={cilLockLocked} />
                  </CInputGroupText>
                  <CFormInput
                    value={oldPasswordResetPassword}
                    type="password"
                    placeholder="Old password"
                    autoComplete=""
                    onChange={(e) => setOldPasswordResetPassword(e.target.value)}
                  />
                </CInputGroup>
              </CRow>
              <CRow>
                <CInputGroup className="mb-4">
                  <CInputGroupText>
                    <CIcon icon={cilLockLocked} />
                  </CInputGroupText>
                  <CFormInput
                    value={newPasswordResetPassword}
                    type="password"
                    placeholder="New password"
                    autoComplete=""
                    onChange={(e) => setNewPasswordResetPassword(e.target.value)}
                  />
                </CInputGroup>
              </CRow>
            </CCol>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={() => resetPassword()}>
            Reset
          </CButton>
        </CModalFooter>
      </CModal>
      <CToaster ref={toaster} push={toast} placement="top-end" />
    </div>
  )
}

export default Login
