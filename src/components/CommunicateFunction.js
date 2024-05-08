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
} from '@coreui/icons'
import axios from 'axios'

const CommunicateFunction = (props) => {
  const [comFunction, setComFunction] = React.useState('Comment')

  var remark_config = {
    host: 'http://localhost:8080',
    site_id: 'remark',
    components: ['embed', 'last-comments', 'counter'],
    max_shown_comments: 100,
    theme: 'light',
    no_footer: true,
  }

  !(function (e, n) {
    for (var o = 0; o < e.length; o++) {
      var r = n.createElement('script'),
        c = '.js',
        d = n.head || n.body
      'noModule' in r ? ((r.type = 'module'), (c = '.mjs')) : (r.async = !0),
        (r.defer = !0),
        (r.src = remark_config.host + '/web/' + e[o] + c),
        d.appendChild(r)
    }
  })(remark_config.components || ['embed'], document)

  const insertScript = (id, parentElement) => {
    const script = window.document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.id = id
    let url = window.location.origin + window.location.pathname
    if (url.endsWith('/')) {
      url = url.slice(0, -1)
    }
    script.innerHTML = `
      var remark_config = {
        host: "http://localhost:8080",
        site_id: "remark",
        theme: "light",
        components: ['embed', 'last-comments', 'counter'],
        no_footer: true,
        max_shown_comments: 10,
        url: "${props.id}",
      };
      !function(e,n){for(var o=0;o<e.length;o++){var r=n.createElement("script"),c=".js",d=n.head||n.body;"noModule"in r?(r.type="module",c=".mjs"):r.async=!0,r.defer=!0,r.src=remark_config.host+"/web/"+e[o]+c,d.appendChild(r)}}(remark_config.components||["embed"],document);`
    parentElement.appendChild(script)
  }

  const removeScript = (id, parentElement) => {
    const script = window.document.getElementById(id)
    if (script) {
      parentElement.removeChild(script)
    }
  }

  const manageScript = () => {
    if (!window) {
      return
    }
    const document = window.document
    if (document.getElementById('remark42')) {
      insertScript('comments-script', document.body)
    }
    return () => removeScript('comments-script', document.body)
  }
  const recreateRemark42Instance = () => {
    if (!window) {
    }
    const remark42 = window.REMARK42
    if (remark42) {
      remark42.destroy()
      remark42.createInstance(window.remark_config)
    }
  }
  React.useEffect(manageScript, [props.id])
  React.useEffect(recreateRemark42Instance, [props.id])

  return (
    <>
      <CCard>
        <CCardHeader>
          <div>
            <strong>Comment</strong>
          </div>
        </CCardHeader>
        <CCardBody>
          <div id="remark42"></div>
        </CCardBody>
      </CCard>
    </>
  )
}

export default CommunicateFunction
