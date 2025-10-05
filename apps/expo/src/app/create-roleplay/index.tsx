import type { FC } from "react"
import { useRef } from "react"
import { router, Stack } from "expo-router"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ChevronLeftIcon } from "lucide-react-native"
import { useForm } from "react-hook-form"
import { TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import type { TProfileRoleplayCreateSchema } from "@acme/validators"
import { ZProfileRoleplayCreateSchema } from "@acme/validators"

import type { Difficulty } from "~/components/common/difficulty"
import { difficulties, getDifficultyName } from "~/components/common/difficulty"
import * as Step from "~/components/common/step"
import * as Button from "~/ui/button"
import { inputClasses } from "~/ui/input"
import { Label } from "~/ui/label"
import * as TabsButton from "~/ui/tabs-button"
import { TextError } from "~/ui/text"
import { Textarea, textareaClasses } from "~/ui/textarea"
import { trpc } from "~/utils/api"
import { cn } from "~/utils/utils"
import { useUserStore } from "~/utils/zustand/user-store"

const CreateRoleplay: FC = () => {
  const currentOrganizationId = useUserStore((state) => state.currentOrganizationId)
  if (!currentOrganizationId) throw new Error("Current organization ID not found")

  const queryClient = useQueryClient()

  const userRoleRef = useRef<TextInput>(null)
  const assistantRoleRef = useRef<TextInput>(null)
  const descriptionRef = useRef<TextInput>(null)

  const form = useForm<TProfileRoleplayCreateSchema>({
    defaultValues: { userRole: "", assistantRole: "", description: "", difficulty: 2 as Difficulty, organizationId: currentOrganizationId },
    mode: "all",
    resolver: zodResolver(ZProfileRoleplayCreateSchema),
  })

  const profileRoleplaySessionCreateMutation = useMutation(
    trpc.profile.roleplaySession.create.mutationOptions({
      onSuccess: async (data) => {
        await Promise.all([
          queryClient.invalidateQueries(trpc.profile.roleplaySession.getAll.queryFilter({ organizationId: currentOrganizationId })),
          queryClient.fetchQuery(
            trpc.profile.roleplaySession.get.queryOptions({ roleplaySessionId: data.id, organizationId: currentOrganizationId }),
          ),
        ])

        router.push(`/roleplay-session/${data.id}`)
      },
    }),
  )

  const profileRoleplayCreateMutation = useMutation(
    trpc.profile.roleplay.create.mutationOptions({
      onSuccess: async (data) => {
        await Promise.all([
          queryClient.invalidateQueries(trpc.profile.roleplay.getAll.queryFilter({ organizationId: currentOrganizationId })),
          profileRoleplaySessionCreateMutation.mutateAsync({ roleplayId: data.id, organizationId: currentOrganizationId }),
        ])
      },
    }),
  )

  const handleCreateRoleplay = () => {
    void form.handleSubmit(async (data) => await profileRoleplayCreateMutation.mutateAsync(data))()
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
          /* headerTitle: () => <Text className="text-lg font-semibold text-neutral-900">🎭 New Roleplay</Text>, */
        }}
      />
      <Step.Container>
        <Step.Header>
          <Step.HeaderTitle>Create Roleplay</Step.HeaderTitle>
          <Step.HeaderDescription>We will generate a personalized roleplay based on your inputs</Step.HeaderDescription>
        </Step.Header>
        <Step.Body>
          {/* Form */}
          <View className="flex flex-col gap-6">
            {/* Your Role */}
            <View className="flex flex-col gap-2">
              <Label>🙋 Your Role</Label>
              <TextInput
                ref={userRoleRef}
                className={cn(inputClasses({ size: "lg" }))}
                placeholder="e.g., Tourist at a restaurant"
                value={form.watch("userRole")}
                onChangeText={(text) => form.setValue("userRole", text)}
                returnKeyType="next"
                onSubmitEditing={() => assistantRoleRef.current?.focus()}
              />
              {form.formState.errors.userRole && <TextError>{form.formState.errors.userRole.message}</TextError>}
            </View>

            {/* Assistant Role */}
            <View className="flex flex-col gap-2">
              <Label>🤖 Assistant Role</Label>
              <TextInput
                ref={assistantRoleRef}
                className={cn(inputClasses({ size: "lg" }))}
                placeholder="e.g., Friendly waiter"
                value={form.watch("assistantRole")}
                onChangeText={(text) => form.setValue("assistantRole", text)}
                returnKeyType="next"
                onSubmitEditing={() => descriptionRef.current?.focus()}
              />
              {form.formState.errors.assistantRole && <TextError>{form.formState.errors.assistantRole.message}</TextError>}
            </View>

            {/* Description */}
            <View className="flex flex-col gap-2">
              <Label>💬 Roleplay Description</Label>
              <Textarea
                ref={descriptionRef}
                className={cn(textareaClasses({ size: "lg" }))}
                placeholder="e.g., Ordering food at a French bistro in Paris"
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

              <TabsButton.Root value={difficulty.toString()} onValueChange={(value) => handleDifficultyChange(parseInt(value) as Difficulty)} size="sm">
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
            onPress={handleCreateRoleplay}
            loading={profileRoleplayCreateMutation.isPending}
            disabled={
              !(
                form.watch("userRole") !== "" &&
                form.watch("assistantRole") !== "" &&
                form.watch("description") !== "" &&
                form.watch("difficulty")
              ) || profileRoleplayCreateMutation.isPending
            }
          >
            <Button.Text>Create Roleplay</Button.Text>
          </Button.Root>
        </Step.Bottom>
      </Step.Container>
    </SafeAreaView>
  )
}

export default CreateRoleplay
