import React, { useEffect, useState } from 'react'
import { ActionIcon, RingProgress, Text, Center, rem } from '@mantine/core'
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
  CSpinner,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CListGroup,
  CListGroupItem,
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
} from '@coreui/icons'
import axios from 'axios'
import client from '../../../hooks/useApi'

const colorModel = {
  accuracy: '#FF6384',
  precision: '#4BC0C0',
  recall: '#FFCE56',
  auc: '#c9a0dc',
  f1_score: '#36A2EB',
}
const infoAttr = {
  accuracy:
    'Accuracy is one metric for evaluating classification models. Informally, accuracy is the fraction of predictions our model got righ',
  precision:
    'Precision refers to the number of true positives divided by the total number of positive predictions (i.e., the number of true positives plus the number of false positives).',
  recall:
    'The ability of a model to find all the relevant cases within a data set. Mathematically, we define recall as the number of true positives divided by the number of true positives plus the number of false negatives',
  auc: 'AUC stands for "Area under the ROC Curve." That is, AUC measures the entire two-dimensional area underneath the entire ROC curve (think integral calculus) from (0,0) to (1,1). AUC (Area under the ROC Curve). AUC provides an aggregate measure of performance across all possible classification thresholds',
  f1_score:
    'F1 score is a measure of the harmonic mean of precision and recall. Commonly used as an evaluation metric in binary and multi-class classification and LLM evaluation, the F1 score integrates precision and recall into a single metric to gain a better understanding of model performance. F-score can be modified into F0',
}
const nameMetricModel = ['accuracy', 'precision', 'recall', 'auc', 'f1_score']

const Models = () => {
  const [model, setModel] = useState('Decision Tree')
  const [modelInfo, setModelInfo] = useState([])
  const [indexModel, setIndexModel] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showCompare, setShowCompare] = useState(false)
  const [rankingModel, setRankingModel] = useState({
    accuracy: [],
    precision: [],
    recall: [],
  })
  const [loadingFetch, setLoadingFetch] = useState(true)

  const fetchModelInfo = async () => {
    client
      .get(process.env.REACT_APP_API_ENDPOINT + '/api/model-info', {
        params: {
          feature: 'credit_card',
        },
      })
      .then((res) => {
        if (res.status === 200) {
          // var temp = res.data
          // for (var i = 0; i < temp.length; i++) {
          //   delete temp[i]['feature']
          //   delete temp[i]['model']
          //   temp[i]['f1_score'] =
          //     Math.round(
          //       ((temp[i]['precision'] * temp[i]['recall']) /
          //         (temp[i]['precision'] + temp[i]['recall'])) *
          //         10000,
          //     ) / 10000
          // }
          var temp = res.data
          var arr = rankingModel
          for (var i = 0; i < temp.length; i++) {
            if (temp[i]['model'] == 'VotingClassifier') continue
            var a = [temp[i]['model'], temp[i]['accuracy']]
            var b = [temp[i]['model'], temp[i]['precision']]
            var c = [temp[i]['model'], temp[i]['recall']]
            arr['accuracy'].push(a)
            arr['precision'].push(b)
            arr['recall'].push(c)
          }

          for (var key in arr) {
            arr[key].sort(function (first, second) {
              return second[1] - first[1]
            })
          }

          setRankingModel(arr)
          setModelInfo(res.data)
          setLoadingFetch(false)
        }
      })
  }

  useEffect(() => {
    setLoadingFetch(true)
    fetchModelInfo()
  }, [])

  function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time))
  }

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
                      onClick={() => {
                        setModel('Decision Tree')
                        setIndexModel(0)
                      }}
                    >
                      Decision Tree
                    </CDropdownItem>
                    <CDropdownItem
                      onClick={() => {
                        setModel('K-Nearest Neighbors')
                        setIndexModel(1)
                      }}
                    >
                      K-Nearest Neighbors
                    </CDropdownItem>
                    <CDropdownItem
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
              <div className="ms-auto focus:cursor-auto">
                <CButton
                  color="primary"
                  onClick={() => {
                    setShowCompare(true)
                  }}
                  className="ms-4"
                >
                  Compare
                </CButton>
              </div>
            </CCardHeader>
            <CCardBody>
              {loading || loadingFetch ? (
                <CSpinner />
              ) : (
                <CCol>
                  {modelInfo.length > 0 &&
                    Object.entries(modelInfo[indexModel]).map(
                      (item, index) =>
                        nameMetricModel.includes(item[0]) && (
                          <CCard style={{ height: '23rem' }} className="mb-4">
                            <CCardHeader>
                              {item[0].charAt(0).toUpperCase() + item[0].slice(1)}
                            </CCardHeader>
                            <CCardBody>
                              <CRow>
                                <CCol xs={1}></CCol>
                                {index % 2 != 0 && (
                                  <CCol xs={7} className="mt-5">
                                    <div className="align-items-center justify-content-center mt-5 me-3">
                                      {infoAttr[item[0]]}
                                    </div>
                                  </CCol>
                                )}
                                <CCol xs={3}>
                                  <RingProgress
                                    size={290}
                                    thickness={15}
                                    sections={[
                                      {
                                        value: Math.round(item[1] * 100 * 100) / 100,
                                        color: colorModel[item[0]],
                                      },
                                    ]}
                                    label={
                                      <Text c="black" fw={700} ta="center" size="xl">
                                        {Math.round(item[1] * 100 * 100) / 100}%
                                      </Text>
                                    }
                                  />
                                </CCol>
                                {index % 2 == 0 && (
                                  <CCol xs={7} className="mt-5">
                                    <div className="align-items-center justify-content-center mt-5 ms-3">
                                      {infoAttr[item[0]]}
                                    </div>
                                    <CRow xs={4} />
                                  </CCol>
                                )}
                                <CCol xs={1}></CCol>
                              </CRow>
                            </CCardBody>
                          </CCard>
                        ),
                    )}
                </CCol>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal
        scrollable
        visible={showCompare}
        backdrop="static"
        alignment="center"
        onClose={() => setShowCompare(false)}
      >
        <CModalHeader>
          <CModalTitle>Ranking Model</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CListGroup>
            <CListGroupItem>
              <span style={{ fontWeight: '700' }}>Highest Accuracy</span>
              {rankingModel['accuracy'].map((item, index) => (
                <div className="ms-4">
                  {index + 1}. {item[0]}: {item[1]}
                </div>
              ))}
            </CListGroupItem>
            <CListGroupItem>
              <span style={{ fontWeight: '700' }}>Highest Precision</span>
              {rankingModel['precision'].map((item, index) => (
                <div className="ms-4">
                  {index + 1}. {item[0]}: {item[1]}
                </div>
              ))}
            </CListGroupItem>
            <CListGroupItem>
              <span style={{ fontWeight: '700' }}>Highest Recall</span>
              {rankingModel['recall'].map((item, index) => (
                <div className="ms-4">
                  {index + 1}. {item[0]}: {item[1]}
                </div>
              ))}
            </CListGroupItem>
          </CListGroup>
          {/* <div>Highest Accuracy</div>
          <div>Highest Precision</div>
          <div>Highest Recall</div> */}
        </CModalBody>
      </CModal>
    </>
  )
}

export default Models
