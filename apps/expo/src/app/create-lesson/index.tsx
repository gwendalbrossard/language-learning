import type { FC } from "react"
import type { TextInput } from "react-native"
import { useRef } from "react"
import { router, Stack } from "expo-router"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ChevronLeftIcon } from "lucide-react-native"
import { useForm } from "react-hook-form"
import { Alert, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import type { TProfileLessonCreateSchema } from "@acme/validators"
import { ZProfileLessonCreateSchema } from "@acme/validators"

import type { Difficulty } from "~/components/common/difficulty"
import { difficulties, getDifficultyName } from "~/components/common/difficulty"
import * as Step from "~/components/common/step"
import * as Button from "~/ui/button"
import { Label } from "~/ui/label"
import * as TabsButton from "~/ui/tabs-button"
import { TextError } from "~/ui/text"
import { Textarea } from "~/ui/textarea"
import { trpc } from "~/utils/api"
import { useUserStore } from "~/utils/zustand/user-store"

const CreateLesson: FC = () => {
  const currentOrganizationId = useUserStore((state) => state.currentOrganizationId)
  if (!currentOrganizationId) throw new Error("Current organization ID not found")

  const queryClient = useQueryClient()

  const descriptionRef = useRef<TextInput>(null)

  const form = useForm<TProfileLessonCreateSchema>({
    defaultValues: { description: "", difficulty: 2 as Difficulty, organizationId: currentOrganizationId },
    mode: "all",
    resolver: zodResolver(ZProfileLessonCreateSchema),
  })

  const profileLessonSessionCreateMutation = useMutation(
    trpc.profile.lessonSession.create.mutationOptions({
      onSuccess: async (data) => {
        await Promise.all([
          queryClient.invalidateQueries(trpc.profile.lessonSession.getAll.queryFilter({ organizationId: currentOrganizationId })),
          queryClient.fetchQuery(trpc.profile.lessonSession.get.queryOptions({ lessonSessionId: data.id, organizationId: currentOrganizationId })),
        ])

        router.replace(`/lesson-session/${data.id}`)
      },
      onError: (error) => {
        if (error.data?.code === "PAYMENT_REQUIRED") {
          Alert.alert("Subscription required", "You need to upgrade your plan to have access to this feature")
        } else {
          Alert.alert("An error occurred", error.message ? error.message : "An unknown error occurred")
        }
      },
    }),
  )

  const profileLessonCreateMutation = useMutation(
    trpc.profile.lesson.create.mutationOptions({
      onSuccess: async (data) => {
        await Promise.all([
          queryClient.invalidateQueries(trpc.profile.lesson.getAll.queryFilter({ organizationId: currentOrganizationId })),
          profileLessonSessionCreateMutation.mutateAsync({ lessonId: data.id, organizationId: currentOrganizationId }),
        ])
      },
      onError: (error) => {
        if (error.data?.code === "PAYMENT_REQUIRED") {
          Alert.alert("Subscription required", "You need to upgrade your plan to have access to this feature")
        } else {
          Alert.alert("An error occurred", error.message ? error.message : "An unknown error occurred")
        }
      },
    }),
  )

  const handleCreateLesson = () => {
    void form.handleSubmit(async (data) => await profileLessonCreateMutation.mutateAsync(data))()
  }

  const difficulty = form.watch("difficulty")

  const handleDifficultyChange = (selectedDifficulty: Difficulty) => {
    form.setValue("difficulty", selectedDifficulty)
  }

  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1, backgroundColor: "white" }}>
      <Stack.Screen
        options={{
          title: "",
          headerShown: true,
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="flex size-10 items-center justify-center">
              <ChevronLeftIcon className="text-neutral-600" />
            </TouchableOpacity>
          ),
          /* headerTitle: () => <Text className="text-lg font-semibold text-neutral-900">🎓 New Lesson</Text>, */
        }}
      />
      <Step.Container>
        <Step.Header>
          <Step.HeaderTitle>Create Lesson</Step.HeaderTitle>
          <Step.HeaderDescription>We will generate a personalized lesson based on your inputs</Step.HeaderDescription>
        </Step.Header>
        <Step.Body>
          {/* Form */}
          <View className="flex flex-col gap-6">
            {/* Description */}
            <View className="flex flex-col gap-2">
              <Label>💬 Lesson Description</Label>
              <Textarea
                ref={descriptionRef}
                size="lg"
                placeholder="e.g., Learn vocabulary for family members like mother, father, brother, sister, and practice describing family relationships."
                value={form.watch("description")}
                onChangeText={(text) => form.setValue("description", text)}
                multiline
                numberOfLines={4}
                returnKeyType="default"
                textAlignVertical="top"
              />
              {form.formState.errors.description && <TextError>{form.formState.errors.description.message}</TextError>}
            </View>

            {/* Difficulty */}
            <View className="flex flex-col gap-2">
              <Label>📊 Difficulty</Label>

              <TabsButton.Root
                value={difficulty.toString()}
                onValueChange={(value) => handleDifficultyChange(parseInt(value) as Difficulty)}
                size="sm"
              >
                <TabsButton.List>
                  {difficulties.map((difficultyLevel) => (
                    <TabsButton.Trigger key={difficultyLevel} value={difficultyLevel.toString()}>
                      <TabsButton.TriggerText>{getDifficultyName(difficultyLevel)}</TabsButton.TriggerText>
                    </TabsButton.Trigger>
                  ))}
                </TabsButton.List>
              </TabsButton.Root>
              {form.formState.errors.difficulty && <TextError>{form.formState.errors.difficulty.message}</TextError>}
            </View>
          </View>
        </Step.Body>
        <Step.Bottom>
          <Button.Root
            className="w-full"
            size="lg"
            variant="primary"
            onPress={handleCreateLesson}
            loading={profileLessonCreateMutation.isPending}
            disabled={!(form.watch("description") !== "" && form.watch("difficulty")) || profileLessonCreateMutation.isPending}
          >
            <Button.Text>Create Lesson</Button.Text>
          </Button.Root>
        </Step.Bottom>
      </Step.Container>
    </SafeAreaView>
  )
}

export default CreateLesson
