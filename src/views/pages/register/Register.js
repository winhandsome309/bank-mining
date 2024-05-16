import React, { useState, useRef } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CToaster,
  CToast,
  CToastBody,
  CToastClose,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import axios, { formToJSON } from 'axios'
import client from '../../../hooks/useApi'

const Register = () => {
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [isValidEmail, setIsValidEmail] = useState(true)
  const [password, setPassWord] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [toast, addToast] = useState(0)
  const toaster = useRef()

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const handleEmailChange = (event) => {
    const { value } = event.target
    setEmail(value)
    setIsValidEmail(validateEmail(value))
  }

  const successToast = (msg) => (
    <CToast title="Success" color="success" className="d-flex">
      <CToastBody>{msg} !</CToastBody>
      <CToastClose className="me-2 m-auto" white />
    </CToast>
  )

  function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time))
  }

  const successCreate = async () => {
    addToast(successToast('Account is created successfully'))
    await sleep(1000)
    window.location.href = '/#/login'
  }

  const createAccount = async () => {
    const formData = new FormData()
    formData.append('username', userName)
    formData.append('email', email)
    formData.append('password', password)

    client
      .post( '/api/create-account', formData)
      .then((res) => {
        if (res.status === 201) {
          successCreate()
        }
      })
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Username"
                      autoComplete="username"
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      style={{ color: !isValidEmail && 'red' }}
                      placeholder="Email"
                      autoComplete="email"
                      onChange={handleEmailChange}
                      value={email}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      onChange={(e) => {
                        setPassWord(e.target.value)
                      }}
                      value={password}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      style={{ color: confirmPassword != password && 'red' }}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                      }}
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      value={confirmPassword}
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton
                      color="success"
                      disabled={
                        userName == '' ||
                        email == '' ||
                        password == '' ||
                        !isValidEmail ||
                        password != confirmPassword
                      }
                      onClick={createAccount}
                    >
                      Create Account
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
      <CToaster ref={toaster} push={toast} placement="top-end" />
    </div>
  )
}

export default Register
