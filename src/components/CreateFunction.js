import React, { useRef, useState, useEffect } from 'react'
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
  cilPlus,
} from '@coreui/icons'
import axios, { formToJSON } from 'axios'
import { IconNumber0Small } from '@tabler/icons-react'

const CreateFunction = (props) => {
  const [visibleMultipleApp, setVisibleMultipleApp] = useState(false)
  const [visibleSingleApp, setVisibleSingleApp] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [validated, setValidated] = useState(false)

  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      setVisibleMultipleApp(false)
      setVisibleSingleApp(false)
      setSelectedFile(IconNumber0Small)
      props.createSingle()
    }
    setValidated(true)
  }

  return (
    <CModal
      scrollable
      visible={props.visibleCreate}
      backdrop="static"
      onClose={() => props.setVisibleCreate(false)}
      alignment="center"
    >
      <CModalHeader>
        <CModalTitle>Create {props.nameCreate}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CCol>
          <CRow>
            <CCol />
            <CCol xs={8}>
              <CButton color="primary" onClick={() => setVisibleMultipleApp(!visibleMultipleApp)}>
                List of {props.nameCreate}
              </CButton>
              <CCol />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCollapse visible={visibleMultipleApp}>
              <CCard className="mt-3">
                <CCardBody>
                  <CFormInput
                    type="file"
                    id="formFile"
                    label="Input File CSV"
                    onChange={(e) => {
                      setSelectedFile(e.target.files[0])
                    }}
                  />
                </CCardBody>
                <CCardFooter>
                  {props.loadingMultipleCreation ? (
                    <CSpinner />
                  ) : (
                    <CButton
                      color="primary"
                      onClick={() => {
                        props.setLoadingMultipleCreation(true)
                        props.createMultiple(selectedFile)
                      }}
                    >
                      Create
                    </CButton>
                  )}
                </CCardFooter>
              </CCard>
            </CCollapse>
          </CRow>
          <CRow>
            <CCol />
            <CCol xs={8}>
              <CButton color="primary" onClick={() => setVisibleSingleApp(!visibleSingleApp)}>
                Single {props.nameCreate}
              </CButton>
            </CCol>
          </CRow>
          <CCollapse visible={visibleSingleApp}>
            <CCard className="mt-3">
              <CCardBody>
                <CForm
                  className="row g-3 needs-validation mt-2"
                  noValidate
                  validated={validated}
                  onSubmit={handleSubmit}
                >
                  {props.listParams.map(
                    (params, index) =>
                      index % 2 == 0 && (
                        <CRow className="mb-3">
                          <CCol>
                            <CTooltip placement="left" content={params[1]}>
                              {params[2] == 'normal' ? (
                                <CFormInput
                                  required
                                  feedbackValid="Looks good!"
                                  floatingLabel={params[0]}
                                  id={params[0]}
                                  placeholder={params[0]}
                                  onChange={(e) => {
                                    props.setForm({
                                      ...props.form,
                                      [params[0]]: e.target.value,
                                    })
                                  }}
                                />
                              ) : (
                                <CFormSelect
                                  required
                                  feedbackValid="Looks good!"
                                  floatingLabel={params[0]}
                                  aria-label="Default"
                                  onChange={(e) => {
                                    props.setForm({
                                      ...props.form,
                                      [params[0]]: e.target.value,
                                    })
                                  }}
                                >
                                  <option selected="" value="">
                                    Select
                                  </option>
                                  {params[3].map((value, i) => (
                                    <option value={params[4][i]}>{value}</option>
                                  ))}
                                </CFormSelect>
                              )}
                            </CTooltip>
                          </CCol>
                          {index + 1 < props.listParams.length ? (
                            <CCol>
                              <CTooltip placement="left" content={props.listParams[index + 1][1]}>
                                {props.listParams[index + 1][2] == 'normal' ? (
                                  <CFormInput
                                    required
                                    feedbackValid="Looks good!"
                                    floatingLabel={props.listParams[index + 1][0]}
                                    id={props.listParams[index + 1][0]}
                                    placeholder={props.listParams[index + 1][0]}
                                    onChange={(e) => {
                                      props.setForm({
                                        ...props.form,
                                        [props.listParams[index + 1][0]]: e.target.value,
                                      })
                                    }}
                                  />
                                ) : (
                                  <CFormSelect
                                    required
                                    feedbackValid="Looks good!"
                                    floatingLabel={props.listParams[index + 1][0]}
                                    aria-label="Default"
                                    onChange={(e) => {
                                      props.setForm({
                                        ...props.form,
                                        [props.listParams[index + 1][0]]: e.target.value,
                                      })
                                    }}
                                  >
                                    <option selected="" value="">
                                      Select
                                    </option>
                                    {props.listParams[index + 1][3].map((value, i) => (
                                      <option value={props.listParams[index + 1][4][i]}>
                                        {value}
                                      </option>
                                    ))}
                                  </CFormSelect>
                                )}
                              </CTooltip>
                            </CCol>
                          ) : (
                            <CCol></CCol>
                          )}
                        </CRow>
                      ),
                  )}
                  <CButton type="submit" color="primary">
                    Create
                  </CButton>
                </CForm>
              </CCardBody>
              {/* <CCardFooter>
                <CButton
                  color="primary"
                  onClick={() => {
                    setVisibleMultipleApp(false)
                    setVisibleSingleApp(false)
                    setSelectedFile(IconNumber0Small)
                    props.createSingle()
                  }}
                >
                  Create
                </CButton>
              </CCardFooter> */}
            </CCard>
          </CCollapse>
        </CCol>
      </CModalBody>
    </CModal>
  )
}

export default CreateFunction
