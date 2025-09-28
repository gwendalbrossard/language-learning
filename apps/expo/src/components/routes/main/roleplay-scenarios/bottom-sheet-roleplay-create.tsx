import { forwardRef } from "react"
import { BottomSheetModal, BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { View } from "react-native"

import type { TProfileRoleplayScenarioCreateSchema } from "@acme/validators"
import { ZProfileRoleplayScenarioCreateSchema } from "@acme/validators"

import { BottomSheetBackdrop } from "~/ui/bottom-sheet"
import * as Button from "~/ui/button"
import { inputClasses } from "~/ui/input"
import { Label } from "~/ui/label"
import { Text, TextDescription, TextError } from "~/ui/text"
import { textareaClasses } from "~/ui/textarea"
import { trpc } from "~/utils/api"
import { cn } from "~/utils/utils"
import { useUserStore } from "~/utils/zustand/user-store"

const BottomSheetRoleplayCreate = forwardRef<BottomSheetModal, object>((_, ref) => {
  const currentOrganizationId = useUserStore((state) => state.currentOrganizationId)
  if (!currentOrganizationId) throw new Error("Current organization ID not found")

  const queryClient = useQueryClient()

  const defaultValues: TProfileRoleplayScenarioCreateSchema = {
    userRole: "",
    assistantRole: "",
    description: "",
    organizationId: currentOrganizationId,
  }

  const form = useForm<TProfileRoleplayScenarioCreateSchema>({
    defaultValues: defaultValues,
    mode: "all",
    resolver: zodResolver(ZProfileRoleplayScenarioCreateSchema),
  })

  const profileRoleplayScenarioCreateMutation = useMutation(
    trpc.profile.roleplayScenario.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.profile.roleplayScenario.getAll.queryFilter({ organizationId: currentOrganizationId }))
        form.reset()
        if (ref && "current" in ref && ref.current) {
          ref.current.dismiss()
        }
      },
    }),
  )

  const handleCreateScenario = () => {
    void form.handleSubmit(async (data) => await profileRoleplayScenarioCreateMutation.mutateAsync(data))()
  }

  return (
    <BottomSheetModal
      ref={ref}
      backdropComponent={BottomSheetBackdrop}
      enableBlurKeyboardOnGesture
      keyboardBlurBehavior="restore"
      enableDynamicSizing
      enablePanDownToClose
      stackBehavior="push"
    >
      <BottomSheetView className="flex-1 px-4 pb-10 pt-2">
        <View className="flex flex-col gap-6">
          {/* Header */}
          <View className="flex flex-col items-center gap-2">
            <Text className="text-center text-2xl font-bold">Create Roleplay Scenario</Text>
            <TextDescription className="max-w-[80%] text-center">
              We will generate a personalized roleplay scenario based on your inputs
            </TextDescription>
          </View>

          {/* Form */}
          <View className="flex flex-col gap-6">
            {/* Your Role */}
            <View className="flex flex-col gap-2">
              <Label>🙋 Your Role</Label>
              <BottomSheetTextInput
                className={cn(inputClasses({ size: "lg" }))}
                placeholder="e.g., Tourist at a restaurant"
                value={form.watch("userRole")}
                onChangeText={(text) => form.setValue("userRole", text)}
              />
              {form.formState.errors.userRole && <TextError>{form.formState.errors.userRole.message}</TextError>}
            </View>

            {/* Assistant Role */}
            <View className="flex flex-col gap-2">
              <Label>🤖 Assistant Role</Label>
              <BottomSheetTextInput
                className={cn(inputClasses({ size: "lg" }))}
                placeholder="e.g., Friendly waiter"
                value={form.watch("assistantRole")}
                onChangeText={(text) => form.setValue("assistantRole", text)}
              />
              {form.formState.errors.assistantRole && <TextError>{form.formState.errors.assistantRole.message}</TextError>}
            </View>

            {/* Description */}
            <View className="flex flex-col gap-2">
              <Label>💬 Scenario Description</Label>
              <BottomSheetTextInput
                className={cn(textareaClasses({ size: "lg" }))}
                placeholder="e.g., Ordering food at a French bistro in Paris"
                value={form.watch("description")}
                onChangeText={(text) => form.setValue("description", text)}
                multiline
                numberOfLines={4}
              />
              {form.formState.errors.description && <TextError>{form.formState.errors.description.message}</TextError>}
            </View>
          </View>

          {/* Create Button */}
          <Button.Root
            className="w-full"
            size="lg"
            variant="primary"
            onPress={handleCreateScenario}
            loading={profileRoleplayScenarioCreateMutation.isPending}
            disabled={
              !(form.watch("userRole") !== "" && form.watch("assistantRole") !== "" && form.watch("description") !== "") ||
              profileRoleplayScenarioCreateMutation.isPending
            }
          >
            <Button.Text>Generate Scenario</Button.Text>
          </Button.Root>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  )
})

BottomSheetRoleplayCreate.displayName = "BottomSheetRoleplayCreate"

export default BottomSheetRoleplayCreate
