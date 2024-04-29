import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import routes from '../routes'
import customerRoutes from '../customerRoutes'

const AppContent = (props) => {
  // function getCookie(name) {
  //   const value = `; ${document.cookie}`
  //   const parts = value.split(`; ${name}=`)
  //   if (parts.length === 2) return parts.pop().split(';').shift()
  // }

  // var userRole = getCookie('role')

  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {(props.role == 'admin' ? routes : customerRoutes).map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element role={props.role} />}
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
