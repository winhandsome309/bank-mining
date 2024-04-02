import React, { useEffect, useState } from 'react'
import axios from 'axios'

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
    <>
      {iframeUrl == '' ? (
        <></>
      ) : (
        <iframe src={iframeUrl} frameBorder={0} width={1250} height={2550} allowTransparency />
      )}
    </>
  )
}

export default AboutData
