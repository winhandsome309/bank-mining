// import React, { useEffect, useState } from 'react'
import React, { useState, useEffect } from 'react'
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
  CInputGroupText,
  CFormInput,
  CInputGroup,
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
  CTooltip,
  COffcanvas,
  COffcanvasHeader,
  COffcanvasTitle,
  CCloseButton,
  COffcanvasBody,
  CContainer,
  CFooter,
  CFormSelect,
  CCollapse,
  CForm,
  CSpinner,
  CBadge,
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
  cilSearch,
} from '@coreui/icons'
import axios from 'axios'
import client from '../hooks/useApi'
import { BarChart } from '@mantine/charts'

const Filter = (props) => {
  const [data, setData] = useState([])
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [visible, setVisible] = useState(false)
  const [numberOfFilter, setNumberOfFilter] = useState(0)
  var temp = []
  for (var i = 0; i < 20; i++) temp.push(false)
  const [visibleFilter, setVisibleFilter] = useState(temp)

  const fetchInsight = () => {
    client
      .get(process.env.REACT_APP_API_ENDPOINT + props.api, {
        params: {
          id: props.data.id,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setData(res.data['data'])
          setLoaded(true)
        }
      })
  }

  useEffect(() => {
    if (open) fetchInsight()
  }, [open])

  var filterValueTemp = {}

  props.params != undefined &&
    props.params.map((item, index) => {
      filterValueTemp[item[0]] = [item[2], false, '', '']
    })

  const [filterValue, setFilterValue] = useState(filterValueTemp)

  const searchByFilter = (filterValue, reset) => {
    if (reset == true) {
      setNumberOfFilter(0)
      props.setFilteredData(props.data)

      return
    }

    var temp = []

    for (const item of props.data) {
      for (const [key, value] of Object.entries(item)) {
        // Filter
        if (key in filterValue) {
          if (filterValue[key][1] == true) {
            if (
              filterValue[key][0] == 'normal' &&
              filterValue[key][2] != '' &&
              filterValue[key][3] != ''
            ) {
              if (filterValue[key][2] <= value && value <= filterValue[key][3]) {
                temp.push(item)
              }
            } else {
              if (value == filterValue[key][2] && filterValue[key][2] != '') {
                temp.push(item)
              }
            }
          }
        }
      }
    }
    if (temp.length == 0) props.setFilteredData(-1)
    else {
      props.setFilteredData(temp)
    }
  }

  return (
    <>
      <CIcon
        icon={cilSearch}
        size="lg"
        onClick={() => setVisible(true)}
        style={{ color: numberOfFilter ? 'red' : 'black' }}
      />

      <COffcanvas
        className="w-25"
        placement="end"
        visible={visible}
        onHide={() => setVisible(false)}
        // backdrop="static"
      >
        <COffcanvasHeader>
          <COffcanvasTitle>Filter</COffcanvasTitle>
          <CCloseButton className="text-reset ms-auto" onClick={() => setVisible(false)} />
        </COffcanvasHeader>
        <COffcanvasBody>
          <CCol>
            {props.params != undefined &&
              props.params.map((item, index) => (
                <CRow>
                  <div>
                    <CCard className="mb-3">
                      <CCardHeader
                        onClick={() => {
                          temp = visibleFilter
                          temp[index] = !temp[index]
                          setVisibleFilter([...temp])
                        }}
                      >
                        {item[0]}
                      </CCardHeader>
                      <CCollapse visible={visibleFilter[index]}>
                        <CCardBody>
                          {item[2] == 'normal' ? (
                            <>
                              <CRow>
                                <CCol xs={6}>
                                  <CFormInput
                                    type="text"
                                    placeholder="From"
                                    aria-label="readonly input example"
                                    onChange={(e) => {
                                      var arr = filterValue
                                      arr[item[0]][1] = true
                                      arr[item[0]][2] = e.target.value
                                      setFilterValue(arr)
                                      if (e.target.value == '') {
                                        setNumberOfFilter(numberOfFilter - 1)
                                      } else {
                                        setNumberOfFilter(numberOfFilter + 1)
                                      }
                                    }}
                                  />
                                </CCol>
                                {/* <CCol xs={2}>-</CCol> */}
                                <CCol xs={6}>
                                  <CFormInput
                                    type="text"
                                    placeholder="To"
                                    aria-label="readonly input example"
                                    onChange={(e) => {
                                      var arr = filterValue
                                      arr[item[0]][1] = true
                                      arr[item[0]][3] = e.target.value
                                      setFilterValue(arr)
                                      if (e.target.value == '') {
                                        setNumberOfFilter(numberOfFilter - 1)
                                      } else {
                                        setNumberOfFilter(numberOfFilter + 1)
                                      }
                                    }}
                                  />
                                </CCol>
                              </CRow>
                            </>
                          ) : (
                            <>
                              <CFormSelect
                                required
                                feedbackValid="Looks good!"
                                //   floatingLabel={params[0]}
                                aria-label="Default"
                                onChange={(e) => {
                                  var arr = filterValue
                                  arr[item[0]][1] = true
                                  arr[item[0]][2] = e.target.value
                                  setFilterValue(arr)
                                  if (e.target.value == '') {
                                    setNumberOfFilter(numberOfFilter - 1)
                                  } else {
                                    setNumberOfFilter(numberOfFilter + 1)
                                  }
                                }}
                              >
                                <option selected="" value="">
                                  Select
                                </option>
                                {item[3].map((value, i) => (
                                  <option value={item[4][i]}>{value}</option>
                                ))}
                              </CFormSelect>
                            </>
                          )}
                        </CCardBody>
                      </CCollapse>
                    </CCard>
                    {/* <hr /> */}
                  </div>
                </CRow>
              ))}
          </CCol>
        </COffcanvasBody>
        <CFooter>
          <div>
            <CButton
              color="secondary"
              onClick={() => {
                setFilterValue(filterValueTemp)
                searchByFilter(filterValueTemp, true)
              }}
            >
              <span style={{ color: 'white' }}>Reset</span>
            </CButton>
          </div>
          <div>
            <CButton
              color="success"
              onClick={() => {
                searchByFilter(filterValue, false)
              }}
            >
              <span style={{ color: 'white' }}>Search</span>
            </CButton>
          </div>
        </CFooter>
      </COffcanvas>
    </>
  )
}

export default Filter
