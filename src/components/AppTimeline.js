import { useState } from 'react'
import { Stepper, rem } from '@mantine/core'
import { IconCircleX } from '@tabler/icons-react'

const AppTimeline = (props) => {
  return (
    <>
      <Stepper
        active={props.currentStep == -1 ? 3 : props.currentStep}
        allowNextStepsSelect={false}
      >
        {/* <Stepper.Step label="First step" description="Create an application" className="mb-2">
          Step 1 content: Create an application
        </Stepper.Step> */}
        <Stepper.Step label="First step" description="Created and Waiting" className="mb-2">
          <div>
            <span style={{ color: 'blue' }}>Status:</span> Application is waiting to be examined
          </div>
        </Stepper.Step>
        {props.currentStep == 2 && props.result == false ? (
          <Stepper.Step
            label="Third step"
            description="Processed"
            className="mb-2"
            color="red"
            completedIcon={<IconCircleX style={{ width: rem(20), height: rem(20) }} />}
          >
            Status: Application is being examnied
          </Stepper.Step>
        ) : (
          <Stepper.Step label="Second step" description="Processed" className="mb-2">
            Status: Application is being examnied
          </Stepper.Step>
        )}
        {props.currentStep == -1 ? (
          <Stepper.Step
            label="Final step"
            description="Done"
            className="mb-2"
            color="red"
            progressIcon={<IconCircleX style={{ width: rem(20), height: rem(20) }} />}
          >
            Status: Application was dinied. Stopped at step 3.
          </Stepper.Step>
        ) : (
          <Stepper.Step label="Final step" description="Done" className="mb-2">
            Status: Application was approve. Waiting for future response.
          </Stepper.Step>
        )}
      </Stepper>
    </>
  )
}
export default AppTimeline
