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
import axios from 'axios'

const Models = () => {
  const [model, setModel] = useState('Linear Regression')

  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader className="d-none d-md-flex">
              <div>
                <CDropdown>
                  <CDropdownToggle split={false} color="light">
                    {model}
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem onClick={() => setModel('Linear Regression')}>
                      Linear Regression
                    </CDropdownItem>
                    <CDropdownItem onClick={() => setModel('Logistic Regression')}>
                      Logistic Regression
                    </CDropdownItem>
                    <CDropdownItem onClick={() => setModel('Random Forest')}>
                      Random Forest
                    </CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </div>
            </CCardHeader>
            <CCardBody>
              <iframe
                src="./src/assets/loan-app/plotly_graph.html"
                height={1000}
                width={800}
                loading="lazy"
              ></iframe>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Models
