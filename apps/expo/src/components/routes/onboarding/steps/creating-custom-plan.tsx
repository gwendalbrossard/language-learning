import { useEffect, useState } from "react"
import { View } from "react-native"
import { PieChart } from "react-native-gifted-charts"

import type { StepProps } from "~/components/common/step"
import * as Step from "~/components/common/step"
import { Text } from "~/ui/text"

const CreatingCustomPlan: React.FC<StepProps> = ({ onContinue, onBack, progress }) => {
  const [creationProgress, setCreationProgress] = useState(0)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const updateProgress = () => {
      setCreationProgress((prev) => {
        if (prev >= 100) {
          setTimeout(() => {
            onContinue()
          }, 1200)
          return 100
        }

        // Random increment between 0.5 and 2
        const increment = Math.random() * 1.5 + 0.5
        const newProgress = Math.min(prev + increment, 100)

        // Random delay between 20ms and 100ms
        const delay = Math.floor(Math.random() * 80) + 20
        timeout = setTimeout(updateProgress, delay)

        return newProgress
      })
    }

    // Start the progress
    timeout = setTimeout(updateProgress, 50)

    return () => {
      clearTimeout(timeout)
    }
  }, [onContinue])

  return (
    <Step.Container className="justify-center">
      <Step.Progress onBack={onBack} progress={progress} />

      <Step.Header className="gap-4">
        <Step.HeaderTitle className="text-2xl">Personalizing Your Journey</Step.HeaderTitle>
        <Step.HeaderDescription className="text-lg">We're creating a tailored plan to help you reduce alcohol consumption</Step.HeaderDescription>
      </Step.Header>

      <Step.Body className="mt-8 flex-grow-0">
        <View className="relative items-center justify-center">
          <PieChart
            data={[
              { value: creationProgress, color: "#2160EB" },
              { value: 100 - creationProgress, color: "#E5E7EB" },
            ]}
            donut
            radius={110}
            innerRadius={90}
            innerCircleColor="#FFFFFF"
            centerLabelComponent={() => <Text className="text-2xl font-bold">{Math.round(creationProgress)}%</Text>}
            isAnimated
            animationDuration={50}
          />
        </View>
      </Step.Body>
    </Step.Container>
  )
}

export default CreatingCustomPlan
