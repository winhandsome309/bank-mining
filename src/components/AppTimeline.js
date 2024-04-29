import { Timeline, Text } from '@mantine/core'

const AppTimeline = () => {
  return (
    <Timeline active={1} bulletSize={25}>
      <Timeline.Item title="Default bullet">
        <Text c="dimmed" size="sm">
          Default bullet without anything
        </Text>
      </Timeline.Item>
    </Timeline>
  )
}

export default AppTimeline
