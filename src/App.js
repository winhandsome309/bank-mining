import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes, redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)
  const hostName = window.location.hostname

  function checkCookieExists(cookieName) {
    var cookies = document.cookie.split(';')

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim()

      if (cookie.indexOf(cookieName + '=') === 0) {
        return true
      }
    }

    return false
  }

  function redirect() {
    window.location.href = '/#/login'
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route
            exact
            path="/login"
            name="Login Page"
            element={!checkCookieExists('authorization') ? <Login /> : <DefaultLayout />}
          />
          <Route
            exact
            path="/register"
            name="Register Page"
            element={!checkCookieExists('authorization') ? <Register /> : <DefaultLayout />}
          />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route
            path="*"
            name="Home"
            element={checkCookieExists('authorization') ? <DefaultLayout /> : redirect()}
          />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
