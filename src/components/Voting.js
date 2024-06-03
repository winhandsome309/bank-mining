// import React, { useEffect, useState } from 'react'
import * as React from 'react'
import classNames from 'classnames'
import { getStyle } from '@coreui/utils'
import { CChart, CChartRadar, CChartDoughnut } from '@coreui/react-chartjs'
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
  CWidgetStatsD,
  CContainer,
} from '@coreui/react'
import { Doughnut } from 'react-chartjs-2'
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
  cilThumbDown,
  cilThumbUp,
} from '@coreui/icons'
import axios from 'axios'
import client from '../hooks/useApi'

const Voting = (props) => {
  const [comFunction, setComFunction] = React.useState('Comment')
  const [like, setLike] = React.useState(0)
  const [dislike, setDislike] = React.useState(0)
  const [numberLike, setNumberLike] = React.useState(0)
  const [numberDislike, setNumberDislike] = React.useState(0)

  const fetchVoting = () => {
    client
      .get(process.env.REACT_APP_API_ENDPOINT + '/api/voting', {
        params: {
          id: props.appData['id'],
        },
      })
      .then((res) => {
        var likeVal = res.data['like']
        var dislikeVal = res.data['dislike']
        var sum = parseInt(likeVal) + parseInt(dislikeVal)
        if (sum == 0) {
          setLike(0)
          setDislike(0)
        } else {
          var a = (likeVal * 100) / sum
          var b = (dislikeVal * 100) / sum
          setLike(Math.round((a * 100) / 100))
          setDislike(Math.round((b * 100) / 100))
          setNumberLike(likeVal)
          setNumberDislike(dislikeVal)
        }
        props.setCheckFetchVote(!props.checkFetchVote)
      })
  }

  React.useEffect(() => {
    if (props.appData['id'] != '') {
      fetchVoting()
    }
  }, [props.changeApp])

  return (
    <>
      <CCard>
        <CCardHeader>
          <div>
            <strong>Voting</strong>
          </div>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol xs={2} />
            <CCol xs={1}>
              <CRow>
                <div
                  style={{
                    color: 'green',
                  }}
                >
                  <CIcon icon={cilThumbUp} className="me-2" />
                </div>
              </CRow>
              <CRow>
                <div
                  style={{
                    color: 'red',
                  }}
                >
                  <CIcon icon={cilThumbDown} className="me-2" />
                </div>
              </CRow>
            </CCol>
            <CCol xs={6}>
              <CRow className="mt-2 mb-3">
                <div
                  style={{
                    color: 'green',
                  }}
                >
                  <CProgress value={like} color="success" height={10} animated variant="striped">
                    {numberLike} votes
                  </CProgress>
                </div>
              </CRow>
              <CRow className="mt-1 mb-1">
                <div
                  style={{
                    color: 'red',
                  }}
                >
                  <CProgress value={dislike} color="danger" height={10} animated variant="striped">
                    {numberDislike} votes
                  </CProgress>
                </div>
              </CRow>
            </CCol>
            <CCol xs={3}>
              <CRow>
                <div
                  style={{
                    color: 'green',
                  }}
                >
                  {like}%
                </div>
              </CRow>
              <CRow>
                <div
                  style={{
                    color: 'red',
                  }}
                >
                  {dislike}%
                </div>
              </CRow>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Voting
