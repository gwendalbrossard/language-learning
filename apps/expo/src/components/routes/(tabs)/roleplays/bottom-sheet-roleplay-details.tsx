import type { FC } from "react"
import { forwardRef } from "react"
import { router } from "expo-router"
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet"
import { useMutation } from "@tanstack/react-query"
import { Play } from "lucide-react-native"
import { Dimensions, View } from "react-native"

import type { Difficulty } from "~/components/common/difficulty"
import type { DifficultyIconProps } from "~/components/common/filters"
import type { RouterOutputs } from "~/utils/api"
import { getDifficultyIcon, getDifficultyName } from "~/components/common/difficulty"
import * as Badge from "~/ui/badge"
import { BottomSheetBackdrop } from "~/ui/bottom-sheet"
import * as Button from "~/ui/button"
import { Text } from "~/ui/text"
import { queryClient, trpc } from "~/utils/api"
import { useUserStore } from "~/utils/zustand/user-store"

type Props = {
  roleplay: RouterOutputs["profile"]["roleplay"]["getAll"][number] | null
  onClose: () => void
}

const DifficultyIcon: FC<DifficultyIconProps> = ({ difficulty }) => {
  const Icon = getDifficultyIcon(difficulty)
  return <Icon width={14} height={14} />
}

const BottomSheetRoleplayDetails = forwardRef<BottomSheetModal, Props>(({ roleplay, onClose }, ref) => {
  const currentOrganizationId = useUserStore((state) => state.currentOrganizationId)
  if (!currentOrganizationId) throw new Error("Current organization ID not found")

  const profileRoleplaySessionCreateMutation = useMutation(
    trpc.profile.roleplaySession.create.mutationOptions({
      onSuccess: async (data) => {
        if (ref && "current" in ref && ref.current) {
          ref.current.dismiss()
        }
        await queryClient.fetchQuery(
          trpc.profile.roleplaySession.get.queryOptions({ roleplaySessionId: data.id, organizationId: currentOrganizationId }),
        )
        router.replace(`/roleplay-session/${data.id}`)
      },
    }),
  )

  const handleStartRoleplay = () => {
    if (!roleplay) throw new Error("Roleplay not found")
    profileRoleplaySessionCreateMutation.mutate({ roleplayId: roleplay.id, organizationId: currentOrganizationId })
  }

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={["50%"]}
      maxDynamicContentSize={Dimensions.get("window").height * 0.8}
      backdropComponent={BottomSheetBackdrop}
      enablePanDownToClose
      stackBehavior="push"
      enableDynamicSizing={false}
      onDismiss={onClose}
    >
      {roleplay && (
        <BottomSheetView className="h-full flex-1 justify-between px-4 pb-10 pt-2">
          {/* Roleplay Details */}
          <View className="flex flex-col gap-6">
            {/* Header */}
            <View className="flex flex-col items-center gap-4">
              <Text className="text-4xl">{roleplay.emoji}</Text>
              <View className="flex flex-col items-center gap-2">
                <Text className="text-center text-2xl font-semibold text-neutral-900">{roleplay.title}</Text>

                {/* Category and difficulty */}
                <View className="flex flex-row items-center gap-2.5">
                  <Badge.Root variant="white" size="md">
                    <Badge.Text>
                      {roleplay.category.emoji} {roleplay.category.name}
                    </Badge.Text>
                  </Badge.Root>

                  <Badge.Root variant="white" size="sm">
                    <DifficultyIcon difficulty={roleplay.difficulty as Difficulty} />
                    <Badge.Text>{getDifficultyName(roleplay.difficulty as Difficulty)}</Badge.Text>
                  </Badge.Root>
                </View>
              </View>
            </View>

            {/* Description */}
            <View className="flex flex-col gap-1">
              <Text className="text-lg font-semibold text-neutral-900">About This Roleplay</Text>
              <Text className="font-base text-base font-medium leading-6 text-neutral-500">{roleplay.description}</Text>
            </View>
          </View>

          {/* Start Button */}
          <View className="pt-6">
            <Button.Root
              className="w-full"
              size="lg"
              variant="primary"
              onPress={handleStartRoleplay}
              loading={profileRoleplaySessionCreateMutation.isPending}
            >
              <Button.Icon icon={Play} />
              <Button.Text>Start Roleplay</Button.Text>
            </Button.Root>
          </View>
        </BottomSheetView>
      )}
    </BottomSheetModal>
  )
})

BottomSheetRoleplayDetails.displayName = "BottomSheetRoleplayDetails"

export default BottomSheetRoleplayDetails
