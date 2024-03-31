import React, { useEffect, useState } from 'react'
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
} from '@coreui/icons'
import axios from 'axios'

const Models = () => {
  const [iframeUrl, setIframeUrl] = useState('')

  const getToken = async () => {
    axios.get(process.env.REACT_APP_API_ENDPOINT + '/get-token').then((res) => {
      setIframeUrl(res.data)
    })
  }

  useEffect(() => {
    getToken()
  }, [])

  return (
    <>
      {iframeUrl == '' ? (
        <></>
      ) : (
        <iframe src={iframeUrl} frameBorder={0} width={1300} height={2550} allowTransparency />
      )}
    </>
  )
}

export default Models
