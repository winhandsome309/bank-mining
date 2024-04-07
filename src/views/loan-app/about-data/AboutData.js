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

const AboutData = () => {
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
    // <>
    //   {iframeUrl == '' ? (
    //     <></>
    //   ) : (
    //     <iframe src={iframeUrl} frameBorder={0} width={1250} height={2550} allowTransparency />
    //   )}
    // </>
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
