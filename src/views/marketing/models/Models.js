import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
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
  CSpinner,
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
import client from '../../../hooks/useApi'

const colorModel = {
  accuracy: '#FF6384',
  precision: '#4BC0C0',
  recall: '#FFCE56',
  auc: '#c9a0dc',
  'f1-score': '#36A2EB',
}
const nameMetricModel = ['accuracy', 'precision', 'recall', 'auc', 'f1-score']

const Models = () => {
  const [model, setModel] = useState('Logistic regression')
  const [modelInfo, setModelInfo] = useState([])
  const [indexModel, setIndexModel] = useState(0)

  const fetchModelInfo = async () => {
    client
      .get(process.env.REACT_APP_API_ENDPOINT + '/api/model-info', {
        params: {
          feature: 'marketing',
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setModelInfo(res.data)
        }
      })
  }

  useEffect(() => {
    fetchModelInfo()
  }, [])

  function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time))
  }

  const [loading, setLoading] = useState(false)
  useEffect(() => {
    return async () => {
      setLoading(true)
      await sleep(200)
      setLoading(false)
    }
  }, [indexModel])

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
                    <CDropdownItem
                      // href="#/loan-app/models"
                      onClick={() => {
                        setModel('Logistic Regression')
                        setIndexModel(0)
                      }}
                    >
                      Linear Regression
                    </CDropdownItem>
                    <CDropdownItem
                      // href="#/loan-app/models"
                      onClick={() => {
                        setModel('Logistic Regression - Improve')
                        setIndexModel(1)
                      }}
                    >
                      Logistic Regression - Improve
                    </CDropdownItem>
                    <CDropdownItem
                      // href="#/loan-app/models"
                      onClick={() => {
                        setModel('Random Forest')
                        setIndexModel(2)
                      }}
                    >
                      Random Forest
                    </CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </div>
            </CCardHeader>
            <CCardBody>
              {loading ? (
                <CSpinner />
              ) : (
                <CRow>
                  {modelInfo.length > 0 &&
                    Object.entries(modelInfo[indexModel]).map(
                      (item, index) =>
                        nameMetricModel.includes(item[0]) && (
                          <CCol>
                            <CChartDoughnut
                              height={50}
                              width={50}
                              data={{
                                labels: [item[0]],
                                datasets: [
                                  {
                                    backgroundColor: [colorModel[item[0]], '#E7E9ED'],
                                    data: [item[1], 1 - item[1]],
                                  },
                                ],
                              }}
                            />
                          </CCol>
                        ),
                    )}
                </CRow>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Models
