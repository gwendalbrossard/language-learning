import { useLocalSearchParams } from "expo-router"
import { useQuery } from "@tanstack/react-query"
import { View } from "react-native"

import { Text } from "~/ui/text"
import { trpc } from "~/utils/api"
import { useUserStore } from "~/utils/zustand/user-store"

const LessonSessionIdEnded = () => {
  const { id } = useLocalSearchParams<{ id: string }>()

  const currentOrganizationId = useUserStore((state) => state.currentOrganizationId)
  if (!currentOrganizationId) throw new Error("Current organization ID not found")

  const profileLessonSessionGet = useQuery(
    trpc.profile.lessonSession.get.queryOptions({ organizationId: currentOrganizationId, lessonSessionId: id }),
  )
  if (!profileLessonSessionGet.data) throw new Error("Lesson session not found")

  return (
    <View>
      <Text>{profileLessonSessionGet.data.lesson.title}</Text>
      <Text>Vocabulary</Text>
      {profileLessonSessionGet.data.vocabulary.map((vocabulary) => (
        <Text key={vocabulary.id}>{vocabulary.text}</Text>
      ))}
      <Text>Messages</Text>
      <Text>Duration</Text>
      <Text>User Speaking Duration</Text>
      <Text>AI Speaking Duration</Text>
      <Text>Created At</Text>
      <Text>Updated At</Text>
    </View>
  )
}

export default LessonSessionIdEnded
