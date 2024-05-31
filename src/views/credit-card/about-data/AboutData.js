import React, { useEffect, useState } from 'react'
import axios from 'axios'

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
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
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
import client from '../../../hooks/useApi'

const AboutData = () => {
  const [iframeUrl, setIframeUrl] = useState('')

  const getToken = async (id) => {
    client
      .get( '/api/metabase/get-token', {
        params: {
          id: id,
        },
      })
      .then((res) => {
        setIframeUrl(res.data)
      })
  }

  useEffect(() => {
    getToken(process.env.REACT_APP_CREDITCARD_DASHBOARD)
  }, [])

  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader className="d-none d-md-flex">
              {iframeUrl == '' ? (
                <></>
              ) : (
                <iframe
                  src={iframeUrl}
                  frameBorder={0}
                  width={1250}
                  height={2550}
                  allowTransparency
                />
              )}
            </CCardHeader>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default AboutData
