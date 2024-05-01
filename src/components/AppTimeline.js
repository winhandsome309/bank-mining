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
        <Stepper.Step label="First step" description="Create an application" className="mb-2">
          Step 1 content: Create an application
        </Stepper.Step>
        <Stepper.Step label="Second step" description="Waiting" className="mb-2">
          Step 2 content: Application is waiting to be examined
        </Stepper.Step>
        {props.currentStep == -1 ? (
          <Stepper.Step
            label="Third step"
            description="Processed"
            className="mb-2"
            color="red"
            completedIcon={<IconCircleX style={{ width: rem(20), height: rem(20) }} />}
          >
            Step 3 content: Application is being examnied
          </Stepper.Step>
        ) : (
          <Stepper.Step label="Third step" description="Processed" className="mb-2">
            Step 3 content: Application is being examnied
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
            Step 4 content: Application was dinied. Stopped at step 3.
          </Stepper.Step>
        ) : (
          <Stepper.Step label="Final step" description="Done" className="mb-2">
            Step 4 content: Application was approve. Waiting for future reponse.
          </Stepper.Step>
        )}
      </Stepper>
    </>
  )
}
export default AppTimeline
