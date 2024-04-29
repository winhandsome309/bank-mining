import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = () => {
  function getCookie(name) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
  }

  var userRole = getCookie('role')

  return (
    <div>
      <AppSidebar role={userRole} />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent role={userRole} />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
