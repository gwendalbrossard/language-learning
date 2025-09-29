import { useRef } from "react"
import { router, Stack } from "expo-router"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ChevronLeftIcon } from "lucide-react-native"
import { useForm } from "react-hook-form"
import { TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import type { TProfileRoleplayScenarioCreateSchema } from "@acme/validators"
import { ZProfileRoleplayScenarioCreateSchema } from "@acme/validators"

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

const CreateRoleplayScenario = () => {
  const currentOrganizationId = useUserStore((state) => state.currentOrganizationId)
  if (!currentOrganizationId) throw new Error("Current organization ID not found")

  const queryClient = useQueryClient()

  const userRoleRef = useRef<TextInput>(null)
  const assistantRoleRef = useRef<TextInput>(null)
  const descriptionRef = useRef<TextInput>(null)

  const form = useForm<TProfileRoleplayScenarioCreateSchema>({
    defaultValues: { userRole: "", assistantRole: "", description: "", organizationId: currentOrganizationId },
    mode: "all",
    resolver: zodResolver(ZProfileRoleplayScenarioCreateSchema),
  })

  const profileRoleplayScenarioCreateMutation = useMutation(
    trpc.profile.roleplayScenario.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.profile.roleplayScenario.getAll.queryFilter({ organizationId: currentOrganizationId }))
        router.back()
      },
    }),
  )

  const handleCreateScenario = () => {
    void form.handleSubmit(async (data) => await profileRoleplayScenarioCreateMutation.mutateAsync(data))()
  }

  const difficulty = form.watch("difficulty")
  const mapping: Record<number, string> = {
    1: "easy",
    2: "medium",
    3: "hard",
  }

  const reverseMapping: Record<string, number> = {
    easy: 1,
    medium: 2,
    hard: 3,
  }

  const handleDifficultyChange = (value: string) => {
    const val = reverseMapping[value]
    if (!val) throw new Error("Invalid difficulty value")
    form.setValue("difficulty", val)
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
          <Step.HeaderTitle>Create Roleplay Scenario</Step.HeaderTitle>
          <Step.HeaderDescription>We will generate a personalized roleplay scenario based on your inputs</Step.HeaderDescription>
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
              <Label>💬 Scenario Description</Label>
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
              <TabsButton.Root
                value={mapping[difficulty] ?? "medium"}
                onValueChange={(value) => handleDifficultyChange(value)}
                className="h-fit flex-1 bg-red-100"
                size="sm"
              >
                <TabsButton.List>
                  <TabsButton.Trigger value="easy">
                    <TabsButton.TriggerText>Easy</TabsButton.TriggerText>
                  </TabsButton.Trigger>
                  <TabsButton.Trigger value="medium">
                    <TabsButton.TriggerText>Medium</TabsButton.TriggerText>
                  </TabsButton.Trigger>
                  <TabsButton.Trigger value="hard">
                    <TabsButton.TriggerText>Hard</TabsButton.TriggerText>
                  </TabsButton.Trigger>
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
            onPress={handleCreateScenario}
            loading={profileRoleplayScenarioCreateMutation.isPending}
            disabled={
              !(
                form.watch("userRole") !== "" &&
                form.watch("assistantRole") !== "" &&
                form.watch("description") !== "" &&
                form.watch("difficulty")
              ) || profileRoleplayScenarioCreateMutation.isPending
            }
          >
            <Button.Text>Create Scenario</Button.Text>
          </Button.Root>
        </Step.Bottom>
      </Step.Container>
    </SafeAreaView>
  )
}

export default CreateRoleplayScenario
