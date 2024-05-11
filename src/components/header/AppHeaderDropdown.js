import React, { useState, useRef } from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
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
  CButton,
  CForm,
  CCol,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import { PasswordInput, rem, Input } from '@mantine/core'
import { IconLock, IconAt, IconKey } from '@tabler/icons-react'
import CIcon from '@coreui/icons-react'
import axios from 'axios'
import avatar8 from './../../assets/images/avatars/8.jpg'
import avatar10 from './../../assets/images/avatars/10.png'
import client from '../../hooks//useApi'

const AppHeaderDropdown = () => {
  const [usernameResetPassword, setUsernameResetPassword] = useState('')
  const [oldPasswordResetPassword, setOldPasswordResetPassword] = useState('')
  const [newPasswordResetPassword, setNewPasswordResetPassword] = useState('')
  const [loadingButton, setLoadingButton] = useState(false)
  const [visibleResetPassword, setVisibleResetPassword] = useState(false)
  const [toast, setToast] = useState(0)
  const toaster = useRef()

  const logout = () => {
    client
      .post(
        process.env.REACT_APP_API_ENDPOINT + '/logout',
        {},
        {
          data: null,
          withCredentials: true,
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
        },
      )
      .then((res) => {
        document.cookie = 'authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        document.cookie = 'role=admin; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        window.location.replace('')
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

  const resetPassword = () => {
    const formData = new FormData()
    formData.append('email', usernameResetPassword)
    formData.append('oldPassword', oldPasswordResetPassword)
    formData.append('newPassword', newPasswordResetPassword)
    client
      .post(process.env.REACT_APP_API_ENDPOINT + '/api/customer/reset-password', formData)
      .then((res) => {
        if (res.status === 200) {
          setLoadingButton(false)
          setToast(successToast('Reset password successully'))
          setVisibleResetPassword(false)
        }
      })
  }

  return (
    <>
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
          <CAvatar src={avatar10} size="md" />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
          {/* <CDropdownItem href="#">
            <CIcon icon={cilBell} className="me-2" />
            Updates
          </CDropdownItem>
          <CDropdownItem href="#">
            <CIcon icon={cilTask} className="me-2" />
            Tasks
          </CDropdownItem>
          <CDropdownItem href="#">
            <CIcon icon={cilCommentSquare} className="me-2" />
            Comments
          </CDropdownItem>
          <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
          <CDropdownItem href="#">
            <CIcon icon={cilUser} className="me-2" />
            Profile
          </CDropdownItem> */}
          <CDropdownItem onClick={() => setVisibleResetPassword(!visibleResetPassword)}>
            <CIcon icon={cilSettings} className="me-2" />
            Reset password
          </CDropdownItem>
          <CDropdownDivider />
          <CDropdownItem href="#" onClick={() => logout()}>
            <CIcon icon={cilLockLocked} className="me-2" />
            Log Out
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>

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
              <Input
                className="mb-4 mt-2"
                placeholder="Email"
                size="md"
                leftSection={<IconAt size={16} />}
                onChange={(e) => setUsernameResetPassword(e.target.value)}
              />
              <PasswordInput
                className="mb-4"
                size="md"
                leftSection={<IconLock style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
                placeholder="Old Password"
                onChange={(e) => setOldPasswordResetPassword(e.target.value)}
              />
              <PasswordInput
                className="mb-4"
                size="md"
                leftSection={<IconLock style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
                placeholder="New Password"
                onChange={(e) => setNewPasswordResetPassword(e.target.value)}
              />
            </CCol>
          </CForm>
        </CModalBody>
        <CModalFooter>
          {!loadingButton ? (
            <CButton
              color="primary"
              onClick={() => {
                setLoadingButton(true)
                resetPassword()
              }}
            >
              Reset
            </CButton>
          ) : (
            <CSpinner />
          )}
        </CModalFooter>
      </CModal>
      <CToaster ref={toaster} push={toast} placement="top-end" />
    </>
  )
}

export default AppHeaderDropdown
