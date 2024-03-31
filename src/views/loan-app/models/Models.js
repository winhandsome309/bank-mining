import React from 'react'

const Models = () => {
  const TOKEN = '6d5bc8d158ffd9cd13c4cc4c503ce582f92eb7aa6b62ed08034c8f4b97b0b884'
  return (
    <>
      <script src="http://localhost:3002/app/iframeResizer.js"></script>
      <iframe
        src={'http://localhost:3002/embed/dashboard/' + TOKEN}
        onload="iFrameResize({}, this)"
      ></iframe>
    </>
  )
}

export default Models
