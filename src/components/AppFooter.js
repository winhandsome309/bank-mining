import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a
          href="https://github.com/winhandsome309/bank-mining"
          target="_blank"
          rel="noopener noreferrer"
        >
          Bank Mining
        </a>
        <span className="ms-1">&copy; 2024.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://github.com/winhandsome309" target="_blank" rel="noopener noreferrer">
          HandsomeTeam
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
